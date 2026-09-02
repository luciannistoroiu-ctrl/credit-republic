#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web; skip in local/CLI sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install ralph-loop@claude-plugins-official -y

# The plugin ships /ralph-loop and /cancel-ralph with hide-from-slash-command-tool
# set, which hides them from the SlashCommand tool listing. Strip that flag so
# they're available like any other command.
shopt -s nullglob
ralph_commands=(~/.claude/plugins/cache/claude-plugins-official/ralph-loop/*/commands/*.md)
if [ ${#ralph_commands[@]} -gt 0 ]; then
  sed -i '/hide-from-slash-command-tool/d' "${ralph_commands[@]}"
fi
