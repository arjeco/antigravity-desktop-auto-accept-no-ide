# Antigravity Desktop Auto-Accept (No-IDE) 🚀

[ 🇺🇸 English ](README.md) | [ 🇪🇸 Español ](README.es.md)

> A lightweight, autonomous background daemon designed to automatically accept tool execution permissions and question prompts (`Submit ↵`) in **Antigravity Desktop App (v2.x Electron)** with multi-window multitasking support and microphone safety.

---

## ⚠️ Why This Repository? (Key Difference from the IDE Version)

Antigravity is available in two distinct formats:

| Version | Architecture | Does this tool work with it? |
| :--- | :--- | :---: |
| **Antigravity Desktop App (v2.x)** | Standalone Electron application. Standard VS Code extensions **cannot access the DOM** of conversations. Requires direct automation via Chrome DevTools Protocol (CDP). | ✅ **YES (Specially designed for this)** |
| **Antigravity IDE (VS Code Fork)** | Classic VS Code-based development environment. Supports native marketplace extensions. | ❌ **NO (Use standard VS Code extension)** |

This repository was created specifically for the **standalone Desktop App**, establishing a bridge via Electron's debugging port to interact directly with the interface without manual intervention.

---

## ✨ Key Features

- **🛡️ Safe Mode (Submit-Only):**
  - Automatically selects Option 1 (*"Yes, allow this time"*) and clicks `Submit ↵`.
  - **Does NOT** auto-accept implementation plans or critical commands (`Run` / `Proceed` / `Accept`), allowing you to review and validate proposals before authorizing them.
- **🎙️ Mic-Safe (Zero accidental voice recordings):**
  - Clicks exclusively through the DOM tree (`element.click()`), explicitly filtering and ignoring any element with voice or microphone attributes (`Record voice memo`). No blind coordinate clicks.
- **🪟 Multi-Window Multitasking Support:**
  - If you open multiple Antigravity windows (`Ctrl + Shift + N` or separate projects), the daemon dynamically detects each window and runs auto-approval across all of them in parallel.
- **💤 100% Unattended & Minimized Operation:**
  - Works seamlessly while Antigravity is minimized or running behind other windows without stealing focus.
- **🚀 Silent Windows Startup:**
  - Includes helper scripts to register as a Windows Startup task, running completely silently in the background without opening black terminal windows.

---

## 📋 Prerequisites

1. **Windows 10 / 11**
2. **Node.js** (v18 or higher) $\rightarrow$ [Download Node.js](https://nodejs.org/)
3. **Antigravity Desktop App** launched with the remote debugging flag (`--remote-debugging-port=9000`).

---

## ⚙️ Antigravity Shortcut Setup (One-Time Step)

To allow the service to communicate with the desktop application, Antigravity must be launched with the CDP port enabled:

1. Right-click your **Antigravity** shortcut (on your Desktop, Start Menu, or Taskbar) $\rightarrow$ **Properties**.
2. In the **Shortcut** tab, locate the **Target** field.
3. At the very end of the line, add a space and:
   ```text
   --remote-debugging-port=9000
   ```
   *Example:*
   ```text
   "C:\Users\your-user\AppData\Local\Programs\Antigravity\Antigravity.exe" --remote-debugging-port=9000
   ```
4. Click **Apply** and **OK**.
5. Restart Antigravity completely using this shortcut.

---

## 🚀 Quick Start

### 1. Clone the repository
Open a terminal (PowerShell or Command Prompt) and run:
```bash
git clone https://github.com/arjeco/antigravity-desktop-auto-accept-no-ide.git
cd antigravity-desktop-auto-accept-no-ide
```

### 2. Install dependencies
```bash
npm install
```

---

## 💻 Usage Options

### Option A: Interactive run (For testing)
```bash
npm start
```
You will see the console reporting detected windows and every auto-clicked `Submit` action in real time.

### Option B: Automatic silent Windows startup (Recommended)
To run permanently and invisibly every time your PC boots:
```powershell
npm run install-startup
```
> This creates a shortcut in your Startup folder (`shell:startup`) that launches the service via `wscript.exe` with zero visible console windows.

### To uninstall Windows startup:
```powershell
npm run uninstall-startup
```

---

## 🪵 Live Logging

The daemon maintains an activity log at:
```text
%USERPROFILE%\.antigravity\auto_accept.log
```

To watch logs live in PowerShell:
```powershell
Get-Content "$env:USERPROFILE\.antigravity\auto_accept.log" -Wait -Tail 20
```

---

## ❓ Frequently Asked Questions (FAQ)

#### What happens if I open multiple Antigravity windows?
The service scans all active windows every 1.5 seconds. All open windows will automatically have auto-accept running concurrently.

#### Why does auto-accept pause if a conversation is in the sidebar?
Antigravity is a Single Page Application (SPA) and only renders the currently active conversation in the DOM. Background conversations in the sidebar do not have their buttons rendered in memory until selected.  
**Solution:** If you want to run parallel tasks unattended, open each task in a separate window using **`Ctrl + Shift + N`**.

#### How do I know if port 9000 is open?
Open this URL in your web browser: [http://127.0.0.1:9000/json/list](http://127.0.0.1:9000/json/list). You should see a JSON array representing the active Antigravity windows.

---

## 📄 License

Distributed under the **MIT** License. See [`LICENSE`](LICENSE) for more information.

Developed and maintained by **Arturo Cabarcas**.