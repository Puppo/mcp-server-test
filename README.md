# @puppo/mcp-server-test

A Model Context Protocol (MCP) server providing mathematical utility tools.

## Features

- **Fibonacci**: Calculate Fibonacci numbers for a given index
- **Sum**: Sum a list of comma-separated numbers

## Installation

```bash
npm install -g @puppo/mcp-server-test
```

## Usage

Register the MCP server:

```json
{
  "mcpServers": {
    "puppo-mcp-server-test": {
      "command": "npx",
      "args": ["-y", "@puppo/mcp-server-test@latest"]
    }
  }
}
```

## Available Tools

### fibonacci

Computes the Fibonacci number for a given non-negative integer.

**Parameters:**

- `number`: A non-negative integer (e.g., 10)

### sum

Sums a list of numbers provided in a string format.

**Parameters:**

- `numbers`: A comma-separated list of numbers (e.g., "1,2,3")

## License

MIT
