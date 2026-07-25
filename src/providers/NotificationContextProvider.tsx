import { useCallback, useState, type ReactNode } from "react";
import { v4 } from "uuid";

import { NotificationContext, type Notification, type NotificationSeverity } from "../context/NotificationContext";

const DEFAULT_DURATION = 4000;

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const dismiss = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const notify = useCallback(
        (severity: NotificationSeverity, message: string, duration = DEFAULT_DURATION) => {
            const id = v4();
            setNotifications(prev => [...prev, { id, severity, message, duration }]);

            if (duration > 0) {
                setTimeout(() => dismiss(id), duration);
            }
        },
        [dismiss]
    );

    return (
        <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
