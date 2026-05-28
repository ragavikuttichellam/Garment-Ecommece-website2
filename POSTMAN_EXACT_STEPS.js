/**
 * ✅ COMPLETE POSTMAN TESTING GUIDE - STEP BY STEP
 *
 * This shows EXACTLY how to test the auth system and create products
 * Follow these steps precisely to make it work
 */

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: LOGIN AND GET TOKEN (MOST IMPORTANT)
// ═══════════════════════════════════════════════════════════════════════════

/*
┌──────────────────────────────────────────────────────────────────────────┐
│ REQUEST 1: LOGIN                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ URL: http://localhost:5000/api/auth/login                               │
│ Method: POST                                                             │
│                                                                           │
│ HEADERS (Auto-added):                                                    │
│   Content-Type: application/json                                         │
│                                                                           │
│ BODY (Select: raw, JSON):                                               │
│ {                                                                         │
│   "email": "admin@garmentx.com",                                         │
│   "password": "admin123"                                                 │
│ }                                                                         │
│                                                                           │
│ SEND ──────→ Get response with TOKEN                                    │
│                                                                           │
│ RESPONSE (200 OK):                                                       │
│ {                                                                         │
│   "_id": "6a01d76ca274a5da05c1c97d",                                    │
│   "name": "Admin User",                                                  │
│   "email": "admin@garmentx.com",                                         │
│   "role": "admin",                                                       │
│   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDFkNzZj..."│
│ }                                                                         │
│                                                                           │
│ ✅ COPY THE ENTIRE TOKEN STRING                                          │
│    (from "eyJ..." to the end)                                            │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: CREATE PRODUCT WITH TOKEN (THE KEY ISSUE FIX)
// ═══════════════════════════════════════════════════════════════════════════

/*
┌──────────────────────────────────────────────────────────────────────────┐
│ REQUEST 2: CREATE PRODUCT                                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ URL: http://localhost:5000/api/products                                 │
│ Method: POST                                                             │
│                                                                           │
│ HEADERS TAB - CRITICAL!                                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Key                | Value                                          │ │
│ │ ───────────────────┼─────────────────────────────────────────────── │ │
│ │ Authorization      | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ │
│ │ (Paste your token) |                                               │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ BODY TAB - CRITICAL!                                                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ SELECT: form-data (NOT raw, NOT JSON)                              │ │
│ │                                                                     │ │
│ │ ADD THESE FIELDS (EXACT NAMES - case sensitive):                   │ │
│ │                                                                     │ │
│ │ KEY              | VALUE TYPE | VALUE                              │ │
│ │ ─────────────────┼────────────┼────────────────────────────────── │ │
│ │ name             | Text       | Cotton T-Shirt                      │ │
│ │ description      | Text       | High-quality soft cotton t-shirt    │ │
│ │ price            | Text       | 599                                 │ │
│ │ originalPrice    | Text       | 999                                 │ │
│ │ category         | Text       | men                                 │ │
│ │ stock            | Text       | 100                                 │ │
│ │ brand            | Text       | GarmentX                            │ │
│ │ sizes            | Text       | ["S","M","L","XL"]                 │ │
│ │ colors           | Text       | ["White","Black","Blue"]            │ │
│ │ discount         | Text       | 40                                  │ │
│ │ image            | File       | <SELECT YOUR IMAGE FILE>            │ │
│ │                  |            | (Click "Select Files" button)       │ │
│ │ tags             | Text       | ["bestseller","new"]                │ │
│ │                  |            | (Optional)                          │ │
│ │                  |            | (Leave empty if not needed)         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ SEND ──────→ Product created!                                           │
│                                                                           │
│ RESPONSE (201 Created):                                                 │
│ {                                                                         │
│   "_id": "507f1f77bcf86cd799439012",                                    │
│   "name": "Cotton T-Shirt",                                              │
│   "price": 599,                                                          │
│   "image": "https://res.cloudinary.com/dammkjmb5/image/upload/v177..."  │
│ }                                                                         │
│                                                                           │
│ ✅ PRODUCT CREATED SUCCESSFULLY!                                         │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════
// COMMON POSTMAN MISTAKES & FIXES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ❌ MISTAKE 1: Authorization in Body instead of Headers
 *
 * ❌ WRONG:
 * Body (form-data):
 * Authorization | Bearer eyJ...
 *
 * ✅ CORRECT:
 * Headers:
 * Authorization | Bearer eyJ...
 */

/**
 * ❌ MISTAKE 2: Forgot to select form-data for file upload
 *
 * ❌ WRONG:
 * Body (raw, JSON):
 * {
 *   "name": "T-Shirt",
 *   ...
 * }
 *
 * ✅ CORRECT:
 * Body (form-data):
 * name | T-Shirt
 * (no JSON quotes needed for form-data)
 */

/**
 * ❌ MISTAKE 3: Field names don't match backend expects
 *
 * ❌ WRONG field names:
 * productName (instead of "name")
 * description_text (instead of "description")
 * prod_price (instead of "price")
 * cat (instead of "category")
 * prod_stock (instead of "stock")
 *
 * ✅ CORRECT field names (MUST match exactly):
 * name
 * description
 * price
 * category
 * stock
 * (case sensitive!)
 */

/**
 * ❌ MISTAKE 4: Token format wrong
 *
 * ❌ WRONG:
 * Authorization: eyJ...  (missing "Bearer ")
 * Authorization: bearer eyJ...  (lowercase "bearer")
 * Authorization: "Bearer eyJ..."  (with quotes)
 *
 * ✅ CORRECT:
 * Authorization: Bearer eyJ...  (with space after Bearer)
 * (uppercase Bearer, then space, then token)
 */

/**
 * ❌ MISTAKE 5: Token has extra spaces or quotes
 *
 * ❌ WRONG:
 * Authorization: Bearer 'eyJ...'  (with quotes)
 * Authorization: Bearer eyJ... '  (extra quote at end)
 * Authorization: Bearer  eyJ...  (double space)
 *
 * ✅ CORRECT:
 * Authorization: Bearer eyJ...  (clean, no extra chars)
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEBUGGING: CHECK BACKEND LOGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * When you hit SEND, check the terminal where "npm run dev" is running
 *
 * ✅ GOOD LOGS (means it worked):
 *
 * [🔐 AUTH MIDDLEWARE - STEP 1: Check Header]
 * Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsI...
 *
 * [🔐 AUTH MIDDLEWARE - STEP 2: Parse Token]
 * Scheme: Bearer
 * Token provided: true
 *
 * [🔐 AUTH MIDDLEWARE - STEP 3: Verify JWT]
 * ✅ Token verified successfully
 *
 * [🔐 AUTH MIDDLEWARE - STEP 4: Find User]
 * ✅ User found:
 * Name: Admin User
 *
 * [📦 CREATE PRODUCT - STEP 1: Validate Input]
 * name: Cotton T-Shirt      ← NAME IS HERE!
 * description: High-quality...
 * price: 599
 * category: men             ← CATEGORY IS HERE!
 * stock: 100                ← STOCK IS HERE!
 * ✅ All validations passed
 *
 * [📦 CREATE PRODUCT - STEP 3: Save to MongoDB]
 * ✅ Product saved successfully
 *
 *
 * ❌ BAD LOGS (means something wrong):
 *
 * Authorization Header: NOT PROVIDED
 * → Fix: Add Authorization header in Headers tab
 *
 * Token verification error: jwt malformed
 * → Fix: Token has extra spaces or quotes, paste clean token
 *
 * name: undefined
 * description: undefined
 * category: undefined
 * → Fix: Change Body from "raw" to "form-data"
 *        Make sure field names are exact (case sensitive)
 */

// ═══════════════════════════════════════════════════════════════════════════
// POSTMAN COLLECTION IMPORT (AUTOMATED)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * If you want Postman to auto-save and reuse the token:
 *
 * 1. In Login request → Tests tab, paste:
 *
 * const response = pm.response.json();
 * if (response.token) {
 *   pm.environment.set('token', response.token);
 *   console.log('✅ Token saved to: {{token}}');
 * }
 *
 * 2. In Create Product request → Headers:
 *
 * Authorization | Bearer {{token}}
 *
 * Now:
 * - Click Login → Token auto-saved
 * - Click Create Product → Token auto-added ✅
 */

// ═══════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING FLOWCHART
// ═══════════════════════════════════════════════════════════════════════════

/**
 *
 * START: Try Create Product
 *   ↓
 * Get 401 "Not authorized, no token provided"?
 *   ├─ YES: Add Authorization header in Headers tab
 *   │       Format: Bearer <token>
 *   │       Click Send again
 *   │
 *   └─ NO: Get 400 "Missing required fields"?
 *         ├─ YES: Check Body is set to form-data
 *         │       Fill: name, description, price, category, stock
 *         │       Field names must be EXACT (case sensitive)
 *         │       Click Send again
 *         │
 *         └─ NO: Get 201 Created?
 *               ✅ SUCCESS!
 *               Product saved to MongoDB
 *               Check http://localhost:5173/ to see product
 *
 * If you get errors, check the logs in the terminal where "npm run dev" runs
 */

module.exports = {};
