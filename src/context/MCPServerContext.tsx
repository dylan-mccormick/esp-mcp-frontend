import { Client } from "@modelcontextprotocol/client";
import { createContext } from "react";

export type MCPServerConnectionStatus = "not connected" | "connecting" | "connected";

interface BaseMCPServerContextProps {
    connect: () => void;
    connectionStatus: MCPServerConnectionStatus;
    setSessionUUID: (s: string) => void;
    setDeviceName: (s: string) => void;
    setWifiSSID: (s: string) => void;
    setIpAddress: (s: string) => void;
    ipAddress?: string;
    sessionUUID?: string;
    deviceName?: string;
    wifiSSID?: string;
    setConnectionStatus: (b: MCPServerConnectionStatus) => void;
}

interface DisconnectedMCPServerContextProps extends BaseMCPServerContextProps {
    connectionStatus: "not connected";
}

export interface ConnectionMCPServerContextProps extends BaseMCPServerContextProps {
    ipAddress: string;
    setIpAddress: (s: string) => void;
}

interface ConnectingMCPServerContextProps extends ConnectionMCPServerContextProps {
    connectionStatus: "connecting";
}

export interface ConnectedMCPServerContextProps extends ConnectionMCPServerContextProps {
    connectionStatus: "connected";
    sessionUUID: string;
    deviceName: string;
    wifiSSID: string;
    mcp: Client;
}

export type MCPServerContextProps =
    | DisconnectedMCPServerContextProps
    | ConnectingMCPServerContextProps
    | ConnectedMCPServerContextProps;

export const MCPServerContext = createContext<MCPServerContextProps>({
    connect: () => {},
    connectionStatus: "not connected",
    setSessionUUID: () => {},
    setDeviceName: () => {},
    setWifiSSID: () => {},
    setIpAddress: () => {},
    setConnectionStatus: () => {}
});
