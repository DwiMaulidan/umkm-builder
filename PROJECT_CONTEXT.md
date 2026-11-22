# UMKM-Builder --- Project Context

Last updated: 22 November 2026\
Purpose: handoff document for continuing work in a new ChatGPT
conversation.

## 1. Project overview

UMKM-Builder is a group project for an information systems / technology
innovation course. It is a web application for small-business
operations.

Known stack: - Frontend: React + Vite - Backend: Node.js + Express -
Database: PostgreSQL - Local database: Docker container
`umkm-postgres` - Cloud database: Neon PostgreSQL - Planned hosting:
Render (backend) and Vercel (frontend)

Project root on the main developer's Windows machine:
`C:\Users\ADVAN\umkm-builder`

GitHub repository: `DwiMaulidan/umkm-builder`

## 2. Important working style and constraints

-   User works on Windows 11 using VS Code and PowerShell.
-   Explain in Indonesian, casually and clearly.
-   Give one manageable step at a time; wait for command output before
    moving on.
-   Avoid overwhelming the user with many changes at once.
-   Do not ask the user to share `.env`, passwords, JWTs, database
    connection strings, or other secrets.
-   Never put secrets in project documentation or Git.
-   Preserve existing UI/design and teammates' work. Inspect before
    editing.
-   Prefer small, tested changes. Do not assume a feature is complete
    just because a database table exists.
-   The user's stated goal is that **all application features should be
    fully demonstrable**, not merely that the backend is hosted. The
    user is willing to work intensively toward that goal.
-   Presentation is imminent (the user previously said the presentation
    is the next morning); confirm the actual deadline when resuming.

## 3. Frontend structure and known pages

Known frontend files / pages from previous inspection: - `src/App.jsx` -
`src/App.css` - `src/data/storage.js` -
`src/data/workflowTemplates.js` - `src/pages/Dashboard.jsx` -
`src/pages/ProductStock.jsx` - `src/pages/Transactions.jsx` -
`src/pages/SettingsPage.jsx` - `src/pages/TemplateWorkflow.jsx` -
`src/pages/LandingPage.jsx`

Sidebar/menu previously included: Dashboard, Transaksi, Produk & Stok,
Pelanggan, Laporan, Workflow Builder, Template, Integrasi, Pengaturan.

Frontend is React + Vite. App uses React Router for
landing/login/register and `/app/*`, and an `activePage` state inside
`MainApp` for internal page selection.

Shared design notes: - Font: Inter - Teal accent: `#087c72` - Page
background: `#f6f8fd` - Sidebar width: 234px - Shared styles in
`src/App.css` - New CSS should use scoped/prefixed classes. -
ProductStock uses React state and local storage helpers.

## 4. Backend status

Backend root: `backend/`

Current known backend source tree (last inspected):

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

Known implemented backend modules: - Auth: controller + routes -
Products: controller + routes - Categories: controller + routes

No transaction/customer/workflow/supplier/purchase/report/integration
controllers or routes were present in that last directory listing. This
must be rechecked before assuming they are absent.

Backend package scripts: - `npm run dev` uses nodemon - `npm start` runs
`node src/server.js`

`backend/.gitignore` contains:

``` text
node_modules/
.env
```

`git ls-files backend/.env` previously returned no output, so `.env` was
not tracked at that time.

Backend `server.js` previously mounted: - `/api/auth` -
`/api/products` - `/api/categories` - `/` health-like root message -
`/api/health/db` - `/api/auth/me` protected by auth middleware

CORS was configured as `cors()` (wide open) at the time inspected.
Restrict to deployed frontend origin before/after public deployment when
practical.

Auth middleware attaches: `req.user = { userId, businessId, role }`
Backend controllers use `businessId` for tenant isolation.

### Database config --- current known working version

`backend/src/config/database.js` was edited to use Neon when
`DATABASE_URL` exists, otherwise local split DB variables. **The
`options: "-c search_path=public"` setting was removed** because Neon
rejected it as an unsupported startup parameter.

Current known config:

``` js
const { Pool } = require("pg");

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

pool.on("connect", () => {
  console.log("PostgreSQL connected!");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

module.exports = pool;
```

Important caveat: Neon role's `search_path` was blank during direct
inspection. Removing `search_path` allowed connection, but queries may
still need schema-qualified names (`public.products`, etc.) or a
Neon-supported configuration approach. Test real API queries, not just
DB connection.

## 5. Database and Neon status

Local Docker containers previously observed: - `umkm-postgres` ---
PostgreSQL 17, host port 5432; this is the UMKM-Builder DB. -
`simticketingkrm-local-postgres-1` --- separate project on port 5433; do
not modify it.

Local DB credentials metadata previously observed: - PostgreSQL user:
`umkm_admin` - Database: `umkm_builder` Do not expose or request
passwords.

Neon project: - Organization/project name: UMKM-Builder - Region: AWS
Asia Pacific 1 (Singapore) - Branch: `production` - Database: `neondb`

Local database backup file was created as `umkm_builder_backup.sql`
(\~40,998 bytes) and imported into Neon. Import showed CREATE TABLE /
COPY / indexes / constraints with no reported errors.

Neon contains 17 tables in `public`: - `business_members` -
`businesses` - `categories` - `customers` - `integrations` -
`products` - `purchase_items` - `purchases` - `stock_movements` -
`suppliers` - `transaction_items` - `transactions` - `users` -
`workflow_execution_logs` - `workflow_executions` - `workflow_steps` -
`workflows`

Previous checks: - `SELECT COUNT(*) FROM public.users;` returned 1. -
`SELECT COUNT(*) FROM public.products;` returned 0 at that time. -
`SHOW search_path;` returned blank. - Unqualified table queries failed
because search_path was blank; querying `public.<table>` worked. -
`public.products` schema matches known product controller fields: -
`id bigint` - `business_id bigint NOT NULL` -
`name varchar(150) NOT NULL` - `category varchar(100)` -
`price numeric(12,2) NOT NULL DEFAULT 0` -
`stock integer NOT NULL DEFAULT 0` - `unit varchar(30)` -
`min_stock integer NOT NULL DEFAULT 0` - `created_at timestamp` -
`category_id bigint` - foreign keys to businesses and composite
category/business relation - nonnegative checks on price, stock,
min_stock

Never assume the 17 tables mean all corresponding backend APIs exist.

## 6. Confirmed connection test

On 22 November 2026, backend was started from `backend` using:

``` powershell
npm.cmd start
```

Output:

``` text
Server running on http://localhost:5000
```

Then:

``` powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health/db" -Method GET
```

returned:

``` text
Database connected successfully! 2026-11-22T16:10:28.340Z
```

Therefore Express started and the health endpoint successfully queried
Neon at that point.

Earlier error: `unsupported startup parameter in options: search_path`
was fixed by removing `options: "-c search_path=public"` from Pool
config.

A pg-connection-string SSL mode warning was also observed. It was a
warning, not the cause of the connection failure.

## 7. Frontend persistence audit

A search was run:

``` powershell
Get-ChildItem .\src -Recurse -Include *.js,*.jsx |
Select-String -Pattern "localStorage|fetch\(|axios|API_URL"
```

Results: - `src/data/storage.js:42` reads `umkm_products` from
localStorage - `src/data/storage.js:60` writes `umkm_products` -
`src/data/storage.js:64` reads `umkm_orders` -
`src/data/workflowTemplates.js` reads/writes localStorage for template
selections/storage - `src/pages/Transactions.jsx:73` writes
`umkm_orders`

This suggests Products and Transactions frontend still use localStorage
in at least some paths. Workflow templates also persist locally. Search
output did not show `fetch`, `axios`, or `API_URL` matches in those
files, but auth may use other patterns or code not covered; inspect auth
pages and the full repo before concluding.

## 8. Git context --- verify before acting

Last known branch in the user's local working directory:
`feature/customer-page-dwi`

At one previous checkpoint it tracked `origin/feature/customer-page-dwi`
and was clean/up to date. This is historical; **always run `git status`,
`git branch`, and `git log -1 --oneline` before making changes or
switching branches**.

Other historical branches: - `feature/landing-page` -
`feature/workflow-builder` - `main` - `feature/customer-page` -
`feature/auth-login-register` - integration branches were previously
merged via PRs.

Do not assume current branch, commit, or clean working tree without
checking.

## 9. Hosting plan

Planned hosting: - Neon: PostgreSQL cloud DB (already provisioned and
connection-tested locally) - Render: backend Express Web Service -
Vercel: frontend React/Vite

Previous free-tier caveat: - Render free web service may sleep after
inactivity and have a cold start. - Neon free plan has usage/storage
limits and may suspend/scale to zero depending on current plan. - Verify
current provider limits before relying on them for presentation.

Do not deploy until: - backend API routes work against Neon - frontend
uses deployed backend URL - CORS is configured for frontend origin -
secrets are entered into Render environment variables, never committed -
smoke tests pass.

## 10. Immediate next actions

1.  Reconfirm actual deadline and current working branch/status.

2.  Run a full frontend page inventory:

    ``` powershell
    Get-ChildItem .\src\pages -File | Select-Object Name
    ```

3.  Inspect all frontend pages and data/storage helpers to map each
    feature to its persistence method.

4.  Inspect all backend controllers/routes and all 17 table schemas.

5.  Build a feature matrix: UI exists? backend API exists? connected?
    CRUD tested? tenant-safe?

6.  Prioritize implementation feature-by-feature, with small changes and
    tests.

7.  Verify Neon queries use `public` schema explicitly if necessary.

8.  Do not claim full app readiness until each feature has been tested
    end-to-end.

## 11. Security reminders

-   Never paste `.env` or `DATABASE_URL` into chat.
-   Never commit `.env`, JWTs, passwords, or credentials.
-   If sharing terminal output, redact secrets.
-   Use PowerShell commands appropriate for Windows.
