const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware: Verify JWT token and attach user to request
 *
 * Expected header format:
 * Authorization: Bearer <JWT_TOKEN>
 */
const protect = async (req, res, next) => {
  try {
    // ✅ Step 1: Read Authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    console.log("\n[🔐 AUTH MIDDLEWARE - STEP 1: Check Header]");
    console.log(
      "Authorization Header:",
      authHeader ? `${authHeader.substring(0, 30)}...` : "NOT PROVIDED",
    );
    console.log("All Headers:", Object.keys(req.headers));

    // ❌ Error: No Authorization header provided
    if (!authHeader) {
      console.log("❌ ERROR: No Authorization header found\n");
      return res.status(401).json({
        message: "Not authorized, no token provided",
        hint: "Add Authorization: Bearer <token> to headers",
      });
    }

    // ✅ Step 2: Parse Bearer token
    const parts = authHeader.split(" ");
    const scheme = parts[0];
    const token = parts[1];

    console.log("\n[🔐 AUTH MIDDLEWARE - STEP 2: Parse Token]");
    console.log("Scheme:", scheme);
    console.log("Token provided:", !!token);
    console.log(
      "Token preview:",
      token ? `${token.substring(0, 20)}...` : "MISSING",
    );

    // ❌ Error: Invalid Bearer format
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      console.log("❌ ERROR: Invalid Authorization format");
      console.log('Expected: "Bearer <token>"\n');
      return res.status(401).json({
        message: "Not authorized, invalid token format",
        hint: "Use format: Authorization: Bearer <token>",
      });
    }

    // ✅ Step 3: Verify JWT signature
    console.log("\n[🔐 AUTH MIDDLEWARE - STEP 3: Verify JWT]");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length || 0);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified successfully");
      console.log("User ID from token:", decoded.id);
    } catch (jwtError) {
      console.log("❌ JWT Verification failed:", jwtError.message);
      console.log("Error type:", jwtError.name);

      if (jwtError.name === "TokenExpiredError") {
        console.log(
          "⏰ Token expired at:",
          new Date(jwtError.expiredAt).toISOString(),
          "\n",
        );
        return res.status(401).json({
          message: "Not authorized, token expired",
          expiredAt: jwtError.expiredAt,
        });
      }

      console.log("");
      return res.status(401).json({
        message: "Not authorized, token failed",
        hint: "Login again to get a fresh token",
      });
    }

    // ✅ Step 4: Find user in database
    console.log("\n[🔐 AUTH MIDDLEWARE - STEP 4: Find User]");
    const foundUser = await User.findById(decoded.id).select("-password");

    if (!foundUser) {
      console.log("❌ ERROR: User not found in database");
      console.log("User ID:", decoded.id, "\n");
      return res.status(401).json({
        message: "Not authorized, user no longer exists",
      });
    }

    console.log("✅ User found:");
    console.log("Name:", foundUser.name);
    console.log("Email:", foundUser.email);
    console.log("Role:", foundUser.role);

    // ✅ Step 5: Attach user to request
    console.log("\n[✅ AUTH MIDDLEWARE - SUCCESS]");
    console.log("User authenticated and attached to request\n");

    req.user = foundUser;
    req.userId = foundUser._id;
    req.userRole = foundUser.role;

    next();
  } catch (error) {
    console.error("\n[❌ AUTH MIDDLEWARE - UNEXPECTED ERROR]");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack, "\n");

    return res.status(500).json({
      message: "Authentication error",
      error: error.message,
    });
  }
};

/**
 * Middleware: Check if user has admin role
 * Must be used AFTER protect middleware
 */
const admin = (req, res, next) => {
  console.log("\n[👮 ADMIN MIDDLEWARE - Check Role]");
  console.log("User role:", req.user?.role);
  console.log("Is admin:", req.user?.role === "admin");

  if (req.user && req.user.role === "admin") {
    console.log("✅ Admin access granted\n");
    next();
  } else {
    console.log("❌ Admin access denied - user is", req.user?.role, "\n");
    return res.status(403).json({
      message: "Not authorized as admin",
      userRole: req.user?.role,
    });
  }
};

module.exports = { protect, admin };
