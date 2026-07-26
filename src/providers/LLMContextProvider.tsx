import Anthropic from "@anthropic-ai/sdk";
import { useCallback, useContext, useState, type ReactNode } from "react";

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
    const connect = useCallback(() => {
        setConnectionStatus("connecting");
        setClient(
            new Anthropic({
                apiKey,
                dangerouslyAllowBrowser: true // TODO: remove this for any prod systems!!
            })
        );
        setConnectionStatus("connected");
        notify("info", "Connected to the LLM model.");
    }, [apiKey]);

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
