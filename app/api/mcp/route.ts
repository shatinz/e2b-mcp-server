import { createMcpHandler } from "mcp-handler";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";

export const maxDuration = 60; // 60 seconds serverless timeout

// Helper to get or connect to an E2B Sandbox
async function getOrConnectSandbox(explicitId?: string) {
  const apiKey = process.env.E2B_API_KEY;
  if (!apiKey) {
    throw new Error(
      "E2B_API_KEY is not configured in environment variables. Please set it in Vercel."
    );
  }

  // 1. If explicit ID is provided, connect directly to it
  if (explicitId && explicitId.trim() !== "") {
    return await Sandbox.connect(explicitId.trim(), { apiKey });
  }

  // 2. Look for any currently running sandboxes
  try {
    const paginator = await Sandbox.list({ apiKey });
    const running = await paginator.nextItems();
    if (running && running.length > 0) {
      return await Sandbox.connect(running[0].sandboxId, { apiKey });
    }
  } catch (err) {
    console.warn("Could not list active sandboxes:", err);
  }

  // 3. Otherwise create a fresh sandbox with 1 hour (3,600,000 ms) timeout
  return await Sandbox.create({
    apiKey,
    timeoutMs: 3600000,
  });
}

const handler = createMcpHandler(
  (server) => {
    // Tool 1: execute_bash
    server.registerTool(
      "execute_bash",
      {
        title: "Execute Bash Command",
        description:
          "Executes any Linux shell command (git, npm, pip, build, tests, system tools, etc.) inside the cloud VM sandbox. Spark has full root/user shell access.",
        inputSchema: z.object({
          command: z
            .string()
            .describe("The shell command to execute in the VM."),
          cwd: z
            .string()
            .optional()
            .describe(
              "Working directory inside the VM (default: /home/user)."
            ),
          timeoutMs: z
            .number()
            .optional()
            .describe("Max execution timeout in milliseconds (default: 60000)."),
          sandboxId: z
            .string()
            .optional()
            .describe(
              "Specific sandbox ID to run in. If omitted, uses active sandbox or spins up a new one."
            ),
        }),
      },
      async ({ command, cwd, timeoutMs, sandboxId }) => {
        try {
          const sandbox = await getOrConnectSandbox(sandboxId);
          const result = await sandbox.commands.run(command, {
            cwd: cwd || "/home/user",
            timeoutMs: timeoutMs || 60000,
          });

          const outputParts: string[] = [];
          outputParts.push(`[Sandbox ID]: ${sandbox.sandboxId}`);
          outputParts.push(`[Exit Code]: ${result.exitCode}`);

          if (result.stdout && result.stdout.trim()) {
            outputParts.push(`[stdout]:\n${result.stdout}`);
          }
          if (result.stderr && result.stderr.trim()) {
            outputParts.push(`[stderr]:\n${result.stderr}`);
          }
          if (!result.stdout && !result.stderr) {
            outputParts.push("[Output]: Command finished with no stdout/stderr.");
          }

          return {
            content: [
              {
                type: "text",
                text: outputParts.join("\n\n"),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error executing command]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 2: read_file
    server.registerTool(
      "read_file",
      {
        title: "Read File",
        description:
          "Reads the full text contents of a file from the cloud VM filesystem.",
        inputSchema: z.object({
          path: z
            .string()
            .describe("Absolute or relative path to the file inside the VM."),
          sandboxId: z
            .string()
            .optional()
            .describe("Specific sandbox ID to read from."),
        }),
      },
      async ({ path, sandboxId }) => {
        try {
          const sandbox = await getOrConnectSandbox(sandboxId);
          const content = await sandbox.files.read(path);
          return {
            content: [
              {
                type: "text",
                text: `[Sandbox ID]: ${sandbox.sandboxId}\n[Path]: ${path}\n\n${content}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error reading file ${path}]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 3: write_file
    server.registerTool(
      "write_file",
      {
        title: "Write File",
        description:
          "Creates or overwrites a file in the cloud VM filesystem with the given content. Allows modifying codebases and configurations.",
        inputSchema: z.object({
          path: z
            .string()
            .describe("Path to the file to create or overwrite in the VM."),
          content: z.string().describe("The full text content to write."),
          sandboxId: z
            .string()
            .optional()
            .describe("Specific sandbox ID to write to."),
        }),
      },
      async ({ path, content, sandboxId }) => {
        try {
          const sandbox = await getOrConnectSandbox(sandboxId);
          await sandbox.files.write(path, content);
          return {
            content: [
              {
                type: "text",
                text: `[Sandbox ID]: ${sandbox.sandboxId}\nSuccessfully wrote ${content.length} characters to ${path}.`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error writing file ${path}]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 4: edit_file
    server.registerTool(
      "edit_file",
      {
        title: "Edit File",
        description:
          "Replaces a specific snippet or block of text with new content inside an existing file on the VM.",
        inputSchema: z.object({
          path: z.string().describe("Path to the file to edit."),
          oldContent: z.string().describe("Exact string or block to replace."),
          newContent: z.string().describe("New string or block to replace with."),
          sandboxId: z.string().optional().describe("Specific sandbox ID."),
        }),
      },
      async ({ path, oldContent, newContent, sandboxId }) => {
        try {
          const sandbox = await getOrConnectSandbox(sandboxId);
          const currentContent = await sandbox.files.read(path);

          if (!currentContent.includes(oldContent)) {
            return {
              content: [
                {
                  type: "text",
                  text: `[Error]: 'oldContent' was not found inside ${path}. Please read the file first to verify exact contents.`,
                },
              ],
            };
          }

          const updated = currentContent.replace(oldContent, newContent);
          await sandbox.files.write(path, updated);

          return {
            content: [
              {
                type: "text",
                text: `[Sandbox ID]: ${sandbox.sandboxId}\nSuccessfully edited ${path}.`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error editing file ${path}]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 5: list_directory
    server.registerTool(
      "list_directory",
      {
        title: "List Directory",
        description:
          "Lists all files and subdirectories at a given directory path inside the cloud VM.",
        inputSchema: z.object({
          path: z
            .string()
            .optional()
            .describe("Directory path to inspect (default: /home/user)."),
          sandboxId: z
            .string()
            .optional()
            .describe("Specific sandbox ID to inspect."),
        }),
      },
      async ({ path, sandboxId }) => {
        try {
          const targetPath = path || "/home/user";
          const sandbox = await getOrConnectSandbox(sandboxId);
          const entries = await sandbox.files.list(targetPath);

          const formatted = entries
            .map(
              (entry) =>
                `${entry.type === "dir" ? "[DIR]" : "[FILE]"} ${entry.name}`
            )
            .join("\n");

          return {
            content: [
              {
                type: "text",
                text: `[Sandbox ID]: ${sandbox.sandboxId}\n[Path]: ${targetPath}\n\n${formatted || "(Empty directory)"}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error listing directory]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 6: run_code
    server.registerTool(
      "run_code",
      {
        title: "Run Python / Jupyter Code",
        description:
          "Executes Python code in the sandbox with rich interactive output, notebook style results, and stdout/stderr capture.",
        inputSchema: z.object({
          code: z.string().describe("The Python code snippet to execute."),
          sandboxId: z
            .string()
            .optional()
            .describe("Specific sandbox ID to execute in."),
        }),
      },
      async ({ code, sandboxId }) => {
        try {
          const sandbox = await getOrConnectSandbox(sandboxId);
          const execution = await sandbox.runCode(code);

          const logs: string[] = [];
          logs.push(`[Sandbox ID]: ${sandbox.sandboxId}`);

          if (execution.logs.stdout.length > 0) {
            logs.push(`[stdout]:\n${execution.logs.stdout.join("\n")}`);
          }
          if (execution.logs.stderr.length > 0) {
            logs.push(`[stderr]:\n${execution.logs.stderr.join("\n")}`);
          }
          if (execution.error) {
            logs.push(
              `[Error]: ${execution.error.name} - ${execution.error.value}\n${execution.error.traceback}`
            );
          }
          if (execution.results.length > 0) {
            const resultsText = execution.results
              .map((r) => r.text || JSON.stringify(r))
              .join("\n");
            logs.push(`[Results]:\n${resultsText}`);
          }

          return {
            content: [
              {
                type: "text",
                text: logs.join("\n\n"),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error running code]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 7: get_or_create_sandbox
    server.registerTool(
      "get_or_create_sandbox",
      {
        title: "Get or Provision Cloud Sandbox",
        description:
          "Returns the active sandbox ID and status, or spins up a fresh new sandbox if none is currently active.",
        inputSchema: z.object({
          forceNew: z
            .boolean()
            .optional()
            .describe("If true, spins up a fresh sandbox even if one is active."),
        }),
      },
      async ({ forceNew }) => {
        try {
          const apiKey = process.env.E2B_API_KEY;
          if (!apiKey) {
            throw new Error("E2B_API_KEY environment variable is missing.");
          }

          if (forceNew) {
            const newSb = await Sandbox.create({
              apiKey,
              timeoutMs: 3600000,
            });
            return {
              content: [
                {
                  type: "text",
                  text: `Created fresh sandbox: ${newSb.sandboxId} (Max lifespan: 60 min).`,
                },
              ],
            };
          }

          const sandbox = await getOrConnectSandbox();
          return {
            content: [
              {
                type: "text",
                text: `Active sandbox ID: ${sandbox.sandboxId}. Ready to execute bash commands, edit files, and clone repos.`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error getting/creating sandbox]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool 8: kill_sandbox
    server.registerTool(
      "kill_sandbox",
      {
        title: "Kill / Release Sandbox",
        description: "Explicitly terminates a sandbox VM to release cloud compute hours.",
        inputSchema: z.object({
          sandboxId: z.string().describe("The sandbox ID to terminate."),
        }),
      },
      async ({ sandboxId }) => {
        try {
          const apiKey = process.env.E2B_API_KEY;
          await Sandbox.kill(sandboxId, { apiKey });
          return {
            content: [
              {
                type: "text",
                text: `Sandbox ${sandboxId} has been successfully killed.`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `[Error killing sandbox ${sandboxId}]: ${error?.message || String(error)}`,
              },
            ],
          };
        }
      }
    );
  },
  {
    serverInfo: {
      name: "e2b-cloud-vm-mcp",
      version: "1.0.0",
    },
  }
);

export async function GET(request: Request) {
  try {
    return await handler(request);
  } catch (err: any) {
    console.error("MCP GET error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || String(err),
        stack: err?.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handler(request);
  } catch (err: any) {
    console.error("MCP POST error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || String(err),
        stack: err?.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
