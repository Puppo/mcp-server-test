import { sumToolConfig } from "@/src/tools/sum.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { ServerNotification, ServerRequest, TextContent } from "@modelcontextprotocol/sdk/types.js";
import { describe, test, type TestContext } from "node:test";

const mockExtra = {} as RequestHandlerExtra<ServerRequest, ServerNotification>;

describe("Sum Tool", () => {
  describe("Tool Configuration", () => {
    test("should have correct tool name", (t: TestContext) => {
      t.assert.strictEqual(sumToolConfig.name, "sum_numbers");
    });

    test("should have a description", (t: TestContext) => {
      t.assert.ok(sumToolConfig.description);
      t.assert.match(sumToolConfig.description, /sum/i);
    });

    test("should have an input schema", (t: TestContext) => {
      t.assert.ok(sumToolConfig.inputSchema);
    });

    test("should have an execute function", (t: TestContext) => {
      t.assert.strictEqual(typeof sumToolConfig.execute, "function");
    });
  });

  describe("Sum Calculation", () => {
    test("should sum two numbers", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,2" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /3/);
    });

    test("should sum three numbers", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /6/);
    });

    test("should sum multiple numbers", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "10,20,30,40" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /100/);
    });

    test("should handle single number", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "42" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /42/);
    });

    test("should handle zero", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "0" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /0/);
    });

    test("should handle negative numbers", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "-5,10,-3" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /2/);
    });

    test("should handle decimal numbers", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1.5,2.5,3" }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /7/);
    });

    test("should handle numbers with spaces", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: " 1 , 2 , 3 " }, mockExtra);
      t.assert.strictEqual(result.isError, undefined);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /6/);
    });
  });

  describe("Error Handling", () => {
    test("should return error for invalid number format", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,abc,3" }, mockExtra);
      t.assert.strictEqual(result.isError, true);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /Error:/);
      t.assert.match((result.content[0] as TextContent).text, /Invalid number/);
    });

    test("should return error for empty string in list", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,,3" }, mockExtra);
      t.assert.strictEqual(result.isError, true);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /Error:/);
    });

    test("should return error for non-numeric text", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "hello" }, mockExtra);
      t.assert.strictEqual(result.isError, true);
      t.assert.strictEqual(result.content[0].type, "text");
      t.assert.match((result.content[0] as TextContent).text, /Invalid number/);
    });
  });

  describe("Response Format", () => {
    test("should return response with content array", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" }, mockExtra);
      t.assert.ok(Array.isArray(result.content));
      t.assert.strictEqual(result.content.length, 1);
    });

    test("should return text content type", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" }, mockExtra);
      t.assert.strictEqual(result.content[0].type, "text");
    });

    test("should include numbers in response", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "5,10,15" }, mockExtra);
      t.assert.match((result.content[0] as TextContent).text, /5/);
      t.assert.match((result.content[0] as TextContent).text, /10/);
      t.assert.match((result.content[0] as TextContent).text, /15/);
    });

    test("should include result in response", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "5,10,15" }, mockExtra);
      t.assert.match((result.content[0] as TextContent).text, /30/);
    });

    test("should format numbers with plus signs", async (t: TestContext) => {
      const result = await sumToolConfig.execute({ numbers: "1,2,3" }, mockExtra);
      t.assert.match((result.content[0] as TextContent).text, /\+/);
    });
  });

  describe("Input Schema Validation", () => {
    test("should accept valid comma-separated numbers", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "1,2,3" });
      t.assert.strictEqual(result.success, true);
    });

    test("should accept single number", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "42" });
      t.assert.strictEqual(result.success, true);
    });

    test("should accept empty string", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: "" });
      t.assert.strictEqual(result.success, true);
    });

    test("should reject missing numbers field", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({});
      t.assert.strictEqual(result.success, false);
    });

    test("should reject non-string input", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: 123 });
      t.assert.strictEqual(result.success, false);
    });

    test("should reject array input", (t: TestContext) => {
      const result = sumToolConfig.inputSchema.safeParse({ numbers: [1, 2, 3] });
      t.assert.strictEqual(result.success, false);
    });
  });
});
