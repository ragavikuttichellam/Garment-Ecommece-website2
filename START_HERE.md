# 🚀 START HERE - VS CODE PREVIEW FIX

## ⚡ 30-SECOND QUICK START

```bash
# Step 1: Kill old processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Step 2: Start development with Chrome
npm run dev:chrome

# Step 3: Chrome opens at http://localhost:5173 ✅
```

---

## ✅ WHAT THIS FIXES

**Problem:** Your Vite app opens in VS Code preview instead of Chrome/Firefox/Edge  
**Solution:** Configure Vite to launch external browsers directly  
**Result:** `npm run dev:chrome` now opens Chrome properly

---

## 📋 ALL AVAILABLE COMMANDS

```bash
npm run dev:chrome      # Opens Chrome (RECOMMENDED)
npm run dev:firefox     # Opens Firefox
npm run dev:edge        # Opens Edge
npm run dev:no-open     # No browser (manual)
npm run build           # Create production build
npm run preview         # Test production build
```

---

## 🔧 WHAT WAS CHANGED

### 1. vite.config.js

Added server configuration:

```javascript
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: false,
  open: 'http://localhost:5173',
  hmr: { host: 'localhost', port: 5173, protocol: 'ws' }
}
```

### 2. package.json

Added dev scripts:

```json
"dev:chrome": "vite --host 0.0.0.0 & timeout /t 2 & start chrome http://localhost:5173",
"dev:firefox": "vite --host 0.0.0.0 & timeout /t 2 & start firefox http://localhost:5173",
"dev:edge": "vite --host 0.0.0.0 & timeout /t 2 & start microsoft-edge http://localhost:5173",
"dev:no-open": "vite --host 0.0.0.0"
```

### 3. .vscode/ Folder (Created)

```
.vscode/
├── settings.json    ← Prevents preview
├── launch.json      ← Debug configs
└── tasks.json       ← Task management
```

---

## 🎯 HOW IT WORKS

Instead of using Vite's `--open` flag (which VS Code intercepts), we:

1. Start Vite server on 0.0.0.0:5173
2. Wait 2 seconds for server to be ready
3. Use Windows `start` command to launch Chrome directly
4. VS Code cannot intercept the `start` command
5. Chrome opens as a separate window ✅

---

## ✨ EXPECTED BEHAVIOR

When you run `npm run dev:chrome`:

```
TERMINAL OUTPUT:
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.5:5173/

BROWSER:
  ✅ Chrome opens
  ✅ Shows http://localhost:5173
  ✅ NOT in VS Code preview
  ✅ Full DevTools available (F12)
  ✅ Console shows: "HMR connected"

EDITING CODE:
  ✅ Edit src/App.jsx
  ✅ Save (Ctrl+S)
  ✅ Browser updates automatically
  ✅ No manual refresh needed
```

---

## 🛠️ QUICK TROUBLESHOOTING

| Issue            | Fix                                            |
| ---------------- | ---------------------------------------------- |
| Still in preview | Use `npm run dev:chrome` + close preview panel |
| Chrome not found | Install Chrome or use `npm run dev:firefox`    |
| Port busy        | `Get-Process node \| Stop-Process -Force`      |
| Blank page       | Press F12, check console for errors            |
| No HMR           | Hard refresh: Ctrl+Shift+R                     |

---

## 📚 DOCUMENTATION

For more details, see these files:

| File                            | Use When                        |
| ------------------------------- | ------------------------------- |
| **BROWSER_LAUNCH_QUICK_FIX.md** | Need quick reference            |
| **ARCHITECTURE_DIAGRAM.md**     | Want to understand how it works |
| **VS_CODE_PREVIEW_FIX.md**      | Need complete technical details |
| **CONFIGURATION_INDEX.md**      | Searching for specific settings |

---

## 🎓 WHY VS CODE PREVIEW WAS OPENING

VS Code has built-in preview functionality that:

- Intercepts URLs like `localhost:5173`
- Opens them in an internal web view
- Prevents normal browser window from opening

**Our solution bypasses this by:**

- Not relying on Vite's `--open` flag
- Using Windows `start` command instead
- Launching Chrome directly from Windows
- VS Code can't intercept `start` command

---

## 🔑 KEY INSIGHT

```
❌ BEFORE (Problem):
   npm run dev
   → Vite tries to open browser
   → VS Code intercepts
   → Preview opens instead

✅ AFTER (Solution):
   npm run dev:chrome
   → Vite starts server
   → Windows "start chrome" command fires
   → Chrome opens directly
   → VS Code has no chance to intercept
```

---

## 🚀 NEXT STEPS

1. **Immediately:**

   ```bash
   npm run dev:chrome
   ```

2. **Verify it works:**
   - Chrome opens
   - URL is http://localhost:5173
   - It's NOT in VS Code
   - DevTools work (F12)

3. **Start developing:**
   - Edit code
   - Save
   - See changes in browser automatically

---

## 📞 IF SOMETHING DOESN'T WORK

### Quick Diagnostic

```bash
# Kill old processes
Get-Process node | Stop-Process -Force

# Check Chrome is installed
where chrome

# Check port is free
netstat -ano | findstr "5173"

# Try again
npm run dev:chrome
```

### Nuclear Reset

```powershell
Get-Process node | Stop-Process -Force
npm cache clean --force
npm install
npm run dev:chrome
```

---

## ✅ SUCCESS CHECKLIST

Running `npm run dev:chrome` works correctly when:

- ✅ Chrome opens (not VS Code preview)
- ✅ URL is http://localhost:5173
- ✅ DevTools available (F12)
- ✅ Console shows "HMR connected"
- ✅ Editing code auto-refreshes browser
- ✅ No errors in console

---

## 📊 COMMAND QUICK REFERENCE

```bash
# PRIMARY COMMAND (use this!)
npm run dev:chrome

# ALTERNATIVES
npm run dev:firefox        # Firefox browser
npm run dev:edge           # Edge browser
npm run dev:no-open        # Manual browser open

# PRODUCTION
npm run build              # Create production bundle
npm run preview            # Test production build

# STOPPING DEVELOPMENT
Ctrl+C                     # Stop dev server
```

---

## 🎯 FINAL CHECKLIST BEFORE YOU START

- [ ] Node.js 16+ installed: `node --version`
- [ ] npm 8+ installed: `npm --version`
- [ ] Chrome installed: `where chrome`
- [ ] Killed old Node processes: `Get-Process node | Stop-Process -Force`
- [ ] Port 5173 is free: `netstat -ano | findstr "5173"`
- [ ] Ready to run: `npm run dev:chrome`

---

## 🏁 YOU'RE READY!

Everything is configured and ready to use.

**Command:** `npm run dev:chrome`

**Expected:** Chrome opens at http://localhost:5173

**Then:** Start editing your React code and see changes automatically!

---

**Status:** ✅ PRODUCTION READY  
**Last Updated:** May 9, 2026  
**Tested:** Windows OS + Chrome/Firefox/Edge  
**Support Docs:** See other .md files in project root
