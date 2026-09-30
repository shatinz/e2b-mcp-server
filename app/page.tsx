export default function Home() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px", lineHeight: "1.6" }}>
      <header style={{ marginBottom: "32px", borderBottom: "1px solid #1f2937", paddingBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#60a5fa", margin: "0 0 8px 0" }}>
          ⚡ E2B Cloud VM MCP Server
        </h1>
        <p style={{ margin: 0, color: "#9ca3af", fontSize: "16px" }}>
          Production Model Context Protocol endpoint for Gemini Spark and AI coding agents.
        </p>
      </header>

      <section style={{ background: "#111827", borderRadius: "12px", padding: "24px", marginBottom: "32px", border: "1px solid #374151" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 12px 0", color: "#34d399" }}>
          📡 MCP Server Endpoint
        </h2>
        <code style={{ background: "#1f2937", padding: "8px 14px", borderRadius: "6px", display: "block", color: "#38bdf8", wordBreak: "break-all" }}>
          /api/mcp
        </code>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "12px", marginBottom: 0 }}>
          Connect directly via StreamableHTTP/POST in Gemini Spark, Cursor, Claude Desktop, or Windsurf.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f9fafb", marginBottom: "16px" }}>
          🛠️ Capabilities & Registered Tools
        </h2>
        <div style={{ display: "grid", gap: "14px" }}>
          {[
            {
              name: "execute_bash",
              desc: "Run terminal commands (git clone, npm install, pip, build, tests, system tools) inside the cloud Linux VM.",
            },
            {
              name: "read_file",
              desc: "Read file contents from the VM filesystem with line numbers or raw text.",
            },
            {
              name: "write_file",
              desc: "Create or overwrite files to modify codebases, configs, and scripts in the VM.",
            },
            {
              name: "list_directory",
              desc: "Inspect file trees, permissions, and directory contents.",
            },
            {
              name: "run_python",
              desc: "Execute Python scripts or notebook cells with stdout, stderr, and rich evaluation results.",
            },
            {
              name: "get_or_create_sandbox",
              desc: "Explicitly provision or re-attach to an active persistent sandbox instance.",
            },
            {
              name: "kill_sandbox",
              desc: "Release and terminate the sandbox VM when finished.",
            },
          ].map((tool) => (
            <div
              key={tool.name}
              style={{
                background: "#1e293b",
                borderRadius: "8px",
                padding: "14px 18px",
                border: "1px solid #334155",
              }}
            >
              <code style={{ color: "#a78bfa", fontWeight: "600", fontSize: "15px" }}>{tool.name}</code>
              <p style={{ margin: "6px 0 0 0", color: "#cbd5e1", fontSize: "14px" }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ borderTop: "1px solid #1f2937", paddingTop: "24px", color: "#6b7280", fontSize: "13px" }}>
        Powered by E2B Firecracker MicroVMs & Next.js on Vercel.
      </section>
    </main>
  );
}
