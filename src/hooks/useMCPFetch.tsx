const useMCPFetch = (ipAddress: string) => {
    const mcpGet = (url: string, timeout: number = 10) => {
        if (!ipAddress)
            throw new Error(`Attempt to make a GET request to the MCP Server without setting an IP Address.`);

        if (typeof url !== "string" || !url.startsWith("/")) {
            throw new Error(`Invalid URL path: ${url}. URL must start with /`);
        }

        return fetch(`http://${ipAddress}${url}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(timeout * 1000)
        });
    };

    const mcpPost = (url: string, body: BodyInit, timeout: number = 10) => {
        if (!ipAddress)
            throw new Error(`Attempt to make a POST request to the MCP Server without setting an IP Address.`);

        if (typeof url !== "string" || !url.startsWith("/")) {
            throw new Error(`Invalid URL path: ${url}. URL must start with /`);
        }

        return fetch(`http://${ipAddress}${url}`, {
            method: "POST",
            body: body,
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(timeout * 1000)
        });
    };

    return { mcpGet, mcpPost };
};

export default useMCPFetch;
