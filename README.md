# DebugMCP - Empowering AI Agents with Multi-Language Debugging Capabilities

DebugMCP provides comprehensive multi-language debugging capabilities for AI assistants via the MCP (Model Context Protocol). It is available in two forms:

1. **Standalone MCP Server** - Works with any MCP-compatible AI assistant (Claude Desktop, Cursor, etc.)
2. **VS Code Extension** - Includes the MCP server built-in, plus provides an interactive debugging experience within VS Code

> **📢 Beta Version Notice**: This is a beta version of DebugMCP maintained by [ozzafar@microsoft.com](mailto:ozzafar@microsoft.com) and [orbarila@microsoft.com](mailto:orbarila@microsoft.com). We welcome feedback and contributions to help improve this extension.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.104.0+-blue.svg)](https://code.visualstudio.com/)
[![Version](https://img.shields.io/badge/version-1.0.2-green.svg)](https://github.com/microsoft/DebugMCP)
[![VS Marketplace](https://img.shields.io/badge/VS%20Marketplace-Install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=ozzafar.debugmcpextension)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Standalone MCP Server](#standalone-mcp-server)
  - [VS Code Extension](#vs-code-extension-installation)
- [Configuration](#configuration)
  - [DebugMCP Configuration](#debugmcp-configuration)
  - [VS Code Extension Settings](#vs-code-extension-settings)
- [Quick Start](#quick-start)
- [Supported Languages](#supported-languages)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

DebugMCP bridges the gap between professional debugging and AI-assisted development by providing a powerful debugging interface that AI assistants can use to help you identify and fix issues in your code.

| Option | Best For | What You Get |
|--------|----------|--------------|
| **Standalone MCP Server** | Claude Desktop, Cursor, or any MCP client | Full debugging capabilities via MCP protocol |
| **VS Code Extension** | VS Code users with AI assistants (Copilot, Cline, Roo) | MCP server + interactive VS Code debugging UI |

> **Note**: The VS Code extension includes the standalone MCP server functionality, so you don't need both.

## Features

### 🔧 Tools

| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| **start_debugging** | Start a debug session for a source code file | `filePath` (required)<br>`workingDirectory` (optional)<br>`configurationName` (optional) | Start debugging a Python script |
| **stop_debugging** | Stop the current debug session | None | End the current debugging session |
| **step_over** | Execute the next line (step over function calls) | None | Move to next line without entering functions |
| **step_into** | Step into function calls | None | Enter function calls to debug them |
| **step_out** | Step out of the current function | None | Exit current function and return to caller |
| **continue_execution** | Continue until next breakpoint | None | Resume execution until hitting a breakpoint |
| **restart_debugging** | Restart the current debug session | None | Restart debugging from the beginning |
| **add_breakpoint** | Add a breakpoint at a specific line | `filePath` (required)<br>`line` (required) | Set breakpoint at line 25 of main.py |
| **remove_breakpoint** | Remove a breakpoint from a specific line | `filePath` (required)<br>`line` (required) | Remove breakpoint from line 25 |
| **list_breakpoints** | List all active breakpoints | None | Show all currently set breakpoints |
| **get_debug_status** | Get current debug session status | None | Check if debugging session is active |
| **get_variables** | Get variables and their values | `scope` (optional: 'local', 'global', 'all') | Inspect local variables |
| **evaluate_expression** | Evaluate an expression in debug context | `expression` (required) | Evaluate `user.name` or `len(items)` |

### 🎯 Debugging Best Practices

DebugMCP follows systematic debugging practices for effective issue resolution:

- **Start with Entry Points**: Begin debugging at function entry points or main execution paths
- **Follow the Execution Flow**: Use step-by-step execution to understand code flow
- **Root Cause Analysis**: Don't stop at symptoms - find the underlying cause

### 🛡️ Security & Reliability
- **Secure Communication**: All MCP communications use secure protocols
- **Local Operation**: The MCP server runs 100% locally with no external communications and requires no credentials
- **State Validation**: Robust validation of debugging states and operations

## Installation

### Standalone MCP Server

For use with Claude Desktop, Cursor, or any MCP-compatible client (without VS Code):

```bash
npx debugmcp
```

Then configure your MCP client to connect (see [DebugMCP Configuration](#debugmcp-configuration)).

### VS Code Extension Installation

For VS Code users who want the full interactive debugging experience:

**Option 1: Direct Link** (Fastest)
- Click this link: [vscode:extension/ozzafar.debugmcpextension](vscode:extension/ozzafar.debugmcpextension)
- Or copy and paste in your browser: `vscode:extension/ozzafar.debugmcpextension`

**Option 2: VS Code Marketplace**
- Visit: [https://marketplace.visualstudio.com/items?itemName=ozzafar.debugmcpextension](https://marketplace.visualstudio.com/items?itemName=ozzafar.debugmcpextension)
- Click "Install"

**Option 3: Within VS Code**
1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "DebugMCP"
4. Click Install
5. The extension automatically activates and registers as an MCP server

### Verification

**For Standalone MCP Server:**
- The server starts and displays connection information
- Your MCP client can connect and list debugging tools

**For VS Code Extension:**
- DebugMCP extension appears in your installed extensions
- MCP server automatically runs on port 3001 (configurable)
- Debug tools are available to connected AI assistants

> **📝 Note**: No additional debugging rule instructions are needed - DebugMCP works out of the box.

> **💡 Tip**: Enable auto-approval for all debugmcp tools in your AI assistant to create seamless debugging workflows without constant approval interruptions.

## Quick Start

1. **Install the extension** (see [Installation](#installation))
2. **Open your project** in VSCode
3. **Ask your AI to debug** - it can now set breakpoints, start debugging, and analyze your code!

## Supported Languages

DebugMCP supports debugging for the following languages with their respective VSCode extensions:

| Language | Extension Required | File Extensions | Status |
|----------|-------------------|-----------------|---------|
| **Python** | [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | `.py` | ✅ Fully Supported |
| **JavaScript/TypeScript** | Built-in / [JS Debugger](https://marketplace.visualstudio.com/items?itemName=ms-vscode.js-debug) | `.js`, `.ts`, `.jsx`, `.tsx` | ✅ Fully Supported |
| **Java** | [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) | `.java` | ✅ Fully Supported |
| **C/C++** | [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) | `.c`, `.cpp`, `.h`, `.hpp` | ✅ Fully Supported |
| **Go** | [Go](https://marketplace.visualstudio.com/items?itemName=golang.Go) | `.go` | ✅ Fully Supported |
| **Rust** | [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) | `.rs` | ✅ Fully Supported |
| **PHP** | [PHP Debug](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug) | `.php` | ✅ Fully Supported |
| **Ruby** | [Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.ruby) | `.rb` | ✅ Fully Supported |
| **C#/.NET** | [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) | `.cs` | ✅ Fully Supported |

## Configuration

### DebugMCP Configuration

Configure your MCP client to connect to DebugMCP. The configuration depends on your AI assistant:

#### Claude Desktop

Add to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "debugmcp": {
      "command": "npx",
      "args": ["debugmcp"]
    }
  }
}
```

#### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "debugmcp": {
      "command": "npx",
      "args": ["debugmcp"]
    }
  }
}
```

#### Cline

Add to your Cline settings or `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "debugmcp": {
      "command": "npx",
      "args": ["debugmcp"]
    }
  }
}
```

#### OpenCode

Add to your OpenCode config file (`~/.config/opencode/config.json`):

```json
{
  "mcp": {
    "debugmcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["debugmcp"]
    }
  }
}
```

---

### VS Code Extension Settings

> **Note**: These settings only apply when using the VS Code extension. They configure the built-in MCP server that the extension runs automatically.

The VS Code extension includes the MCP server and exposes it via SSE (Server-Sent Events) for AI assistants running inside VS Code.

#### Extension Configuration

Configure DebugMCP behavior in VS Code settings (`.vscode/settings.json` or user settings):

```json
{
  "debugmcp.serverPort": 3001,
  "debugmcp.timeoutInSeconds": 180
}
```

| Setting | Default | Description |
|---------|---------|-------------|
| `debugmcp.serverPort` | `3001` | Port number for the MCP server |
| `debugmcp.timeoutInSeconds` | `180` | Timeout for debugging operations |

#### Connecting VS Code AI Assistants

When using the VS Code extension, AI assistants connect via SSE to the built-in server:

**GitHub Copilot**

Add to your workspace settings (`.vscode/settings.json`):

```json
{
  "github.copilot.mcp.servers": {
    "debugmcp": {
      "type": "sse",
      "url": "http://localhost:3001/sse"
    }
  }
}
```

**Cline (in VS Code)**

Add to Cline MCP settings:

```json
{
  "mcpServers": {
    "debugmcp": {
      "transport": "sse",
      "url": "http://localhost:3001/sse"
    }
  }
}
```

**Roo Code**

Add to Roo's MCP settings:

```json
{
  "mcp": {
    "servers": {
      "debugmcp": {
        "type": "sse",
        "url": "http://localhost:3001/sse"
      }
    }
  }
}
```

> **Note**: The extension will prompt to auto-register the MCP server with your AI assistant on first activation.


## Troubleshooting

### Common Issues

#### MCP Server Not Starting
- **Symptom**: AI assistant can't connect to DebugMCP
- **Solution**: 
  - Check if port 3001 is available
  - Restart VSCode
  - Verify extension is installed and activated

## How It Works

### Launch Configuration Integration
The extension handles debug configurations intelligently:

- **Existing launch.json**: If a `.vscode/launch.json` file exists, it will:
   - Search for a relevant configuration
   - Use a specific configuration if found

- **Default Configuration**: If no launch.json exists or no relevant config, it creates an appropriate default configurations for each language based on file extension detection


## Requirements

- VSCode with appropriate language extensions installed:
  - **Python**: [Python extension](vscode:extension/ms-python.debugpy) for `.py` files
  - **JavaScript/TypeScript**: Built-in Node.js debugger or [JavaScript Debugger extension](vscode:extension/ms-vscode.js-debug)
  - **Java**: [Extension Pack for Java](vscode:extension/vscjava.vscode-java-pack)
  - **C#/.NET**: [C# extension](vscode:extension/ms-dotnettools.csharp)
  - **C/C++**: [C/C++ extension](vscode:extension/ms-vscode.cpptools)
  - **Go**: [Go extension](vscode:extension/golang.go)
  - **Rust**: [rust-analyzer extension](vscode:extension/rust-lang.rust-analyzer)
  - **PHP**: [PHP Debug extension](vscode:extension/xdebug.php-debug)
  - **Ruby**: [Ruby extension](vscode:extension/rebornix.ruby) with debug support
- MCP-compatible AI assistant (Copilot, Cline, Roo..)

## Demo

<video width="800" controls>
  <source src="assets/DebugMCP.mp4" type="video/mp4">
  Your browser does not support the video tag. <a href="assets/DebugMCP.mp4">Download the demo video</a>
</video>

> Watch to see DebugMCP in action, showing the integration between the VSCode extension and an AI assistant using the MCP protocol.

## Development

To build the extension:

```bash
npm install
npm run compile
```

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Security

Security vulnerabilities should be reported following the guidance at [https://aka.ms/SECURITY.md](https://aka.ms/SECURITY.md).
Please do not report security vulnerabilities through public GitHub issues.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

## License

MIT License - See [LICENSE](LICENSE.txt) for details

This extension was created by **Oz Zafar**, **Ori Bar-Ilan** and **Karin Brisker**.
