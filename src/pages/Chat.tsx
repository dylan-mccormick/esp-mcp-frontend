import ChatComposer from "../components/ChatComposer";
import ConnectionManagerButton from "../components/ConnectionManagerButton";

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

                    <ConnectionManagerButton />
                </header>

                <section className="flex-1 space-y-5 pb-6"></section>

                <section className="flex-1 space-y-5 pb-32"></section>

                <div className="fixed bottom-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-4 sm:bottom-6 sm:px-6 lg:bottom-8 lg:px-8">
                    <ChatComposer />
                </div>
            </div>
        </main>
    );
};

export default Chat;
