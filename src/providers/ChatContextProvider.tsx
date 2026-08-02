import { useCallback, useState, type ReactNode } from "react";

import { ChatContext, type ChatMessage } from "../context/ChatContext";

const STORAGE_KEY = "mcp-chat-messages";

const loadInitialMessages = (): ChatMessage[] => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Failed to load initial messages from sessionStorage:", error);
        return [];
    }
}

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
    // State
    const [messages, setMessages] = useState<ChatMessage[]>(loadInitialMessages);

    // Functions
    const addMessage = useCallback((message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return <ChatContext.Provider value={{ messages, setMessages, addMessage, clearMessages }}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
