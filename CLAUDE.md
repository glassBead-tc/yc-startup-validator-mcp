# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Y Combinator Startup Validator MCP Server** - a Model Context Protocol (MCP) server that provides startup validation feedback from YC legends and comprehensive validation workflows. It features the "Ask Gods" toolset for getting personalized feedback from Paul Graham, Garry Tan, Jessica Livingston, and other YC icons, plus research-backed validation processes powered by Exa AI.

## Key Commands

### Development
- `npm run dev` - Run Smithery CLI in development mode (interactive development)
- `npm run watch` - Run TypeScript compiler in watch mode for continuous compilation
- `npm run inspector` - Run MCP inspector on the built output to test tools (requires building first)

### Building
- `npm run build` - Build for SHTTP transport (default)
- `npm run build:stdio` - Build for STDIO transport (used by Claude Desktop) - adds shebang and makes executable
- `npm run build:shttp` - Build for SHTTP transport explicitly

### Installation & Publishing
- `npm install` - Install dependencies and automatically run stdio build via prepare script
- `npm publish` - Publish to npm (runs prepublishOnly script which builds stdio version)

### Testing Tools
- `npx exa-mcp-server --list-tools` - List all available tools
- `npx exa-mcp-server --tools=web_search_exa` - Run with specific tools enabled

## Architecture Overview

### Core Pattern: MCP Tool Server
The server follows a modular plugin architecture where each tool is independently implemented and registered:

1. **Entry Point** (`src/index.ts`): Creates MCP server and dynamically registers tools based on configuration
2. **Tool Registration**: Each tool exports a `registerXxxTool()` function that uses `server.tool()` to register with MCP
3. **Configuration**: Uses Zod schemas for runtime validation of both server config and tool inputs
4. **API Integration**: All tools make HTTP requests to Exa API endpoints using axios

### Directory Structure
- `src/tools/` - Individual tool implementations (one per file)
- `src/types.ts` - TypeScript interfaces for Exa API requests/responses
- `src/utils/logger.ts` - Request-scoped logging utilities
- `src/resources/` - Additional resources like user guides

### Tool Implementation Pattern
Every tool follows this consistent pattern:
```typescript
export function registerXxxTool(server: McpServer, config?: { exaApiKey?: string }): void {
  server.tool({
    name: "tool_name_exa",
    description: "...",
    inputSchema: zodSchema,
    handler: async ({ arguments: args }) => {
      // 1. Create request-scoped logger
      // 2. Validate inputs
      // 3. Make Exa API request
      // 4. Transform and return response
    }
  });
}
```

### Available Tools
- `web_search_exa` - Real-time web search
- `research_paper_search_exa` - Academic paper search  
- `company_research_exa` - Company information
- `crawling_exa` - URL content extraction
- `competitor_finder_exa` - Business competitor identification
- `linkedin_search_exa` - LinkedIn search
- `wikipedia_search_exa` - Wikipedia search
- `github_search_exa` - GitHub repository search

### Configuration
The server accepts configuration via:
1. `exaApiKey` - API key for Exa AI (can also use `EXA_API_KEY` env var)
2. `enabledTools` - Array of tool IDs to enable (defaults to all)
3. `debug` - Enable debug logging

### Logging
Uses a custom logger (`src/utils/logger.ts`) that:
- Logs to stderr with `[EXA-MCP-DEBUG]` prefix
- Creates request-scoped loggers with unique IDs
- Tracks request lifecycle (start → log → complete/error)

## Important Notes

- The project uses **Smithery CLI** for building MCP servers
- TypeScript target is ES2022 with Node16 module system
- No test suite exists - be careful when making changes
- No linting configuration - maintain existing code style
- Built files go to `.smithery/` directory (gitignored)
- The server supports both STDIO and SHTTP transports
- API key can be provided via `exaApiKey` config option or `EXA_API_KEY` environment variable
- Node.js version requirement: >=18.0.0
- Main entry point: `.smithery/index.cjs` (built artifact)

## Development Workflow

1. Make changes to TypeScript source files in `src/`
2. Run `npm run build:stdio` to build for local testing
3. Test using `npm run inspector` or integrate with Claude Desktop
4. Use `npm run dev` for interactive development with hot reload
5. Ensure all tools follow the consistent registration pattern

## Adding New Tools

To add a new tool:
1. Create a new file in `src/tools/` following the naming convention
2. Export a `registerXxxTool()` function following the established pattern
3. Import and register in `src/index.ts`
4. Add the tool ID to the `AVAILABLE_TOOLS` array in index.ts
5. Update README.md with tool documentation