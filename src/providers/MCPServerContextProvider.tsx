import { useContext, useEffect, useState, type ReactNode } from "react";
import { MCPServerContext, type MCPServerConnectionStatus } from "../context/MCPServerContext";
import useMCPFetch from "../hooks/useMCPFetch";
import { NotificationContext } from "../context/NotificationContext";

const MCPServerContextProvider = ({ children }: { children: ReactNode }) => {

    // Notifs Mgr
    const { notify } = useContext(NotificationContext);

    // Connection details state management
    const [ connectionStatus, setConnectionStatus ] = useState<MCPServerConnectionStatus>("not connected");
    const [ ipAddress, setIpAddress ] = useState<string>(window.location.hostname);
    const [ sessionUUID, setSessionUUID ] = useState<string>("");
    const [ deviceName, setDeviceName ] = useState<string>("");
    const [ wifiSSID, setWifiSSID ] = useState<string>("");

    // API Client
    const { mcpGet } = useMCPFetch(ipAddress);

    // MCP Connect
    const mcpConnect = async () => {

    };

    // MCP Client state management
    useEffect(() => {
        if (connectionStatus === "not connected") return;
        mcpGet(`/info`).then(async res => {
            if (!res.ok) {
                throw new Error(`HTTP request failed with status code ${res.status}: ${await res.text()}`);
            }

            const data = await res.json();

            setDeviceName(data.deviceName);
            setWifiSSID(data.wifiSSID)

            // TODO: establish the MCP connection
            //mcpConnect();
            // TODO: for now, let's just say "connected" (testing purposes)
            setConnectionStatus("connected");
        }).catch(err => {
            console.error(`Failed to refresh the MCP Server /info endpoint`, err);
            notify("error", "Failed to obtain information about the MCP server.");
            setConnectionStatus("not connected");
        });
    }, [ connectionStatus, ipAddress]);

    // Attempt connection
    const connect = () => {
        // causes the effect above to run
        setDeviceName("");
        setWifiSSID("");
        setConnectionStatus("connecting");
    };

    return <MCPServerContext.Provider value={{ connect, connectionStatus, ipAddress, sessionUUID, deviceName, wifiSSID, setConnectionStatus, setIpAddress, setSessionUUID, setDeviceName, setWifiSSID }} >
            { children }
        </MCPServerContext.Provider>
};

export default MCPServerContextProvider;