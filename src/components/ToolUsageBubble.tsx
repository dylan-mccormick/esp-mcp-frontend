type ToolUsageBubbleProps = {
    title: string;
    subtitle: string;
    progress?: number;
    status?: "running" | "completed" | "error";
    outputLines?: string[];
};

const ToolUsageBubble = ({ title, subtitle, progress, status = "running", outputLines }: ToolUsageBubbleProps) => {
    const clampedProgress = typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : undefined;

    return (
        <div className="rounded-3xl border border-[#d9d0d1] bg-[rgba(255,255,255,0.7)] p-4 shadow-[0_12px_40px_rgba(36,27,37,0.08)] backdrop-blur-md">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h3 className="mt-1 text-sm font-semibold text-[#241b25]">{title}</h3>
                </div>
                <span
                    className={`
                    rounded-full border ${status === "running" ? "border-[#5ba8ff]" : status === "completed" ? "border-[#38c172]" : "border-[#ff593f]"} bg-white px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.24em] ${status === "running" ? "text-[#5ba8ff]" : status === "completed" ? "text-[#38c172]" : "text-[#ff593f]"}
                `}>
                    {status === "running" && "Running"}
                    {status === "completed" && "Completed"}
                    {status === "error" && "Error"}
                </span>
            </div>

            <p className="text-sm leading-6 text-[#665864]">{subtitle}</p>

            {typeof clampedProgress === "number" ? (
                <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#8f8188]">
                        <span>Progress</span>
                        <span>{clampedProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#ebe4e4]">
                        <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#241b25_0%,#6d5b68_100%)]"
                            style={{ width: `${clampedProgress}%` }}
                        />
                    </div>
                </div>
            ) : null}

            <div className="mt-4 overflow-hidden rounded-[1.1rem] border border-[#d8cfd1] bg-[#141112] shadow-inner">
                <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3">
                    <span className="ml-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/38">
                        Output
                    </span>
                </div>
                {outputLines && outputLines.length > 0 && (
                    <div className="space-y-2 px-4 py-4 font-mono text-[0.78rem] leading-6 text-[#e8dfde]">
                        {outputLines.map((line, index) => (
                            <div
                                key={`${line}-${index}`}
                                className="flex gap-3">
                                <span className="w-9 flex-none text-white/28">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="wrap-break-word text-white/86">{line}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolUsageBubble;
