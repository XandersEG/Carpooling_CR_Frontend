# Implementation Plan — Tuanis Carpooling Frontend

> Based on the design audit in this folder ([design-system.md](design-system.md), [screens-inventory.md](screens-inventory.md), [components-inventory.md](components-inventory.md), [user-flows.md](user-flows.md), [assets-inventory.md](assets-inventory.md)).
> Decisions recorded on 2026-11-13.

## 1. Decisions

| # | Topic | Decision |
|---|-------|----------|
| D1 | Mobile Puntos 1–3 (auth, vehicles, publish trip, profile) were drawn in an older style | **Restyle them with the Punto 4–7 tokens** (variables `Colores`, `Radios`, `Espaciado` and the `Carpooling/*` text styles) |
| D2 | Primary button on Login/Registro | **Keep dark brown** (`#413333`, as in Figma and the current `theme.ts`) |
| D3 | Maps | **Static placeholder image** for now, behind a `MapView` abstraction so a real map can replace it later |
| D4 | Icons | **Export the exact SVGs from Figma** and render them with `react-native-svg` |
| D5 | Web sidebar | **One shell for the whole portal**, based on the `Menu lateral` component (`316:1561`) |
| D6 | Web viewport | **Desktop only**, minimum width about 1280px. The content area scrolls vertically. |
| D7 | Technology | **Expo + React Native + React Native Web for both** the mobile app and the web admin portal (single codebase, Expo Router) |
| D8 | Code organization | **One folder for mobile pages and one for web pages** (route groups `app/(mobile)` and `app/(web)`) |

## 2. Why Expo/React Native for everything works here

| Need | Approach | Risk |
|------|----------|------|
| Web admin portal (desktop) | React Native Web; `expo export -p web` produces a single-page app, deployable to Vercel | Low |
| Hover states (sidebar, tabs, buttons) | `Pressable` `onHoverIn`/`onHoverOut` (supported on web) | Low |
| SVG icons | `react-native-svg` (+ `react-native-svg-transformer` to import `.svg` files) | Low |
| Charts (donuts, bar charts) | Hand-built with `react-native-svg` and plain views. No chart library. | Medium (effort) |
| Modals, dropdowns, calendar, time picker | Custom components that follow the Figma components | Low |
| Image upload (vehicle photos) | `expo-image-picker` (native and web) | Low |
| Maps | Static image (D3) | None |

Accepted trade-offs:
- Web tables are built from views, not HTML tables, so they are less semantic.
- The web bundle includes the mobile code (acceptable for an internal admin tool).

## 3. Folder structure

```
app/                                   # Expo Router: routes only, kept thin
├── _layout.tsx                        # fonts, providers
├── index.tsx                          # redirect: native → /login, web → /admin/login
├── (mobile)/                          # ── MOBILE PAGES ──
│   ├── _layout.tsx                    # on web: redirect to /admin (allowed in __DEV__)
│   ├── (auth)/
│   │   ├── login.tsx                  # /login        (moved from app/login.tsx)
│   │   ├── registro.tsx               # /registro
│   │   └── terminos.tsx               # /terminos
│   └── (main)/                        # logged-in pages: Stack + permanent bottom TabBar
│       ├── _layout.tsx                # Menú · Publicar · Historial · Perfil
│       ├── inicio.tsx                 # Menú (Home), /inicio (not index.tsx: "/" is app/index.tsx)
│       ├── publicar…                  # Publicar viaje (wizard)
│       ├── historial/index.tsx, historial/[id].tsx
│       ├── perfil.tsx
│       ├── buscar.tsx, resultados.tsx
│       ├── viaje/[id].tsx             # Detalle viaje
│       ├── recogida/[tripId].tsx      # Seleccionar / confirmar punto de recogida
│       ├── mis-viajes/index.tsx, mis-viajes/[requestId].tsx
│       ├── solicitudes.tsx
│       ├── viaje-conductor/…          # programado / en curso / finalizado / cancelado
│       └── vehiculos/index.tsx, vehiculos/[id].tsx, vehiculos/[id]/fotos.tsx
└── (web)/                             # ── WEB PAGES ──
    ├── _layout.tsx                    # on native: redirect to /login
    └── admin/
        ├── login.tsx                  # /admin/login
        ├── recuperar.tsx, restablecer.tsx
        └── (portal)/
            ├── _layout.tsx            # AdminShell: sidebar + header
            ├── consultas/[tab].tsx    # 6 queries
            ├── estadisticas.tsx
            ├── instituciones.tsx
            ├── usuarios/index.tsx, usuarios/[id].tsx
            └── parametros/[catalogo].tsx

components/
├── shared/                            # Button, Chip, Card, TextField, ConfirmDialog, Toast, Avatar, Icon…
├── mobile/                            # TripCard, SearchSummary, SegmentedControl, TabBar, ScreenHeader…
└── web/                               # AdminShell, Sidebar, DataTable, FilterBar, Modal, charts…

src/
├── constants/theme.ts                 # tokens from Figma variables
├── types/                             # Trip, Vehicle, Request, User, Institution, CatalogItem…
├── services/                          # API layer; mock implementations with design fixtures first
├── hooks/
└── features/                          # optional: shared feature logic (no UI)

assets/
├── icons/                             # SVGs exported from Figma (D4)
├── images/                            # logo, map placeholder, KPI illustrations
└── fonts/ (only if not loaded via @expo-google-fonts)
```

Notes:
- Route group folder names (`(mobile)`, `(web)`, `(auth)`, `(tabs)`, `(portal)`) don't appear in URLs.
- Web routes live under `/admin/…` to avoid URL clashes with mobile routes (e.g. both have a login).
- The existing `app/login.tsx` moves to `app/(mobile)/(auth)/login.tsx`. Its URL stays `/login`.

## 4. Phases

### Phase 1: Foundations ✅ (branch `feature/estructura-base`)
Done:
- `app/(mobile)` and `app/(web)` with platform guards. Login moved to `app/(mobile)/(auth)/login.tsx`. Placeholder `/admin/login`.
- `theme.ts` tokens (`palette`, `colors`, `authColors`, `webColors`, `fonts`, `typography`, `webTypography`, `spacing`, `radius`, `shadows`, `layout`).
- Fonts: Cairo 400–900 and DM Sans 700/900.
- `react-native-svg`, `react-native-svg-transformer` (`metro.config.js`, `src/types/svg.d.ts`), `@expo-google-fonts/cairo`, `expo-image-picker`.
- Types in `src/types/`. Mock services in `src/services/` backed by `src/services/mock/` (fixtures from Figma, in-memory db).
- Verified with `tsc --noEmit` and `expo export` for web and Android.

Original scope:
- Restructure `app/` as above. Move the existing login without behavior changes.
- `theme.ts`: tokens from the Figma variables (design-system §1.2, §3, §4, §5), web shell colors, and the dark-brown auth button (D2).
- Fonts: add Cairo (400–900). Add DM Sans 700 and 900.
- Dependencies (via `npx expo install`): `react-native-svg`, `react-native-svg-transformer` (+ `metro.config.js`), `@expo-google-fonts/cairo`, `expo-image-picker`.
- Platform guards in the `(mobile)` and `(web)` layouts.
- Types plus a mock service layer seeded with the sample data from the designs.

### Phase 2: Assets & shared components ✅
Done:
- Icons exported from Figma to `assets/icons/mobile/` (cleaned with `scripts/prepare-svg.mjs`; tintable via `currentColor`). Map placeholder `assets/images/map-placeholder.jpg` (from the Figma "Voyager" raster, recompressed to 1920×1080).
- Shared: `Button`, `Chip`, `Card`, `Avatar`; `src/hooks/useHover.ts`; `src/utils/format.ts`; `src/utils/clock.ts` (mock clock = 25 Oct 2026, the design's "Hoy"); `src/services/config.ts` (`EXPO_PUBLIC_USE_MOCKS`).
- Mobile: `Screen`, `ScreenHeader`, `BackButton`, `TabBar`, `TripCard`, `Route`, `SearchSummary`, `SegmentedControl`, `SearchField`, `CalendarPicker`, `TimeSlotPicker`, `BottomSheet`, `ShortcutTile`, `PlaceRow`, `Detail` (DetailCard/Row, PersonCard, NoticeBox), `MapView`/`MapLabel`, `Form` (FormField, SelectField, Stepper).
- Navigation: `app/(mobile)/(main)/_layout.tsx` is a Stack with a **permanent TabBar** (the design shows the tab bar on every logged-in screen, including detail screens), so mobile pages live in `(main)` instead of `(tabs)`.

Original scope:
- Export SVG icons and images listed in [assets-inventory.md](assets-inventory.md). Add the static map placeholder.
- Shared: `Button` (primary / secondary / tertiary / dark), `Chip`, `Card`, `TextField` family, `ConfirmDialog`, `Toast`, `Avatar`, `Icon`.
- Mobile: `ScreenHeader`, `TabBar`, `TripCard`, `SearchSummary`, `SegmentedControl`, `SearchField`, `CalendarPicker`, `TimeSlotPicker`, `ShortcutTile`, `PlaceRow`, `MapView` (static).

### Phase 3: Mobile flows (each one complete before the next)
1. Auth: login (restyled per D1/D2), registro, términos.
2. Home → buscar → resultados (lista/mapa) → detalle → punto de recogida.
3. Mis viajes → resumen (aprobado / pendiente / cancelado).
4. Publicar viaje wizard (5 steps) + vehículos + perfil (roles).
5. Driver: solicitudes → viaje programado / en curso / finalizado / cancelado.
6. Historial (lista, detalle conductor/pasajero).

### Phase 4: Web admin portal
1. `AdminShell` (single sidebar, D5) + login, error, password recovery.
2. Parámetros: one config-driven catalog screen for all 5 catalogs (list / nuevo / editar / eliminar / eliminado toast).
3. Instituciones (table, add/edit modals, validate/resend toast, activate/deactivate).
4. Usuarios (table, detail tabs, edit mode, delete confirm, admin rank).
5. Consultas generales (6 tabs on a shared `FilterBar` + `DataTable`, expandable rows, tooltips).
6. Estadísticas (KPI cards, donuts, bar charts).

### Phase 5: Hardening
- Minimal empty, loading and error states (not designed; keep them simple and consistent).
- Accessibility labels and keyboard focus on web.
- Per-screen visual comparison against the Figma frames. Pull exact spacing with `get_design_context` when implementing each screen.

## 5. Still open (non-blocking)
See [user-flows.md §4](user-flows.md#4-gaps--open-questions-not-invented-listed-for-decision). Main items:
- Mobile logout and forgot-password.
- Add-vehicle flow.
- Driver's list of published trips.
- Notifications.
- Behavior of "Volver al inicio" after a trip ends.
