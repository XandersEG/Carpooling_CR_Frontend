# Design System — Tuanis Carpooling

> Source: Figma file **Prototipo-Proyecto-Carpooling** (`gsw0VhFa56qIAcVPcYKjxg`), explored on 2026-11-13 via the Figma MCP (read-only).
> Related docs: [screens-inventory.md](screens-inventory.md) · [components-inventory.md](components-inventory.md) · [user-flows.md](user-flows.md) · [assets-inventory.md](assets-inventory.md)

## 0. How to read this document

The file does **not** have one consistent design system. Values come from four sources, listed here from most to least authoritative:

| # | Source | Scope | Notes |
|---|--------|-------|-------|
| 1 | **Local variables** (collections `Colores`, `Radios`, `Espaciado`) | Mobile, mostly *Movil Punto 4–7* | ~1,550 nodes bound across Puntos 4–7, but only 19 in Punto 2, 111 in Punto 3, 2 in Punto 1 and 0 on the Web page. |
| 2 | **Local text styles** `Carpooling/*` and **effect styles** `Carpooling/Sombra *` | Mobile | No local paint styles or grid styles exist. |
| 3 | **Tokens page** (`84:2`) and the duplicated `COLORES - ICONOS - LETRAS` section (`2501:5820`) | Both | Swatches, type specimens, buttons and icons. **The swatch frame names are stale**: e.g. frame `#B2D258` actually contains `#75C217`. Always trust the fill or label, not the frame name. |
| 4 | **Values observed on screens** (aggregated by script over every node) | Both | Used where no token exists, especially on Web. |

Where these disagree, this doc says so explicitly rather than picking one silently.

---

## 1. Color

### 1.1 Brand palette (Tokens page → `Colores`, section `85:10`)

The real values below come from the swatch fills. The names in parentheses are the stale frame names, which look like an earlier version of the palette.

| Family | Strong | Medium | Light |
|--------|--------|--------|-------|
| Lime green (primary) | `#75C217` *(was #B2D258)* | `#A1D86E` *(was #D1E49B)* | `#C9E5AE` *(was #E3EFC3)* |
| Sage green | `#6C9744` *(was #87A566)* | `#A7C28E` *(was #C0D0AF)* | `#C9DAB9` *(was #D9E3CF)* |
| Terracotta | `#C57346` | `#E1B69E` | `#EDD3C5` |

| Neutrals | | | |
|----------|---|---|---|
| `#3F3334` dark brown | `#C7C7C7` grey | `#1C1C1C` near-black |
| `#7F6769` mauve-brown | `#E1E1E1` light grey | `#4D4D4D` dark grey |
| `#AF9C9E` dusty mauve | `#FFFFFF` white | `#8C8C8C` mid grey |

**"Colores (Variación Móvil 4)"** (`2452:2430`): `#E4DDD5` (input border), `#6E6262` (placeholder text), `#75C217`.

The same 18 swatches are duplicated on the Web page (sections `7:434` and `7:440`) with the same stale names.

### 1.2 Semantic color variables (collection `Colores`, mode `Valor`)

| Variable | Value | Observed usage |
|----------|-------|----------------|
| `color/accion/primario` | `#75C217` | Primary CTA fill, active segment, route line, origin dot, success icon |
| `color/acento/verde` | `#6C9744` | "Editar" link on search summary, accents |
| `color/superficie/verde-claro` | `#C9E5AE` | Chips (time, seats, approved, verified badge) |
| `color/superficie/verde-suave` | `#A1D86E` | Avatar circles (initials), "Solicitudes" pill |
| `color/superficie/naranja-claro` | `#EDD3C5` | Payment and cancelled chips, info notice box, cancel-dialog icon bg |
| `color/superficie/input` | alias → (see note) | Input background |
| `color/borde/input` | `#E4DDD5` | Input border |
| `color/borde/tarjeta` | `#E1E1E1` | Card border |
| `color/borde/busqueda` | `#8C8C8C` | Search-summary card border |
| `color/texto/titulo` | `#000000` | Screen titles |
| `color/texto/principal` | `#1C1C1C` | Body/strong text |
| `color/texto/oscuro` | `#3F3334` | Labels/values |
| `color/texto/secundario` | `#7F6769` | Secondary text (e.g. "Toyota Corolla · Blanco") |
| `color/texto/placeholder` | `#6E6262` | Placeholders |
| `color/texto/subtitulo` | alias → (see note) | Subtitles |
| `color/linea/ruta` | `#C7C7C7` | Dashed/connector line between origin and destination |
| `color/base/blanco` | `#FFFFFF` | Surfaces |

> Note: `color/superficie/input` and `color/texto/subtitulo` are aliases to variable IDs `VariableID:2452:2394` and `VariableID:2452:2399`. These IDs were not resolved because they don't belong to a local collection, so they are probably from a removed or remote collection. On screen, inputs render `#E1E1E1` and subtitles `#7F6769`. **To verify** before relying on them.

### 1.3 Color usage observed on screens (not tokenized)

**Mobile (Puntos 4–7, canonical "green" style)**
- Screen background `#FFFFFF`. Map screens use a full-bleed static map image.
- Tab bar: white, labels `#727272` / `#89898B` at 12px. The active tab is darker.
- Search fields inside the search card: `#E1E1E1` pills.
- Driver trip action bar: "Cancelar" is a white outlined button, "Iniciar viaje" is a `#A1D86E`/`#75C217` fill, and "Finalizar viaje" is `#3F3334` with white text.
- Status chips:

  | Status | Fill |
  |--------|------|
  | Aprobado / Aprobada | `#C9E5AE` |
  | Pendiente | `#C9DAB9` (greyer green) |
  | Cancelado | `#EDD3C5` |
  | Finalizado | `#C9E5AE` |
  | Por iniciar / En curso | `#C9E5AE` |

- Request card icons: reject is an outlined circle in `#C57346`, accept an outlined circle in `#75C217`. An accepted request card gets a `#C9E5AE` fill.

**Mobile (Puntos 1–3, older style, see §7)**
- Punto 1 (Login/Registro): text `#413333`, placeholder `#6E6262`, inputs `#E1E1E1` (Registro) or `#F7F4F0` with border `#E4DDD5` (Login). Primary button `#413333` with white text. Link underline in terracotta.
- Punto 2/3: active vehicle card header `#DBF0C9`/`#C6F2AF`, inactive header `#8C8C8C`. "Activo" badge `#B7E2A7` with dot `#027102`. Destructive actions in `#F4CECE` (bg) with `#AA3838`/`#CF1B2E` text, confirm buttons `#CC3E13`@78% (orange-red). Step tabs: active `#B7E2A7`, inactive `#8C8C8C`.

**Web (admin portal)**
- Sidebar `#3F3334`, sidebar text `#E1E1E1`. The active item is a `#7F6769` pill with a 1–2px `#75C217` border and radius 16.
- Header bar `#FFFFFF`, 126px tall, title `#3F3334`.
- Content background `#C9DAB9` (some frames `#DAE3D0`).
- Cards `#FFFFFF` with radius 23–26.
- Primary buttons `#75C217`. Secondary/destructive `#C57346` (Desactivar, Eliminar). Tertiary/dark `#3F3334` (Validar, Editar on inactive row).
- "Reenviar" `#7F6769`. "Activo" status pill `#A1D86E` with dot.
- Modal header `#3F3334` with white title and icon. Toasts: dark `#3F3334` (Instituciones) or green pill `#A1D86E` (Parámetros).
- Charts use `#C57346` (terracotta), `#6C9744`/`#7FA65D` (greens), `#7F6769` (mauve). A highlighted table row uses `#EDD3C5`.

### 1.4 Discarded palette exploration
`Movil Punto 4` contains a second row of the same five screens (`2506:5704`, `2506:5732`, `2522:3649`, `2506:5771`, `2506:5826`). It uses a brown/café primary (`#7F6769`) instead of lime green. The canvas note `2506:6392` reads *"Solo es para ver como se vería de café. Es que verde se ve muy chillón"*, and the Home frame is literally named **"Menu No Usar"**. **Treat this row as a discarded exploration and do not implement it.**

---

## 2. Typography

### 2.1 Font families in use

| Family | Where | Notes |
|--------|-------|-------|
| **DM Sans** | Mobile: titles, names, buttons, card text | Already loaded in the repo (`@expo-google-fonts/dm-sans`). Text styles use weights 400, 700 and 900 (Black), plus ExtraLight/Light/SemiBold in Punto 2/3. |
| **Cairo** | Mobile secondary text (12–14), Punto 1 login/register, **primary font of the whole Web portal** | Not yet in the repo. |
| **Inter** | Web *Consultas generales* tables/labels (10–15px); Términos y Condiciones screen | Probably incidental (imported HTML). |
| **Nunito Sans** | Web login (only the "✓" checkbox glyph) | Incidental. |
| **42dot Sans / ABeeZee** | Mobile **tab bar labels only** ("Menú", "Publicar" use 42dot Sans Medium 12; "Historial", "Perfil" use ABeeZee 12) | Looks accidental. Recommend DM Sans or Cairo 12. |
| **Comfortaa** | Only in the Tokens specimen | **Not used on any screen.** |

### 2.2 Local text styles (`Carpooling/*`, mobile)

| Style | Family / weight | Size | Line height | Usage |
|-------|-----------------|------|-------------|-------|
| `Carpooling/Titulo pantalla` | DM Sans Bold (700) | 28 | auto | Screen title ("Resultados", "Detalle del viaje") |
| `Carpooling/Subtitulo` | DM Sans 9pt Regular (400, opsz 9) | 13 | auto | Subtitles |
| `Carpooling/Nombre destacado` | DM Sans Bold | 17 | auto | Person name on detail screens |
| `Carpooling/Nombre tarjeta` | DM Sans Bold | 15 | auto | Name inside trip card |
| `Carpooling/Texto fuerte` | DM Sans Bold | 14 | auto | Values in detail rows, origin/destination |
| `Carpooling/Boton y costo` | DM Sans Black (900) | 16 | auto | CTA labels and prices ("₡1 500") |
| `Carpooling/Toggle activo` | DM Sans Black | 14 | auto | Active segment label |
| `Carpooling/Texto secundario` | Cairo Regular | 13 | auto | Labels ("Placa", "Fecha") |
| `Carpooling/Texto pequeno` | Cairo Regular | 12 | auto | Chips, captions |

Letter spacing is 0% for all styles.

### 2.3 Type specimen on the Tokens page (section `Fonts`, `84:3`)

| Level | Cairo | Comfortaa (unused) |
|-------|-------|--------------------|
| Heading 1 | ExtraBold 36 | Bold 36 |
| Heading 2 | Bold 32 | Bold 32 |
| Heading 3 | Bold 24 | Bold 24 |
| Heading 4 | SemiBold 20 | SemiBold 20 |
| Caption | Black 10 | Bold 10 |
| Normal text | SemiBold 12 | SemiBold 12 |

### 2.4 Observed web type scale (Cairo unless noted)
- Page title ("Gestión de Parámetros", "Consultas generales"): Cairo Bold, about 32.
- Section/card titles: Cairo Bold 20, SemiBold 20.
- Sidebar items: Cairo SemiBold/Bold 15–20.
- Table text: Cairo Medium/SemiBold 15–16 (Gestión screens); Inter Regular 11–13 (Consultas tables).
- Login hero "Viaja seguro, / ahorra en cada recorrido": Cairo Bold 51. Login card title: Cairo Bold 30. Field labels: Cairo SemiBold 13.

---

## 3. Spacing & layout

### 3.1 Spacing variables (collection `Espaciado`)

| Token | Value |
|-------|-------|
| `espacio/margen-pantalla` | 22 |
| `espacio/2xs` | 6 |
| `espacio/xs` | 8 |
| `espacio/s` | 10 |
| `espacio/m` | 12 |
| `espacio/l` | 14 |
| `espacio/xl` | 16 |
| `tamano/icono` | 16 |

### 3.2 Mobile layout (verified on `2446:2252 Resultados viajes`)
- Frame 402 × 874. Content column x = 22, width = **359** (402 − 2 × 22).
- Status bar component `Barra de estado` 402 × 50 at the top. Logo (42 × 41) is centred at y 20 on some screens (overlapping the status bar area).
- Header row at y ≈ 69: back button (36 × 36 circle, `#E1E1E1`) followed by a 28px title.
- Fixed bottom area: white rectangle 402 × 70 at y 804, containing the `navbar` instance (340 × 62).
- Vertical rhythm between blocks: 8–16 (e.g. summary card y 124 h 68 → toggle y 200 → count y 256 → list y 280).

### 3.3 Web layout (verified on `271:254`, `228:142`, `259:13`)
- Frame 1920 × 1080, background `#444444` behind the layout.
- **Sidebar**: x 0, width **366**, full height, `#3F3334`.
- **Header**: x 366, width 1554, height **126**, white. Title at (420, 22), subtitle at (420, 76). Bell icon at x 1631 and user chip (avatar + name + role) at x 1695.
- **Content area**: x 366, width 1554, `#C9DAB9`. Content cards start at x ≈ 420–482 with ~54–116px side padding.
- Some frames extend below 1080 (`285:483 Estadísticas` content reaches 1549px), so **the content area scrolls vertically**.

---

## 4. Corner radius

### 4.1 Radius variables (collection `Radios`)

| Token | Value | Usage |
|-------|-------|-------|
| `radio/chip` | 12 | Chips/tags |
| `radio/input` | 14 | Inputs (also Login/Registro fields) |
| `radio/tarjeta` | 15 | Cards (trip card, detail blocks) |
| `radio/segmento` | 16 | Segmented control inner pill |
| `radio/boton` | 20 | CTA buttons, toggle container |

### 4.2 Other observed radii
- Mobile: 18 (36px circular back button), 2 and 5 (small markers), 22, 36 (dialog icon circles).
- Punto 2/3: 10, 14, 25 (pills), 8.
- Web: 16 (sidebar items, filter inputs, pills), 23/26 (content cards), 7 (Consultas tab pills), 45/100/166 (fully rounded pills and avatars), 9 and 3.

---

## 5. Elevation (shadows)

| Name | Spec (CSS equivalent) | Where |
|------|-----------------------|-------|
| `Carpooling/Sombra tarjeta` (effect style) | `0 2px 8px rgba(0,0,0,.08)` | Mobile cards |
| `Carpooling/Sombra etiqueta mapa` (effect style) | `0 2px 6px rgba(0,0,0,.18)` | Map label pills ("San José", "TEC Cartago") |
| *(observed)* | `0 -4px 16px rgba(0,0,0,.12)` | Mobile bottom panels over map (Punto 6) |
| *(observed)* | `0 8px 24px rgba(0,0,0,.20)` | Mobile dialog ("¿Cancelar viaje?") |
| *(observed)* | inner `0 .5px .5px rgba(0,0,0,.25)` | Status bar / small details |
| *(observed, Punto 2/3)* | `0 4px 4px rgba(0,0,0,.25)`, `0 1px 1px rgba(0,0,0,.25)` | Buttons/cards in older style |
| *(observed, Web)* | `0 4px 6px rgba(0,0,0,.25)`, `0 8px 28px rgba(0,0,0,.07)` | Consultas cards and tabs |

Modal scrims: mobile uses black at about 45% (`#000000@0.45`). Web modals dim the page with a translucent grey overlay.

---

## 6. Borders & strokes

| Stroke | Where |
|--------|-------|
| 1px `#E1E1E1` | Mobile cards |
| 1px `#8C8C8C` | Mobile search-summary card |
| 1px `#E4DDD5` | Mobile inputs (Punto 1, 4) |
| 1.4px `#6E6262` | Mobile search panel fields |
| 1/3px `#C57346`, 1/3px `#75C217` | Reject/accept circular icons (Solicitudes) |
| 2px `#E1E1E1`, 1px `#C7C7C7` | Web cards/tables |
| 1–2px `#75C217` | Web active sidebar item, focused/selected elements |

---

## 7. Known inconsistencies (must be resolved before or during implementation)

1. **Two mobile visual generations.**
   - Puntos 4–7 (search, my trips, trip management, history) use the variables and text styles.
   - Puntos 1–3 (login/register, vehicles, publish trip, profile) were drawn earlier with different greens (`#027102`, `#B7E2A7`), reds (`#F4CECE`, `#CC3E13`), weights (DM Sans ExtraLight/Light) and radii (10/14/25).
   - **Recommendation:** implement everything with the Punto 4–7 tokens and map the Punto 1–3 elements onto them. This needs product/design confirmation.
2. **Login/Registro palette** (`#413333` primary button) differs from the rest of the app (lime-green CTAs). The repo's current [theme.ts](../../src/constants/theme.ts) follows the Login palette.
3. **Tab bar fonts** (42dot Sans / ABeeZee) look accidental.
4. **Active tab indicator is inconsistent.** In the Publicar flow the "Perfil" tab is drawn active, and in other screens no tab is highlighted.
5. **Destructive-action styling differs.**
   - Mobile Punto 2/3 dialogs: orange-red filled.
   - Mobile Punto 6 "Sí, cancelar": `#EDD3C5` fill.
   - Web: terracotta `#C57346`.
6. **Web has two shells.** The Steven-group screens use the `Menu lateral` component (bold "Portal administrativo" heading). The Xanders-group screens (Consultas/Estadísticas) draw their own sidebar with the same items and slightly different typography.
7. **Stale Tokens frame names** (see §1.1).
8. **Button component naming**: `Terceario` should be "Terciario". Its variants are not uniformly named (`Property 1=Default`, `Deshabilitado`, `Hover`).

---

## 8. Breakpoints & responsiveness

| Target | Frame size | Count | Notes |
|--------|-----------|-------|-------|
| Mobile app | **402 × 874** | 57 frames | Matches a 402pt-wide iPhone. Status bar is iOS style, but the keyboard instance is "android keyboard". |
| Mobile (outliers) | 421 × 844 (`2081:3` Inicio de sesión), 424 × 861 (`3069:3947` Términos y condiciones, content 6,417 tall) | 2 | Look like HTML-to-Figma imports (layers named `Background`, `Container`, `Margin`). |
| Web admin portal | **1920 × 1080** | 54 frames | Desktop only. Some content overflows vertically. |

- **No responsive variants exist**: no tablet, no narrow-desktop, no mobile-web versions of the admin portal.
- No auto-layout breakpoints or grid styles were defined.
- Anything beyond "mobile at about 402 wide" and "desktop at 1920" is an implementation decision. Suggested defaults are in the implementation plan.

---

## 9. Proposed token mapping for code (proposal, not in Figma)

```ts
// src/constants/theme.ts (proposed shape; values from Figma variables)
colors: {
  primary: '#75C217',          // color/accion/primario
  accentGreen: '#6C9744',      // color/acento/verde
  surfaceGreenLight: '#C9E5AE',
  surfaceGreenSoft: '#A1D86E',
  surfaceOrangeLight: '#EDD3C5',
  inputBorder: '#E4DDD5',
  cardBorder: '#E1E1E1',
  searchBorder: '#8C8C8C',
  textTitle: '#000000',
  textPrimary: '#1C1C1C',
  textDark: '#3F3334',
  textSecondary: '#7F6769',
  textPlaceholder: '#6E6262',
  routeLine: '#C7C7C7',
  white: '#FFFFFF',
  terracotta: '#C57346',
  // web shell
  sidebar: '#3F3334', sidebarText: '#E1E1E1', sidebarActive: '#7F6769',
  webContentBg: '#C9DAB9',
}
radius: { chip: 12, input: 14, card: 15, segment: 16, button: 20 }
spacing: { screen: 22, xxs: 6, xs: 8, s: 10, m: 12, l: 14, xl: 16 }
```
