# Webbshop 2026 Backend

Backend API for the Webbshop 2026 project, built with MongoDB, Express, and Node.js.

The API handles:

- product and variant listing
- JWT-based authentication
- user profile and wishlist management
- order creation
- admin product, variant, user, and order management
- server-sent events for product updates
- scheduled publishing of upcoming products

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

If you are using PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your own values.

Required variables:

- `PORT` - local server port, defaults to `3000`
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - secret used for access tokens
- `JWT_REFRESH_SECRET` - secret used for refresh tokens
- `CRON_SECRET` - required if you want to call the cron endpoint securely

### 3. Start MongoDB

Use either:

- a local MongoDB server
- MongoDB Atlas

### 4. Run the API

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default local URL:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm start
```

## API Overview

### Public endpoints

- `GET /` - API info
- `GET /health` - health check
- `GET /products` - list all products
- `GET /products/:id` - get one product
- `GET /products/:id/variants` - get variants for one product
- `GET /products/events` - SSE stream for product updates
- `GET /variants` - list all variants
- `GET /variants/product/:productId` - get variants by product ID
- `GET /variants/:id` - get one variant
- `POST /auth/register` - register a user
- `POST /auth/login` - log in a user
- `POST /auth/refresh` - issue a new access token from a refresh token

### Authenticated user endpoints

These routes require a valid bearer token.

- `GET /users/me` - get current user
- `PUT /users/me` - update current user
- `GET /users/me/wishlist` - get wishlist
- `POST /users/me/wishlist` - add product or variant to wishlist
- `DELETE /users/me/wishlist` - remove product or variant from wishlist
- `GET /orders/me` - get current user's orders
- `POST /orders` - create a new order

### Admin endpoints

These routes require both authentication and admin access.

- `GET /admin/orders`
- `PUT /admin/orders/:id/status`
- `PUT /admin/orders/:id`
- `DELETE /admin/orders/:id`
- `GET /admin/users`
- `GET /admin/users/email/:email`
- `GET /admin/users/:id`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/variants`
- `PUT /admin/variants/:id/stock`
- `DELETE /admin/variants/:id`
- `POST /admin/products/publish-scheduled`

### Cron endpoint

The cron route is protected with `CRON_SECRET` via the `Authorization` header:

```http
Authorization: Bearer your-cron-secret
```

Endpoint:

- `GET /cron/publish-scheduled-products`

## Authentication

After `POST /auth/register` or `POST /auth/login`, the API returns:

- `accessToken`
- `refreshToken`
- user information

Use the access token in requests like this:

```http
Authorization: Bearer <accessToken>
```

## Server-Sent Events

`GET /products/events` opens an SSE connection used for live product updates.

Events are sent when, for example:

- variant stock changes
- a product is created, updated, or deleted
- a product becomes sold out
- a scheduled product is published

## Seeding Data

There is a seed file at [src/db/seed.js](C:/Users/Samuel/Desktop/WEBB25/Backend%201/webbshop-2026-be/src/db/seed.js).

Run it manually with:

```bash
node src/db/seed.js
```

This will:

- clear existing products and variants
- insert sample products
- create random product variants and stock values

## Project Structure

```text
src/
|-- app.js
|-- server.js
|-- config/
|   |-- database.js
|-- db/
|   |-- order.js
|   |-- products.js
|   |-- seed.js
|   |-- users.js
|   |-- variants.js
|-- middleware/
|   |-- adminMiddleware.js
|   |-- authMiddleware.js
|-- models/
|   |-- Order.js
|   |-- Product.js
|   |-- User.js
|   |-- Variant.js
|-- routes/
|   |-- admin.js
|   |-- auth.js
|   |-- cron.js
|   |-- order.js
|   |-- products.js
|   |-- user.js
|   |-- variants.js
postman/
```

## Postman

There is a ready-made Postman setup for testing the deployed Vercel environment in [postman/README.md](C:/Users/Samuel/Desktop/WEBB25/Backend%201/webbshop-2026-be/postman/README.md).

Included files:

- `postman/webbshop-2026-vercel.postman_collection.json`
- `postman/webbshop-2026-vercel.postman_environment.json`

## Notes

- `src/app.js` currently connects to the database on import, and `src/server.js` also calls the database connection before starting the server.
- CORS is enabled globally.
- The API is set up for both local development and deployment workflows like Vercel.
