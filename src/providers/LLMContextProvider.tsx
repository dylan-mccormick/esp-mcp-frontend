import Anthropic from "@anthropic-ai/sdk";
import { useCallback, useState, type ReactNode } from "react";

import { LLMContext, type LLMConnectionStatus } from "../context/LLMContext";

const LLMContextProvider = ({ children }: { children: ReactNode }) => {
    const [connectionStatus, setConnectionStatus] = useState<LLMConnectionStatus>("not connected");
    const [apiKey, setApiKey] = useState<string>("");
    const [maxTokens, setMaxTokens] = useState<number>(1024);
    const [model, setModel] = useState<string>("claude-haiku-4-5");
    const [client, setClient] = useState<Anthropic>();

    // Method to initiate a connection
    const connect = useCallback(() => {
        setConnectionStatus("connecting");
        setClient(
            new Anthropic({
                apiKey
            })
        );
        setConnectionStatus("connected");
    }, [apiKey, connectionStatus]);

    return (
        <LLMContext.Provider
            value={
                connectionStatus === "connected" && client
                    ? {
                          connect,
                          connectionStatus: "connected",
                          apiKey,
                          maxTokens,
                          model,
                          client,
                          setApiKey,
                          setMaxTokens,
                          setModel
                      }
                    : {
                          connect,
                          connectionStatus: connectionStatus === "connected" ? "connecting" : connectionStatus,
                          apiKey,
                          maxTokens,
                          model,
                          setApiKey,
                          setMaxTokens,
                          setModel
                      }
            }>
            {children}
        </LLMContext.Provider>
    );
};

export default LLMContextProvider;
