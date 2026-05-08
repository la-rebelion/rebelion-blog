---
title: "How to Integrate One React App Into Another Without Creating a Maintenance Mess"
description: "A practical guide to reuse a React app inside another project by extracting packages, feature modules, and thin app shells instead of copying the whole app."
date: 2026-05-01T09:00:00.000Z
slug: integrate-one-react-app-into-another
authors:
  - adrianescutia
tags:
  - react
  - frontend
  - architecture
  - monorepo
  - ai-coding
keywords:
  - integrate React app into another React app
  - reusable React packages
  - React monorepo architecture
  - Bun workspaces
  - Vite React library mode
  - Tailwind v4 monorepo
  - feature package architecture
  - standalone app shell
  - Module Federation alternative
  - micro frontend alternative
---

You built something useful.

Maybe it started as a side project. Maybe it was a customer portal, an internal dashboard, a marketplace, a registry, a billing screen, or an admin console. It has routes, components, mock data, styles, a few clever helpers, and just enough product thinking to feel real.

Then the second product shows up.

Now you want that same capability inside another app.

The first instinct is understandable: "Can I just import the app?"

Short answer: yes, technically. Better answer: almost never as the default.

If you import a full React app into another React app, you usually import more than screens. You import its router, providers, CSS assumptions, auth decisions, environment variables, dependency versions, and deployment model. That is how a reusable feature becomes a hidden maintenance contract.

The better pattern is this:

> Turn the reusable capability into packages, then keep each deployed app as a thin shell.

That is the difference between copying a product and extracting a product capability.

## The Real Problem

Creators do not struggle because they lack code. They struggle because they have working code in the wrong shape.

An app is usually optimized for launch:

* Render a root component.
* Own the router.
* Load global CSS.
* Fetch or mock data directly.
* Control layout and navigation.
* Assume one deployment target.

That is great when the app is the product.

It becomes painful when the app needs to become part of a larger platform.

The moment you embed it somewhere else, the host app already has opinions:

* It already owns authentication.
* It already owns `BrowserRouter`.
* It already has a design system.
* It already has global layout and navigation.
* It already uses one React instance.
* It already has build tooling, Tailwind config, environment variables, and route protection.

When two apps both try to be the root, the integration gets weird fast.

## The Challenges Nobody Mentions Early Enough

The hard part is not moving files. The hard part is separating responsibilities.

### 1. Routing Conflicts

A standalone app usually creates its own router:

```tsx
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

That is correct for a deployed app. It is wrong for a reusable feature package.

When the feature is embedded, the host should own the router:

```tsx
<Route
  path="/marketplace/*"
  element={<MarketplaceRoutes basePath="/marketplace" />}
/>
```

The feature should export routes. It should not render the root.

### 2. Duplicated Providers

Auth, theme, analytics, telemetry, error boundaries, data clients, and feature flags usually belong to the host app.

The embedded feature should receive what it needs through props or context:

```tsx
<MarketplaceRoutes
  basePath="/marketplace"
  client={marketplaceClient}
  getAccessToken={getAccessToken}
  flags={{ checkoutEnabled: true }}
/>
```

This keeps the feature reusable without letting it hijack the platform.

### 3. Multiple React Copies

This one is sneaky.

If your feature package declares `react` and `react-dom` as normal dependencies, you can accidentally bundle a second React copy. That leads to broken hooks, strange context behavior, and bugs that look impossible.

Reusable React packages should usually use peer dependencies:

```json
{
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  }
}
```

The host app provides React. The package uses it.

### 4. CSS and Tailwind Drift

Two apps can both use Tailwind and still be incompatible.

One might use Tailwind v3 with `tailwind.config.js` and PostCSS. Another might use Tailwind v4 with `@tailwindcss/vite`, `@import "tailwindcss";`, CSS `@theme`, and `@source`.

In a monorepo, the host app must scan the feature package source:

```css
@import "tailwindcss";

@source "../../packages/feature-marketplace/src";

@theme {
  --color-brand: #1193b0;
  --radius-card: 0.5rem;
}
```

The feature package should avoid global resets and app-level CSS side effects. Let the shell own global styling.

### 5. Mock Data Coupling

Most useful apps start with mock data. That is fine.

The problem is when pages import mock data directly:

```tsx
import { apps } from "../data/mock-apps";
```

That makes the UI harder to reuse because the data source is wired into the screen.

Extract the model first:

```txt
packages/
  marketplace-domain/
    src/index.ts
```

Then create a client contract:

```txt
packages/
  marketplace-api-client/
    src/index.ts
```

Now the UI can render from a client, not from hardcoded data.

## The Decision Model

Use this when deciding how to reuse one app inside another:

| Need | Best Pattern |
| --- | --- |
| Reuse types, schemas, constants, utilities, hooks, or API clients | Shared package |
| Reuse complete screens or product capability inside another app | Feature package |
| Let optional capabilities register themselves dynamically | Plugin package |
| Deploy the capability independently | Thin standalone app shell |
| Compose independently deployed apps at runtime | Micro-frontend, last resort |

This model keeps the architecture honest.

If you only need buttons, types, or clients, do not ship a whole app.

If you need complete screens, create a feature package.

If you need independent deployment, create an app shell that imports the feature package.

If you need independently deployed teams composing at runtime, then consider micro-frontends or Module Federation. But do not start there just because the code lives in two apps.

## The Recommended Shape

For a React, Vite, Bun, and Tailwind workspace, this structure works well:

```txt
repo/
  apps/
    web/
    marketplace/                 # thin standalone shell, if independent deployment is required
  packages/
    marketplace-domain/          # types, schemas, constants, validation
    marketplace-api-client/      # typed frontend-safe client
    feature-marketplace/         # reusable React pages, components, routes
    marketplace-db/              # schema and migrations, if reusable
```

The important idea is simple:

* Packages contain reusable capability.
* Apps contain runtime ownership.

That means `apps/web` can mount the marketplace under `/marketplace/*`, while `apps/marketplace` can still deploy the same feature independently.

Both apps consume the same feature package.

## How to Integrate One React App Into Another

Here is the sequence I recommend.

### Step 1: Inventory the Source App

Before moving code, identify each layer:

* Domain types and constants.
* Mock or seed data.
* API calls.
* UI primitives.
* Feature pages.
* Layout components.
* Router and app bootstrap.
* Global CSS.
* Static assets.
* Database schema or migrations.

You are not just moving folders. You are deciding ownership.

### Step 2: Extract the Domain Package First

Start with the code that has no React dependency.

Good candidates:

* Catalog models.
* Publisher models.
* Pricing plans.
* Deployment states.
* Validation helpers.
* Shared constants.

Example:

```ts
export type MarketplaceApp = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  publisher: Publisher;
  pricing: PricingPlan[];
  deployment: DeploymentOption[];
};
```

This package should be boring. Boring is good here.

### Step 3: Create an API Client Contract

The UI should not care whether data comes from mock data, SQLite, D1, REST, RPC, or an MCP server.

Create a client interface:

```ts
export type MarketplaceClient = {
  listMarketplaceApps(): Promise<MarketplaceApp[]>;
  getMarketplaceApp(slug: string): Promise<MarketplaceApp | null>;
  listDeployments(): Promise<Deployment[]>;
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
};
```

Then provide implementations:

* A mock client for development.
* A fetch client for the real backend.
* Later, maybe an MCP-aware client if the product needs agent workflows.

The UI stays stable while the backend evolves.

### Step 4: Convert Screens Into a Feature Package

Move reusable pages and components into a package:

```txt
packages/
  feature-marketplace/
    src/
      MarketplaceRoutes.tsx
      pages/
        MarketplaceBrowsePage.tsx
        MarketplaceAppDetailPage.tsx
      components/
      index.ts
```

Export the feature surface:

```ts
export { MarketplaceRoutes } from "./MarketplaceRoutes";
export { MarketplaceBrowsePage } from "./pages/MarketplaceBrowsePage";
export { MarketplaceAppDetailPage } from "./pages/MarketplaceAppDetailPage";
```

Remove app-shell ownership from this package:

* No `createRoot`.
* No top-level `BrowserRouter`.
* No duplicated auth provider.
* No global CSS reset.
* No hardcoded app-level layout.

The package should be mountable.

### Step 5: Mount It in the Host App

The host app owns the platform.

```tsx
import { MarketplaceRoutes } from "@your-org/feature-marketplace";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route
        path="/marketplace/*"
        element={
          <ProtectedRoute>
            <MarketplaceRoutes
              basePath="/marketplace"
              client={marketplaceClient}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

The feature becomes part of the product, but the host still controls auth, layout, navigation, and route protection.

### Step 6: Add a Standalone Shell Only When You Need Independent Deployment

Sometimes you really do need the marketplace to deploy by itself.

That is valid. Just keep it thin:

```txt
apps/
  marketplace/
    src/
      main.tsx
      index.css
      vite.config.ts
```

The shell should bootstrap the feature:

```tsx
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { MarketplaceRoutes } from "@your-org/feature-marketplace";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MarketplaceRoutes basePath="" client={marketplaceClient} />
  </BrowserRouter>,
);
```

Now you have both:

* Embedded marketplace inside the main app.
* Independently deployed marketplace shell.

Without duplicating the product logic.

### Step 7: Move Database Assets Only If They Are Truly Shared

If multiple backends need the same schema or migrations, create a DB package:

```txt
packages/
  marketplace-db/
    migrations/
      0001_marketplace_schema.sql
```

Keep the package focused on schema and migrations. Do not hide backend runtime behavior inside it unless that is clearly part of the contract.

## What Not To Do

Avoid these traps:

* Importing a full standalone app as a dependency.
* Nesting routers inside routers.
* Shipping a second React copy.
* Letting a feature package own the auth provider.
* Letting reusable UI import mock data directly.
* Copying database schemas into multiple apps.
* Upgrading Tailwind inside one package without checking consuming apps.
* Using Module Federation before you actually need runtime composition.

These shortcuts feel fast until the second consumer arrives.

## Validation Checklist

Before calling the integration done, verify:

* The host app builds.
* The standalone shell builds, if it exists.
* The feature works under a route prefix like `/marketplace/*`.
* The feature works at root in the standalone shell.
* React is a peer dependency in reusable React packages.
* There is only one React instance at runtime.
* The feature does not create its own root router when embedded.
* Global CSS is owned by the app shell.
* Tailwind scans package source files.
* The UI can render from an API client contract, not just mock data.

This checklist catches most integration mistakes before they turn into architecture debt.

## FAQ

### Can I integrate one React app into another React app?

Yes, but the best practice is usually to extract reusable packages from the source app instead of importing the whole app. Put shared types and business rules in a domain package, API calls in an API client package, reusable screens in a feature package, and deployment bootstrapping in thin app shells.

### Should I use a monorepo?

A monorepo is often the simplest option when multiple apps need to consume the same packages. Bun workspaces, npm workspaces, pnpm workspaces, and Turborepo-style setups can all work. The important part is clear package ownership, not the specific workspace tool.

### When should I use a micro-frontend?

Use a micro-frontend when independently deployed apps must be composed at runtime. If you control the repo and can compose packages at build time, a feature package is usually simpler, easier to test, and easier to refactor.

### How do I avoid multiple React versions?

Put `react`, `react-dom`, and usually `react-router-dom` in `peerDependencies` for reusable React packages. The consuming app should provide those dependencies.

### How do I share Tailwind styles across apps and packages?

Let app shells own global CSS. In Tailwind v4, use `@import "tailwindcss";` and add `@source` entries for package source directories so class names inside packages are included in the build.

### What if the original app still needs to deploy independently?

Keep a standalone shell under `apps/your-feature-app`. That shell should only handle routing bootstrap, CSS entrypoint, environment setup, and deployment config. The business logic and feature UI should live in packages.

## The Creator Takeaway

The goal is not to make every app reusable.

The goal is to recognize when an app has become a capability.

When that happens, extract the capability:

* Domain package.
* API client package.
* Feature package.
* Optional DB package.
* Thin app shells for each deployment target.

That structure lets you move faster without turning your codebase into a pile of copied screens and hidden assumptions.

I turned this workflow into a reusable agent skill so creators and engineering teams can apply it consistently across projects: **App Package Integration**.

You can find it on Skills by searching La Rebelion here:

[https://skills.sh/?q=la-rebelion](https://skills.sh/?q=la-rebelion)
In case you are working with AI agents, and MCP servers, here we have more skills that can help you: [https://skills.sh/?q=mcp-com-ai](https://skills.sh/?q=mcp-com-ai)

Also, if you want to see a real example of this architecture in action, check out the [My Clawster](https://clawster.my), which is built using this exact pattern integrating the [MCP Marketplace](https://marketplace.mcp.com.ai) into both the main app and a standalone shell.

Use it when you want to integrate one app into another, turn an app into packages, keep an independent app shell, or avoid reaching for micro-frontends too early.

**Be HAPI. Go Rebels.** ✊🏽
