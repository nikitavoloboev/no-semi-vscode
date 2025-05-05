# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands
- `pnpm build` - Build the extension
- `pnpm dev` - Build with watch mode and sourcemaps
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run all tests with Vitest
- `pnpm test <filename>` - Run specific test file
- `pnpm test -t "test name"` - Run specific test by name

## Code Style Guidelines
- TypeScript with strict mode enabled
- Import style: absolute imports for packages, relative imports for local files
- Use ESM module syntax (`import/export`)
- Follow @antfu/eslint-config conventions
- Use reactive-vscode for configuration management
- Error handling: use logger from utils.ts
- Prefer arrow functions for handlers and callbacks
- Use optional chaining and nullish coalescing where appropriate
- Keep code concise and focused on single responsibilities
- Extension code follows VSCode extension patterns (context subscriptions)