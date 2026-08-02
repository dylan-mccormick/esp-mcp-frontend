import { createContext } from "react";
import type { UserMessageProps } from "../components/UserMessage";
import type { AssistantMessageProps } from "../components/AssistantMessage";

export interface TextBlock {
    type: "text";
    text: string;
}

export interface ToolUseBlock {
    type: "tool_use";
    id: string;
    name: string;
    input: Record<string, unknown>;
}

export interface ToolResultBlock {
    type: "tool_result";
    tool_use_id: string;
    content: string;
    is_error?: boolean;
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export interface BaseChatMessage {
    id: string;
    role: "user" | "assistant";
    content: ContentBlock[];
}

export type ChatMessage = UserMessageProps | AssistantMessageProps;

interface ChatContextProps {
    messages: ChatMessage[];
    setMessages: (f: (p: ChatMessage[]) => ChatMessage[]) => void;
    addMessage: (m: ChatMessage) => void;
    clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextProps>({
    messages: [],
    setMessages: () => {},
    addMessage: () => {},
    clearMessages: () => {}
});
