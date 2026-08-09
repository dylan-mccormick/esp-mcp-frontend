import {
    Client,
    StreamableHTTPClientTransport,
    type Tool,
    type Prompt,
    type Resource
} from "@modelcontextprotocol/client";
import { useContext, useEffect, useState, type ReactNode } from "react";

import { LLMContext } from "../context/LLMContext";
import { MCPServerContext, type MCPServerConnectionStatus } from "../context/MCPServerContext";
import { NotificationContext } from "../context/NotificationContext";
import useMCPFetch from "../hooks/useMCPFetch";

const MCPServerContextProvider = ({ children }: { children: ReactNode }) => {
    // Notifs Mgr
    const { notify } = useContext(NotificationContext);
    const llmCtx = useContext(LLMContext);

    // MCP Details
    const [mcp, setMCP] = useState<Client>();

    // Connection details state management
    const [connectionStatus, setConnectionStatus] = useState<MCPServerConnectionStatus>("not connected");
    const [ipAddress, setIpAddress] = useState<string>(window.location.hostname);
    const [sessionUUID, setSessionUUID] = useState<string>("");
    const [deviceName, setDeviceName] = useState<string>("");
    const [wifiSSID, setWifiSSID] = useState<string>("");

    const [waitingForLLMToConnect, setWaitingforLLMToConnect] = useState(false);
    const [mcpServerEndpoint, setMcpServerEndpoint] = useState<URL>();

    // MCP features
    const [tools, setTools] = useState<Tool[]>();
    const [resources, setResources] = useState<Resource[]>();
    const [prompts, setPrompts] = useState<Prompt[]>();

    // API Client
    const { mcpGet } = useMCPFetch(ipAddress);

    // Tools, resources, prompts
    const refreshMCP = async () => {
        // Tools
        const toolsResult = await mcp?.listTools();
        console.log(toolsResult);
        setTools(toolsResult?.tools);

        // Resources
        const resourcesResult = await mcp?.listResources();
        setResources(resourcesResult?.resources);

        // Prompts
        const promptsResult = await mcp?.listPrompts();
        setPrompts(promptsResult?.prompts);
    };

    const establishMCPConnection = async () => {
        if (connectionStatus !== "connecting" || llmCtx.connectionStatus !== "connected" || !mcpServerEndpoint)
            return setConnectionStatus("not connected");

        // Try to connect to the /mcp endpoint
        const transport = new StreamableHTTPClientTransport(new URL(`http://${ipAddress}${mcpServerEndpoint}`));
        const mcpObject = new Client(
            {
                name: "ESP-MCP Client",
                description:
                    "React frontend with an MCP Client component, connected directly to an LLM via the browser.",
                version: "1.0.0"
            },
            { versionNegotiation: { mode: "auto" } }
        );

        try {
            await mcpObject.connect(transport);
            setMCP(mcpObject);
        } catch (err) {
            console.error("Failed to establish a connection to the MCP server", err);
            notify("error", "Failed to connect to the MCP server.");
            setConnectionStatus("not connected");
            return;
        }

        // Call MCP detail functions
        await refreshMCP();

        notify("info", "Connected to the MCP server.");
        setConnectionStatus("connected");
    };

    // Fires when we were previously waiting for the LLM to connect
    useEffect(() => {
        if (llmCtx.connectionStatus == "connected" && waitingForLLMToConnect) {
            setWaitingforLLMToConnect(false);
            notify("info", "Resuming connection attempt with the MCP server...");
            establishMCPConnection();
        }
    }, [llmCtx.connectionStatus, waitingForLLMToConnect]);

    // MCP Client state management
    useEffect(() => {
        if (connectionStatus !== "connecting") return;
        mcpGet(`/info`)
            .then(async res => {
                if (!res.ok) {
                    throw new Error(`HTTP request failed with status code ${res.status}: ${await res.text()}`);
                }

                const data = await res.json();

                setDeviceName(data.deviceName);
                setWifiSSID(data.wifiSSID);
                setMcpServerEndpoint(data.mcpEndpoint);

                // Wait until Anthropic client is connected
                // We need to do this before connecting to the MCP server
                if (llmCtx.connectionStatus !== "connected") {
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
    }, [connectionStatus, llmCtx.connectionStatus, ipAddress]);

    // Attempt connection
    const connect = () => {
        // causes the effect above to run
        setDeviceName("");
        setWifiSSID("");
        setConnectionStatus("connecting");
    };

    return (
        <MCPServerContext.Provider
            value={
                connectionStatus == "connected" && mcp && tools && resources && prompts
                    ? {
                          connect,
                          connectionStatus,
                          ipAddress,
                          sessionUUID,
                          deviceName,
                          wifiSSID,
                          tools,
                          resources,
                          prompts,
                          setConnectionStatus,
                          setIpAddress,
                          setSessionUUID,
                          setDeviceName,
                          setWifiSSID,
                          mcp
                      }
                    : {
                          connect,
                          connectionStatus: connectionStatus == "connected" ? "not connected" : connectionStatus, // if the mcp server does not exist for some reason, rollback the connection status
                          ipAddress,
                          sessionUUID,
                          deviceName,
                          wifiSSID,
                          setConnectionStatus,
                          setIpAddress,
                          setSessionUUID,
                          setDeviceName,
                          setWifiSSID
                      }
            }>
            {children}
        </MCPServerContext.Provider>
    );
};

export default MCPServerContextProvider;
