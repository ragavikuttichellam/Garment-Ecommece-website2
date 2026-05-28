/**
 * MERN Auth System - Demo User Setup Script
 *
 * This script creates demo users in MongoDB for testing the authentication system.
 * Run this once to populate the database with test accounts.
 *
 * Usage: node setup-demo-users.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const DEMO_USERS = [
  {
    name: "Admin User",
    email: "admin@garmentx.com",
    password: "admin123",
    role: "admin",
    description: "Admin account for managing products",
  },
  {
    name: "Demo User",
    email: "user@garmentx.com",
    password: "user123",
    role: "user",
    description: "Regular user account",
  },
  {
    name: "Munees Ahmed",
    email: "munees@garmentx.com",
    password: "Munees123",
    role: "user",
    description: "Test user account",
  },
  {
    name: "John Doe",
    email: "john@garmentx.com",
    password: "John@1234",
    role: "user",
    description: "Test customer",
  },
  {
    name: "Sarah Smith",
    email: "sarah@garmentx.com",
    password: "Sarah@1234",
    role: "user",
    description: "Test customer",
  },
];

const setupDemoUsers = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("📋 Creating demo users...\n");

    let createdCount = 0;
    let existingCount = 0;

    for (const userData of DEMO_USERS) {
      const userExists = await User.findOne({ email: userData.email });

      if (userExists) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        existingCount++;
      } else {
        const user = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        });

        console.log(`✅ Created user: ${userData.email}`);
        console.log(`   Name: ${userData.name}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Note: ${userData.description}\n`);

        createdCount++;
      }
    }

    console.log("═══════════════════════════════════════════════════════");
    console.log(
      `📊 Summary: ${createdCount} created, ${existingCount} already existed`,
    );
    console.log("═══════════════════════════════════════════════════════\n");

    console.log("🧪 Test Login Credentials:");
    console.log("─────────────────────────────────────────────────────");
    DEMO_USERS.forEach((user) => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔐 Password: ${user.password}`);
      console.log(`👤 Role: ${user.role}`);
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════════");
    console.log("\n✨ Ready to test authentication!");
    console.log("\nPostman Test Steps:");
    console.log("1. POST http://localhost:5000/api/auth/login");
    console.log(
      '2. Send JSON: {"email": "user@garmentx.com", "password": "user123"}',
    );
    console.log('3. Copy the "token" from response');
    console.log("4. Use token in Authorization header: Bearer <token>");
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setupDemoUsers();
