// FrontendTools.ts
// Contains definitions for various MCP tools that are intended to run on the MCP Client exclusively

import type { ConnectedMCPServerContextProps } from "../context/MCPServerContext";

export interface FrontendTool {
    name: string;
    description: string;
    input_schema: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    };
    execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export const createFrontendTools = (mcpCtx: ConnectedMCPServerContextProps): FrontendTool[] => [
    {
        name: "read_resource",
        description: "Reads the contents of an available MCP resource by URI.",
        input_schema: {
            type: "object",
            properties: { uri: { type: "string" } },
            required: ["uri"]
        },
        execute: async input => {
            if (mcpCtx.resources.find(r => r.uri === input.uri) == undefined) {
                return undefined;
            }
            const result = await mcpCtx.mcp.readResource({ uri: input.uri as string });
            return result;
        }
    }
];
