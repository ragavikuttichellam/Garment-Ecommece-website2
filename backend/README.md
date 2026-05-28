# Garment E-commerce Backend

A complete backend API for a garment e-commerce website built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Product Management**: CRUD operations for products (admin only)
- **Cart Management**: Add, update, remove items from cart
- **Order Processing**: Place orders, view order history, update order status
- **Admin Panel**: Manage users, products, and orders

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root directory and add the following environment variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/garment-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start MongoDB service (if running locally)

5. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/products` - Get all products (admin only)

## Data Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (user/admin)

### Product
- name: String
- description: String
- price: Number
- category: String
- brand: String
- images: Array of Strings
- sizes: Array of Strings
- colors: Array of Strings
- stock: Number
- isActive: Boolean

### Cart
- user: ObjectId (ref: User)
- items: Array of cart items
  - product: ObjectId (ref: Product)
  - quantity: Number
  - size: String
  - color: String

### Order
- user: ObjectId (ref: User)
- items: Array of order items
  - product: ObjectId (ref: Product)
  - quantity: Number
  - size: String
  - color: String
  - price: Number
- totalAmount: Number
- shippingAddress: Object
- paymentMethod: String
- status: String

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Admin-only routes
- Input validation with express-validator
- CORS enabled for frontend integration

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.