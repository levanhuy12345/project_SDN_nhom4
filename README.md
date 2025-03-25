#   🏀 Shoe Store Server

This is the backend server for the Nike Shoe Store Management System, built with Node.js, Express, and MongoDB. It provides a RESTful API for managing users, products, orders, payments, and blogs.

## Installation

1. Clone repository:

```bash
git clone <repository-url>
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create .env file in root directory and add environment variables:

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

## Directory Structure

server/
├── src/
│ ├── config/ # Database and service configurations
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Middleware (auth, upload, etc.)
│ ├── models/ # Mongoose models
│ ├── routes/ # Route definitions
│ └── index.js # Entry point
├── .env # Environment variables
└── package.json

## API Endpoints

### Authentication

-   `POST /api/register` - Register new account
-   `POST /api/login` - Login
-   `POST /api/logout` - Logout
-   `GET /api/auth` - Check authentication

### Users

-   `GET /api/getalluser` - Get all users (Admin only)
-   `DELETE /api/deleteuser` - Delete user (Admin only)
-   `POST /api/updateavatar` - Update avatar
-   `POST /api/forgotpassword` - Forgot password
-   `POST /api/resetpassword` - Reset password

### Products

-   `GET /api/products` - Get product list
-   `POST /api/addproduct` - Add new product (Admin only)
-   `GET /api/product` - Get product details
-   `GET /api/search` - Search products
-   `POST /api/editpro` - Edit product (Admin only)
-   `DELETE /api/deleteproduct` - Delete product (Admin only)

### Cart

-   `POST /api/addtocart` - Add to cart
-   `GET /api/cart` - Get cart
-   `POST /api/deletecart` - Remove item from cart

### Blog

-   `GET /api/blogs` - Get blog posts
-   `GET /api/blogs/:id` - Get blog post details
-   `POST /api/blogs` - Create new blog post (Admin only)
-   `PUT /api/blogs/:id` - Update blog post (Admin only)
-   `DELETE /api/blogs/:id` - Delete blog post (Admin only)
-   `POST /api/blogs/:id/comments` - Add comment
-   `POST /api/blogs/:id/like` - Like blog post

### Payment

-   `POST /api/payment` - Process payment
-   `GET /api/payments` - Get payment history
-   `POST /api/paymentcod` - Cash on delivery payment
-   `POST /api/cancelorder` - Cancel order

## Middleware

### Authentication Middleware

-   `verifyToken` - Verify user token
-   `verifyTokenAdmin` - Verify admin privileges

### Upload Middleware

-   Handle file uploads with multer
-   Cloudinary integration for image storage

## Models

### User Model

-   fullname: String (required)
-   email: String (required, unique)
-   password: String (required)
-   phone: String (required)
-   isAdmin: Boolean (default: false)
-   avatar: String
-   surplus: Number (default: 0)

### Product Model

-   name: String (required)
-   price: Number (required)
-   description: String
-   image: String
-   category: String
-   size: Array
-   quantity: Number

### Cart Model

-   user: String (required)
-   products: Array
-   sumprice: Number
-   phone: String

### Blog Model

-   title: String (required)
-   content: String (required)
-   author: String (required)
-   category: String
-   image: String
-   comments: Array
-   likes: Number
-   status: String

## Scripts

```bash
# Run in development environment
npm run dev

# Run in production environment
npm start
```

## Main Dependencies

-   express
-   mongoose
-   jsonwebtoken
-   bcrypt
-   cloudinary
-   multer
-   dotenv
-   cors
-   cookie-parser

## Security

-   JWT authentication
-   Password hashing with bcrypt
-   CORS configuration
-   Cookie-based authentication
-   Protected routes with middleware

## Notes

-   Ensure MongoDB is running before starting the server
-   Configure Cloudinary for image uploads
-   Set up environment variables in .env file
-   Check access permissions for protected routes
