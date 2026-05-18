# Command Center Lite

A lightweight personal dashboard for your day. Shows your morning briefing, tasks, and meetings in one place.

Built with Electron, React, TypeScript, and Vite.

![Screenshot of Command Center Lite showing the afternoon briefing with a personalized greeting, a task list with prioritized items, and a list of upcoming meetings for the day](public/screenshot.png)

## Features

- **Morning Briefing** - Get a personalized greeting and overview of your day
- **Tasks** - Local task management with priority levels
- **Meetings** - View your calendar from Microsoft 365 via WorkIQ

## Getting Started

### Quick Install (macOS)

Clone the repo, review the setup script, then run it:

```bash
git clone https://github.com/karthikkaiplody/command-center-lite.git ~/command-center-lite
cat ~/command-center-lite/setup.sh   # review before running
bash ~/command-center-lite/setup.sh
```

> **Requires:** [Homebrew](https://brew.sh) (used to install Node.js if missing)

The script builds a native `.app`, opens the DMG, and you drag it to Applications. After that, launch from Spotlight (`⌘Space`) or Launchpad — no terminal needed.

> **Why not `bash <(curl ...)`?** That pattern pipes untrusted code directly to a shell with no chance to inspect it. Always download first, review the script, then run it locally.

The app will ask for your name and optional settings on first launch via an in-app settings screen. You can also enable **Launch on Login** in Settings so it starts automatically when you log in.

---

### Manual Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line) (for WorkIQ setup)
- A Microsoft 365 account (for calendar sync)

### 1. Clone and Install

```bash
git clone https://github.com/karthikkaiplody/command-center-lite.git
cd command-center-lite
npm install
```

### 2. Set Up WorkIQ (for calendar/meetings sync)

WorkIQ connects to your Microsoft 365 data to pull in your calendar. Follow the [WorkIQ MCP setup instructions](https://github.com/microsoft/work-iq-mcp):

```bash
# 1. Open GitHub Copilot CLI
copilot

# 2. Add the plugins marketplace (one-time setup)
/plugin marketplace add github/copilot-plugins

# 3. Install WorkIQ
/plugin install workiq@copilot-plugins
```

You can also install WorkIQ standalone:

```bash
# Install globally
npm install -g @microsoft/workiq

# Accept the EULA (required on first use)
workiq accept-eula
```

> **Note**: WorkIQ requires admin consent on your Microsoft 365 tenant. If you're not an admin, contact your tenant administrator. See the [Tenant Administrator Enablement Guide](https://github.com/microsoft/work-iq-mcp/blob/main/ADMIN-INSTRUCTIONS.md) for details.

### 3. Run the App

```bash
# Development mode (with hot reload)
npm run dev:electron

# Or build for production
npm run build
npm run electron
```

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool with hot module replacement
- **Tailwind CSS** - Styling
- **SQLite** - Local database for tasks
- **WorkIQ MCP** - Microsoft 365 calendar integration

## Data Storage

Your data is stored locally at:
- **macOS**: `~/.command-center-lite/command-center.db`
- **Windows**: `%USERPROFILE%\.command-center-lite\command-center.db`
- **Linux**: `~/.command-center-lite/command-center.db`

## License

MIT
