import { useContext } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { NotificationContext, type NotificationSeverity } from "../context/NotificationContext";

const severityStyles: Record<NotificationSeverity, { icon: typeof AlertCircle; iconColor: string; border: string }> = {
    error:   { icon: AlertCircle,   iconColor: "text-[#c4485a]", border: "border-[#e6c3c8]" },
    warning: { icon: AlertTriangle, iconColor: "text-[#c48a3a]", border: "border-[#e6d9c3]" },
    info:    { icon: Info,          iconColor: "text-[#3a7ec4]", border: "border-[#c3d5e6]" },
};

const NotificationStack = () => {
    const { notifications, dismiss } = useContext(NotificationContext);

    return (
        <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-full max-w-sm flex-col gap-3">
            {notifications.map(n => {
                const { icon: Icon, iconColor, border } = severityStyles[n.severity];
                return (
                    <div
                        key={n.id}
                        className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${border} bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_18px_50px_rgba(36,27,37,0.12)] backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-200`}
                    >
                        <Icon className={`h-5 w-5 flex-none ${iconColor}`} />
                        <p className="flex-1 text-sm font-medium text-[#241b25]">{n.message}</p>
                        <button
                            type="button"
                            onClick={() => dismiss(n.id)}
                            className="flex-none text-[#8a7c84] hover:text-[#241b25]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationStack;