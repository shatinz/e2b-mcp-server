import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E2B MCP Server for Gemini Spark",
  description: "Cloud microVM MCP Server providing full server & repo control for AI coding agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#0b0f19", color: "#f3f4f6" }}>
        {children}
      </body>
    </html>
  );
}
