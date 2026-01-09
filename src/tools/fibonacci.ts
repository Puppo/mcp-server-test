import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

const getFibonacciToolSchema = z.object({
  number: z.number().int().nonnegative().describe("A non-negative integer to compute the Fibonacci number for, e.g. '10'"),
});

const fibonacciToolName = "fibonacci_series";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}


const fibonacciTool: ToolCallback<typeof getFibonacciToolSchema> = async function ({
  number
}) {
  try {
    const result = fibonacci(number);
    return {
      content: [{
        type: "text",
        text: `The Fibonacci number for ${number} is: ${result}`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: `Error: ${(error as Error).message}`
      }]
    };
  }
}

export const fibonacciToolConfig = {
  name: fibonacciToolName,
  description: "This tool computes the Fibonacci number for a given non-negative integer.",
  inputSchema: getFibonacciToolSchema,
  execute: fibonacciTool
} as const;