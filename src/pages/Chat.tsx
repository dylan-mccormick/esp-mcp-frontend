import { APIError } from "@anthropic-ai/sdk";
import { useContext, useEffect, useState } from "react";
import AssistantMessage, { type AssistantMessageProps } from "../components/AssistantMessage";
import ChatComposer from "../components/ChatComposer";
import ConnectionManagerButton from "../components/ConnectionManagerButton";
import UserMessage, { type UserMessageProps } from "../components/UserMessage";
import { LLMContext } from "../context/LLMContext";
import { MCPServerContext } from "../context/MCPServerContext";
import { NotificationContext } from "../context/NotificationContext";

const Chat = () => {

    // Context
    const { notify } = useContext(NotificationContext);
    const llmCtx = useContext(LLMContext);
    const mcpCtx = useContext(MCPServerContext);

    // State
    const [ messageLog, setMessageLog ] = useState<(AssistantMessageProps | UserMessageProps)[]>([]);
    const [ messageSending, setMessageSending ] = useState(false);

    // Scroll to bottom when a message is sent
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, [ messageLog ]);

    const sendMessage = async (msg: string) => {
        msg = msg.trim();
        if (msg.length === 0 || llmCtx.connectionStatus !== "connected" || mcpCtx.connectionStatus !== "connected") return;

        setMessageSending(true);
        setMessageLog(prev => [ ...prev, { message: msg, sender: "user" } ]);

        // Send the message
        try {
            await llmCtx.client.messages.stream({
                max_tokens: llmCtx.maxTokens,
                messages: [{ content: msg, role: "user" }],
                model: llmCtx.model
            }).on("text", (text) => {
                setMessageLog(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === "assistant") {
                        return [ ...prev.slice(0, -1), { ...lastMessage, message: lastMessage.message + text } ];
                    }
                    return [ ...prev, { message: text, sentBy: llmCtx.model, sender: "assistant" } ];
                });
            }).on("error", (error) => {
                if (error instanceof APIError) {
                    switch (error.status) {
                        case 401:
                            notify("error", "Unable to authenticate. This is most likely because your API key is incorrect. Verify that you are using the correct API key.", 8000);
                            break;
                        case 429:
                            notify("error", "You are being rate limited by the LLM. Please wait a few minutes and try again.", 6000);
                            break;
                        case 500:
                            notify("error", "An internal server error (of the LLM) has occured. Please try again later.", 6000);
                            break;
                        default:
                            notify("error", "An unknown error occured.");
                            console.error("Unable to send LLM message", error);
                    }
                    return;
                }
                throw error;
            });

        } catch (error) {
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
                        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#241b25] sm:text-4xl">
                            ESP-MCP Chat
                        </h1>
                    </div>

                    <ConnectionManagerButton />
                </header>

                <section className="flex-1 space-y-5 pb-6"></section>

                { messageLog.length === 0 &&
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-center text-sm text-[#241b25]/60">No messages yet. Start the conversation by sending a message.</p>
                    </div>
                }

                { messageLog.map((msg, index) => {
                    if (msg.sender === "user") {
                        return <UserMessage
                            key={index}
                            {...msg}
                        />
                    }

                    return <AssistantMessage
                            key={index}
                            {...msg}
                        />
                }) }

                <section className="flex-1 space-y-5 pb-32"></section>

                <div className="fixed bottom-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4 sm:bottom-6 sm:px-6 lg:bottom-8 lg:px-8">

                    {llmCtx.connectionStatus === "connected" && mcpCtx.connectionStatus === "connected" &&
                        <ChatComposer sending={messageSending} onSendMessage={sendMessage} /> ||
                        <div className="rounded-[1.75rem] border border-white/70 bg-[rgba(255,255,255,0.72)] py-3 px-8 shadow-[0_18px_50px_rgba(36,27,37,0.1)] backdrop-blur-md text-sm text-gray-500" >Connect to an LLM and MCP server to start chatting.</div>
                    }
                </div>
            </div>
        </main>
    );
};

export default Chat;
