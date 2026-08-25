# Installing Highsfield MCP
URL: https://claude.ai/chat/410d3886-38dc-48f7-a298-99c30c193c11
---
You said: how to install highsfield mcp

Claude responded: Assuming you mean Higgsfield (the AI image/video platform) — it's a hosted MCP server, so there's nothing to install locally. Higgsfield runs its MCP server at https://mcp.higgsfield.ai, and you authenticate through your Higgsfield account rather than managing API keys.

In Claude (web, desktop, mobile):
- Settings → Connectors → Add custom connector
- Name it "Higgsfield" and paste the server URL: https://mcp.higgsfield.ai/mcp
- Save, then click Connect — you'll be redirected to sign in to your Higgsfield account

One caveat: on managed/enterprise plans, your admin may need to allowlist the URL before the connector shows up.

In Claude Code:
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp

Auth happens through a browser OAuth flow — no API keys. Run claude mcp list afterward to confirm it connected.

Once it's live, ask it to list its tools — you should see generation, history, and character-training tools. It draws on your existing Higgsfield credits, so no separate billing.

If you actually meant a different product than Higgsfield, let me know the correct spelling and I'll look it up.

You said: how can i install https://www.agentation.com/install in claude code web

Claude responded: Agentation is a React dev-tool, not a connector — it installs into your project, and Claude Code picks it up via a skill plus a local MCP server.

One important caveat first: the MCP part runs a local server on port 4747 and the toolbar talks to http://localhost:4747. Claude Code on the web runs in a cloud sandbox that can't reach your machine's localhost, so the real-time sync won't work there. On web you can still use the copy-paste workflow (annotate → copy markdown → paste into the chat). For the full two-way setup you need Claude Code in the terminal or desktop app.

Basic setup (works everywhere):
npm install agentation -D

Then in your root component:
import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

The NODE_ENV check keeps it out of production.

Auto-setup via the Claude Code skill:
npx skills add benjitaylor/agentation

Then run /agentation in Claude Code — it detects your framework, installs the package, wires it into your layout, and recommends MCP setup.

MCP server (local Claude Code only):
npx add-mcp "npx -y agentation-mcp server"

or npx agentation-mcp init for the Claude Code–specific wizard, then npx agentation-mcp doctor to verify. Point the component at it with endpoint="http://localhost:4747" and restart the agent.

Requirements: React 18+, client-side only, desktop only.

No artifacts in this conversation.
