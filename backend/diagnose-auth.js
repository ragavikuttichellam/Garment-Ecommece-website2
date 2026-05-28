/**
 * 🔍 MERN AUTH SYSTEM DIAGNOSTIC SCRIPT
 *
 * Run this to verify your authentication system is configured correctly.
 * Usage: node diagnose-auth.js
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║     🔍 AUTHENTICATION SYSTEM DIAGNOSTIC REPORT         ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

const checks = [];

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 1: Environment Variables
// ═══════════════════════════════════════════════════════════════════════════

console.log("📋 CHECK 1: Environment Variables\n");

const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];

const optionalEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLIENT_URL",
  "NODE_ENV",
];

let envCheckPassed = true;

console.log("Required Variables:");
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value ? "✅" : "❌";
  const display = value
    ? varName === "JWT_SECRET"
      ? `[HIDDEN - ${value.length} chars]`
      : value
    : "NOT SET";
  console.log(`  ${status} ${varName.padEnd(20)} : ${display}`);

  if (!value) {
    envCheckPassed = false;
    console.log(`     ⚠️  Add to .env: ${varName}=<value>`);
  }
});

console.log("\nOptional Variables:");
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value ? "✅" : "⏭️ ";
  const display = value
    ? varName.includes("SECRET")
      ? "[HIDDEN]"
      : value
    : "NOT SET";
  console.log(`  ${status} ${varName.padEnd(20)} : ${display}`);
});

checks.push({
  name: "Environment Variables",
  passed: envCheckPassed,
  message: envCheckPassed
    ? "All required vars set"
    : "Some required vars missing",
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 2: .env File
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n\n📋 CHECK 2: .env File\n");

const envPath = path.join(__dirname, ".env");
const envExists = fs.existsSync(envPath);

console.log(`  ${envExists ? "✅" : "❌"} .env file exists at: ${envPath}`);
if (envExists) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const envLines = envContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));
  console.log(`  ✅ .env contains ${envLines.length} configuration lines`);
}

checks.push({
  name: ".env File",
  passed: envExists,
  message: envExists ? ".env file found" : ".env file missing",
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 3: Required Files
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n\n📋 CHECK 3: Required Backend Files\n");

const requiredFiles = [
  "models/User.js",
  "controllers/authController.js",
  "middleware/authMiddleware.js",
  "routes/authRoutes.js",
  "routes/productRoutes.js",
  "config/database.js",
  "server.js",
];

let filesCheckPassed = true;
requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? "✅" : "❌";
  console.log(`  ${status} ${file}`);
  if (!exists) filesCheckPassed = false;
});

checks.push({
  name: "Required Files",
  passed: filesCheckPassed,
  message: filesCheckPassed ? "All files present" : "Some files missing",
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 4: npm Dependencies
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n\n📋 CHECK 4: npm Dependencies\n");

const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const requiredDeps = [
  "express",
  "mongoose",
  "jsonwebtoken",
  "bcryptjs",
  "dotenv",
  "cors",
  "multer",
  "cloudinary",
];

let depsCheckPassed = true;
requiredDeps.forEach((dep) => {
  const hasLib = packageJson.dependencies[dep];
  const status = hasLib ? "✅" : "❌";
  const version = hasLib || "NOT INSTALLED";
  console.log(`  ${status} ${dep.padEnd(20)} : ${version}`);
  if (!hasLib) depsCheckPassed = false;
});

checks.push({
  name: "npm Dependencies",
  passed: depsCheckPassed,
  message: depsCheckPassed
    ? "All dependencies available"
    : "Missing dependencies",
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 5: MongoDB Connection
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n\n📋 CHECK 5: MongoDB Connection\n");

const connectDB = async () => {
  try {
    console.log(`  ⏳ Connecting to: ${process.env.MONGO_URI}`);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("  ✅ MongoDB connected successfully!");
    console.log(`  ✅ Connected to: ${mongoose.connection.host}`);

    // Check for User model
    const User = require("./models/User");
    const userCount = await User.countDocuments();
    console.log(`  ✅ User collection has ${userCount} documents`);

    checks.push({
      name: "MongoDB Connection",
      passed: true,
      message: "Database connected and accessible",
    });

    return true;
  } catch (error) {
    console.log(`  ❌ MongoDB connection failed!`);
    console.log(`  Error: ${error.message}`);

    checks.push({
      name: "MongoDB Connection",
      passed: false,
      message: `Connection failed: ${error.message}`,
    });

    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 6: JWT Configuration
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n\n📋 CHECK 6: JWT Configuration\n");

const jwtSecret = process.env.JWT_SECRET;
const jwtCheckPassed = !!(jwtSecret && jwtSecret.length >= 10);

console.log(`  ${jwtCheckPassed ? "✅" : "❌"} JWT_SECRET configured`);
console.log(`     Length: ${jwtSecret?.length || 0} characters`);
console.log(`     Min required: 10 characters`);

if (jwtSecret && jwtSecret.length < 10) {
  console.log(
    `  ⚠️  WARNING: JWT_SECRET is too short (min 10 chars recommended)`,
  );
}

checks.push({
  name: "JWT Configuration",
  passed: jwtCheckPassed,
  message: jwtCheckPassed
    ? "JWT configured correctly"
    : "JWT_SECRET missing or too short",
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DIAGNOSTIC FLOW
// ═══════════════════════════════════════════════════════════════════════════

const runDiagnostics = async () => {
  // Check database
  const dbConnected = await connectDB();

  // ═════════════════════════════════════════════════════════════════════════
  // FINAL REPORT
  // ═════════════════════════════════════════════════════════════════════════

  console.log("\n\n╔════════════════════════════════════════════════════════╗");
  console.log("║                    📊 SUMMARY REPORT                    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  let totalPassed = 0;
  let totalFailed = 0;

  checks.forEach((check) => {
    const status = check.passed ? "✅" : "❌";
    const name = check.name.padEnd(25);
    const message = check.message;

    console.log(`${status} ${name} : ${message}`);

    if (check.passed) totalPassed++;
    else totalFailed++;
  });

  console.log("\n" + "─".repeat(55));
  console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);

  if (totalFailed === 0) {
    console.log("\n✨ All checks passed! Your auth system is ready to use.\n");
    console.log("Next steps:");
    console.log("1. Run: npm run dev (in backend)");
    console.log("2. Run: node setup-demo-users.js (to create test accounts)");
    console.log("3. Test with Postman collection\n");
  } else {
    console.log(
      "\n⚠️  Some checks failed. Fix issues above before proceeding.\n",
    );
  }

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║            🔐 TROUBLESHOOTING GUIDE                    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  console.log("Common Issues:\n");

  console.log('1️⃣  "MongoDB connection failed"');
  console.log("   Solution: Make sure MongoDB is running (mongod)\n");

  console.log('2️⃣  "MONGO_URI not set"');
  console.log(
    "   Solution: Add to .env: MONGO_URI=mongodb://localhost:27017/garment-ecommerce\n",
  );

  console.log('3️⃣  "JWT_SECRET not set"');
  console.log(
    "   Solution: Add to .env: JWT_SECRET=your_super_secret_key_here\n",
  );

  console.log('4️⃣  "Dependencies missing"');
  console.log("   Solution: Run: cd backend && npm install\n");

  console.log('5️⃣  "Missing required files"');
  console.log("   Solution: Ensure all files from the project are present\n");

  // Cleanup
  await mongoose.disconnect();
};

// Run diagnostics
runDiagnostics().catch((error) => {
  console.error("Diagnostic error:", error);
  process.exit(1);
});
