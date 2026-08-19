import { ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { LLMContext } from "../context/LLMContext";
import { MCPServerContext } from "../context/MCPServerContext";
import ConnectionStatusBadge, { type ConnectionState } from "./ConnectionStatusBadge";

const ConnectionManagerButton = () => {
    const navigate = useNavigate();
    const { connectionStatus: llmConnectionStatus } = useContext(LLMContext);
    const { connectionStatus: mcpConnectionStatus } = useContext(MCPServerContext);
    const [lowestConnectionStatus, setLowestConnectionStatus] = useState<ConnectionState>("not connected");

    useEffect(() => {
        if (llmConnectionStatus.length > mcpConnectionStatus.length) {
            // Coincidentally, lower length = worse connection status
            setLowestConnectionStatus(llmConnectionStatus);
            return;
        }
        setLowestConnectionStatus(mcpConnectionStatus);
    }, [llmConnectionStatus, mcpConnectionStatus]);

    return (
        <button
            className="ui-button ui-button-pill ui-button-surface"
            onClick={() => navigate("/connections")}>
            <ConnectionStatusBadge status={lowestConnectionStatus} />
            <ChevronRight className="h-4 w-4 text-[#6d5b68]" />
        </button>
    );
};

export default ConnectionManagerButton;
