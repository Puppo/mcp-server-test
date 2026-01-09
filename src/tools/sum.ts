import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

const getSumToolSchema = z.object({
  numbers: z.string().describe("A comma-separated list of numbers to sum, e.g. '1,2,3'"),
});

function parseNumbers(numbersStr: string): number[] {
  return numbersStr.split(',').map(numStr => {
    const num = parseFloat(numStr.trim());
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${numStr}`);
    }
    return num;
  });
}

function sum (numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

const sumToolName = "sum_numbers";
const sumTool: ToolCallback<typeof getSumToolSchema> = async function (args) {
  try {
    const numbers = parseNumbers(args.numbers);
    const result = sum(numbers);
    return {
      content: [{
        type: "text",
        text: `The sum of ${numbers.join(' + ')} is: ${result}`
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

export const sumToolConfig = {
  name: sumToolName,
  description: "This tool sums a list of numbers provided in a string format and split by commas.",
  inputSchema: getSumToolSchema,
  execute: sumTool
} as const;