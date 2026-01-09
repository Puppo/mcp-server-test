#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  StdioServerTransport
} from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools } from "./tools/index.js";

export function registerTools(mcpServer: McpServer) {
  for (const {
  name, description, inputSchema, execute
  } of tools) {
    mcpServer.registerTool(
      name,
      {
        title: name,
        description: description,
        inputSchema: inputSchema
      },
      execute
    );
  }
}

// Start the server with stdio transport
async function main() {
    try {
        const mcpServer = new McpServer({
            name: "my-mcp-server",
            version: "1.0.0"
          }, {
            capabilities: {
              tools: {},
            }
        });

        registerTools(mcpServer);
        const transport = new StdioServerTransport();
        await mcpServer.connect(transport);
        console.error("Server started and listening on stdio");
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

main();