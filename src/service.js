const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');

// Configuration
const CDP_PORT = parseInt(process.env.CDP_PORT, 10) || 9000;
const POLL_PAGES_INTERVAL_MS = 1500;
const SCAN_DOM_INTERVAL_MS = 300;

// Log file in user profile (~/.antigravity/auto_accept.log) or local directory fallback
const USER_ANTIGRAVITY_DIR = path.join(os.homedir(), '.antigravity');
try {
  if (!fs.existsSync(USER_ANTIGRAVITY_DIR)) {
    fs.mkdirSync(USER_ANTIGRAVITY_DIR, { recursive: true });
  }
} catch (e) {}

const LOG_FILE = fs.existsSync(USER_ANTIGRAVITY_DIR)
  ? path.join(USER_ANTIGRAVITY_DIR, 'auto_accept.log')
  : path.join(__dirname, '..', 'auto_accept.log');

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const line = `[${ts}] [AutoAccept] ${msg}\n`;
  console.log(line.trim());
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (e) {}
}

const activeConnections = new Map();

/**
 * Connect to an Antigravity Electron page window via Chrome DevTools Protocol (CDP)
 */
function connectToPage(page) {
  if (activeConnections.has(page.id)) return;

  log(`Target detected: "${page.title}" (${page.url})`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  activeConnections.set(page.id, ws);

  let msgId = 1;

  function send(method, params = {}) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ id: msgId++, method, params }));
    }
  }

  ws.on('open', () => {
    send('Runtime.enable');
    send('Page.enable');
    log(`Attached CDP monitor to "${page.title}" (Submit-only, Mic-safe, Multi-window enabled)`);

    // In-page DOM inspection loop (runs safely inside the Electron renderer)
    const scannerLoop = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        clearInterval(scannerLoop);
        return;
      }

      send('Runtime.evaluate', {
        expression: `
          (function() {
            // ONLY TARGET SUBMIT BUTTONS (Question & Permission modals)
            // SAFETY: NEVER touch microphone / voice recording buttons
            const candidates = Array.from(document.querySelectorAll('button, [role="button"], div, span, a'));
            for (const el of candidates) {
              if (el.children.length > 2) continue;

              // Filter out voice/mic/recording elements
              const aria = (el.getAttribute('aria-label') || '').toLowerCase();
              if (aria.includes('voice') || aria.includes('mic') || aria.includes('record')) {
                continue;
              }

              const text = (el.innerText || el.textContent || '').trim().toLowerCase();
              if (text === 'submit' || text === 'submit ↵' || text.startsWith('submit')) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  // If there are numbered choices (e.g. "1. Yes, allow this time"), ensure option 1 is selected
                  const options = Array.from(document.querySelectorAll('*'));
                  for (const opt of options) {
                    const ot = (opt.innerText || '').trim();
                    if (/^1\\s+yes/i.test(ot) || ot === '1' || ot.toLowerCase() === 'yes, allow this time') {
                      try { opt.click(); } catch(e) {}
                      break;
                    }
                  }

                  // Pure DOM click on the Submit button
                  try {
                    el.click();
                  } catch(e) {}

                  return { clicked: true, target: 'Submit' };
                }
              }
            }

            return { ok: true };
          })()
        `,
        returnByValue: true
      });
    }, SCAN_DOM_INTERVAL_MS);

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        const res = data.result?.result?.value;
        if (res?.clicked) {
          log(`Action: Auto-clicked "${res.target}" cleanly in "${page.title}"`);
        }
      } catch (e) {}
    });

    ws.on('close', () => {
      clearInterval(scannerLoop);
      activeConnections.delete(page.id);
      log(`Disconnected from "${page.title}"`);
    });

    ws.on('error', () => {
      clearInterval(scannerLoop);
      activeConnections.delete(page.id);
    });
  });
}

/**
 * Poll CDP port to discover and attach to all open Antigravity windows
 */
function pollPages() {
  const req = http.get(`http://127.0.0.1:${CDP_PORT}/json/list`, { timeout: 1500 }, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const targets = JSON.parse(raw);
        const pages = targets.filter(t => t.type === 'page' && t.webSocketDebuggerUrl);
        for (const p of pages) {
          connectToPage(p);
        }
      } catch (e) {}
    });
  });

  req.on('error', () => {
    // If Antigravity is closed, terminate stale connections
    for (const [id, ws] of activeConnections) {
      try { ws.terminate(); } catch (e) {}
    }
    activeConnections.clear();
  });
}

function start() {
  log('====================================================');
  log(' Antigravity Desktop Auto-Accept Service (No-IDE)');
  log(` Mode: Submit-Only (Safe) | Port: ${CDP_PORT} | Mic-Safe: ON`);
  log(` Multi-window support: Active`);
  log(` Logging to: ${LOG_FILE}`);
  log('====================================================');

  setInterval(pollPages, POLL_PAGES_INTERVAL_MS);
  pollPages();
}

module.exports = { start };

if (require.main === module) {
  start();
}
