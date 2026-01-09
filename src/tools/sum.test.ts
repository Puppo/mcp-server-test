import assert from "node:assert";
import { describe, test } from "node:test";
import { sumToolConfig } from "./sum.ts";

describe("Sum Tool", () => {
  describe("Tool Configuration", () => {
    test("should have correct tool name", () => {
      assert.strictEqual(sumToolConfig.name, "sum_numbers");
    });

    test("should have a description", () => {
      assert.ok(sumToolConfig.description);
      assert.match(sumToolConfig.description, /sum/i);
    });

    test("should have an input schema", () => {
      assert.ok(sumToolConfig.inputSchema);
    });

    test("should have an execute function", () => {
      assert.strictEqual(typeof sumToolConfig.execute, "function");
    });
  });

  describe("Sum Calculation", () => {
    test("should sum two numbers", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,2" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /3/);
    });

    test("should sum three numbers", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /6/);
    });

    test("should sum multiple numbers", async () => {
      const result = await sumToolConfig.execute({ numbers: "10,20,30,40" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /100/);
    });

    test("should handle single number", async () => {
      const result = await sumToolConfig.execute({ numbers: "42" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /42/);
    });

    test("should handle zero", async () => {
      const result = await sumToolConfig.execute({ numbers: "0" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /0/);
    });

    test("should handle negative numbers", async () => {
      const result = await sumToolConfig.execute({ numbers: "-5,10,-3" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /2/);
    });

    test("should handle decimal numbers", async () => {
      const result = await sumToolConfig.execute({ numbers: "1.5,2.5,3" });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /7/);
    });

    test("should handle numbers with spaces", async () => {
      const result = await sumToolConfig.execute({ numbers: " 1 , 2 , 3 " });
      assert.strictEqual(result.isError, undefined);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /6/);
    });
  });

  describe("Error Handling", () => {
    test("should return error for invalid number format", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,abc,3" });
      assert.strictEqual(result.isError, true);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /Error:/);
      assert.match(result.content[0].text, /Invalid number/);
    });

    test("should return error for empty string in list", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,,3" });
      assert.strictEqual(result.isError, true);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /Error:/);
    });

    test("should return error for non-numeric text", async () => {
      const result = await sumToolConfig.execute({ numbers: "hello" });
      assert.strictEqual(result.isError, true);
      assert.strictEqual(result.content[0].type, "text");
      assert.match(result.content[0].text, /Invalid number/);
    });
  });

  describe("Response Format", () => {
    test("should return response with content array", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" });
      assert.ok(Array.isArray(result.content));
      assert.strictEqual(result.content.length, 1);
    });

    test("should return text content type", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" });
      assert.strictEqual(result.content[0].type, "text");
    });

    test("should include numbers in response", async () => {
      const result = await sumToolConfig.execute({ numbers: "5,10,15" });
      assert.match(result.content[0].text, /5/);
      assert.match(result.content[0].text, /10/);
      assert.match(result.content[0].text, /15/);
    });

    test("should include result in response", async () => {
      const result = await sumToolConfig.execute({ numbers: "5,10,15" });
      assert.match(result.content[0].text, /30/);
    });

    test("should format numbers with plus signs", async () => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" });
      assert.match(result.content[0].text, /\+/);
    });
  });

  describe("Input Schema Validation", () => {
    test("should accept valid comma-separated numbers", () => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "1,2,3" });
      assert.strictEqual(result.success, true);
    });

    test("should accept single number", () => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "42" });
      assert.strictEqual(result.success, true);
    });

    test("should accept empty string", () => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "" });
      assert.strictEqual(result.success, true);
    });

    test("should reject missing numbers field", () => {
      const result = sumToolConfig.inputSchema.safeParse({});
      assert.strictEqual(result.success, false);
    });

    test("should reject non-string input", () => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: 123 });
      assert.strictEqual(result.success, false);
    });

    test("should reject array input", () => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: [1, 2, 3] });
      assert.strictEqual(result.success, false);
    });
  });
});
