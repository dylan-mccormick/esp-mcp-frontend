import { useState, type ReactNode } from "react";
import { type MCPServerConnectionStatus, MCPServerContext } from "../context/MCPServerContext";

const MCPServerContextProvider = ({ children }: { children: ReactNode }) => {
    const [ connectionStatus, setConnectionStatus ] = useState<MCPServerConnectionStatus>("not connected");
    const [ ipAddress, setIpAddress ] = useState<string>("");
    const [ sessionUUID, setSessionUUID ] = useState<string>("");
    const [ deviceName, setDeviceName ] = useState<string>("");
    const [ wifiSSID, setWifiSSID ] = useState<string>("");

    return <MCPServerContext.Provider value={
        connectionStatus == "not connected"
            ? { connectionStatus, setConnectionStatus }
            : connectionStatus == "connecting"
                ? { connectionStatus, ipAddress, setConnectionStatus, setIpAddress }
                : { connectionStatus, ipAddress, sessionUUID, deviceName, wifiSSID, setConnectionStatus, setIpAddress, setSessionUUID, setDeviceName, setWifiSSID }
    } >
            { children }
        </MCPServerContext.Provider>
};

export default MCPServerContextProvider;