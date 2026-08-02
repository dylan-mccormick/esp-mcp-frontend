import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import AssistantMessage, { type AssistantMessageProps } from "../components/AssistantMessage";
import ChatComposer from "../components/ChatComposer";
import ConnectionManagerButton from "../components/ConnectionManagerButton";
import UserMessage, { type UserMessageProps } from "../components/UserMessage";
import { ChatContext, type BaseChatMessage, type ContentBlock, type ToolResultBlock } from "../context/ChatContext";
import { LLMContext } from "../context/LLMContext";
import { MCPServerContext } from "../context/MCPServerContext";
import { NotificationContext } from "../context/NotificationContext";

const Chat = () => {
    // Context
    const { notify } = useContext(NotificationContext);
    const llmCtx = useContext(LLMContext);
    const mcpCtx = useContext(MCPServerContext);
    const { messages, setMessages, addMessage } = useContext(ChatContext);

    // State
    const [messageSending, setMessageSending] = useState(false);

    // Handling errors
    const handleAnthropicApiError = (error: APIError) => {
        switch (error.status) {
                    case 401:
                        notify(
                            "error",
                            "Unable to authenticate. This is most likely because your API key is incorrect. Verify that you are using the correct API key.",
                            8000
                        );
                        break;
                    case 429:
                        notify(
                            "error",
                            "You are being rate limited by the LLM. Please wait a few minutes and try again.",
                            6000
                        );
                        break;
                    case 500:
                        notify(
                            "error",
                            "An internal server error (of the LLM) has occured. Please try again later.",
                            6000
                        );
                        break;
                    default:
                        notify("error", "An unknown error occured.");
                        console.error("Unable to send LLM message", error);
                }
            };

    // Scroll to bottom when a message is sent
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (msg: string) => {
        msg = msg.trim();
        if (msg.length === 0 || llmCtx.connectionStatus !== "connected" || mcpCtx.connectionStatus !== "connected")
            return;

        const userMessage: UserMessageProps = {
            id: uuidv4(),
            role: "user",
            content: [{ type: "text", text: msg }],
            timeRef: new Date()
        };

        addMessage(userMessage);
        setMessageSending(true);

        try {
            let conversationHistory: (Omit<BaseChatMessage, "id">)[] = [
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: userMessage.role, content: userMessage.content }
            ];

            let cont = true;
            while (cont) {
                const assistantMessageId = uuidv4();
                const finalMessage: Anthropic.Message = await new Promise((resolve, reject) => {
                    if (llmCtx.connectionStatus !== "connected") {
                        reject(new Error("LLM is not connected"));
                        return;
                    }

                    llmCtx.client.messages.stream({
                        max_tokens: llmCtx.maxTokens,
                        messages: conversationHistory,
                        model: llmCtx.model,
                        cache_control: { type: "ephemeral" }
                    })
                    .on("text", text => {
                        // Render new assistant text
                        setMessages(prev => {
                            const last = prev[prev.length - 1];

                            // Text being appended to previous message
                            if (last.id === assistantMessageId && last.role == "assistant") {
                                const blocks = [...last.content];
                                const lastBlock = blocks[blocks.length - 1];
                                if (lastBlock.type === "text") {
                                    blocks[blocks.length - 1] = { ...lastBlock, text: lastBlock.text + text }
                                } else {
                                    blocks.push({ type: "text", text });
                                }
                                return [ ...prev.slice(0, -1), { ...last, content: blocks } ]
                            }

                            // Update message
                            const newAssistantMessage: AssistantMessageProps = {
                                id: assistantMessageId,
                                role: "assistant",
                                model: llmCtx.model,
                                content: [{ type: "text", text }]
                            };

                            return [...prev, newAssistantMessage]
                        })
                    })
                    .on("message", final => resolve(final))
                    .on("error", err => {
                        if (err instanceof APIError) {
                            handleAnthropicApiError(err);
                            reject(err);
                            return;
                        }
                        reject(err);
                    });
                });

                const assistantBlocks = finalMessage.content as ContentBlock[];
                llmCtx.setRemainingTokens(llmCtx.maxTokens - finalMessage.usage.output_tokens);

                // Show the new message thread upon final
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last.id === assistantMessageId && last.role === "assistant") {
                        return [ ...prev.slice(0, -1), { ...last, content: assistantBlocks } ]
                    }

                    const newAssistantMessage: AssistantMessageProps = {
                        id: assistantMessageId,
                        role: "assistant",
                        model: llmCtx.model,
                        content: assistantBlocks
                    };
                    return [...prev, newAssistantMessage]
                });

                conversationHistory = [ ...conversationHistory, { role: "assistant", content: assistantBlocks } ];

                const toolUseBlocks = assistantBlocks.filter(b => b.type === "tool_use");
                if (toolUseBlocks.length === 0) { // if we don't need to use any tools, just stop
                    cont = false;
                    break;
                }

                // we need to use a tool
                const toolResults: ToolResultBlock[] = await Promise.all(toolUseBlocks.map(async block => {
                    try {
                        const response = await mcpCtx.mcp.callTool({ name: block.name }, block.input);
                        return {
                            type: "tool_result",
                            tool_use_id: block.id,
                            content: JSON.stringify(response)
                        } satisfies ToolResultBlock;
                    } catch (err) {
                        return {
                            type: "tool_result",
                            tool_use_id: block.id,
                            content: err instanceof Error ? err.message : "Tool call failed",
                            is_error: true
                        } satisfies ToolResultBlock;
                    }
                }));

                const toolResultMessage: UserMessageProps = {
                    id: uuidv4(),
                    role: "user",
                    content: toolResults,
                    timeRef: new Date()
                };
                addMessage(toolResultMessage);
                conversationHistory = [ ...conversationHistory, { role: "user", content: toolResults } ]
            }
        } catch (error) {
            notify("error", "Unable to send LLM message.");
            console.error("Unable to send LLM message", error);
        } finally {
            setMessageSending(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 " />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col">
                <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#7b6a76]">
                            ESP-MCP Server
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#241b25] sm:text-4xl">
                            Chat
                        </h1>
                    </div>

                    <ConnectionManagerButton />
                </header>

                <section className="flex-1 space-y-5 pb-6"></section>

                {messages.length === 0 && (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-center text-sm text-[#241b25]/60">
                            No messages yet. Start the conversation by sending a message.
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    if (msg.role === "user") {
                        return (
                            <UserMessage
                                key={index}
                                {...msg}
                            />
                        );
                    }

                    return (
                        <AssistantMessage
                            key={index}
                            {...msg}
                        />
                    );
                })}

                <section className="flex-1 space-y-5 pb-32"></section>

                <div className="fixed bottom-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4 sm:bottom-6 sm:px-6 lg:bottom-8 lg:px-8">
                    {(llmCtx.connectionStatus === "connected" && mcpCtx.connectionStatus === "connected" && (
                        <ChatComposer
                            sending={messageSending}
                            onSendMessage={sendMessage}
                        />
                    )) || (
                        <div className="rounded-[1.75rem] border border-white/70 bg-[rgba(255,255,255,0.72)] py-3 px-8 shadow-[0_18px_50px_rgba(36,27,37,0.1)] backdrop-blur-md text-sm text-gray-500">
                            Connect to an LLM and MCP server to start chatting.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Chat;
