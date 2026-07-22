import { useContext } from "react";
import { LLMContext, type ConnectionLLMContextProps } from "../context/LLMContext";

const useConnectedLLM = (): ConnectionLLMContextProps => {
    const ctx = useContext(LLMContext);
    if (ctx.connectionStatus === "not connected") {
        throw new Error(`useConnectionLLM may only be used when connectionStatus is 'connecting' or 'connected'`);
    }
    return ctx;
};

export default useConnectedLLM;