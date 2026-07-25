import { createContext } from "react";

export type NotificationSeverity = "error" | "warning" | "info";

export interface Notification {
    id: string;
    severity: NotificationSeverity;
    message: string;
    duration?: number;
}

interface NotificationContextProps {
    notifications: Notification[];
    notify: (severity: NotificationSeverity, message: string, duration?: number) => void;
    dismiss: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
    notifications: [],
    notify: () => {},
    dismiss: () => {},
});