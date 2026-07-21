import AssistantMessage from "../components/AssistantMessage";
import ChatComposer from "../components/ChatComposer";
import ConnectionManagerButton from "../components/ConnectionManagerButton";
import ToolUsageBubble from "../components/ToolUsageBubble";
import UserMessage from "../components/UserMessage";

const Chat = () => {
    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_68%)]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col">
                <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#241b25] sm:text-4xl">
                            ESP-MCP Chat
                        </h1>
                    </div>

                    <ConnectionManagerButton isConnected={true} />
                </header>

                <section className="flex-1 space-y-5 pb-6">
                    <UserMessage message="I want a calm, focused chat layout that still feels polished. Keep the interface minimal, but make the AI feel helpful and technical." />

                    <AssistantMessage message="This layout keeps the conversation center stage, uses soft contrast for hierarchy, and leaves the composition controls anchored at the bottom so the page reads like a dedicated workspace.">
                        <ToolUsageBubble
                            title="Scanning interface requirements"
                            subtitle="Looking at the page shell, spacing rhythm, and the available component surfaces before shaping the final conversation flow."
                            progress={100}
                            status="completed"
                            outputLines={[
                                "Detected root route at / and a sparse app shell.",
                                "Using presentational components only, no interaction logic.",
                                "Thread should remain readable at desktop and mobile widths."
                            ]}
                        />
                    </AssistantMessage>

                    <UserMessage
                        message="Add a tool-status bubble inside the AI response too. It should feel like the assistant is doing real work, with a terminal-style output window."
                        timeLabel="1 min ago"
                    />

                    <AssistantMessage message="That fits naturally as a nested card inside the assistant bubble. I would treat it as a transient status block that can appear before the final response text or beneath it.">
                        <ToolUsageBubble
                            title="Preparing response"
                            subtitle="Formatting a concise answer, collecting relevant structure, and staging the final reply for the user."
                            progress={80}
                            status="running"
                            outputLines={[
                                "[ready] conversation draft generated",
                                "[ok] assistant tone aligned to minimalist layout",
                                "[done] composer, messages, and tool bubble rendered"
                            ]}
                        />
                    </AssistantMessage>

                    <AssistantMessage message="The result should feel restrained but not empty: soft glass surfaces, crisp text, and enough visual weight in the assistant cards to suggest intelligence without visual noise." />
                </section>

                <section className="flex-1 space-y-5 pb-32"></section>

                <div className="fixed bottom-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4 sm:bottom-6 sm:px-6 lg:bottom-8 lg:px-8">
                    <ChatComposer />
                </div>
            </div>
        </main>
    );
};

export default Chat;
