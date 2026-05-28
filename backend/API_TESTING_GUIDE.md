# Backend API Testing Guide

## ✅ Server Status
The backend server is running on **http://localhost:5000**

---

## 🔐 Step 1: Register Admin User (First User)

The first user registered will automatically become an **admin** (can add products).

### Request:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Expected Response (201 Created):
```json
{
  "_id": "user_id_here",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

⚠️ **IMPORTANT**: Copy the `token` value - you'll need it for adding products!

---

## 🔑 Step 2: Login (If You Already Have an Account)

### Request:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Expected Response (200 OK):
```json
{
  "_id": "user_id_here",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📦 Step 3: Add Product (Requires Admin Token)

Use the token from registration or login response.

### Request:
```
POST http://localhost:5000/api/products
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "name": "Casual T-Shirt",
  "description": "100% cotton comfortable casual t-shirt",
  "price": 29.99,
  "category": "Clothing",
  "brand": "StyleCo",
  "images": ["https://example.com/tshirt1.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "White"],
  "stock": 50
}
```

### Expected Response (201 Created):
```json
{
  "_id": "product_id",
  "name": "Casual T-Shirt",
  "description": "100% cotton comfortable casual t-shirt",
  "price": 29.99,
  "category": "Clothing",
  "brand": "StyleCo",
  "images": ["https://example.com/tshirt1.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "White"],
  "stock": 50,
  "createdAt": "2024-04-29T10:30:00.000Z"
}
```

---

## ⚠️ Common Errors & Solutions

### Error: "Not authorized, no token provided"
**Cause**: Missing Authorization header
**Solution**: Add `Authorization: Bearer YOUR_TOKEN_HERE` to request headers

### Error: "Not authorized as admin"
**Cause**: User role is not 'admin'
**Solution**: Register as the first user to get admin privileges, or ask an admin to promote you

### Error: "Missing required fields"
**Cause**: Missing name, description, price, category, or stock
**Solution**: Ensure all required fields are present in the request body

### Error: "Invalid email or password"
**Cause**: Wrong credentials during login
**Solution**: Check email and password are correct

---

## 🧪 Using Postman (Recommended)

1. **Open Postman**
2. **Create new request**
3. **Method**: POST
4. **URL**: http://localhost:5000/api/auth/register
5. **Headers**: Set `Content-Type: application/json`
6. **Body**: Select `raw` and paste JSON
7. **Send** and copy the token from response

For product creation:
1. **Method**: POST
2. **URL**: http://localhost:5000/api/products
3. **Headers**:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN_HERE`
4. **Body**: Product JSON
5. **Send**

---

## 📊 Server Console Output

When requests come in, you'll see debug logs like:
```
[2024-04-29T10:30:00.000Z] POST /api/auth/register
User registered: admin@example.com, Role: admin, Token generated: eyJhbGciOiJIUzI1NiIs...

[2024-04-29T10:31:00.000Z] POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## ✅ All Endpoints

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login existing user |
| GET | `/api/auth/profile` | Yes | Get current user profile |
| GET | `/api/products` | No | Get all products |
| GET | `/api/products/:id` | No | Get single product |
| POST | `/api/products` | Yes (Admin) | Create product |
| PUT | `/api/products/:id` | Yes (Admin) | Update product |
| DELETE | `/api/products/:id` | Yes (Admin) | Delete product |
| GET | `/api/cart` | Yes | Get user cart |
| POST | `/api/cart` | Yes | Add to cart |
| PUT | `/api/cart/:id` | Yes | Update cart item |
| DELETE | `/api/cart/:id` | Yes | Remove from cart |
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders` | Yes | Get user orders |
| GET | `/api/admin/users` | Yes (Admin) | Get all users |
| PUT | `/api/admin/users/:id/role` | Yes (Admin) | Update user role |
| DELETE | `/api/admin/users/:id` | Yes (Admin) | Delete user |

---

## 🐛 Debugging Tips

1. **Check server console** for error messages
2. **Verify token** is copied correctly (no extra spaces)
3. **Ensure MongoDB** is running locally
4. **Use Postman** to test endpoints (easier than curl)
5. **Check request headers** - Authorization header is case-sensitive
