import { createContext } from "react";

export type MCPServerConnectionStatus = "not connected" | "connecting" | "connected";

interface BaseMCPServerContextProps {
    connectionStatus: MCPServerConnectionStatus;
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
    setSessionUUID: (s: string) => void;
    deviceName: string;
    setDeviceName: (s: string) => void;
    wifiSSID: string;
    setWifiSSID: (s: string) => void;
}

export type MCPServerContextProps = DisconnectedMCPServerContextProps | ConnectingMCPServerContextProps | ConnectedMCPServerContextProps;

export const MCPServerContext = createContext<MCPServerContextProps>({
    connectionStatus: "not connected",
    setConnectionStatus: () => {}
});