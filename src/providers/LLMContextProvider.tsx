import Anthropic from "@anthropic-ai/sdk";
import { useContext, useState, type ReactNode } from "react";

import { LLMContext, type LLMConnectionStatus } from "../context/LLMContext";
import { NotificationContext } from "../context/NotificationContext";

const LLMContextProvider = ({ children }: { children: ReactNode }) => {
    // Context
    const { notify } = useContext(NotificationContext);

    // State vars
    const [connectionStatus, setConnectionStatus] = useState<LLMConnectionStatus>("not connected");
    const [apiKey, setApiKey] = useState<string>("");
    const [maxTokens, setMaxTokens] = useState<number>(1024);
    const [remainingTokens, setRemainingTokens] = useState<number>();
    const [model, setModel] = useState<string>("claude-haiku-4-5");
    const [client, setClient] = useState<Anthropic>();

    // Method to initiate a connection
    const connect = (key: string) => {
        setConnectionStatus("connecting");

        // SECURITY NOTE: This client runs in the browser, which means your API key is exposed
        // to potential XSS attacks. For production systems:
        // 1. Use a backend proxy to handle API authentication
        // 2. Implement proper CORS policies
        // 3. Never expose API keys directly in client-side code
        // 4. Consider using temporary credentials from your backend
        if (!key || key.trim().length === 0) {
            notify("error", "API key cannot be empty.");
            setConnectionStatus("not connected");
            return;
        }

        setClient(
            new Anthropic({
                apiKey: key,
                dangerouslyAllowBrowser: true
            })
        );
        setConnectionStatus("connected");
        notify("info", "Connected to the LLM model.");
    };

    return (
        <LLMContext.Provider
            value={
                connectionStatus === "connected" && client
                    ? {
                          connect,
                          connectionStatus: "connected",
                          apiKey,
                          maxTokens,
                          remainingTokens,
                          model,
                          client,
                          setApiKey,
                          setMaxTokens,
                          setModel,
                          setRemainingTokens
                      }
                    : {
                          connect,
                          connectionStatus: connectionStatus === "connected" ? "connecting" : connectionStatus,
                          apiKey,
                          maxTokens,
                          model,
                          setApiKey,
                          setMaxTokens,
                          setModel,
                          setRemainingTokens
                      }
            }>
            {children}
        </LLMContext.Provider>
    );
};

export default LLMContextProvider;
