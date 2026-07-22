import { Anthropic } from "@anthropic-ai/sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { LLMContext } from "../context/LLMContext";
import type { MessageCreateParams, MessageParam } from "@anthropic-ai/sdk/resources";

const useLLM = () => {

    // Context Hooks
    const ctx = useContext(LLMContext);

    // State variables
    const [ client, setClient ] = useState<Anthropic>();

    // Create message params
    const createMessageParams = useCallback(( messages: MessageParam[], stream: boolean = false ): MessageCreateParams | undefined => {
        if (ctx.connectionStatus !== "connected") throw new Error(`createMessageParams may only be called when the connectionStatus is 'connected'`);
        const { maxTokens, model } = ctx;
        return { stream, messages, max_tokens: maxTokens, model };
    }, [ ...(ctx.connectionStatus === "connected" ? [ ctx.maxTokens, ctx.model ] : [ ]) ]);

    // Update the Anthropic client when key is changed
    useEffect(() => {
        if (ctx.connectionStatus == "connecting") {
            setClient(new Anthropic({
                apiKey: ctx.apiKey,
                dangerouslyAllowBrowser: true // not suitable for non-user supplied API keys!!!!!!
            }));
        } else setClient(undefined);
    }, [ ctx.connectionStatus === "connected" ? ctx.apiKey : undefined ]);

    return { client, createMessageParams };
};

export default useLLM;