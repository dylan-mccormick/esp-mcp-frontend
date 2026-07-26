import type Anthropic from "@anthropic-ai/sdk";
import { createContext } from "react";

export type LLMConnectionStatus = "not connected" | "connecting" | "connected";

interface BaseLLMContextProps {
    connect: () => void;
    connectionStatus: LLMConnectionStatus;
    apiKey?: string;
    remainingTokens?: number;
    maxTokens?: number;
    model?: string;
    setApiKey: (s: string) => void;
    setMaxTokens: (n: number) => void;
    setModel: (s: string) => void;
    setRemainingTokens: (n: number) => void;
}

interface DisconnectedLLMContextProps extends BaseLLMContextProps {
    connectionStatus: "not connected";
}

export interface ConnectionLLMContextProps extends BaseLLMContextProps {
    apiKey: string;
    maxTokens: number;
    model: string;
}

interface ConnectingLLMContextProps extends ConnectionLLMContextProps {
    connectionStatus: "connecting";
}

interface ConnectedLLMContextProps extends ConnectionLLMContextProps {
    connectionStatus: "connected";
    client: Anthropic;
}

export type LLMContextProps = DisconnectedLLMContextProps | ConnectingLLMContextProps | ConnectedLLMContextProps;

export const LLMContext = createContext<LLMContextProps>({
    connect: () => {},
    connectionStatus: "not connected",
    setApiKey: () => {},
    setMaxTokens: () => {},
    setModel: () => {},
    setRemainingTokens: () => {}
});
