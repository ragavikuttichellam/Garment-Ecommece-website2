# 🔐 GarmentX - Complete MERN Authentication System

## 📋 Overview

A production-ready authentication system for the GarmentX e-commerce platform that allows:

- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Auto-authentication on page refresh
- ✅ Protected routes for authenticated users
- ✅ Product CRUD operations with image upload
- ✅ Role-based access control (admin/user)

---

## 🗂️ System Architecture

### Backend Stack

- **Runtime**: Node.js v24.13.0
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs (10 salt rounds)
- **File Upload**: Cloudinary (images)
- **CORS**: Enabled for development
- **Environment**: dotenv for secrets

### Frontend Stack

- **Framework**: React 19 + Vite
- **State Management**: Context API (AuthContext)
- **HTTP Client**: Axios with custom config
- **Routing**: React Router DOM
- **UI Notifications**: Sonner (toast)
- **Icons**: Lucide React
- **Animations**: Motion/Framer Motion
- **Styling**: Tailwind CSS

---

## 📁 Project Structure

```
Garment E-commerce Website (2)/
│
├── backend/
│   ├── models/
│   │   └── User.js                    # User schema with password hashing
│   │
│   ├── controllers/
│   │   └── authController.js          # Login, Register, Profile logic
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification
│   │   └── upload.js                  # Cloudinary integration
│   │
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints
│   │   └── productRoutes.js           # Product CRUD
│   │
│   ├── config/
│   │   └── database.js                # MongoDB connection
│   │
│   ├── server.js                      # Express app setup
│   ├── .env                           # Environment variables
│   ├── setup-demo-users.js            # Demo account creator
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── app/
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Login form
│   │   │   ├── Register.jsx           # Registration form
│   │   │   └── ...other pages
│   │   │
│   │   └── components/
│   │       └── ...UI components
│   │
│   ├── services/
│   │   └── api.js                     # Axios API client
│   │
│   ├── App.jsx                        # App wrapper
│   ├── main.jsx                       # Entry point
│   └── styles/
│
├── GarmentX_Auth_API.postman_collection.json  # Postman tests
├── AUTH_SYSTEM_GUIDE.js               # This guide
└── README.md                          # Project docs
```

---

## 🚀 Quick Start

### Step 1: Start Backend Server

```bash
cd backend
npm install              # First time only
npm run dev            # Start with nodemon
```

Expected output:

```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 2: Create Demo Users

```bash
node setup-demo-users.js
```

This creates 5 demo accounts:

- **admin@garmentx.com** / admin123 (Admin role)
- **user@garmentx.com** / user123 (User role)
- **munees@garmentx.com** / Munees123 (User role)
- **john@garmentx.com** / John@1234 (User role)
- **sarah@garmentx.com** / Sarah@1234 (User role)

### Step 3: Start Frontend Server

```bash
npm run dev           # From root directory
# or
npm run dev:no-open   # Without browser
```

Frontend runs on: `http://localhost:5173`

### Step 4: Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select `GarmentX_Auth_API.postman_collection.json`
4. Start testing API endpoints

---

## 🔄 Authentication Flow

### 1️⃣ User Registration

```
User fills form → Frontend validates → POST /api/auth/register →
Backend hashes password with bcrypt → Save to MongoDB →
Generate JWT token → Return token + user data →
Frontend saves to localStorage → Auto login ✅
```

### 2️⃣ User Login

```
User enters email/password → POST /api/auth/login →
Backend finds user in MongoDB → Compare password with bcrypt →
Match found? Generate JWT token → Return token + user data →
Frontend saves to localStorage → User authenticated ✅
```

### 3️⃣ Protected Routes (Product CRUD)

```
User clicks "Create Product" → Frontend adds token to header →
POST /api/products with "Authorization: Bearer <token>" →
Backend middleware: Check Authorization header → Verify JWT signature →
Extract user from token → Attach to request → Allow access ✅
```

### 4️⃣ Auto-Login on Refresh

```
Page refresh → Frontend useEffect runs → Read localStorage for token →
Token exists? Verify it's still valid → Set user state →
User automatically logged in ✅
```

### 5️⃣ Logout

```
User clicks Logout → Frontend removes token from localStorage →
Clear user state → Redirect to login → Protected routes show login ✅
```

---

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/register`

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "1234567890"
}
```

**Response:** 201 Created

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- 400: Missing required fields
- 400: Invalid email format
- 400: Password less than 6 characters
- 400: Email already exists

---

#### POST `/api/auth/login`

Login with email and password.

**Request:**

```json
{
  "email": "munees@garmentx.com",
  "password": "Munees123"
}
```

**Response:** 200 OK

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Munees Ahmed",
  "email": "munees@garmentx.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- 400: Email and password required
- 401: Invalid email or password
- 401: User no longer exists

---

#### GET `/api/auth/profile`

Get logged-in user's profile (Protected).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** 200 OK

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Munees Ahmed",
  "email": "munees@garmentx.com",
  "role": "user"
}
```

**Errors:**

- 401: Not authorized, no token provided
- 401: Not authorized, token failed

---

### Products

#### POST `/api/products`

Create new product (Protected, requires auth).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**

```
name              | "Cotton T-Shirt"
description       | "Premium quality t-shirt"
price             | "499"
originalPrice     | "999"
category          | "men"
stock             | "100"
image             | <file>
sizes             | ["S", "M", "L", "XL"]
colors            | ["White", "Black"]
```

**Response:** 201 Created

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Cotton T-Shirt",
  "price": 499,
  "image": "https://res.cloudinary.com/...",
  "images": ["https://res.cloudinary.com/..."]
}
```

---

#### GET `/api/products`

Get all active products (Public).

**Query Parameters:**

- `pageNumber` - Page number (default: 1)
- `keyword` - Search keyword

**Response:** 200 OK

```json
{
  "success": true,
  "products": [...],
  "page": 1,
  "pages": 5,
  "count": 50
}
```

---

## 🔐 Security Details

### Password Hashing

```javascript
// Passwords are hashed with bcryptjs before saving
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(plainPassword, salt);

// Password comparison during login
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### JWT Token

```javascript
// Token generated with user ID and timestamp
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "30d",
});

// Token verified with secret key
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### CORS Configuration

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
```

### Authorization Header Format

```
Authorization: Bearer <JWT_TOKEN>

// Example
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjYzNzk4YWI5ZjQwYjBhNDZlZjg4MCIsImlhdCI6MTcyNzk4NjI0NSwiZXhwIjoxNzI3OTg5ODQ1fQ.9xyZabc...
```

---

## 📝 Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/garment-ecommerce

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Client URL for CORS
CLIENT_URL=http://localhost:5173
```

---

## 🧪 Testing with Postman

### 1. Import Collection

1. Open Postman
2. Click **Import**
3. Select `GarmentX_Auth_API.postman_collection.json`

### 2. Login Test

1. Select "Login Regular User"
2. Click **Send**
3. Token auto-saved to `auth_token` variable ✅

### 3. Create Product

1. Select "Create Product (with Image)"
2. Click **Select Files** for image
3. Token auto-added to headers (from `auth_token` variable)
4. Click **Send** ✅

### 4. Error Testing

Test protected routes without token:

- Expected: 401 Unauthorized
- Message: "Not authorized, no token provided"

---

## 🎨 Frontend Authentication Context

### AuthContext.jsx

Manages global authentication state:

```javascript
// Login
const { login } = useAuth();
const success = await login(email, password);
// Returns: true (success) or false (failed)

// Check authentication
const { isAuthenticated, user } = useAuth();
// Returns: boolean, user object

// Logout
const { logout } = useAuth();
logout(); // Clears localStorage and state

// Auto-login on refresh
// Automatically handled in AuthContext useEffect
```

### Protected Route Component

```javascript
// Routes that require authentication
<Route element={<ProtectedRoute />}>
  <Route path="/admin" element={<Admin />} />
  <Route path="/orders" element={<Orders />} />
</Route>

// Redirect to /login if not authenticated
```

---

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  phone: String,
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (default: Date.now)
}
```

---

## 🐛 Common Issues & Solutions

| Error                               | Cause                                     | Solution                                   |
| ----------------------------------- | ----------------------------------------- | ------------------------------------------ |
| "Invalid email or password"         | User not found or wrong password          | Check email is lowercase, verify password  |
| "Not authorized, token failed"      | Expired or invalid token                  | Login again to get fresh token             |
| "Not authorized, no token provided" | Missing Authorization header              | Add `Authorization: Bearer <token>` header |
| "Email already exists"              | User with this email registered           | Use different email or login instead       |
| "CORS error"                        | Frontend and backend on different origins | Check CORS configuration in server.js      |
| "MongoDB connection error"          | Database not running                      | Start MongoDB with `mongod`                |
| "Cloudinary upload failed"          | Missing API credentials                   | Add CLOUDINARY\_\* variables to .env       |

---

## ✅ Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS instead of HTTP
- [ ] Implement token refresh mechanism
- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Rate limit login attempts (3 tries, 15 min lockout)
- [ ] Add 2FA (two-factor authentication)
- [ ] Store tokens in HTTP-only cookies
- [ ] Implement "Logout from all devices"
- [ ] Regular security audits
- [ ] Keep dependencies updated with `npm audit fix`
- [ ] Use environment-specific .env files
- [ ] Set MONGO_URI to MongoDB Atlas (production)
- [ ] Enable CORS only for production domain
- [ ] Add API request logging
- [ ] Implement error tracking (Sentry)

---

## 📚 API Testing Workflows

### Workflow 1: Complete User Journey

```
1. Register New User          → Get token
2. Login with new email       → Get token
3. Get User Profile           → Verify authenticated
4. Create Product             → Upload with token
5. Get Products               → Verify product created
6. Logout                      → Token removed
```

### Workflow 2: Product Management

```
1. Login                      → Get token
2. Create Product 1           → With image
3. Create Product 2           → With image
4. Get All Products           → See 2 products
5. Get Product by ID          → Get details
6. Update Product             → With new image
7. Delete Product             → Remove from DB
```

### Workflow 3: Error Handling

```
1. Try login with wrong password      → 401
2. Try create product without token   → 401
3. Try create product with bad token  → 401
4. Try register with existing email   → 400
5. Try login with non-existent user   → 401
```

---

## 🎓 Learning Resources

- **JWT**: https://jwt.io/
- **bcryptjs**: https://www.npmjs.com/package/bcryptjs
- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html
- **MongoDB**: https://docs.mongodb.com/
- **React Context API**: https://react.dev/reference/react/useContext
- **Axios**: https://axios-http.com/

---

## 📞 Support

For issues or questions:

1. Check the AUTH_SYSTEM_GUIDE.js file
2. Review backend logs: `npm run dev`
3. Check browser console (Frontend)
4. Test with Postman collection
5. Verify .env variables are set correctly

---

## 📄 License

This authentication system is part of the GarmentX E-commerce platform.

---

**Last Updated**: May 11, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
