import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

import ConnectionStatusBadge, { type ConnectionState } from "./ConnectionStatusBadge";

type ConnectionManagerButtonProps = {
    status?: ConnectionState;
    isConnected?: boolean;
};

const ConnectionManagerButton = ({ status, isConnected }: ConnectionManagerButtonProps) => {
    const navigate = useNavigate();
    const resolvedStatus = status ?? (isConnected ? "connected" : "not connected");

    return (
        <button
            className="ui-button ui-button-pill ui-button-surface"
            onClick={() => navigate("/connections")}>
            <ConnectionStatusBadge status={resolvedStatus} />
            <ChevronRight className="h-4 w-4 text-[#6d5b68]" />
        </button>
    );
};

export default ConnectionManagerButton;
