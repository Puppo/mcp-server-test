import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

export type ToolConfig<TInput extends z.ZodTypeAny> = {
  name: string;
  description: string;
  inputSchema: TInput;
  execute: ToolCallback<TInput>;
}