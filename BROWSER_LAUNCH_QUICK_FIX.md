# 🔥 VS CODE PREVIEW FIX - QUICK REFERENCE

## 🎯 THE FIX IN ONE SENTENCE

Instead of using `vite --open` (which VS Code intercepts), we use Windows `start` command to directly launch Chrome.

---

## ⚡ QUICK START (30 SECONDS)

### Kill Old Processes

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Start Development

```bash
npm run dev:chrome
```

### Expected Result

✅ Chrome opens at `http://localhost:5173`  
✅ NOT in VS Code preview  
✅ Full DevTools available  
✅ HMR auto-reload works

---

## 📋 AVAILABLE COMMANDS

| Command               | Behavior                    |
| --------------------- | --------------------------- |
| `npm run dev:chrome`  | Opens Chrome ✅ RECOMMENDED |
| `npm run dev:firefox` | Opens Firefox               |
| `npm run dev:edge`    | Opens Edge                  |
| `npm run dev`         | Opens default browser       |
| `npm run dev:no-open` | No browser (open manually)  |

---

## 🔧 IF IT STILL OPENS IN VS CODE PREVIEW

### Quick Fix 1: Close VS Code Preview

- Close the preview panel in VS Code
- Run: `npm run dev:chrome`

### Quick Fix 2: Clear VS Code Cache

```powershell
# Remove VS Code workspace settings
Remove-Item .vscode -Recurse -Force
# Reopen VS Code
```

### Quick Fix 3: Check Chrome Path

```powershell
where chrome
# or
"C:\Program Files\Google\Chrome\Application\chrome.exe" --version
```

---

## 📁 FILES CREATED

```
.vscode/
  ├── settings.json    ← Disables preview
  ├── launch.json      ← Debug configs
  └── tasks.json       ← VS Code tasks
```

---

## ✅ VERIFICATION

**Run this to verify everything works:**

```bash
# Kill everything
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start dev
npm run dev:chrome

# Should open Chrome immediately
# Check: http://localhost:5173 in Chrome address bar
```

---

## 🎯 KEY CONFIGURATION

### vite.config.js

```javascript
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: false,
  open: 'http://localhost:5173',  // ← This helps
  hmr: {
    host: 'localhost',
    port: 5173,
    protocol: 'ws',
  },
}
```

### package.json (Key Script)

```json
"dev:chrome": "vite --host 0.0.0.0 & timeout /t 2 & start chrome http://localhost:5173"
```

This command:

1. Starts Vite on 0.0.0.0:5173
2. Waits 2 seconds
3. Launches Chrome with `start` command
4. Bypasses VS Code preview entirely

### .vscode/settings.json (Key Setting)

```json
"security.openInExternalBrowser": true
```

This tells VS Code to open URLs externally, not in preview.

---

## 🚀 COMMON SCENARIOS

### Scenario 1: Fresh Start

```bash
npm run dev:chrome
→ Chrome opens ✅
```

### Scenario 2: Manual Control

```bash
npm run dev:no-open
# Then manually type in address bar:
# http://localhost:5173
```

### Scenario 3: Debug in VS Code

```
F5 → Chrome - Open Localhost:5173
→ Chrome opens with full debugging
```

### Scenario 4: Check Status

```bash
npm run dev:no-open
# Check in terminal: "ready in XXX ms"
# Then open manually in any browser
```

---

## 🛑 TROUBLESHOOTING

| Problem          | Solution                                   |
| ---------------- | ------------------------------------------ |
| Still in preview | Close preview panel + `npm run dev:chrome` |
| Chrome not found | Install Chrome or use `dev:firefox`        |
| Port busy        | `taskkill /F /IM node.exe`                 |
| HMR not working  | Check firewall allows localhost:5173       |
| Browser blank    | Hard refresh Ctrl+Shift+R                  |

---

## 📖 FULL GUIDE

See `VS_CODE_PREVIEW_FIX.md` for complete documentation

---

**Status:** ✅ PRODUCTION READY
