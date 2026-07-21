import { Cable, Cpu, Wifi } from "lucide-react";

import ConnectionStatusBadge from "./ConnectionStatusBadge";

const MicrocontrollerCard = () => {
    return (
        <section className="rounded-4xl border border-white/70 bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_18px_50px_rgba(36,27,37,0.08)] backdrop-blur-md sm:p-6">
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[1.3rem] border border-[#ddd4d6] bg-white text-[#241b25] shadow-inner">
                    <Cpu className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#7b6a76]">
                                Microcontroller
                            </p>
                            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#241b25]">
                                MCP Server
                            </h2>
                        </div>

                        <ConnectionStatusBadge status="connected" />
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
                        <div className="rounded-[1.4rem] border border-[#ded5d6] bg-white px-4 py-4">
                            <label className="mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                IP address
                            </label>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="text"
                                    defaultValue="192.168.4.21"
                                    className="ui-input flex-1"
                                />
                                <button
                                    type="button"
                                    className="ui-button ui-button-primary ui-button-rect"
                                >
                                    Connect
                                </button>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-1">
                                <div className="rounded-2xl border border-[#e0d8da] bg-[#f9f6f6] px-4 py-3">
                                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8a7c84]">
                                        Session UUID
                                    </p>
                                    <p className="text-sm font-medium text-[#241b25]">a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-[1.4rem] border border-[#ded5d6] bg-[#faf8f8] px-4 py-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                    <Cable className="h-4 w-4" />
                                    Connection Details
                                </div>
                                <div className="mt-3 space-y-2 text-sm text-[#2f2531]">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[#75646f]">Device</span>
                                        <span>ESP32 Device</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[#75646f]">IP Address</span>
                                        <span>192.168.4.21</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-[#e8e1e2] pt-4">
                                <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8a7c84]">
                                    <Wifi className="h-4 w-4" />
                                    Wi-Fi SSID
                                </div>
                                <p className="text-sm font-medium text-[#241b25]">Workshop-Lab-5G</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MicrocontrollerCard;