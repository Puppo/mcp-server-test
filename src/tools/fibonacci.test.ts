import assert from "node:assert";
import { describe, test } from "node:test";
import { fibonacciToolConfig } from "./fibonacci.js";

describe("Fibonacci Tool", () => {
  describe("Tool Configuration", () => {
    test("should have correct tool name", () => {
      assert.strictEqual(fibonacciToolConfig.name, "fibonacci_series");
    });

    test("should have a description", () => {
      assert.ok(fibonacciToolConfig.description);
      assert.match(fibonacciToolConfig.description, /fibonacci/i);
    });

    test("should have an input schema", () => {
      assert.ok(fibonacciToolConfig.inputSchema);
    });

    test("should have an execute function", () => {
      assert.strictEqual(typeof fibonacciToolConfig.execute, "function");
    });
  });

  describe("Fibonacci Calculation", () => {
    test("should return 0 for input 0", async () => {
      const result = await fibonacciToolConfig.execute({ number: 0 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /0/);
    });

    test("should return 1 for input 1", async () => {
      const result = await fibonacciToolConfig.execute({ number: 1 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /1/);
    });

    test("should return 1 for input 2", async () => {
      const result = await fibonacciToolConfig.execute({ number: 2 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /1/);
    });

    test("should return correct value for input 5", async () => {
      const result = await fibonacciToolConfig.execute({ number: 5 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /5/);
    });

    test("should return correct value for input 10", async () => {
      const result = await fibonacciToolConfig.execute({ number: 10 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /55/);
    });

    test("should return correct value for input 15", async () => {
      const result = await fibonacciToolConfig.execute({ number: 15 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /610/);
    });

    test("should return correct value for input 20", async () => {
      const result = await fibonacciToolConfig.execute({ number: 20 });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /6765/);
    });
  });

  describe("Response Format", () => {
    test("should return response with content array", async () => {
      const result = await fibonacciToolConfig.execute({ number: 5 });
      assert.ok(Array.isArray(result.content));
      assert.strictEqual(result.content.length, 1);
    });

    test("should return text content type", async () => {
      const result = await fibonacciToolConfig.execute({ number: 5 });
      assert.strictEqual(result.content[0].type, "text");
    });

    test("should include input number in response", async () => {
      const result = await fibonacciToolConfig.execute({ number: 7 });
      assert.match(result.content[0].text, /7/);
    });

    test("should include calculated result in response", async () => {
      const result = await fibonacciToolConfig.execute({ number: 7 });
      assert.match(result.content[0].text, /13/);
    });
  });

  describe("Input Schema Validation", () => {
    test("should accept valid non-negative integer", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 5 });
      assert.strictEqual(result.success, true);
    });

    test("should accept zero", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 0 });
      assert.strictEqual(result.success, true);
    });

    test("should reject negative numbers", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: -1 });
      assert.strictEqual(result.success, false);
    });

    test("should reject decimal numbers", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: 5.5 });
      assert.strictEqual(result.success, false);
    });

    test("should reject missing number", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({});
      assert.strictEqual(result.success, false);
    });

    test("should reject non-numeric values", () => {
      const result = fibonacciToolConfig.inputSchema.safeParse({ number: "5" });
      assert.strictEqual(result.success, false);
    });
  });
});
