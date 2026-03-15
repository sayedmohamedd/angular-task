# Angular Countries Task

A professional Angular single-page application for browsing, filtering, and managing country data with authentication and a responsive data table.

---

## 1. Project Overview

This application provides a **dashboard** where authenticated users can view a list of countries from a public API, sort and filter the data, select rows to see details, and perform in-memory **update** and **delete** actions. Access is protected by a simple **login** flow (token stored in `localStorage`). The project is built with **Angular 21**, **standalone components**, and **Tailwind CSS**, and is structured for clarity and maintainability.

---

## 2. Features

- **Authentication**
  - Login with username/password (demo credentials: `admin` / `admin`).
  - JWT-style token stored in `localStorage`; route guards protect dashboard and redirect unauthenticated users to login.
  - Guest guard redirects logged-in users away from the login page.

- **Countries table**
  - Loads country data from REST Countries API.
  - **Sorting** by name, capital, region, or currency (ascending/descending).
  - **Filtering** via per-column search inputs (country name, capital, region, currency).
  - **Pagination** with configurable page size (10, 20, 50) and previous/next controls.
  - **Scrollable body** with fixed header; row selection and expandable inline preview for extra fields.

- **CRUD-style actions (in-memory)**
  - **Update**: Modal with reactive form; currency options loaded from external API; validation and shared error display.
  - **Delete**: Confirmation dialog; removal from the in-memory list only.

- **UX**
  - Loading skeleton while countries are fetched.
  - Selected country preview section below the table.
  - Lazy-loaded routes and deferred dialogs for better initial load.
  - 404 page with navigation options.

---

## 3. Tech Stack

| Layer        | Technology                          |
| ------------ | ------------------------------------ |
| Framework    | Angular 21                           |
| Language     | TypeScript 5.9                       |
| Styling      | Tailwind CSS 4                       |
| HTTP         | Angular `HttpClient`                 |
| Forms        | Angular Reactive Forms               |
| State        | Angular Signals (no NgRx)            |
| Testing      | Vitest                               |
| Package manager | npm                               |

---

## 4. Architecture Explanation

- **Standalone components**: The app uses no NgModules; all components, pipes, and guards are standalone.
- **Lazy loading**: Dashboard, login, and not-found routes are loaded via `loadComponent` for smaller initial bundles.
- **Layered structure**:
  - **Pages** (dashboard, login, not-found) handle routes and compose **components**.
  - **Components** (e.g. countries table, update dialog, preview) own UI and user interaction.
  - **Services** (Countries, Auth, Currency) handle HTTP and auth logic.
  - **Core** holds guards, interceptors, and shared pipes used across the app.
- **Routing**: Default route redirects to `dashboard`; `dashboard` is protected by `authGuard`; `login` is protected by `guestGuard`; `**` shows the not-found page.

---

## 5. State Management Approach

There is **no global store** (e.g. NgRx). State is managed as follows:

- **Auth**: Token and login state are stored in `localStorage` and exposed through the `Auth` service. Guards read the token to allow or deny route access.
- **Countries table**: All table state lives in the **CountriesTable** component using **signals**:
  - **Data**: `countries` (raw list), `loading` (fetch state).
  - **UI**: `page`, `pageSize`, `sortField`, `sortDirection`, `filters`, `selected` (row), `showUpdateDialog`, `showDeleteDialog`.
  - **Derived**: `totalPages` and `displayedCountries` are **computed** signals that apply filter → sort → pagination in one place. This keeps the logic reactive and avoids manual subscriptions.

Updates and deletes are applied by mutating the `countries` signal inside the table component; no server persistence.

---

## 6. Caching Strategy

The application does **not** implement HTTP caching or a dedicated cache layer. Countries are fetched once when the dashboard loads; currencies are fetched when the update dialog is opened. For a production scenario, you could add interceptors or a simple cache in the services to avoid repeated requests.

---

## 7. Table Implementation Details

- **Sorting**
  - Clicking a column header sets `sortField` and toggles `sortDirection` (asc/desc).
  - Sorting is applied inside the `displayedCountries` computed: after filtering, the array is sorted with `String.localeCompare` on the resolved field value (via `getFieldValue` for name, capital, continent, currency).

- **Filtering**
  - Each column has a text input bound to `setFilter(field, value)`, which updates the `filters` signal and resets `page` to 1.
  - The same computed pipeline filters by name, capital, continent, and currency (case-insensitive substring match).

- **Pagination**
  - `page` and `pageSize` are signals; `totalPages` is computed from filtered length and page size.
  - The computed list is sliced with `(page - 1) * pageSize` and `pageSize` to get the current page. Prev/Next and a page-size dropdown update these signals.

- **Scroll behavior**
  - The table is split: one `<table>` for the header only, and a scrollable container (`max-h-150 overflow-y-auto`) with a second `<table>` for the body. This keeps the header fixed while the body scrolls vertically.

- **Row selection and preview**
  - Clicking a row toggles `selected`. The selected row is highlighted, and an expandable preview row below it shows subregion, languages, independent, status, and continent.

---

## 8. Forms Implementation (Reactive Forms)

- **Login**
  - Single `FormGroup` with `username` and `password`, both required. On submit, validity is checked; if valid, credentials are compared to a hardcoded user; on failure, `setErrors({ invalid: true })` is applied so the shared **FormError** component can show messages.

- **Update country dialog**
  - One reactive `FormGroup` with nested groups:
    - `name.common` (country name),
    - `capital`, `status`, `subregion`, `continents`, `languages`,
    - `independent` (boolean),
    - `currencies`: nested group with `code`, `name`, `symbol` (currency from external API).
  - Required validators on main fields; form is reset when the `country` input is set. On save, the form is validated; if invalid, `markAllAsTouched()` and `markAsDirty()` are used to show errors. If valid, the parent receives the value and updates the in-memory list.

- **Shared FormError component**
  - Accepts an `AbstractControl` and a field name; displays a “field is required” message when the control has `errors['required']` and `touched` is true.

---

## 9. API Integration Explanation

- **Countries**
  - **CountriesService** calls `GET https://restcountries.com/v3.1/all?fields=...` to load name, capital, region, subregion, languages, currencies, etc. Data is consumed in the table component via `getCountries().subscribe()` and stored in the `countries` signal.

- **Currencies**
  - **CurrencyService** calls `GET https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json` to populate the currency dropdown in the update dialog.

- **Auth**
  - No backend; the **Auth** service checks credentials in memory and stores a token in `localStorage`. The **auth interceptor** adds `Authorization: Bearer <token>` to outgoing HTTP requests **except** for `restcountries.com` and `cdn.jsdelivr.net`, so public APIs are called without auth headers.

---

## 10. How to Run the Project

**Prerequisites:** Node.js and npm installed.

1. Clone the repository and open a terminal in the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   or `ng serve`.
4. Open **http://localhost:4200/** in a browser. You will be redirected to login.
5. Log in with **admin** / **admin**, then use the dashboard table (sort, filter, paginate, select row, update, delete).

**Build for production:**
```bash
npm run build
```
Output is in `dist/`.

---

## 11. Folder Structure Overview

```
src/
├── app/
│   ├── app.ts                 # Root component (router outlet)
│   ├── app.config.ts          # Router, HttpClient, auth interceptor
│   ├── app.routes.ts          # Lazy-loaded routes, guards
│   ├── components/
│   │   ├── countries-table/   # Main table (sort, filter, pagination, dialogs)
│   │   ├── countries-skeleton/# Loading placeholder rows
│   │   ├── update-dialog/     # Update country reactive form modal
│   │   ├── preview-section/   # Selected country summary card
│   │   ├── preview-row/       # (Inline expandable row in table)
│   │   └── shared/
│   │       └── form-error/    # Reusable validation message
│   ├── core/
│   │   ├── guards/            # authGuard, guestGuard
│   │   ├── interceptors/      # authInterceptor (Bearer token)
│   │   └── pipes/             # countryField, currenciesPipe
│   ├── models/
│   │   └── country.model.ts   # Country, Name, Currency, etc.
│   ├── pages/
│   │   ├── dashboard/         # Wraps countries table
│   │   ├── login/             # Login form
│   │   └── not-found/         # 404 page
│   └── services/
│       ├── auth.service.ts    # Token, logout, demo user
│       ├── countries.service.ts
│       └── currency.service.ts
├── main.ts
├── index.html
└── styles.css                 # Global Tailwind import
```

---

## 12. Important Technical Decisions

- **Signals over RxJS for local UI state**: The table uses signals and computed values for filtering, sorting, and pagination instead of RxJS streams, aligning with Angular’s modern reactive style and reducing subscription management.

- **Single computed for displayed data**: One `displayedCountries` computed applies filter → sort → slice in order. This keeps the logic in one place and ensures the view always reflects the current state.

- **Functional guards and interceptor**: `authGuard`, `guestGuard`, and `authInterceptor` are implemented as functions (e.g. `CanActivateFn`, `HttpInterceptorFn`), which fits the standalone, tree-shakeable setup.

- **Lazy loading and @defer**: Route components are lazy-loaded; the update and delete dialogs use `@defer (when ...; prefetch on idle)` to load their code only when needed and improve initial load.

- **In-memory updates**: Update and delete change only the in-memory `countries` array. There is no backend; the design focuses on front-end structure and UX.

- **Tailwind CSS**: Utility-first styling is used throughout for layout, spacing, and responsiveness without custom CSS modules.
