import { fibonacciToolConfig } from "@/src/tools/fibonacci.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { ServerNotification, ServerRequest, TextContent } from "@modelcontextprotocol/sdk/types.js";
import { describe, test, type TestContext } from "node:test";

const mockExtra = {} as RequestHandlerExtra<ServerRequest, ServerNotification>;

describe("Fibonacci Tool", () => {
  describe("Tool Configuration", () => {
    test("should have correct tool name", (t: TestContext) => {
      t.assert.strictEqual(fibonacciToolConfig.name, "fibonacci_series");
    });

    test("should have a description", (t: TestContext) => {
      t.assert.ok(fibonacciToolConfig.description);
      t.assert.match(fibonacciToolConfig.description, /fibonacci/i);
    });

    test("should have an input schema", (t: TestContext) => {
      t.assert.ok(fibonacciToolConfig.inputSchema);
    });

    test("should have an execute function", (t: TestContext) => {
      t.assert.strictEqual(typeof fibonacciToolConfig.execute, "function");
    });
  });

  describe("Fibonacci Calculation", () => {
    test("should return 0 for input 0", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 0 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /0/);
    });

    test("should return 1 for input 1", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 1 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /1/);
    });

    test("should return 1 for input 2", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 2 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /1/);
    });

    test("should return correct value for input 5", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 5 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /5/);
    });

    test("should return correct value for input 10", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 10 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /55/);
    });

    test("should return correct value for input 15", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 15 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /610/);
    });

    test("should return correct value for input 20", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 20 }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /6765/);
    });
  });

  describe("Response Format", () => {
    test("should return response with content array", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 5 }, mockExtra);
      t.assert.ok(Array.isArray(result.content));
      t.assert.strictEqual(result.content.length, 1);
    });

    test("should return text content type", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 5 }, mockExtra);
      t.assert.strictEqual(result.content[0].type, "text");
    });

    test("should include input number in response", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 7 }, mockExtra);
      t.assert.match((result.content[0] as TextContent).text, /7/);
    });

    test("should include calculated result in response", async (t: TestContext) => {
      const result = await fibonacciToolConfig.execute({ number: 7 }, mockExtra);
      t.assert.match((result.content[0] as TextContent).text, /13/);
    });
  });

  describe("Input Schema Validation", () => {
    test("should accept valid non-negative integer", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 5 });
      t.assert.strictEqual(result.success, true);
    });

    test("should accept zero", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 0 });
      t.assert.strictEqual(result.success, true);
    });

    test("should reject negative numbers", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: -1 });
      t.assert.strictEqual(result.success, false);
    });

    test("should reject decimal numbers", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 5.5 });
      t.assert.strictEqual(result.success, false);
    });

    test("should reject missing number", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({});
      t.assert.strictEqual(result.success, false);
    });

    test("should reject non-numeric values", (t: TestContext) => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: "5" });
      t.assert.strictEqual(result.success, false);
    });
  });
});
