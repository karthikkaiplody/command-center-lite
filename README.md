# Command Center Lite

A personal command center for your workday. Aggregates your calendar, code reviews, tasks, contacts, and notes into one focused desktop app — no browser tabs required.

Built with Electron, React, TypeScript, and Vite. Styled with [Catppuccin Mocha](https://github.com/catppuccin/catppuccin).

![Screenshot of Command Center Lite showing the afternoon briefing with a personalized greeting, a task list with prioritized items, and a list of upcoming meetings for the day](public/screenshot.png)

## Features

- **Morning Briefing** — Personalized greeting with a spoken summary of your day via ElevenLabs TTS
- **Meetings** — Today's calendar pulled from Microsoft 365 via GitHub Copilot + WorkIQ, with one-click join links
- **Tasks** — Local task management with priorities, due dates, and Notion sync
- **GitHub** — PRs waiting for your review, your open PRs, and assigned issues — pulled via `gh` CLI
- **Contacts** — CRM-lite for staying in touch, with check-in frequency tracking and Notion sync
- **Goals** — Hierarchical goal tracking stored locally
- **Inbox** — Capture pad that routes items to tasks, goals, writing, or reading lists
- **Settings** — In-app configuration screen on first launch — no `.env` files to edit
- **Launch on Login** — Starts automatically when you log in (macOS Login Items)

## Getting Started

### Quick Install (macOS)

Clone the repo, review the setup script, then run it:

```bash
git clone https://github.com/karthikkaiplody/command-center-lite.git ~/command-center-lite
cat ~/command-center-lite/bangui/setup.sh   # review before running
bash ~/command-center-lite/bangui/setup.sh
```

> **Requires:** [Homebrew](https://brew.sh) (used to install Node.js if missing)

The script builds a native `.app`, opens the DMG, and you drag it to Applications. After that, launch from Spotlight (`⌘Space`) or Launchpad — no terminal needed.

> **Why not `bash <(curl ...)`?** That pattern pipes untrusted code directly to a shell with no chance to inspect it. Always download first, review, then run locally.

On first launch the app opens a setup screen — enter your name and configure integrations. You never need to touch a config file.

---

### Manual Setup

**Prerequisites:**
- [Node.js](https://nodejs.org/) v18+
- `gh` CLI authenticated (`gh auth login`) — for GitHub integration
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line) with WorkIQ plugin — for calendar sync

```bash
git clone https://github.com/karthikkaiplody/command-center-lite.git
cd command-center-lite/bangui
npm install

# Development (hot reload)
npm run dev:electron

# Production build → DMG
npm run build:electron
```

---

## Integrations

### Microsoft 365 Calendar — WorkIQ + Copilot CLI
Fetches today's meetings (title, time, join link) by running `copilot -p "get my meetings" --allow-all-tools` locally. No API key needed — reuses your existing Copilot CLI auth.

Setup:
```bash
# In GitHub Copilot CLI
/plugin marketplace add github/copilot-plugins
/plugin install workiq@copilot-plugins
```

> WorkIQ may require admin consent on your Microsoft 365 tenant. See the [Tenant Administrator Enablement Guide](https://github.com/microsoft/work-iq-mcp/blob/main/ADMIN-INSTRUCTIONS.md).

### GitHub — `gh` CLI
Shows PRs waiting for your review, your open PRs, and assigned issues. No API key needed — reuses your existing `gh auth` session. Configure your org and repos in the in-app settings.

### Notion *(coming soon)*
The frontend is fully wired up for Notion sync (tasks, inbox, contacts). The backend integration is not yet implemented. You'll need a Notion internal integration token and database IDs when it ships.

### ElevenLabs TTS
Reads your morning briefing aloud. Configure your API key and preferred voice in Settings → Voice. Falls back silently if not configured.

### Local Markdown Files
Reads `.md` files from a directory you configure (e.g. `~/Documents/Notes`). Surfaces your notes and projects inside the app without any import step.

---

## Configuration

All config is stored at `~/.command-center-lite/config.json`. You should never need to edit it directly — use the in-app Settings screen (⌘,) instead.

## Data Storage

Everything is local:
- **Database**: `~/.command-center-lite/command-center.db` (SQLite)
- **Config**: `~/.command-center-lite/config.json`

No data is sent anywhere except to the APIs you explicitly configure (Notion, ElevenLabs).

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop | Electron |
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS (Catppuccin Mocha) |
| Database | SQLite via `better-sqlite3` |
| Calendar | WorkIQ + GitHub Copilot CLI |
| GitHub | `gh` CLI |
| TTS | ElevenLabs API |

## License

MIT
