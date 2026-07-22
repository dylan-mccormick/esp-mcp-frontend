import { useContext } from "react";
import { MCPServerContext, type ConnectedMCPServerContextProps } from "../context/MCPServerContext";

const useConnectedMCPServer = (): ConnectedMCPServerContextProps => {
    const ctx = useContext(MCPServerContext);
    if (ctx.connectionStatus !== "connected") {
        throw new Error(`useConnectedMCPServer may only be used when connectionStatus is 'connected'`);
    }
    return ctx;
};

export default useConnectedMCPServer;