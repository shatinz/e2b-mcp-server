export default function Home() {
  return (
    <main style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px", lineHeight: "1.6" }}>
      <header style={{ marginBottom: "32px", borderBottom: "1px solid #1f2937", paddingBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#60a5fa", margin: "0 0 10px 0" }}>
          ⚡ E2B Cloud Sandbox MCP Server
        </h1>
        <p style={{ margin: 0, color: "#9ca3af", fontSize: "16px" }}>
          Universal Model Context Protocol server enabling Claude Web, Claude Desktop, Gemini Spark, and Cursor to execute code and commands in isolated cloud Linux microVMs for free.
        </p>
      </header>

      <section style={{ background: "#111827", borderRadius: "12px", padding: "24px", marginBottom: "32px", border: "1px solid #374151" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 12px 0", color: "#34d399" }}>
          📡 Server Endpoint
        </h2>
        <code style={{ background: "#1f2937", padding: "10px 16px", borderRadius: "6px", display: "block", color: "#38bdf8", wordBreak: "break-all", fontSize: "15px" }}>
          /api/mcp
        </code>
        <div style={{ marginTop: "14px", color: "#9ca3af", fontSize: "14px" }}>
          <p style={{ margin: "4px 0" }}>
            🔒 <strong>Password Protected:</strong> If <code>MCP_PASSWORD</code> is enabled on this instance, pass your password via:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>
            <li>URL query parameter: <code>/api/mcp?key=YOUR_PASSWORD</code></li>
            <li>HTTP Header: <code>Authorization: Bearer YOUR_PASSWORD</code></li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f9fafb", marginBottom: "16px" }}>
          🤖 Connect Your AI Agents
        </h2>
        
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px 20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#f59e0b", fontSize: "16px" }}>Claude Web (claude.ai)</h3>
            <p style={{ margin: "0 0 8px 0", color: "#cbd5e1", fontSize: "14px" }}>
              In Claude Web: Go to <strong>Customize &rarr; Connectors &rarr; Add custom connector</strong>, name it <code>e2b-sandbox</code>, and enter your server URL with your key (e.g. <code>https://your-domain.vercel.app/api/mcp?key=YOUR_PASSWORD</code>).
            </p>
          </div>

          <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px 20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#38bdf8", fontSize: "16px" }}>Gemini Spark</h3>
            <p style={{ margin: "0 0 8px 0", color: "#cbd5e1", fontSize: "14px" }}>
              Go to <strong>Settings &rarr; Connected Apps &rarr; Add Custom MCP</strong> and enter the server endpoint URL.
            </p>
          </div>

          <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px 20px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#a78bfa", fontSize: "16px" }}>Claude Desktop / Cursor</h3>
            <p style={{ margin: "0 0 8px 0", color: "#cbd5e1", fontSize: "14px" }}>
              Add to your MCP configuration using standard Streamable HTTP transport:
            </p>
            <pre style={{ background: "#0f172a", padding: "12px", borderRadius: "6px", color: "#e2e8f0", fontSize: "13px", overflowX: "auto" }}>
{`{
  "mcpServers": {
    "e2b-sandbox": {
      "url": "https://your-domain.vercel.app/api/mcp?key=YOUR_PASSWORD"
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f9fafb", marginBottom: "16px" }}>
          🛠️ Available Tools
        </h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {[
            { name: "execute_bash", desc: "Run bash terminal commands (git, npm, pip, build, tests) in the cloud microVM." },
            { name: "read_file", desc: "Read file contents from the VM filesystem." },
            { name: "write_file", desc: "Create or overwrite files to modify codebases and scripts." },
            { name: "edit_file", desc: "Targeted find-and-replace to update specific blocks of code." },
            { name: "list_directory", desc: "Inspect directory trees and file listings." },
            { name: "run_code", desc: "Execute Python / Jupyter code with rich evaluation output." },
            { name: "get_or_create_sandbox", desc: "Provision or reconnect to a persistent cloud sandbox." },
            { name: "kill_sandbox", desc: "Terminate a sandbox VM to release cloud compute hours." },
          ].map((tool) => (
            <div key={tool.name} style={{ background: "#1e293b", borderRadius: "8px", padding: "12px 16px", border: "1px solid #334155" }}>
              <code style={{ color: "#a78bfa", fontWeight: "600", fontSize: "14px" }}>{tool.name}</code>
              <p style={{ margin: "4px 0 0 0", color: "#cbd5e1", fontSize: "13px" }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1f2937", paddingTop: "20px", color: "#6b7280", fontSize: "13px" }}>
        Open source on GitHub &bull; Powered by E2B Firecracker MicroVMs & Vercel.
      </footer>
    </main>
  );
}
