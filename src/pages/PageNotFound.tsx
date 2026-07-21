import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.68),transparent_56%)]" />

            <section className="relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-[rgba(255,255,255,0.76)] p-6 text-center shadow-[0_18px_50px_rgba(36,27,37,0.08)] backdrop-blur-md sm:p-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#7b6a76]">404</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#241b25] sm:text-4xl">
                    Page not found
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#665864]">
                    The page you are looking for does not exist, moved, or was never added to this workspace.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="ui-button ui-button-primary ui-button-pill"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to chat
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/connections")}
                        className="ui-button ui-button-outline ui-button-pill"
                    >
                        Open connections
                    </button>
                </div>
            </section>
        </main>
    );
};

export default PageNotFound;
