/**
 * 🔐 POSTMAN SETUP GUIDE - COMPLETE STEP BY STEP
 *
 * This guide shows EXACTLY how to fix the 401 Authorization error
 */

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: LOGIN AND GET TOKEN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * URL: http://localhost:5000/api/auth/login
 * Method: POST
 *
 * BODY (select "raw" and "JSON"):
 * {
 *   "email": "munees@garmentx.com",
 *   "password": "Munees123"
 * }
 *
 * Expected Response (200 OK):
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "Munees Ahmed",
 *   "email": "munees@garmentx.com",
 *   "role": "user",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcyODMyMjE3MH0.6tXfOzWp1c..."
 * }
 *
 * ✅ COPY THE TOKEN VALUE (the long string after "token": ")
 */

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: ADD TOKEN TO CREATE PRODUCT REQUEST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THIS IS THE CRITICAL PART - MOST COMMON MISTAKE:
 *
 * ❌ WRONG - Token in Body:
 * Body > form-data
 * Authorization | Bearer eyJ...
 * (This doesn't work!)
 *
 * ✅ CORRECT - Token in Headers:
 * Headers tab (NOT Body)
 * Key              | Value
 * ─────────────────────────────────────────────────────────────────────────
 * Authorization    | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type     | (Auto-generated for form-data - do NOT set manually)
 *
 *
 * KEY RULES:
 * 1. Authorization header MUST be in "Headers" tab, NOT "Body"
 * 2. Format MUST be: "Bearer <space> <token>"
 * 3. No quotes around the token
 * 4. Token must be the FULL string from login response
 * 5. Body type must be "form-data" (for file upload)
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE REQUEST EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

/*
┌─────────────────────────────────────────────────────────────────────────┐
│ POST http://localhost:5000/api/products                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ HEADERS TAB:                                                             │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Key              │ Value                                            │ │
│ │ ─────────────────┼──────────────────────────────────────────────── │ │
│ │ Authorization    │ Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ BODY TAB:                                                               │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Select: form-data                                                   │ │
│ │                                                                     │ │
│ │ Key              │ Value                                            │ │
│ │ ─────────────────┼──────────────────────────────────────────────── │ │
│ │ name             │ Premium Cotton T-Shirt                          │ │
│ │ description      │ High-quality soft cotton t-shirt                │ │
│ │ price            │ 599                                             │ │
│ │ category         │ men                                             │ │
│ │ stock            │ 100                                             │ │
│ │ sizes            │ ["S", "M", "L", "XL"]                          │ │
│ │ colors           │ ["White", "Black"]                              │ │
│ │ image            │ <Click "Select File" and choose image>          │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ SEND ──────────────────────────────────────────────────────────────→  │
│                                                                         │
│ Expected Response: 201 Created                                         │
│ {                                                                       │
│   "_id": "507f...",                                                    │
│   "name": "Premium Cotton T-Shirt",                                    │
│   "price": 599,                                                        │
│   "image": "https://res.cloudinary.com/..."                           │
│ }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════
// DEBUGGING CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * If you get 401 "Not authorized, no token provided":
 *
 * ❌ Check 1: Are you adding header in HEADERS tab? (NOT Body)
 *     Solution: Go to "Headers" tab and add Authorization header
 *
 * ❌ Check 2: Is the format correct? (Bearer <space> <token>)
 *     Solution: Must be exactly: Bearer eyJ... (with space after Bearer)
 *
 * ❌ Check 3: Did you copy the FULL token from login response?
 *     Solution: Copy entire token string, not just first part
 *
 * ❌ Check 4: Is there a trailing space or newline?
 *     Solution: Remove any spaces before/after token
 *
 * ❌ Check 5: Is the token expired? (login was too long ago)
 *     Solution: Login again and get a fresh token
 *
 * ✅ Check 6: Open browser DevTools → Network tab
 *     Look at request headers and verify Authorization is there
 *
 * ✅ Check 7: Backend should print detailed logs
 *     Check terminal where "npm run dev" is running
 *     Look for [🔐 AUTH MIDDLEWARE] logs
 */

// ═══════════════════════════════════════════════════════════════════════════
// BACKEND LOGS - WHAT TO LOOK FOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * When you send request with correct token, you should see:
 *
 * ✅ Good logs:
 *
 * [🔐 AUTH MIDDLEWARE - STEP 1: Check Header]
 * Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * [🔐 AUTH MIDDLEWARE - STEP 2: Parse Token]
 * Scheme: Bearer
 * Token provided: true
 *
 * [🔐 AUTH MIDDLEWARE - STEP 3: Verify JWT]
 * JWT_SECRET exists: true
 * ✅ Token verified successfully
 *
 * [🔐 AUTH MIDDLEWARE - STEP 4: Find User]
 * ✅ User found:
 * Name: Munees Ahmed
 * Email: munees@garmentx.com
 * Role: user
 *
 * [✅ AUTH MIDDLEWARE - SUCCESS]
 * User authenticated and attached to request
 *
 * [📦 CREATE PRODUCT - STEP 1: Validate Input]
 * name: Premium Cotton T-Shirt
 * price: 599
 * ✅ All validations passed
 *
 * [📦 CREATE PRODUCT - STEP 3: Save to MongoDB]
 * ✅ Product saved successfully
 * Product ID: 507f1f77bcf86cd799439012
 *
 * ❌ Bad logs (indicates problem):
 *
 * [🔐 AUTH MIDDLEWARE - STEP 1: Check Header]
 * Authorization Header: NOT PROVIDED   ← Missing header!
 * ❌ ERROR: No Authorization header found
 *
 * Solution: Add Authorization header in Postman Headers tab
 */

// ═══════════════════════════════════════════════════════════════════════════
// POSTMAN ENVIRONMENT VARIABLES (OPTIONAL BUT RECOMMENDED)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * To auto-save and reuse token in Postman:
 *
 * 1. In login request → Tests tab, add:
 *
 *    const data = pm.response.json();
 *    pm.environment.set('auth_token', data.token);
 *
 * 2. In product request → Headers tab, use variable:
 *
 *    Authorization | Bearer {{auth_token}}
 *
 *    (Postman will replace {{auth_token}} with actual token)
 *
 * 3. Click Login → Token auto-saved
 * 4. Click Create Product → Token auto-added ✅
 */

// ═══════════════════════════════════════════════════════════════════════════
// FRONTEND AXIOS EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * // src/services/api.js
 *
 * export async function createProduct(formData) {
 *   const token = localStorage.getItem('token');
 *
 *   try {
 *     const response = await axios.post(
 *       'http://localhost:5000/api/products',
 *       formData,
 *       {
 *         headers: {
 *           'Authorization': `Bearer ${token}`,
 *           'Content-Type': 'multipart/form-data'
 *         }
 *       }
 *     );
 *     return response.data;
 *   } catch (error) {
 *     console.error('Product creation failed:', error.response?.data);
 *     throw error;
 *   }
 * }
 *
 * // Usage in React component:
 *
 * import { createProduct } from '../services/api';
 *
 * const handleCreateProduct = async (formData) => {
 *   try {
 *     const result = await createProduct(formData);
 *     console.log('Product created:', result);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 */

// ═══════════════════════════════════════════════════════════════════════════
// CURL COMMAND EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * # Step 1: Login and get token
 * curl -X POST http://localhost:5000/api/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"munees@garmentx.com","password":"Munees123"}'
 *
 * # Response includes token, copy it
 *
 * # Step 2: Create product with token
 * curl -X POST http://localhost:5000/api/products \
 *   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
 *   -F "name=Cotton T-Shirt" \
 *   -F "description=Soft cotton shirt" \
 *   -F "price=599" \
 *   -F "category=men" \
 *   -F "stock=100" \
 *   -F "image=@/path/to/image.jpg"
 */

// ═══════════════════════════════════════════════════════════════════════════
// QUICK TROUBLESHOOTING FLOWCHART
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 * START: Try to create product
 *   ↓
 * Get 401 error?
 *   ├─ YES: Authorization header missing in Postman
 *   │       Solution: Add to Headers tab "Authorization: Bearer <token>"
 *   │
 *   └─ NO: Get 400 error?
 *         └─ YES: Missing required fields (name, description, price, etc)
 *                 Solution: Fill all required fields in Body
 *
 *              └─ NO: Get 500 error?
 *                    └─ YES: Server error, check backend logs
 *                           Solution: Check "[❌ CREATE PRODUCT - ERROR]" logs
 *
 *                        └─ NO: Success! ✅
 *                              Product created in MongoDB
 *                              Check terminal logs
 */

module.exports = {};
