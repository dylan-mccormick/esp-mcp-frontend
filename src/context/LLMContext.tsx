import { createContext } from "react";

export type LLMConnectionStatus = "not connected" | "connecting" | "connected";

interface BaseLLMContextProps {
    connectionStatus: LLMConnectionStatus;
    setConnectionStatus: (b: LLMConnectionStatus) => void;
}

interface DisconnectedLLMContextProps extends BaseLLMContextProps {
    connectionStatus: "not connected";
}

export interface ConnectionLLMContextProps extends BaseLLMContextProps {
    apiKey: string;
    setApiKey: (s: string) => void;
    maxTokens: number;
    setMaxTokens: (n: number) => void;
    model: string;
    setModel: (s: string) => void;
}

interface ConnectingLLMContextProps extends ConnectionLLMContextProps {
    connectionStatus: "connecting";
};

interface ConnectedLLMContextProps extends ConnectionLLMContextProps {
    connectionStatus: "connected";
};

export type LLMContextProps = DisconnectedLLMContextProps | ConnectingLLMContextProps | ConnectedLLMContextProps;

export const LLMContext = createContext<LLMContextProps>({
    connectionStatus: "not connected",
    setConnectionStatus: () => {}
});