import { useState, type ReactNode } from "react";
import { type LLMConnectionStatus, LLMContext } from "../context/LLMContext";

const LLMContextProvider = ({ children }: { children: ReactNode }) => {
    const [ connectionStatus, setConnectionStatus ] = useState<LLMConnectionStatus>("not connected");
    const [ apiKey, setApiKey ] = useState<string>("");
    const [ maxTokens, setMaxTokens ] = useState<number>(0);
    const [ model, setModel ] = useState<string>("");

    return <LLMContext.Provider
            value={
                connectionStatus == "not connected"
                    ? { connectionStatus, setConnectionStatus }
                    : { connectionStatus, apiKey, maxTokens, model, setConnectionStatus, setApiKey, setMaxTokens, setModel }
            }
        >
        { children }
    </LLMContext.Provider>
};

export default LLMContextProvider;