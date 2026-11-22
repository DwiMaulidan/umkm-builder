# UMKM-Builder --- Changelog

## 22 November 2026

### Neon database setup

-   Created Neon project `UMKM-Builder` in AWS Asia Pacific 1
    (Singapore).
-   Database is `neondb`, branch `production`.
-   Created local PostgreSQL backup `umkm_builder_backup.sql` and
    imported it into Neon.
-   Confirmed 17 tables in Neon schema `public`.
-   Confirmed one row in `public.users` at the time of inspection.
-   Confirmed zero rows in `public.products` at the time of inspection.

### Backend database configuration

-   Updated `backend/src/config/database.js` to use `DATABASE_URL` for
    Neon and split `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
    `DB_PASSWORD` for local PostgreSQL.
-   Initially included `options: "-c search_path=public"`.
-   Neon rejected startup parameter `search_path` with error:
    `unsupported startup parameter in options: search_path`.
-   Removed `options` from both Pool configurations.
-   Current config uses SSL `{ rejectUnauthorized: false }` for the
    `DATABASE_URL` connection path.

### Backend connectivity test

-   Backend started successfully with `npm.cmd start` from `backend`.
-   `/api/health/db` returned:
    `Database connected successfully! 2026-11-22T16:10:28.340Z`
-   This confirms the backend health query connected to Neon at that
    point. It does not yet prove all API queries or feature flows work.

### Backend source audit

Last inspected backend tree:

``` text
backend/src/server.js
backend/src/config/database.js
backend/src/controllers/authController.js
backend/src/controllers/categoryController.js
backend/src/controllers/productController.js
backend/src/middleware/authMiddleware.js
backend/src/routes/authRoutes.js
backend/src/routes/categoryRoutes.js
backend/src/routes/productRoutes.js
```

### Frontend localStorage audit

Command:

``` powershell
Get-ChildItem .\src -Recurse -Include *.js,*.jsx |
Select-String -Pattern "localStorage|fetch\(|axios|API_URL"
```

Found: - `src/data/storage.js` reads/writes `umkm_products`. -
`src/data/storage.js` reads `umkm_orders`. -
`src/data/workflowTemplates.js` reads/writes localStorage. -
`src/pages/Transactions.jsx` writes `umkm_orders`.

### Next work

-   Inspect Git branch/status and page inventory.
-   Inspect auth integration and all feature pages.
-   Build feature-to-API-to-database matrix.
-   Implement and test remaining backend modules and frontend
    integration.
-   Deploy only after end-to-end flows work.

## Changelog maintenance rule

Add dated entries after each significant code or database change.
Record: - files changed - purpose - commands/tests run - actual
outcomes - known issues / follow-up Never include secrets, connection
strings, passwords, or tokens.
