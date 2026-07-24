import { createContext } from "react";

export type MCPServerConnectionStatus = "not connected" | "connecting" | "connected";

interface BaseMCPServerContextProps {
    connectionStatus: MCPServerConnectionStatus;
    setSessionUUID: (s: string) => void;
    setDeviceName: (s: string) => void;
    setWifiSSID: (s: string) => void;
    setConnectionStatus: (b: MCPServerConnectionStatus) => void;
}

interface DisconnectedMCPServerContextProps extends BaseMCPServerContextProps {
    sessionUUID?: string,
    deviceName?: string,
    wifiSSID?: string,
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
}

export type MCPServerContextProps = DisconnectedMCPServerContextProps | ConnectingMCPServerContextProps | ConnectedMCPServerContextProps;

export const MCPServerContext = createContext<MCPServerContextProps>({
    connectionStatus: "not connected",
    setSessionUUID: () => {},
    setDeviceName: () => {},
    setWifiSSID: () => {},
    setConnectionStatus: () => {}
});