# ⚡ E2B Cloud Sandbox MCP Server

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshatinz%2Fe2b-mcp-server&env=E2B_API_KEY,MCP_PASSWORD&envDescription=E2B_API_KEY%20from%20e2b.dev%20(%24100%20free%20credits)%2C%20and%20an%20optional%20MCP_PASSWORD%20to%20protect%20your%20server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-2026--07--28-green.svg)](https://modelcontextprotocol.io/)

A production-grade, zero-cost **Model Context Protocol (MCP)** server that connects **Claude (Claude Web & Claude Desktop)**, **Gemini Spark**, **Cursor**, and other AI coding agents to **[E2B](https://e2b.dev)** isolated cloud microVM sandboxes.

With this MCP server, AI agents gain full root/user shell execution, filesystem read/write/edit capabilities, and Python execution environments running on Firecracker microVMs in the cloud.

---

## 🌟 Why Use This MCP?

- **Free Compute**: E2B provides a generous free tier ($100 in starter credits + 100 sandbox compute hours/month + up to 20 concurrent VMs).
- **Safe & Isolated**: Code executes in a disposable cloud Linux microVM—not on your local machine.
- **Full Agent Control**: Agents can run `git clone`, modify repositories, run `npm test` / `pytest`, install packages (`apt-get`, `pip`, `npm`), and push changes.
- **Password Protected**: Guard your deployment so unauthorized users cannot exhaust your E2B credits.
- **Multi-User Ready**: Supports per-request E2B API keys (`x-e2b-api-key` header or `?e2b_api_key=...`) so multiple users can share a single deployment using their own free E2B credits.

---

## 🚀 1-Click Free Deployment

Deploy your own instance on Vercel for free in under 60 seconds:

1. Click the **Deploy with Vercel** button above.
2. Sign up / log in to [e2b.dev](https://e2b.dev) (free, no credit card required) and copy your **E2B API Key**.
3. In Vercel deployment settings, fill in:
   - `E2B_API_KEY`: Your key (`e2b_...`)
   - `MCP_PASSWORD`: *(Optional but recommended)* A secret password/token to protect your endpoint (e.g. `my_secret_token_123`).
4. Click **Deploy**. Vercel will give you a live HTTPS domain:
   ```text
   https://your-project.vercel.app/api/mcp
   ```

---

## 🤖 Connecting Your AI Agents

### 1. Claude Web (claude.ai)
1. Open [claude.ai](https://claude.ai).
2. Go to **Customize** (left sidebar) &rarr; **Connectors** &rarr; **Add custom connector**.
3. Name: `e2b-sandbox`.
4. URL: Enter your Vercel endpoint:
   - **With Password**:
     ```text
     https://your-project.vercel.app/api/mcp?key=YOUR_PASSWORD
     ```
   - **Without Password**:
     ```text
     https://your-project.vercel.app/api/mcp
     ```
5. Claude can now dynamically create sandboxes, run bash commands, and edit code!

### 2. Claude Desktop
Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "e2b-sandbox": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-project.vercel.app/api/mcp?key=YOUR_PASSWORD"
      ]
    }
  }
}
```

### 3. Gemini Spark
1. Open **Gemini Spark** &rarr; **Settings** &rarr; **Connected Apps / Extensions** &rarr; **Add Custom MCP**.
2. Enter your endpoint URL (`https://your-project.vercel.app/api/mcp?key=YOUR_PASSWORD`).

### 4. Cursor / Windsurf
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "e2b-sandbox": {
      "url": "https://your-project.vercel.app/api/mcp?key=YOUR_PASSWORD"
    }
  }
}
```

---

## 🔒 Security & Password Protection

If `MCP_PASSWORD` is set in your environment variables, incoming requests must supply the password using any of the following methods:

1. **URL Query Parameter**:
   ```text
   https://your-project.vercel.app/api/mcp?key=YOUR_PASSWORD
   ```
2. **HTTP Authorization Header**:
   ```http
   Authorization: Bearer YOUR_PASSWORD
   ```
3. **Custom Header**:
   ```http
   x-mcp-key: YOUR_PASSWORD
   ```

Requests without a valid password will receive `401 Unauthorized`.

---

## 👥 Bringing Your Own E2B Key (Multi-User)

If you share a deployed MCP endpoint with team members or friends, each user can bring their own E2B key to avoid consuming the server owner's quota:

- **Header**: `x-e2b-api-key: e2b_user_key`
- **Query Parameter**: `https://your-project.vercel.app/api/mcp?e2b_api_key=e2b_user_key`
- **Tool Parameter**: Provide `apiKey` in any tool call.

---

## 🛠️ Registered Tools

| Tool | Description |
| :--- | :--- |
| `execute_bash` | Run any bash shell command with root/user permissions (`git clone`, `npm test`, `pip install`, etc.). |
| `read_file` | Read the full text contents of any file in the VM filesystem. |
| `write_file` | Create or overwrite files across projects in the VM. |
| `edit_file` | Targeted string replacement to edit specific lines/blocks in files. |
| `list_directory` | Inspect directory listings, files, and folder trees. |
| `run_code` | Run Python / Jupyter code with stdout/stderr capture and rich evaluation results. |
| `get_or_create_sandbox` | Provision or reconnect to a persistent cloud sandbox (auto-expires after 60 min). |
| `kill_sandbox` | Terminate a sandbox to release compute resources. |

---

## 💻 Local Development

```bash
git clone https://github.com/shatinz/e2b-mcp-server.git
cd e2b-mcp-server
npm install

# Run dev server
npm run dev
```

Visit `http://localhost:3000` to view the server status page and test `/api/mcp`.

---

## 📄 License

MIT License. Free for personal and commercial use.
