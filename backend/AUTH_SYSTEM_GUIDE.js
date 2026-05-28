/**
 * MERN STACK AUTHENTICATION SYSTEM - COMPLETE GUIDE
 *
 * This document explains the complete authentication flow and how to test it.
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: BACKEND AUTHENTICATION ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AUTHENTICATION FLOW:
 *
 * User Login:
 * 1. User sends email + password → POST /api/auth/login
 * 2. Backend finds user in MongoDB
 * 3. Compares password using bcrypt.compare()
 * 4. If valid → Generates JWT token
 * 5. Returns token + user data
 * 6. Frontend saves token in localStorage
 * 7. Frontend automatically authenticates user
 *
 * JWT Token Verification (on protected routes):
 * 1. Frontend sends Authorization header: "Bearer <token>"
 * 2. Backend middleware checks header
 * 3. Verifies JWT signature
 * 4. Attaches user to request object
 * 5. Allows access to protected routes
 *
 * Logout:
 * 1. Frontend removes token from localStorage
 * 2. User is automatically deauthenticated
 * 3. Protected routes redirect to login
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: POSTMAN TESTING GUIDE
// ═══════════════════════════════════════════════════════════════════════════

// TEST ACCOUNT CREDENTIALS:
const TEST_ACCOUNTS = {
  admin: {
    email: "admin@garmentx.com",
    password: "admin123",
    role: "admin",
  },
  user: {
    email: "user@garmentx.com",
    password: "user123",
    role: "user",
  },
  munees: {
    email: "munees@garmentx.com", // ⚠️ LOWERCASE
    password: "Munees123",
    role: "user",
  },
};

/**
 * STEP 1: LOGIN AND GET TOKEN
 *
 * Request:
 * POST http://localhost:5000/api/auth/login
 *
 * Body (raw JSON):
 * {
 *   "email": "munees@garmentx.com",
 *   "password": "Munees123"
 * }
 *
 * Response:
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "Munees Ahmed",
 *   "email": "munees@garmentx.com",
 *   "role": "user",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * ✅ COPY THE TOKEN VALUE
 */

/**
 * STEP 2: CREATE PRODUCT WITH TOKEN
 *
 * Request:
 * POST http://localhost:5000/api/products
 *
 * Headers:
 * Authorization: Bearer <paste_your_token_here>
 *
 * Body (form-data):
 * Key               | Value
 * ─────────────────────────────────────────────
 * name              | Cotton T-Shirt
 * description       | Soft cotton round-neck
 * price             | 499
 * category          | men
 * stock             | 100
 * image             | <select image file>
 *
 * Response: 201 Created
 * {
 *   "_id": "...",
 *   "name": "Cotton T-Shirt",
 *   "image": "https://res.cloudinary.com/..."
 * }
 */

/**
 * STEP 3: GET USER PROFILE (Protected Route)
 *
 * Request:
 * GET http://localhost:5000/api/auth/profile
 *
 * Headers:
 * Authorization: Bearer <your_token>
 *
 * Response: 200 OK
 * {
 *   "_id": "...",
 *   "name": "Munees Ahmed",
 *   "email": "munees@garmentx.com",
 *   "role": "user"
 * }
 */

/**
 * STEP 4: REGISTER NEW USER
 *
 * Request:
 * POST http://localhost:5000/api/auth/register
 *
 * Body (raw JSON):
 * {
 *   "name": "New User",
 *   "email": "newuser@garmentx.com",
 *   "password": "Password@123",
 *   "phone": "1234567890"
 * }
 *
 * Response: 201 Created
 * {
 *   "_id": "...",
 *   "name": "New User",
 *   "email": "newuser@garmentx.com",
 *   "role": "user",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: FRONTEND AUTHENTICATION (React Context)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AuthContext Flow:
 *
 * 1. Login Function:
 *    - Takes email & password
 *    - Calls POST /api/auth/login
 *    - Saves token to localStorage
 *    - Sets user state
 *    - Returns true/false
 *
 * 2. Auto-Login on Page Refresh:
 *    - useEffect reads localStorage
 *    - If token exists → user stays logged in
 *    - If no token → user is logged out
 *
 * 3. Protected Routes:
 *    - Check if user is authenticated
 *    - If yes → allow access
 *    - If no → redirect to /login
 *
 * 4. Logout Function:
 *    - Clears localStorage
 *    - Clears user state
 *    - Redirects to home
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: KEY FILES IN THE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BACKEND FILES:
 *
 * ├─ models/User.js
 * │  └─ User schema with bcrypt password hashing
 * │     Methods: comparePassword()
 * │
 * ├─ controllers/authController.js
 * │  ├─ registerUser() - Create new user
 * │  ├─ loginUser() - Authenticate user
 * │  └─ getUserProfile() - Get logged-in user info
 * │
 * ├─ middleware/authMiddleware.js
 * │  ├─ protect() - Verify JWT token
 * │  └─ admin() - Check if user is admin
 * │
 * ├─ routes/authRoutes.js
 * │  ├─ POST /auth/register
 * │  ├─ POST /auth/login
 * │  └─ GET /auth/profile (protected)
 * │
 * └─ .env
 *    └─ JWT_SECRET=your_secret_key
 *
 *
 * FRONTEND FILES:
 *
 * ├─ src/app/context/AuthContext.jsx
 * │  └─ Global authentication state & functions
 * │
 * ├─ src/app/pages/Login.jsx
 * │  └─ Login form & UI
 * │
 * ├─ src/app/pages/Register.jsx
 * │  └─ Registration form & UI
 * │
 * ├─ src/app/routes.jsx
 * │  └─ ProtectedRoute component
 * │
 * └─ src/services/api.js
 *    └─ API client with axios
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Common Auth Errors:
 *
 * ❌ "Invalid email or password"
 *    → User not found OR password doesn't match
 *    → Solution: Check email is lowercase, password is correct
 *
 * ❌ "Not authorized, no token provided"
 *    → Missing Authorization header
 *    → Solution: Add "Authorization: Bearer <token>" header
 *
 * ❌ "Not authorized, token failed"
 *    → Token is expired or corrupted
 *    → Solution: Login again to get fresh token
 *
 * ❌ "Not authorized as admin"
 *    → User doesn't have admin role
 *    → Solution: Use admin account or change route protection
 *
 * ❌ "Email and password are required"
 *    → Form validation failed
 *    → Solution: Fill in all required fields
 *
 * ❌ "Email already exists"
 *    → User already registered
 *    → Solution: Use different email or login instead
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: SECURITY BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ What's Already Implemented:
 *
 * 1. Password Hashing:
 *    - bcryptjs with 10 salt rounds
 *    - Passwords never stored in plain text
 *
 * 2. JWT Token:
 *    - Signed with secret key
 *    - Contains user ID and issued time
 *    - Can verify authenticity
 *
 * 3. CORS Protection:
 *    - Only allowed origins can access API
 *    - Credentials included in requests
 *
 * 4. Token Verification:
 *    - Bearer schema validation
 *    - JWT signature verification
 *    - User existence check
 *
 * 5. Environment Variables:
 *    - Secrets stored in .env
 *    - Never hardcoded in source
 *
 * ⚠️ For Production:
 *
 * 1. Use HTTPS instead of HTTP
 * 2. Add token refresh mechanism
 * 3. Implement password reset
 * 4. Add email verification
 * 5. Rate limit login attempts
 * 6. Store tokens in HTTP-only cookies
 * 7. Implement 2FA (two-factor auth)
 * 8. Add logout on all devices
 * 9. Regular security audits
 * 10. Keep dependencies updated
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: QUICK TEST CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ POSTMAN TESTING CHECKLIST:
 *
 * [ ] 1. Login with munees@garmentx.com / Munees123
 * [ ] 2. Verify response contains token
 * [ ] 3. Copy token from response
 * [ ] 4. Create new request with Authorization header
 * [ ] 5. POST /api/products with image
 * [ ] 6. Verify product created successfully
 * [ ] 7. Try request WITHOUT token → should get 401
 * [ ] 8. Try with invalid token → should get 401
 * [ ] 9. GET /api/auth/profile with token → should work
 * [ ] 10. Register new user
 * [ ] 11. Login with new user
 * [ ] 12. Create product with new user token
 *
 * ✅ FRONTEND TESTING CHECKLIST:
 *
 * [ ] 1. Visit /login page
 * [ ] 2. Click "Demo User" button → fills email/password
 * [ ] 3. Click Login → should redirect to home
 * [ ] 4. Navbar shows logged-in user name
 * [ ] 5. Logout button appears
 * [ ] 6. Page refresh → user still logged in (token in localStorage)
 * [ ] 7. Open DevTools → Console should show no errors
 * [ ] 8. LocalStorage has "token" and "garmentx_user"
 * [ ] 9. Try accessing protected route without login → redirects to /login
 * [ ] 10. Click logout → localStorage cleared, user logged out
 */

module.exports = {
  TEST_ACCOUNTS,
};
