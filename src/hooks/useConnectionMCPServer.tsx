import { useContext } from "react";
import { MCPServerContext, type ConnectionMCPServerContextProps } from "../context/MCPServerContext"

const useConnectionMCPServer = (): ConnectionMCPServerContextProps => {
    const ctx = useContext(MCPServerContext);
    if (ctx.connectionStatus === "not connected") {
        throw new Error(`useConnectionMCPServer may only be used when connectionStatus is 'connecting' or 'connected'`);
    }
    return ctx;
};

export default useConnectionMCPServer;