import { useContext, useEffect } from "react";

import AssistantMessage from "../components/AssistantMessage";
import ChatComposer from "../components/ChatComposer";
import ConnectionManagerButton from "../components/ConnectionManagerButton";
import UserMessage from "../components/UserMessage";
import { ChatContext } from "../context/ChatContext";
import { LLMContext } from "../context/LLMContext";
import { MCPServerContext } from "../context/MCPServerContext";
import useSendMessage from "../hooks/useSendMessage";

const Chat = () => {
    // Context
    const llmCtx = useContext(LLMContext);
    const mcpCtx = useContext(MCPServerContext);
    const { messages } = useContext(ChatContext);

    // Messages
    const { sendMessage, messageSending } = useSendMessage();

    // Scroll to bottom when a message is sent
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, [messages]);

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
