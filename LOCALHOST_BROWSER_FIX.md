# Vite + React Localhost Browser Access Fix
## Complete Debugging & Configuration Guide

---

## 🔴 PROBLEM IDENTIFIED

Your Vite dev server was binding to `[::1]:5173` (IPv6 loopback only) instead of `0.0.0.0`:

```
✗ IPv6 only:  [::1]:5173          (VS Code preview works, browsers fail)
✓ All interfaces: 0.0.0.0:5173    (All browsers work)
```

### Why This Happened:
- Default Vite configuration has no explicit `server.host` setting
- Modern Node.js defaults to IPv6 loopback when available
- External browsers (Chrome, Firefox, Edge) try IPv4 `127.0.0.1` → connection refused

---

## ✅ FIXES APPLIED

### 1. **vite.config.js** - Added Server Configuration
```javascript
server: {
  host: '0.0.0.0',           // Listen on all network interfaces
  port: 5173,                // Default port
  strictPort: false,         // Allow fallback to 5174 if 5173 busy
  hmr: {                     // Hot Module Replacement for external browsers
    host: 'localhost',
    port: 5173,
    protocol: 'ws',
  },
}
```

### 2. **package.json** - Enhanced Scripts
```json
"scripts": {
  "dev": "vite --host 0.0.0.0",
  "dev:open": "vite --host 0.0.0.0 --open",
  "build": "vite build",
  "preview": "vite preview --host 0.0.0.0"
}
```

---

## 🚀 QUICK START (After Fixes)

### Step 1: Kill All Node Processes
```powershell
# Windows PowerShell (Run as Administrator)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Start Dev Server
```powershell
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Step 3: Access in External Browsers

| Browser | URL | Status |
|---------|-----|--------|
| Chrome  | http://localhost:5173 | ✅ Works |
| Firefox | http://localhost:5173 | ✅ Works |
| Edge    | http://localhost:5173 | ✅ Works |
| Network | http://192.168.x.x:5173 | ✅ Works from other devices |

---

## 🛠️ WINDOWS TROUBLESHOOTING COMMANDS

### Check Port Status
```powershell
# See what's using ports 5173-5175
netstat -ano | findstr "5173"
netstat -ano | findstr "5174"
netstat -ano | findstr "5175"
```

### Kill Process by Port
```powershell
# Kill process using port 5173 (replace PID with actual process ID)
taskkill /PID <PID> /F

# Example: taskkill /PID 12345 /F
```

### Kill All Node Processes
```powershell
# Force kill all Node.js instances
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Clear DNS Cache
```powershell
# Clear Windows DNS resolver cache
ipconfig /flushdns
```

### Check Listening Ports
```powershell
# List all listening ports (detailed)
netstat -ano | findstr LISTENING

# Or use:
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess
```

### Verify Firewall (if needed)
```powershell
# Check if Windows Firewall is blocking Node.js
Get-NetFirewallProfile

# Add Node.js to firewall exceptions (if needed):
# Control Panel > Windows Defender Firewall > Allow an app through firewall
```

---

## 📋 COMPLETE CONFIGURATION FILES

### vite.config.js (Current - Production Ready)
```javascript
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'tsx',
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // ✅ KEY ADDITION: Server configuration
  server: {
    host: '0.0.0.0',      // All interfaces
    port: 5173,           // Port
    strictPort: false,    // Flexible port
    hmr: {
      host: 'localhost',  // HMR for browsers
      port: 5173,
      protocol: 'ws',
    },
  },
})
```

### package.json Scripts
```json
"scripts": {
  "dev": "vite --host 0.0.0.0",
  "dev:open": "vite --host 0.0.0.0 --open",
  "build": "vite build",
  "preview": "vite preview --host 0.0.0.0"
}
```

---

## 🔍 WHY VS CODE PREVIEW WORKED BUT BROWSERS FAILED

| Aspect | VS Code Preview | External Browsers |
|--------|-----------------|-------------------|
| **Access Method** | Internal WebSocket (IPv6) | Network request (IPv4) |
| **Localhost Resolution** | VS Code handles IPv6 internally | OS resolver tries IPv4 first |
| **Binding Address** | `[::1]:5173` (IPv6 loopback) | Cannot reach IPv4 loopback |
| **Result** | ✅ Connected | ❌ Connection refused |

**Key Point:** `localhost` can resolve to both IPv4 (127.0.0.1) and IPv6 (::1). By binding to `0.0.0.0`, Vite listens on **both** IPv4 and IPv6, making it accessible to all browsers.

---

## 🔥 ADVANCED DEBUGGING

### Check IP Configuration
```powershell
# View all network adapters
ipconfig

# View IPv6 addresses specifically
ipconfig /all
```

### Test Connectivity
```powershell
# Test localhost resolution
nslookup localhost

# Test port connectivity
Test-NetConnection -ComputerName localhost -Port 5173
Test-NetConnection -ComputerName 127.0.0.1 -Port 5173
Test-NetConnection -ComputerName 192.168.x.x -Port 5173
```

### Monitor Vite Logs
```powershell
# Run dev server with verbose logging
npm run dev -- --loglevel=info
```

---

## ⚙️ ENVIRONMENT-SPECIFIC FIXES

### For Windows Firewall
If localhost still fails after fixes:
1. Search "Allow an app through firewall"
2. Click "Change settings" (Admin)
3. Add Node.js to allowed apps
4. Restart dev server

### For VPN/Proxy Issues
If using VPN/proxy:
```javascript
// Alternative HMR config for VPN:
hmr: {
  host: '127.0.0.1',    // Use IPv4 explicitly
  port: 5173,
}
```

### For Docker/Containers
```javascript
// If running in container:
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: true,     // Prevent auto-increment
}
```

---

## ✨ FINAL CHECKLIST

- ✅ vite.config.js has `server.host: '0.0.0.0'`
- ✅ vite.config.js has `strictPort: false`
- ✅ vite.config.js has HMR configuration
- ✅ package.json scripts use `--host 0.0.0.0`
- ✅ All Node processes killed before starting
- ✅ Port 5173 is available (check with netstat)
- ✅ Firewall not blocking localhost
- ✅ Browser cache cleared (hard refresh: Ctrl+Shift+R)

---

## 📞 STILL NOT WORKING? RUN THIS DIAGNOSTIC

```powershell
# 1. Kill everything
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. Check port
netstat -ano | findstr "5173"

# 3. Check Node version
node --version
npm --version

# 4. Reinstall dependencies
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

# 5. Clear npm cache
npm cache clean --force

# 6. Start fresh
npm run dev
```

---

## 🎯 EXPECTED RESULTS

After applying all fixes, you should see:

```
✅ Chrome: http://localhost:5173/ → LOADS SUCCESSFULLY
✅ Firefox: http://localhost:5173/ → LOADS SUCCESSFULLY  
✅ Edge: http://localhost:5173/ → LOADS SUCCESSFULLY
✅ HMR: Auto-refresh on file changes works
✅ Network: 192.168.x.x:5173 accessible from other devices
✅ VS Code Preview: Still works as before
```

---

**Last Updated:** May 9, 2026  
**Status:** Production Ready ✅
