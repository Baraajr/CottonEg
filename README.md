# CottonEg

CottonEg is a production-oriented full-stack fashion e-commerce platform built with the MERN stack, featuring secure authentication, real-world checkout and payment workflows, product variants, order management, administration, automated API testing, and integrations with Redis, Stripe, Cloudinary, and Google OAuth.

## Live Demo

**Frontend:** https://cotton-eg-fogt-pi.vercel.app/

---

## Features

### Customer

* Browse products by category and subcategory
* Product search, filtering, sorting, and pagination
* Product variants with sizes and colors
* Product image galleries
* Shopping cart
* Wishlist
* Product reviews and ratings
* Address management
* Coupon codes
* Checkout and online payments
* Order creation and order history
* User profile management
* Email verification
* Forgot/reset password
* Google authentication
* Responsive UI for desktop and mobile

### Authentication & Authorization

* JWT authentication
* HTTP-only authentication cookies
* Protected routes
* Role-based authorization
* Email verification
* Password reset flow
* Google OAuth
* Account activation/deactivation
* Password-change token invalidation

### Admin

* Product management
* Product variant management
* Category and subcategory management
* Order management
* User management
* Coupon management
* Review management
* Sales and store dashboard
* Product image management

### Backend

* RESTful API
* MongoDB with Mongoose
* Cloudinary image uploads
* Stripe checkout integration
* Redis support
* Email delivery with Nodemailer
* Request validation
* Global error handling
* Rate limiting
* MongoDB query sanitization
* XSS protection
* HTTP parameter pollution protection
* Response compression
* CORS configuration
* Request logging

---

## Tech Stack

### Frontend

* React 19
* Vite
* React Router
* React Query
* React Hook Form
* Axios
* Tailwind CSS
* Framer Motion
* React Hot Toast
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Passport.js
* Google OAuth 2.0
* Stripe
* Cloudinary
* Nodemailer
* Multer
* Sharp

### Testing & Code Quality

* Jest
* Supertest
* MongoDB Memory Server
* ESLint
* Prettier

---

## Architecture

CottonEg follows a separated client/server architecture:

```text
CottonEg
│
├── client/                 # React frontend
│   ├── public/
│   └── src/
│
└── server/                 # Express REST API
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── tests/
    ├── utils/
    └── app.js
```

The frontend communicates with the backend through REST APIs.

```text
┌─────────────────────┐
│     React Client    │
│                     │
│ React Query         │
│ Axios               │
│ React Router        │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│    Express Server   │
│                     │
│ Routes              │
│ Controllers         │
│ Middleware          │
│ Authentication      │
└──────────┬──────────┘
           │
 ┌─────────────────┐
 ▼                 ▼
 MongoDB        Cloudinary
     │
     ▼
 Orders / Products /
 Users / Reviews
```

---

## API Modules

The API is organized into independent resource routes:

```text
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/subcategories
/api/v1/reviews
/api/v1/wishlist
/api/v1/addresses
/api/v1/coupons
/api/v1/cart
/api/v1/orders
/api/v1/dashboard
```

---

## Product System

Products support:

* Name and description
* Price and discounted price
* Categories and subcategories
* Multiple images
* Cover image
* Sizes
* Colors
* Stock quantities
* SKU/variant information
* Seasons
* Materials
* Fit types
* Tags
* Featured products
* Active/inactive products

Product images are uploaded to Cloudinary and stored as secure URLs.

---

## Authentication Flow

```text
Register
   │
   ▼
Email Verification
   │
   ▼
Login ───────► JWT
                │
                ▼
          HTTP-only Cookie
                │
                ▼
       Protected API Routes
```

Authentication supports both traditional email/password authentication and Google OAuth.

---

## Checkout & Orders

The checkout system supports:

1. Cart validation
2. Address selection
3. Coupon application
4. Order creation
5. Stripe payment
6. Payment webhook handling
7. Order status management

Stripe webhooks are handled separately to verify successful payments on the backend.

---

## Security

The backend includes several security layers:

* JWT authentication
* HTTP-only cookies
* CORS configuration
* Express rate limiting
* MongoDB query sanitization
* XSS protection
* HPP protection
* Request body limits
* Role-based authorization
* Password hashing with bcrypt
* Password reset token expiration
* Email verification token expiration
* Account activation checks

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Baraajr/CottonEg.git
cd CottonEg
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=30

FRONT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_URL=your_redis_url

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Email
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
```

Do not commit your `.env` file.

---

## Running Locally

### Start the backend

```bash
cd server
npm run dev
```

The API will run on your configured backend port.

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will start the development server.

---

## Production Build

Build the frontend:

```bash
cd client
npm run build
```

Start the backend:

```bash
cd server
npm start
```

---

## Testing

The backend uses Jest, Supertest, and MongoDB Memory Server for automated API testing.

Run the test suite with:

```bash
cd server
npm test
```

Tests cover API behavior without requiring a production MongoDB database.

---

## Code Quality

Lint the frontend:

```bash
cd client
npm run lint
```

The backend also follows ESLint and Prettier configuration for consistent code style.

---

## Deployment

The project is structured so the frontend and backend can be deployed independently.

The current frontend deployment uses Vercel.

Environment variables must be configured in the deployment environment before starting the application.

---

## Project Goals

CottonEg was built to demonstrate a production-oriented full-stack e-commerce architecture using the MERN stack.

The project focuses on:

* Clean REST API design
* Secure authentication
* Real-world e-commerce workflows
* Scalable backend organization
* Reusable React components
* Server-side validation
* Error handling
* Automated API testing
* Third-party service integration
* Production deployment

---

## Future Improvements

* Advanced product recommendations
* Improved analytics
* Inventory management
* Order tracking
* More extensive automated test coverage
* CI/CD pipeline
* Improved caching strategy
* Advanced admin analytics
* Notifications system

---

## Author

**Baraa**

Full-Stack Developer focused on React, Node.js, Express, MongoDB, and modern web application architecture.

GitHub: https://github.com/Baraajr

---

## License

This project is licensed under the ISC License.
