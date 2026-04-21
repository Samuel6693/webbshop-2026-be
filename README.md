# Webbshop 2026 - Backend (MEN Stack)

**MEN Stack:** MongoDB, Express, Node.js

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   `mongodb-memory-server` anvands for tester och kan ta en stund att installera.

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Uppdatera `.env` med till exempel MongoDB-anslutning och JWT-hemligheter.

3. **Start MongoDB**
   ```bash
   mongod --dbpath <path to data directory>
   ```
   Alternativt anvander ni MongoDB Atlas.

4. **Run the server**
   ```bash
   npm run dev
   npm start
   ```

## API

- `GET /` - API info
- `GET /health` - Health check

## Postman mot Vercel

Det finns en fardig Postman-setup i [postman/README.md](/C:/Users/Samuel/Desktop/WEBB25/Backend 1/webbshop-2026-be/postman/README.md:1) for att testa den deployade Vercel-miljon i stallet for lokal server.

## Project structure

```text
src/
|-- config/
|   |-- database.js
|-- server.js
```
