import { useContext, useEffect, useState, type ReactNode } from "react";

import { LLMContext } from "../context/LLMContext";
import { MCPServerContext, type MCPServerConnectionStatus } from "../context/MCPServerContext";
import { NotificationContext } from "../context/NotificationContext";
import useMCPFetch from "../hooks/useMCPFetch";

const MCPServerContextProvider = ({ children }: { children: ReactNode }) => {
    // Notifs Mgr
    const { notify } = useContext(NotificationContext);
    const { connectionStatus: llmConnectionStatus } = useContext(LLMContext);

    // Connection details state management
    const [connectionStatus, setConnectionStatus] = useState<MCPServerConnectionStatus>("not connected");
    const [ipAddress, setIpAddress] = useState<string>(window.location.hostname);
    const [sessionUUID, setSessionUUID] = useState<string>("");
    const [deviceName, setDeviceName] = useState<string>("");
    const [wifiSSID, setWifiSSID] = useState<string>("");

    const [waitingForLLMToConnect, setWaitingforLLMToConnect] = useState(false);

    // API Client
    const { mcpGet } = useMCPFetch(ipAddress);

    const establishMCPConnection = () => {
        if (connectionStatus !== "connecting") return;
        notify("info", "Connected to the MCP server.");
        setConnectionStatus("connected");
    };

    // Fires when we were previously waiting for the LLM to connect
    useEffect(() => {
        if (llmConnectionStatus == "connected" && waitingForLLMToConnect) {
            setWaitingforLLMToConnect(false);
            notify("info", "Resuming connection attempt with the MCP server...");
            establishMCPConnection();
        }
    }, [llmConnectionStatus, waitingForLLMToConnect]);

    // MCP Client state management
    useEffect(() => {
        if (connectionStatus === "not connected") return;
        mcpGet(`/info`)
            .then(async res => {
                if (!res.ok) {
                    throw new Error(`HTTP request failed with status code ${res.status}: ${await res.text()}`);
                }

                const data = await res.json();

                setDeviceName(data.deviceName);
                setWifiSSID(data.wifiSSID);

                // Wait until Anthropic client is connected
                // We need to do this before connecting to the MCP server
                if (llmConnectionStatus !== "connected") {
                    notify(
                        "warning",
                        "The MCP Server has been found, but the LLM client is not yet connected. Please connect to the LLM client and the MCP connection will automatically resume.",
                        8000
                    );
                    setWaitingforLLMToConnect(true);
                    return;
                }

                establishMCPConnection();
            })
            .catch(err => {
                console.error(`Failed to refresh the MCP Server /info endpoint`, err);
                notify("error", "Failed to obtain information about the MCP server.");
                setConnectionStatus("not connected");
            });
    }, [connectionStatus, llmConnectionStatus, ipAddress]);

    // Attempt connection
    const connect = () => {
        // causes the effect above to run
        setDeviceName("");
        setWifiSSID("");
        setConnectionStatus("connecting");
    };

    return (
        <MCPServerContext.Provider
            value={{
                connect,
                connectionStatus,
                ipAddress,
                sessionUUID,
                deviceName,
                wifiSSID,
                setConnectionStatus,
                setIpAddress,
                setSessionUUID,
                setDeviceName,
                setWifiSSID
            }}>
            {children}
        </MCPServerContext.Provider>
    );
};

export default MCPServerContextProvider;
