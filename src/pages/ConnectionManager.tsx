import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import AIConnectivityCard from "../components/AIConnectivityCard";
import MicrocontrollerCard from "../components/MicrocontrollerCard";

const ConnectionManager = () => {
    const navigate = useNavigate();

    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_68%)]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col">
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#7b6a76]">
                            Connection manager
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#241b25] sm:text-4xl">
                            Devices and model access
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="ui-button ui-button-pill ui-button-surface">
                        <ArrowLeft className="h-4 w-4" />
                        Return to chat
                    </button>
                </header>

                <section className="flex flex-1 flex-col gap-5 pb-8">
                    <MicrocontrollerCard />
                    <AIConnectivityCard />
                </section>
            </div>
        </main>
    );
};

export default ConnectionManager;
