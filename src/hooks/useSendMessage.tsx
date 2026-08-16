// useSendMessage.tsx
// Contains a hook that can be used to communicate with the LLM given MCP Server context

import type Anthropic from "@anthropic-ai/sdk";
import { APIError } from "@anthropic-ai/sdk";
import { useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { AssistantMessageProps } from "../components/AssistantMessage";
import type { UserMessageProps } from "../components/UserMessage";
import {
    ChatContext,
    type BaseChatMessage,
    type ContentBlock,
    type ToolResultBlock,
    type ToolUseBlock
} from "../context/ChatContext";
import { LLMContext } from "../context/LLMContext";
import { MCPServerContext } from "../context/MCPServerContext";
import { NotificationContext } from "../context/NotificationContext";

const useSendMessage = () => {
    // Context
    const { notify } = useContext(NotificationContext);
    const llmCtx = useContext(LLMContext);
    const mcpCtx = useContext(MCPServerContext);
    const { messages, setMessages, addMessage } = useContext(ChatContext);

    // State
    const [messageSending, setMessageSending] = useState(false);

    // Strip status/output
    const toApiContent = (blocks: ContentBlock[]): ContentBlock[] =>
        blocks.map(b => {
            if (b.type !== "tool_use") return b;
            const { status, output, ...apiSafe } = b;
            return apiSafe;
        });

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
                notify("error", "An internal server error (of the LLM) has occured. Please try again later.", 6000);
                break;
            default:
                notify("error", "An unknown error occured.");
                console.error("Unable to send LLM message", error);
        }
    };

    // Update the text content of the last message to include newly streamed text
    const renderTextFromLLM = (assistantMessageId: string) => {
        return (text: string) => {
            if (llmCtx.connectionStatus !== "connected") return;

            setMessages(prev => {
                const last = prev[prev.length - 1];

                // Text being appended to previous message
                if (last.id === assistantMessageId && last.role === "assistant") {
                    const blocks = [...last.content];
                    const lastBlock = blocks[blocks.length - 1];

                    if (lastBlock.type === "text") {
                        // Append text
                        blocks[blocks.length - 1] = { ...lastBlock, text: lastBlock.text + text };
                    } else {
                        blocks.push({ type: "text", text });
                    }

                    return [...prev.slice(0, -1), { ...last, content: blocks }];
                }

                // No message was sent, create a new asst message
                const newAssistantMessage: AssistantMessageProps = {
                    id: assistantMessageId,
                    role: "assistant",
                    model: llmCtx.model,
                    content: [{ type: "text", text }]
                };

                return [...prev, newAssistantMessage];
            });
        };
    };

    // Take in all requested tool use blocks
    // Use local MCP Client tools, then use MCP Server tools
    const handleToolUseBlocks = async (blocks: ToolUseBlock[]): Promise<ToolResultBlock[]> => {
        if (mcpCtx.connectionStatus !== "connected") throw new Error("MCP Server became disconnected.");
        return Promise.all(
            blocks.map(async block => {
                try {
                    const response = await mcpCtx.mcp.callTool({ name: block.name, arguments: block.input });
                    return {
                        type: "tool_result",
                        tool_use_id: block.id,
                        content: JSON.stringify(response),
                        is_error: response.isError === true
                    } satisfies ToolResultBlock;
                } catch (err) {
                    return {
                        type: "tool_result",
                        tool_use_id: block.id,
                        content: err instanceof Error ? err.message : "Tool call failed",
                        is_error: true
                    } satisfies ToolResultBlock;
                }
            })
        );
    };

    // Keep running send/response loop until final message is sent from the LLM
    // For tool/resource usage
    const runMessageLoop = useCallback(
        async (conversationHistory: Omit<BaseChatMessage, "id">[]) => {
            let cont = true;
            while (cont) {
                const assistantMessageId = uuidv4();
                const finalMessage: Anthropic.Message = await new Promise((resolve, reject) => {
                    if (llmCtx.connectionStatus !== "connected" || mcpCtx.connectionStatus !== "connected") {
                        reject(new Error("LLM is not connected"));
                        return;
                    }

                    llmCtx.client.messages
                        .stream({
                            max_tokens: llmCtx.maxTokens,
                            messages: conversationHistory,
                            model: llmCtx.model,
                            tools: mcpCtx.tools.map(t => ({
                                name: t.name,
                                description: t.description,
                                input_schema: t.inputSchema
                            })),

                            cache_control: { type: "ephemeral" }
                        })
                        .on("text", renderTextFromLLM(assistantMessageId))
                        .on("message", final => resolve(final))
                        .on("error", err => {
                            if (err instanceof APIError) {
                                handleAnthropicApiError(err);
                            }
                            reject(err);
                        });
                });

                // Update message history to include the full, final assistant message
                const assistantBlocks = finalMessage.content as ContentBlock[];

                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last.id === assistantMessageId && last.role === "assistant") {
                        return [...prev.slice(0, -1), { ...last, content: assistantBlocks }];
                    }

                    const newAssistantMessage: AssistantMessageProps = {
                        id: assistantMessageId,
                        role: "assistant",
                        model: llmCtx.model ?? "unknown",
                        content: assistantBlocks
                    };
                    return [...prev, newAssistantMessage];
                });

                conversationHistory = [...conversationHistory, { role: "assistant", content: assistantBlocks }];

                // Check if we need to use any tools
                // If not, we can just exit here
                const toolUseBlocks = assistantBlocks.filter(b => b.type === "tool_use");
                if (toolUseBlocks.length === 0) {
                    cont = false;
                    break;
                }

                // Update output to include new tool results
                const toolResults = await handleToolUseBlocks(toolUseBlocks);
                setMessages(prev =>
                    prev.map(m => {
                        if (m.role !== "assistant") return m;

                        const updatedContent = m.content.map(block => {
                            if (block.type !== "tool_use") return block;

                            const matchingResult = toolResults.find(r => r.tool_use_id === block.id);
                            if (!matchingResult) return block;

                            let matchedOutput;
                            const parsedObj = JSON.parse(matchingResult.content);

                            if (
                                parsedObj instanceof Object &&
                                parsedObj.content &&
                                parsedObj.content[0].type === "text"
                            ) {
                                matchedOutput = parsedObj.content[0].text;
                            } else {
                                matchedOutput = matchingResult.content;
                            }

                            return {
                                ...block,
                                status: matchingResult.is_error ? "error" : "completed",
                                output: matchedOutput
                            } satisfies ToolUseBlock;
                        });

                        return { ...m, content: updatedContent };
                    })
                );

                // Add the tool result message
                const toolResultMessage: UserMessageProps = {
                    id: uuidv4(),
                    role: "user",
                    content: toolResults,
                    timeRef: new Date()
                };
                addMessage(toolResultMessage);
                conversationHistory = [...conversationHistory, { role: "user", content: toolResults }];
            }
        },
        [mcpCtx, llmCtx]
    );

    // Send a message with the conversation history
    const sendMessage = useCallback(
        async (msg: string) => {
            // Message Validation
            msg = msg.trim();
            if (msg.length === 0 || llmCtx.connectionStatus !== "connected" || mcpCtx.connectionStatus !== "connected")
                return;

            // Build User Message
            const userMessage: UserMessageProps = {
                id: uuidv4(),
                role: "user",
                content: [{ type: "text", text: msg }],
                timeRef: new Date()
            };

            addMessage(userMessage);
            setMessageSending(true);

            try {
                // Update conversation history to include new message
                let conversationHistory: Omit<BaseChatMessage, "id">[] = [
                    ...messages.map(m => ({ role: m.role, content: toApiContent(m.content) })),
                    { role: userMessage.role, content: userMessage.content }
                ];

                await runMessageLoop(conversationHistory);
            } catch (error) {
                notify("error", "Unable to send LLM message.");
                console.error("Unable to send LLM message", error);
            } finally {
                setMessageSending(false);
            }
        },
        [llmCtx, mcpCtx, messages]
    );

    return { sendMessage, messageSending };
};

export default useSendMessage;
