import { Bot, KeyRound, Link2, Sparkles } from "lucide-react";

import ConnectionStatusBadge from "./ConnectionStatusBadge";

const AIConnectivityCard = () => {
    return (
        <section className="rounded-4xl border border-white/70 bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_18px_50px_rgba(36,27,37,0.08)] backdrop-blur-md sm:p-6">
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[1.3rem] border border-[#ddd4d6] bg-white text-[#241b25] shadow-inner">
                    <Bot className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#7b6a76]">
                                LLM Connectivity
                            </p>
                            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#241b25]">
                                Anthropic LLM Details
                            </h2>
                        </div>

                        <ConnectionStatusBadge status="not-connected" />
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
                        <div className="rounded-[1.4rem] border border-[#ded5d6] bg-white px-4 py-4">
                            <label className="mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                API key
                            </label>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="password"
                                    defaultValue="sk-demo-key-123456789"
                                    className="ui-input"
                                />
                                <button
                                    type="button"
                                    className="ui-button ui-button-primary ui-button-rect"
                                >
                                    Connect
                                </button>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-[#e0d8da] bg-[#f9f6f6] px-4 py-3">
                                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8a7c84]">
                                        Max Tokens
                                    </p>
                                    <input
                                        type="url"
                                        defaultValue="1024"
                                        className="ui-input mt-2"
                                    />
                                </div>
                                <div className="rounded-2xl border border-[#e0d8da] bg-[#f9f6f6] px-4 py-3">
                                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8a7c84]">
                                        Model Selection
                                    </p>
                                    <select className="ui-input mt-2"
                                        defaultValue="gpt-5.4-mini"
                                    >
                                        <option value="gpt-5.4-mini">GPT-5.4 mini</option>
                                        <option value="gpt-5.4">GPT-5.4</option>
                                        <option value="gpt-5.4-pro">GPT-5.4 Pro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-[1.4rem] border border-[#ded5d6] bg-[#faf8f8] px-4 py-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                    <Sparkles className="h-4 w-4" />
                                    Active Model
                                </div>
                                <p className="text-sm font-medium text-[#241b25]">GPT-5.4 mini</p>
                            </div>

                            <div className="border-t border-[#e8e1e2] pt-4">
                                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                    Connection Info
                                </p>
                                <div className="mt-3 space-y-2 text-sm text-[#2f2531]">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[#75646f]">Remaining Tokens</span>
                                        <span>12345</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIConnectivityCard;