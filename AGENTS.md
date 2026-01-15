# Agent Guidelines for DebugMCP

## Project Overview

DebugMCP is a VS Code extension that embeds an MCP (Model Context Protocol) server, enabling AI coding agents to control VS Code's debugger via DAP (Debug Adapter Protocol). AI agents can start/stop debugging, step through code, set breakpoints, inspect variables, and evaluate expressions.

### Architecture

```
AI Agent (Cline/Copilot/Cursor) → MCP/SSE → DebugMCPServer → DebuggingHandler → DebuggingExecutor → VS Code Debug API
```

### Key Components

| Component | Responsibility | Docs |
|-----------|----------------|------|
| `DebugMCPServer` | MCP server, tool/resource registration | [docs/debugMCPServer.md](docs/debugMCPServer.md) |
| `DebuggingHandler` | Operation orchestration, state change detection | [docs/debuggingHandler.md](docs/debuggingHandler.md) |
| `DebuggingExecutor` | VS Code debug API calls, DAP requests | [docs/debuggingExecutor.md](docs/debuggingExecutor.md) |
| `DebugState` | Debug session state model | [docs/debugState.md](docs/debugState.md) |
| `DebugConfigurationManager` | Launch configs, language detection | [docs/debugConfigurationManager.md](docs/debugConfigurationManager.md) |
| `AgentConfigurationManager` | AI agent auto-configuration | [docs/agentConfigurationManager.md](docs/agentConfigurationManager.md) |

## Documentation Maintenance

**IMPORTANT**: Keep `docs/*.md` files up to date when modifying components. These docs should remain high-level:
- Purpose and motivation
- Responsibility scope
- Key concepts and patterns
- Pointers to relevant code sections

Do NOT duplicate detailed implementation in docs - that information should be inferred from the code itself.

## File Header

Include in each source file:
```typescript
// Copyright (c) Microsoft Corporation.
```

## Build/Lint/Test Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile TypeScript to `out/` |
| `npm run lint` | Run ESLint on `src/` |
| `npm test` | Run all tests (`src/test/*.test.ts`) |
| `npm run watch` | Compile in watch mode |

## Code Style & Conventions

- **TypeScript**: Strict mode, ES2022 target, Node16 modules
- **Imports**: vscode → external packages → internal modules
- **Naming**: camelCase (variables/functions), PascalCase (classes/interfaces), `I` prefix for interfaces
- **Types**: Explicit types preferred, strict null checks, avoid `any`
- **Error Handling**: try-catch with descriptive messages, throw `Error` objects
- **Formatting**: Semicolons, curly braces for all control structures, tabs for indentation
- **Async**: async/await, exponential backoff for retries
- **Logging**: Use `logger` from `./utils/logger` (not `console.log`). Simple wrapper providing `info`, `warn`, `error` methods with consistent formatting.
- **VS Code API**: Import as `import * as vscode from 'vscode'`

## Key Dependencies

- `fastmcp`: MCP server framework
- `zod`: Schema validation for tool parameters
- `@modelcontextprotocol/sdk`: MCP protocol types
- `express`: HTTP server (used by FastMCP)

## Entry Points

- **Extension activation**: `src/extension.ts` → `activate()`
- **MCP endpoint**: `http://localhost:{port}/sse` (default port: 3001)

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `debugmcp.serverPort` | 3001 | MCP server port |
| `debugmcp.timeoutInSeconds` | 180 | Operation timeout |

## Documentation Resources

The `docs/` folder contains resources exposed to AI agents via MCP:

| File | Purpose |
|------|---------|
| `debug_instructions.md` | Core debugging workflow guide for AI agents |
| `troubleshooting/*.md` | Language-specific debugging tips (Python, JavaScript, Java, C#) |

These files are loaded at runtime by `DebugMCPServer` and served as MCP resources.
