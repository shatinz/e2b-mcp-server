# E2B Cloud VM MCP Server for Gemini Spark

A high-performance Model Context Protocol (MCP) server running on Vercel that bridges **Gemini Spark** and AI coding agents to **E2B cloud microVM sandboxes** with full server control.

## 🚀 Features

- **Full Linux Shell Control (`execute_bash`)**: Run `git clone`, `git commit`, `git push`, `npm test`, `pip install`, and arbitrary terminal commands with root privileges.
- **Direct Filesystem Management (`read_file`, `write_file`, `edit_file`, `list_directory`)**: Seamlessly inspect, edit, and write files in the cloud VM to modify codebases.
- **Python Code Execution (`run_code`)**: Run Python scripts or Jupyter notebook cells with stdout, stderr, and rich evaluation results.
- **Persistent Sandbox Sessions (`get_or_create_sandbox`, `kill_sandbox`)**: Connects to active sandboxes across multiple tool turns or spins up new ones on demand.

## 📡 MCP Endpoint

- Endpoint: `/api/mcp`
- Transport: Modern StreamableHTTP (POST / GET) compliant with MCP 2026-07-28 and 2025 specs.

## 🛠️ Environment Variables

- `E2B_API_KEY`: Your E2B API Key (configured in Vercel Environment Variables).
