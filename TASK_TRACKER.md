# UMKM-Builder --- Task Tracker

Last updated: 22 November 2026

Status meanings: - \[x\] Confirmed complete - \[\~\] Partially complete
/ needs more verification - \[ \] Not yet completed or not yet audited

## Infrastructure

-   [x] Neon project created in Singapore region.
-   [x] Local PostgreSQL backup imported into Neon.
-   [x] Confirmed 17 tables exist in Neon `public` schema.
-   [x] Backend Express server starts locally on port 5000.
-   [x] `/api/health/db` successfully queried Neon.
-   \[\~\] Neon query schema/search_path behavior: health query works;
    test product/category queries because Neon `search_path` was blank.
-   [ ] Deploy backend to Render.
-   [ ] Deploy frontend to Vercel.
-   [ ] Configure production environment variables and CORS.
-   [ ] End-to-end smoke test on public URLs.

## Backend

-   \[\~\] Auth controller/routes exist; verify login/register/me flows
    against Neon.
-   \[\~\] Product controller/routes exist; verify GET/POST/PUT/DELETE
    against Neon and schema-qualified query behavior.
-   \[\~\] Category controller/routes exist; inspect and test.
-   [ ] Customers API --- inspect repo, then implement if missing.
-   [ ] Transactions API --- inspect repo, then implement if missing.
-   [ ] Transaction items / stock movement behavior --- design and test
    transaction consistency.
-   [ ] Suppliers API --- inspect/implement.
-   [ ] Purchases and purchase items API --- inspect/implement.
-   [ ] Workflow CRUD/execution APIs --- inspect/implement.
-   [ ] Workflow execution logs API --- inspect/implement.
-   [ ] Integrations API --- inspect/implement.
-   [ ] Reports/analytics endpoints --- inspect/implement.
-   [ ] Consistent validation and error handling.
-   [ ] Verify tenant isolation by `business_id` on every business-owned
    resource.
-   [ ] Verify authentication and authorization on protected routes.

## Frontend and integration

-   [ ] Inventory all pages/components and map feature workflows.
-   \[\~\] Product data helper currently uses localStorage
    (`umkm_products`); integrate with API.
-   \[\~\] Transactions page writes `umkm_orders` to localStorage;
    integrate with API.
-   \[\~\] Workflow templates use localStorage; determine whether local
    persistence is intended or must sync to Neon.
-   [ ] Audit auth pages and API usage.
-   [ ] Integrate Customers page with API.
-   [ ] Integrate Dashboard with real backend data.
-   [ ] Integrate Reports with real backend data.
-   [ ] Integrate Workflow Builder and Template with backend as
    required.
-   [ ] Integrate Integrations and Settings with backend as required.
-   [ ] Add loading, empty, success, and error states.
-   [ ] Preserve existing UI and responsive behavior.

## Testing

-   [ ] Create a repeatable test checklist for every feature.
-   [ ] Test register, login, token persistence, protected routes,
    logout.
-   [ ] Test product CRUD and validation.
-   [ ] Test category CRUD and product-category relationship.
-   [ ] Test customer CRUD.
-   [ ] Test transaction creation, item rows, stock changes, and
    rollback/error behavior.
-   [ ] Test purchase/supplier flows if part of user-facing demo.
-   [ ] Test workflows and execution logs.
-   [ ] Test reports against actual transactions.
-   [ ] Test multiple businesses/users for data isolation.
-   [ ] Test app in a second browser/device to confirm data is
    cloud-backed rather than local-only.

## Git and documentation

-   [ ] Check current branch and working tree before changes.
-   [ ] Commit logical, tested changes on the correct feature branch.
-   [ ] Keep `.env` and secrets out of Git.
-   [ ] Update `PROJECT_CONTEXT.md`, `TASK_TRACKER.md`, and
    `CHANGELOG.md` after significant work.

## Immediate next step

Run these commands from project root and share the output:

``` powershell
git status
git branch
git log -1 --oneline
Get-ChildItem .\src\pages -File | Select-Object Name
```

Then inspect `src/data/storage.js`, all pages, and the complete backend
tree before implementing new modules.
