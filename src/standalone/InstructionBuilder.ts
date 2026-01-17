// Copyright (c) Microsoft Corporation.

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { StandaloneConfig, AdapterConfig } from './ConfigLoader';

const execAsync = promisify(exec);

/**
 * Validation result for a debugger adapter
 */
export interface AdapterValidationResult {
	name: string;
	isConfigured: boolean;
	isValid: boolean;
	issues: string[];
	setupInstructions?: string;
}

/**
 * Result of validating the entire configuration
 */
export interface ConfigValidationResult {
	hasConfig: boolean;
	configPath: string;
	adapters: AdapterValidationResult[];
	globalIssues: string[];
}

/**
 * Debugger setup information for each supported language
 */
interface DebuggerSetupInfo {
	displayName: string;
	emoji: string;
	installCommand: string;
	verifyCommand: string;
	prerequisites: string[];
	bestPractices: string[];
	commonIssues: { problem: string; solution: string }[];
	sampleConfig: {
		adapter: AdapterConfig;
		defaults: Record<string, unknown>;
	};
}

/**
 * Registry of supported debuggers and their setup information
 */
const DEBUGGER_REGISTRY: Record<string, DebuggerSetupInfo> = {
	python: {
		displayName: 'Python (debugpy)',
		emoji: '🐍',
		installCommand: 'pip install debugpy',
		verifyCommand: 'python -c "import debugpy; print(debugpy.__version__)"',
		prerequisites: [
			'Python 3.7+ installed',
			'debugpy package installed: `pip install debugpy`',
			'Virtual environment activated (if using one)',
		],
		bestPractices: [
			'Set breakpoints inside function bodies (not on `def` lines)',
			'Use breakpoints after import statements to debug module loading',
			'Set breakpoints in `except` blocks to catch and inspect exceptions',
			'Break complex list comprehensions into regular loops for easier debugging',
			'Be aware that decorators can affect breakpoint placement',
		],
		commonIssues: [
			{ problem: 'ModuleNotFoundError for debugpy', solution: 'Run `pip install debugpy` in your active Python environment' },
			{ problem: 'Wrong Python interpreter', solution: 'Ensure the correct virtual environment is activated' },
			{ problem: 'Breakpoint on `def` line not hit', solution: 'Move breakpoint to first line inside the function body' },
		],
		sampleConfig: {
			adapter: {
				command: 'python',
				args: ['-m', 'debugpy.adapter'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'python',
				request: 'launch',
				console: 'internalConsole',
				justMyCode: true,
			},
		},
	},
	node: {
		displayName: 'Node.js (js-debug)',
		emoji: '🟢',
		installCommand: 'npm install',
		verifyCommand: 'node --version',
		prerequisites: [
			'Node.js 14+ installed',
			'js-debug adapter available (usually from VS Code extension)',
			'For standalone: extract js-debug from VS Code extensions',
		],
		bestPractices: [
			'Set breakpoints inside async functions and callbacks',
			'Use breakpoints in `.then()` and `.catch()` blocks for Promise debugging',
			'Watch for variable scope issues in closures and nested functions',
			'Enable source maps when debugging TypeScript',
			'Set breakpoints in event handlers for event-driven code',
		],
		commonIssues: [
			{ problem: 'Cannot find js-debug adapter', solution: 'Install VS Code js-debug extension or configure path to standalone adapter' },
			{ problem: 'Source maps not working', solution: 'Ensure `sourceMaps: true` in config and maps are generated' },
			{ problem: 'Breakpoint in async code not hit', solution: 'Set breakpoint inside the async callback, not on the async call' },
		],
		sampleConfig: {
			adapter: {
				command: 'node',
				args: ['${env:HOME}/.vscode/extensions/ms-vscode.js-debug-*/src/dapDebugServer.js'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'node',
				request: 'launch',
				console: 'internalConsole',
			},
		},
	},
	java: {
		displayName: 'Java (java-debug)',
		emoji: '☕',
		installCommand: 'Install Java Extension Pack in VS Code',
		verifyCommand: 'java -version',
		prerequisites: [
			'JDK 11+ installed',
			'JAVA_HOME environment variable set',
			'Java Extension Pack or java-debug adapter',
			'Project compiled with debug symbols',
		],
		bestPractices: [
			'Ensure `.class` files are up-to-date before debugging',
			'Set breakpoints inside `main` method for entry point debugging',
			'Use breakpoints in `catch` blocks to debug exceptions',
			'Verify all dependencies are in the classpath',
			'Use conditional breakpoints for loops with many iterations',
		],
		commonIssues: [
			{ problem: 'ClassNotFoundException', solution: 'Check classpath and package structure' },
			{ problem: 'JAVA_HOME not set', solution: 'Set JAVA_HOME environment variable to JDK installation path' },
			{ problem: 'Debug symbols missing', solution: 'Compile with `-g` flag or in Debug mode' },
		],
		sampleConfig: {
			adapter: {
				command: 'java',
				args: ['-jar', '${env:HOME}/.vscode/extensions/vscjava.vscode-java-debug-*/server/com.microsoft.java.debug.plugin-*.jar'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'java',
				request: 'launch',
				console: 'internalConsole',
			},
		},
	},
	coreclr: {
		displayName: 'C# / .NET (coreclr)',
		emoji: '🔷',
		installCommand: 'Install C# Dev Kit in VS Code',
		verifyCommand: 'dotnet --version',
		prerequisites: [
			'.NET SDK 6.0+ installed',
			'C# Dev Kit extension (for VS Code integration)',
			'Project builds successfully in Debug mode',
		],
		bestPractices: [
			'Ensure project builds in Debug configuration (not Release)',
			'Use line content matching for reliable breakpoint placement',
			'Clear breakpoints when stopping debug sessions',
			'For tests, use exact method names for precise filtering',
		],
		commonIssues: [
			{ problem: 'Debugger won\'t start', solution: 'Install C# Dev Kit extension and ensure .NET SDK is installed' },
			{ problem: 'Breakpoints not hit', solution: 'Build in Debug mode and verify paths are correct' },
			{ problem: 'Test discovery issues', solution: 'Verify test project references and naming conventions' },
		],
		sampleConfig: {
			adapter: {
				command: 'dotnet',
				args: ['tool', 'run', 'netcoredbg', '--interpreter=vscode'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'coreclr',
				request: 'launch',
				console: 'internalConsole',
			},
		},
	},
	go: {
		displayName: 'Go (dlv)',
		emoji: '🐹',
		installCommand: 'go install github.com/go-delve/delve/cmd/dlv@latest',
		verifyCommand: 'dlv version',
		prerequisites: [
			'Go 1.18+ installed',
			'Delve debugger installed: `go install github.com/go-delve/delve/cmd/dlv@latest`',
			'GOPATH/bin in PATH',
		],
		bestPractices: [
			'Set breakpoints on executable lines (not type definitions)',
			'Use breakpoints in goroutines carefully - they may run concurrently',
			'Debug tests with `dlv test`',
			'Watch for nil pointer dereferences',
		],
		commonIssues: [
			{ problem: 'dlv not found', solution: 'Install Delve and ensure GOPATH/bin is in PATH' },
			{ problem: 'Cannot debug optimized binary', solution: 'Build with `-gcflags="all=-N -l"` to disable optimizations' },
		],
		sampleConfig: {
			adapter: {
				command: 'dlv',
				args: ['dap'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'go',
				request: 'launch',
				mode: 'debug',
			},
		},
	},
	cppdbg: {
		displayName: 'C/C++ (cppdbg/gdb/lldb)',
		emoji: '⚙️',
		installCommand: 'Install C/C++ extension in VS Code',
		verifyCommand: 'gdb --version || lldb --version',
		prerequisites: [
			'GCC/Clang compiler installed',
			'GDB or LLDB debugger installed',
			'C/C++ extension (for VS Code integration)',
			'Binary compiled with debug symbols (-g flag)',
		],
		bestPractices: [
			'Compile with `-g` flag for debug symbols',
			'Disable optimizations with `-O0` for accurate debugging',
			'Set breakpoints in function bodies, not declarations',
			'Watch for memory issues and pointer errors',
		],
		commonIssues: [
			{ problem: 'No debug symbols', solution: 'Compile with `-g` flag: `gcc -g program.c -o program`' },
			{ problem: 'GDB/LLDB not found', solution: 'Install debugger: `apt install gdb` or `brew install lldb`' },
		],
		sampleConfig: {
			adapter: {
				command: 'gdb',
				args: ['--interpreter=dap'],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'cppdbg',
				request: 'launch',
				MIMode: 'gdb',
			},
		},
	},
	lldb: {
		displayName: 'Rust/LLDB',
		emoji: '🦀',
		installCommand: 'Install CodeLLDB extension in VS Code',
		verifyCommand: 'lldb --version',
		prerequisites: [
			'Rust toolchain installed (rustup)',
			'LLDB debugger installed',
			'CodeLLDB extension (for VS Code integration)',
			'Binary compiled in debug mode (default for `cargo build`)',
		],
		bestPractices: [
			'Use `cargo build` (not `--release`) for debug builds',
			'Set breakpoints inside function bodies',
			'Use conditional breakpoints for loops',
			'Watch for ownership and borrowing issues at runtime',
		],
		commonIssues: [
			{ problem: 'LLDB not found', solution: 'Install LLDB: `brew install llvm` (macOS) or `apt install lldb` (Linux)' },
			{ problem: 'Symbols not loading', solution: 'Ensure building in debug mode: `cargo build` without `--release`' },
		],
		sampleConfig: {
			adapter: {
				command: 'lldb-vscode',
				args: [],
				cwd: '${workspaceFolder}',
			},
			defaults: {
				type: 'lldb',
				request: 'launch',
				cargo: { args: ['build'] },
			},
		},
	},
};

/**
 * InstructionBuilder dynamically composes debugging instructions based on
 * the user's configuration and detected debugger setup.
 */
export class InstructionBuilder {
	private docsPath: string;
	private config: StandaloneConfig | null = null;
	private configPath: string | null = null;
	private workspaceFolder: string;

	constructor(docsPath: string, workspaceFolder: string) {
		this.docsPath = docsPath;
		this.workspaceFolder = workspaceFolder;
	}

	/**
	 * Set the loaded configuration
	 */
	public setConfig(config: StandaloneConfig | null, configPath: string | null): void {
		this.config = config;
		this.configPath = configPath;
	}

	/**
	 * Build complete, context-aware debugging instructions
	 */
	public async buildInstructions(): Promise<string> {
		const sections: string[] = [];

		// 1. Core instructions (always included)
		sections.push(await this.loadCoreInstructions());

		// 2. Configuration status and setup guidance
		const validation = await this.validateConfiguration();
		sections.push(this.buildConfigurationSection(validation));

		// 3. Language-specific tips for configured adapters
		if (validation.hasConfig && validation.adapters.length > 0) {
			sections.push(this.buildLanguageSpecificSection(validation.adapters));
		}

		return sections.join('\n\n---\n\n');
	}

	/**
	 * Load the core debugging instructions from the markdown file
	 */
	private async loadCoreInstructions(): Promise<string> {
		try {
			const filePath = path.join(this.docsPath, 'debug_instructions.md');
			return await fs.promises.readFile(filePath, 'utf8');
		} catch (error) {
			return '# DebugMCP - Debugging Instructions\n\nError loading core instructions.';
		}
	}

	/**
	 * Validate the configuration and check adapter availability
	 */
	public async validateConfiguration(): Promise<ConfigValidationResult> {
		const result: ConfigValidationResult = {
			hasConfig: false,
			configPath: this.configPath || path.join(this.workspaceFolder, 'debugmcp.config.json'),
			adapters: [],
			globalIssues: [],
		};

		// Check if config exists
		if (!this.config) {
			result.globalIssues.push('No debugmcp.config.json found in the workspace');
			return result;
		}

		result.hasConfig = true;

		// Validate each configured adapter
		for (const [name, adapterConfig] of Object.entries(this.config.adapters)) {
			const validation = await this.validateAdapter(name, adapterConfig);
			result.adapters.push(validation);
		}

		return result;
	}

	/**
	 * Validate a single adapter configuration
	 */
	private async validateAdapter(name: string, config: AdapterConfig): Promise<AdapterValidationResult> {
		const result: AdapterValidationResult = {
			name,
			isConfigured: true,
			isValid: true,
			issues: [],
		};

		const debuggerInfo = DEBUGGER_REGISTRY[name];

		// Check if the command exists
		try {
			const commandCheck = await this.checkCommandExists(config.command);
			if (!commandCheck.exists) {
				result.isValid = false;
				result.issues.push(`Command '${config.command}' not found in PATH`);
			}
		} catch {
			result.isValid = false;
			result.issues.push(`Failed to verify command '${config.command}'`);
		}

		// Language-specific validation
		if (debuggerInfo) {
			try {
				const { stdout, stderr } = await execAsync(debuggerInfo.verifyCommand, { timeout: 5000 });
				if (stderr && !stdout) {
					result.issues.push(`Verification warning: ${stderr.trim()}`);
				}
			} catch (error) {
				result.isValid = false;
				const errorMessage = error instanceof Error ? error.message : String(error);
				result.issues.push(`Debugger verification failed: ${errorMessage}`);
				result.setupInstructions = this.buildSetupInstructions(name, debuggerInfo);
			}
		}

		return result;
	}

	/**
	 * Check if a command exists in PATH
	 */
	private async checkCommandExists(command: string): Promise<{ exists: boolean; path?: string }> {
		try {
			const whichCommand = process.platform === 'win32' ? 'where' : 'which';
			const { stdout } = await execAsync(`${whichCommand} ${command}`, { timeout: 3000 });
			return { exists: true, path: stdout.trim() };
		} catch {
			return { exists: false };
		}
	}

	/**
	 * Build setup instructions for a specific debugger
	 */
	private buildSetupInstructions(name: string, info: DebuggerSetupInfo): string {
		const lines: string[] = [
			`## Setup Instructions for ${info.displayName}`,
			'',
			'### Installation',
			`\`\`\`bash`,
			info.installCommand,
			`\`\`\``,
			'',
			'### Prerequisites',
			...info.prerequisites.map(p => `- ${p}`),
			'',
			'### Verify Installation',
			`\`\`\`bash`,
			info.verifyCommand,
			`\`\`\``,
			'',
			'### Sample Configuration',
			'Add this to your `debugmcp.config.json`:',
			'```json',
			JSON.stringify({
				adapters: { [name]: info.sampleConfig.adapter },
				defaults: { [name]: info.sampleConfig.defaults },
			}, null, 2),
			'```',
		];

		return lines.join('\n');
	}

	/**
	 * Build the configuration status section
	 */
	private buildConfigurationSection(validation: ConfigValidationResult): string {
		const lines: string[] = ['# 🔧 Your Debugger Configuration Status'];

		if (!validation.hasConfig) {
			lines.push(
				'',
				'## ⚠️ No Configuration Found',
				'',
				`No \`debugmcp.config.json\` was found at: \`${validation.configPath}\``,
				'',
				'### How to Create a Configuration',
				'',
				'Run the following command to create a default configuration:',
				'```bash',
				'npx debugmcp init',
				'```',
				'',
				'Or manually create `debugmcp.config.json` in your project root:',
				'```json',
				JSON.stringify({
					port: 3001,
					adapters: {
						python: DEBUGGER_REGISTRY.python.sampleConfig.adapter,
					},
					defaults: {
						python: DEBUGGER_REGISTRY.python.sampleConfig.defaults,
					},
					timeout: 180,
				}, null, 2),
				'```',
				'',
				'### Available Debuggers',
				'',
				'DebugMCP supports the following debuggers:',
				'',
				...Object.entries(DEBUGGER_REGISTRY).map(([key, info]) =>
					`- **${info.emoji} ${info.displayName}** (\`${key}\`): ${info.installCommand}`
				),
			);
			return lines.join('\n');
		}

		// Config exists - show status of configured adapters
		const validAdapters = validation.adapters.filter(a => a.isValid);
		const invalidAdapters = validation.adapters.filter(a => !a.isValid);

		if (validAdapters.length > 0) {
			lines.push(
				'',
				'## ✅ Configured Debuggers',
				'',
				'The following debuggers are configured and ready:',
				'',
				...validAdapters.map(a => {
					const info = DEBUGGER_REGISTRY[a.name];
					return `- **${info?.emoji || '🔧'} ${info?.displayName || a.name}**`;
				}),
			);
		}

		if (invalidAdapters.length > 0) {
			lines.push(
				'',
				'## ⚠️ Debuggers Needing Setup',
				'',
				'The following debuggers are configured but have issues:',
				'',
			);

			for (const adapter of invalidAdapters) {
				const info = DEBUGGER_REGISTRY[adapter.name];
				lines.push(
					`### ${info?.emoji || '🔧'} ${info?.displayName || adapter.name}`,
					'',
					'**Issues:**',
					...adapter.issues.map(issue => `- ❌ ${issue}`),
					'',
				);

				if (adapter.setupInstructions) {
					lines.push(adapter.setupInstructions, '');
				} else if (info) {
					lines.push(this.buildSetupInstructions(adapter.name, info), '');
				}
			}
		}

		// Show how to add more debuggers
		const unconfiguredDebuggers = Object.entries(DEBUGGER_REGISTRY)
			.filter(([key]) => !validation.adapters.some(a => a.name === key));

		if (unconfiguredDebuggers.length > 0) {
			lines.push(
				'',
				'## 📦 Other Available Debuggers',
				'',
				'You can add support for these debuggers by updating your `debugmcp.config.json`:',
				'',
				...unconfiguredDebuggers.map(([key, info]) =>
					`- **${info.emoji} ${info.displayName}** (\`${key}\`)`
				),
			);
		}

		return lines.join('\n');
	}

	/**
	 * Build language-specific tips section for configured adapters
	 */
	private buildLanguageSpecificSection(adapters: AdapterValidationResult[]): string {
		const lines: string[] = ['# 📚 Language-Specific Debugging Tips'];

		for (const adapter of adapters) {
			const info = DEBUGGER_REGISTRY[adapter.name];
			if (!info) {
				continue;
			}

			lines.push(
				'',
				`## ${info.emoji} ${info.displayName}`,
				'',
				'### Best Practices',
				...info.bestPractices.map(bp => `- ${bp}`),
				'',
				'### Common Issues & Solutions',
				'',
				'| Problem | Solution |',
				'|---------|----------|',
				...info.commonIssues.map(ci => `| ${ci.problem} | ${ci.solution} |`),
			);
		}

		return lines.join('\n');
	}

	/**
	 * Get setup instructions for a specific language (for targeted help)
	 */
	public getSetupInstructionsForLanguage(language: string): string | null {
		const info = DEBUGGER_REGISTRY[language];
		if (!info) {
			return null;
		}
		return this.buildSetupInstructions(language, info);
	}

	/**
	 * Get the list of supported languages
	 */
	public static getSupportedLanguages(): string[] {
		return Object.keys(DEBUGGER_REGISTRY);
	}

	/**
	 * Get debugger info for a language
	 */
	public static getDebuggerInfo(language: string): DebuggerSetupInfo | undefined {
		return DEBUGGER_REGISTRY[language];
	}
}
