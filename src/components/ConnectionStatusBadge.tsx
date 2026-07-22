export type ConnectionState = "connected" | "not-connected" | "connecting";

type ConnectionStatusBadgeProps = {
    status: ConnectionState;
    label?: string;
};

const statusLabel: Record<ConnectionState, string> = {
    connected: "Connected",
    "not-connected": "Not connected",
    connecting: "Connecting",
};

const ConnectionStatusBadge = ({ status, label }: ConnectionStatusBadgeProps) => {
    return (
        <span className={`connection-status connection-status--${status}`}>
            <span className="connection-status__dot" />
            {label ?? statusLabel[status]}
        </span>
    );
};

export default ConnectionStatusBadge;