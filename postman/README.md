# Postman mot Vercel

Filerna i den har mappen ar till for att testa den deployade backend-miljon i Vercel i stallet for lokal korning.

## Filer

- `webbshop-2026-vercel.postman_collection.json`
- `webbshop-2026-vercel.postman_environment.json`

## Importera i Postman

1. Importera bade collection-filen och environment-filen.
2. Valj environment `Webbshop 2026 - Vercel`.
3. Fyll i:
   - `baseUrl` med er riktiga Vercel-URL, till exempel `https://webbshop-2026-be.vercel.app`
   - `adminEmail`
   - `adminPassword`
   - `cronSecret`

## Rekommenderad korordning

Kor mapparna uppifran och ned:

1. `00 Public`
2. `01 Auth`
3. `02 Admin Product Setup`
4. `03 User`
5. `04 Admin`
6. `05 Cron`
7. `99 Cleanup`

Collectionen sparar automatiskt:

- access tokens och refresh tokens
- skapad anvandare
- skapad produkt
- skapad variant
- skapad order

## Viktigt

- `POST /auth/register` skapar alltid en unik testanvandare automatiskt.
- Admin-inloggningen kraver att det redan finns en adminanvandare i den deployade databasen.
- Cron-testet kraver samma `CRON_SECRET` som finns i Vercel.
- `99 Cleanup` tar bort testdata fran den deployade databasen. Kor den bara nar ni vill stada upp.
- `GET /products/events` ar med som manuell SSE-kontroll. Den lampar sig inte lika bra for automatisk assertions i Postman Runner.
