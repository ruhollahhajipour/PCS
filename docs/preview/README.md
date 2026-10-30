# PCS Preview

This branch provides an isolated browser preview of the PCS development snapshot.

## Open the demo

Visit `/preview` on the deployed preview URL, or select **Explore read-only demo** on the login page.

The public preview is independent of the authentication and workspace providers. It does not call the backend API, does not read or write project records, and does not clear the user's saved workspace. All dashboard metrics, projects, WBS nodes, activities, warehouse stock and procurement orders shown there are fictional sample data.

## Scope and safety

- Demo mode is a separate public route; it does not bypass authentication on normal application routes.
- The demo is read-only and contains no project data mutation controls.
- Real login and protected routes continue to use the existing authentication and backend services.
- This preview is for visual/product review only, not operational use or project reporting.

## Source snapshot

- Source branch: `feature/project-planning-architecture`
- Source commit at preview creation: `8aa933a17bb7a333d104cca8404151ac0a1b5f6d`
- Preview branch: `preview/pcs-latest-2026-10-31`

Frontend build and browser verification must be confirmed from deployment checks before treating this preview as validated.
