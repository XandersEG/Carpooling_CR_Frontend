# Assets Inventory — Tuanis Carpooling

> Source: Figma file `gsw0VhFa56qIAcVPcYKjxg`, explored on 2026-11-13 (read-only).
> Node IDs below are export targets (use `download_assets` / `get_screenshot` on them, or export from Figma). IDs starting with `I…;…` are nested instance children. Export from the main component where one is listed.
> Related docs: [design-system.md](design-system.md) · [screens-inventory.md](screens-inventory.md) · [components-inventory.md](components-inventory.md) · [user-flows.md](user-flows.md)

**Nothing has been downloaded yet.** The repo currently has only [assets/images/logo.png](../../assets/images/logo.png).

---

## 1. Brand / logo

| Asset | Node | Format in Figma | Size | Used in | Notes |
|-------|------|-----------------|------|---------|-------|
| Logo "Tuanis Carpooling" (mobile, raster) | image fill, sample `2518:3433` (hash `9202c8f6…`) | PNG (crop) | 42 × 41 on screens; larger on Login (`2081:6`, 188 × 186) | 52 uses: every mobile screen header, mobile login | Hand-drawn car/leaf mark + script wordmark "Tuanis" + "Carpooling". Compare with the existing `assets/images/logo.png` before re-exporting. |
| Logo original · Tuanis Carpooling (web, raster) | `277:616` (hash `7355fcd2…`) | PNG | 180 × 127 | Web login card ×8 | Same mark, color version |
| Logo (web sidebar, vector group) | `I259:798;382:1987` ("Logo"), with parts `Logo Icono` (`…;382:1988`, 61 × 52) and `Logo Titulo` (`…;382:2014`, 99 × 42) | Vector | 167 × 52 | Sidebar of every Gestión screen (47 uses) | Green circle icon variant + white script title. **Prefer SVG export.** |
| Logo_Vector 1 / 2 | `256:338`, `271:124` | Vector frame | 500 × 500 | Specimen only | Master vector of the mark |
| Texto_Vector 1 / 2 | `256:362`, `271:148` | Vector frame | 500 × 500 | Specimen only | Master vector of the wordmark |
| Brand panel decoration | inside `277:601` (Panel de marca) | Vector | — | Web auth screens | Dashed curved route with two green dots |

Naming note on canvas (`2410:4623`): "Tuanis - Carpooling / Ride - Carpooling", which may be naming options.

## 2. Raster images

| Asset | Node (sample) | Hash | Size on screen | Uses | Notes |
|-------|---------------|------|----------------|------|-------|
| **Static map** "Map 1920×1080 — Voyager" | `2642:3673` | `d564013650a9…` | up to 2708 × 2448 (cropped per screen) | 16: Home, Buscar rutas, Resultados mapa, Seleccionar/Confirmar punto, Mis viaje con mapa, Viaje programado/en curso, Publicar Ruta | A screenshot of a CARTO "Voyager"-style basemap of San Pedro/Curridabat. Route lines, markers and labels are **separate vector layers drawn on top**. **A placeholder only.** See §6. |
| Toyota Corolla photo | `2390:2000` | `89cd544b…` | 89 × 91 | 9 | Filename suggests an internet stock photo ("toyota-corolla-gli-2016-…"). **Licensing unknown.** Sample data only. |
| Hyundai Tucson photo | `2390:2021` | `6b5ff901…` | 84 × 63 | 6 | "…2026HYS…-remo…", internet image |
| Nissan Versa photo | `2390:2041` | `9fd0d60f…` | 91 × 54 | 6 | "13-133923_a-red-nissan-versa-2018…", internet image |
| "People" capacity icon (raster) | `2390:2001` | `5acc8223…` | 25 × 18 | 19 | Raster icon used next to "Capacidad". Replace with a vector icon. |
| Pencil icon (raster) | `2295:4591` | `dc208df1…` | 22 × 20 | 6 | "Minimal Pencil and Trash Icons", vehicle Editar button. Replace with vector. |
| Trash icon (raster) | `2295:4594` | `776080398f…` | 18 × 23 | 7 | Same source, vehicle Eliminar button. Replace with vector. |
| Web "imagen 1/2/3" | `2212:4182`, `2212:4188`, `2212:4200` | `cc4cd629…`, `7671e221…`, `a65eff23…` | 56–76 px | 1 each | Estadísticas KPI tile illustrations (car, person, group of people) |
| Web "image 2" | `285:1298` | `26f49997…` | 102 × 102 | 1 | Loose image near the sidebar components (to verify) |

## 3. Icons

### 3.1 Mobile

| Icon | Node | Size | Uses | Likely source |
|------|------|------|------|---------------|
| `tab/home` | `I2518:3444;22851:374` | 48 × 40 (incl. label) | 54 | navbar instance (house) |
| `tab/services` | `…;22851:375` | 45 × 40 | 54 | 3 × 3 dot grid ("Publicar") |
| `tab/activity` | `…;22851:399` | 48 × 40 | 54 | bookmark/receipt ("Historial") |
| `tab/account` | `…;22851:416` | 30 × 40 | 54 | person ("Perfil") |
| `icon/atras` | `I2518:3473;2479:2757` | 20 × 20 | 47 | arrow-left (inside `Boton atras` `2479:2756`) |
| `icon/origen` | `I2461:2888;2461:2862` | 16 × 16 | 4 | green dot (Campo busqueda) |
| `icon/destino` | `I2461:2894;2461:2868` | 16 × 16 | 4 | black square |
| `icon/fecha` | `I2461:2900;2461:2874` | 16 × 16 | 7 | calendar |
| `icon/horario` | `I2461:2907;2461:2881` | 16 × 16 | 7 | clock |
| `icon/buscar` | `2467:2471` | 22 × 22 | 2 | magnifier (Home search bar) |
| `icon/reloj` | `2467:2476` | 16 × 16 | 2 | clock ("Ahora" chip) |
| `icon/car` | `I2467:2482;2467:2438` | 24 × 24 | 2 | car (Atajo Buscar viaje) |
| `icon/plus` | `I2467:2489;2467:2445` | 24 × 24 | 2 | plus (Atajo Publicar viaje) |
| `icon/list` | `I2467:2494;2467:2450` | 24 × 24 | 2 | list/hamburger (Atajo Mis viajes) |
| `icon/lugar` | `I2467:2501;2467:2456` | 24 × 24 | 6 | map pin (Lugar guardado) |
| `lucide/user` | `2519:8541` | 10 × 10 | 3 | **Lucide** "user" (Perfil screens; exact placement to verify, probably the Rol buttons) |
| `lucide/user-round` | `2519:8543` | 13 × 13 | 3 | **Lucide** "user-round" (Perfil screens; placement to verify) |
| `lucide/car` | `2519:9736` | 24 × 24 | 4 | **Lucide** "car" (Perfil screens; the Mis Vehículos floating button shows a car) |
| `SVG` (eye) | `2642:3696`, `2081:27` | 19–20 | 8 | eye / show-password |
| `Icono resultado` | `2642:3892` | 72 × 72 | 3 | big green check circle (Viaje finalizado, Confirmado) |
| `Icono cancelar` | `2642:4006` | 72 × 72 | 1 | ✕ in orange-light circle (Cancelar viaje dialog) |
| Status bar icons `icon/senal`, `icon/wifi`, `icon/bateria` | `I2518:3445;2472:2503/2508/2512` | 17–27 | 55 | **Mock only. Do not implement** (the OS draws the status bar). |
| Send (paper plane), flag | inside Viaje programado/en curso buttons | ~16 | — | "Iniciar viaje" / "Finalizar viaje" icons |
| Photo-edit badge, image placeholder | Perfil, Modificar fotografías | — | — | image icon |
| Tokens icon set (outlined circles) | `2429:2225`–`2429:2232`; frames `120:93`, `120:148`, `120:150`, `120:152`, `120:153`, `120:154`, `2429:2187` | 52 × 52 | — | Agregar, Completo, Cancelar, Otro, Borrar, Ayuda (info "j"), Atrás, in terracotta and grey colorways |

### 3.2 Web

| Icon | Node | Size | Uses | Likely source |
|------|------|------|------|---------------|
| Bell (notifications) | set `280:96` | 46 × 44 on screens | 46 | outline bell in circle |
| `notifications` | `270:1944` | 79 × 79 | 1 | **Material Symbols** "notifications" (toast) |
| `keyboard_arrow_up` / chevron `icon` | `I2341:3652;2287:2287;2277:2255` | 27 × 27 | 72 | **Material Symbols** (Ver detalles expand) |
| `check_small` | `2920:6158` | 24 × 24 | 5 | **Material Symbols** (checkbox) |
| `Checkboxes` | `2920:6155` | — | 5 | Material checkbox component instance |
| `Plus circle` | `270:1077` | 26 × 26 | 30 | Plus-in-circle (Agregar Institución, Nuevo Parámetro) |
| `pen-square-svgrepo-com` | `2160:4189` | 16 × 39 | 100 | **SVG Repo** edit icon |
| `trash-blank-alt-svgrepo-com` | `2950:7283` | 35 × 35 | 100 | **SVG Repo** trash icon |
| `wallet-minus-svgrepo-com` | `271:447` | 34 × 34 | 125 | **SVG Repo** wallet (catalog pill icons) |
| `chevron-left` / `chevron-right` | `2063:4314`, `2063:4317` | 16 × 16 | 4 each | Calendar navigation |
| `Switch` | `271:2000` | 52 × 32 | 10 | Toggle (component instance) |
| Sidebar icons | inside `Menu lateral` `316:1561` | ~20 | — | search (Consultas), bar-chart (Estadísticas), home (Instituciones), user (Usuarios), sliders (Parámetros), logout (Cerrar sesión) |
| Consultas tab icons | inside `285:963`… | ~16 | — | trophy, map-pin, users, list, wallet, user-plus |
| Generic `Icon` vectors | `2327:4702` | 16 × 16 | 296 | Many small icons share this layer name |
| `Vector` | `237:217`, `244:308` | 72 × 84 | many | Unnamed vectors. Identify per use when implementing. |

### 3.3 Icon strategy (recommendation, not in Figma)
- The design mixes **Lucide** (named layers), **Material Symbols** (named layers) and **SVG Repo** downloads.
- Option A (fastest): use `@expo/vector-icons` (already installed: Ionicons, MaterialIcons, Feather, MaterialCommunityIcons) and pick the closest glyph. **Visual differences from the design are expected.**
- Option B (most faithful): export the specific icons as SVG from the nodes above and render with `react-native-svg`. This is needed for Lucide parity anyway (`lucide-react-native` requires `react-native-svg`).
- Decide once per platform. Don't mix both approaches inside a screen.

## 4. Fonts

| Family | Weights needed | Status in repo | Package |
|--------|----------------|----------------|---------|
| DM Sans | 400, 500, 600 (loaded) + **700, 900** (used by text styles) | Partially loaded in [app/_layout.tsx](../../app/_layout.tsx) | `@expo-google-fonts/dm-sans` (installed) |
| Cairo | 400, 500, 600, 700, 800, 900 | **Missing** | `@expo-google-fonts/cairo` |
| Inter | 400, 500, 700 | Missing (optional, see design-system §2.1) | `@expo-google-fonts/inter` |
| Comfortaa, Nunito Sans, 42dot Sans, ABeeZee | — | Not needed (unused or accidental) | — |

## 5. Illustrations & decorative elements
- Web auth brand panel: dashed curved route with green endpoints (vector, `277:601`).
- Mobile result states: large circular icons (`Icono resultado`, `Icono cancelar`).
- Map overlays: route polyline `#75C217` (about 4px), origin marker (green filled circle with white ring), destination marker (black square), intermediate stops (green hollow/filled circles), selected pickup marker (square in light orange), label pills.

## 6. Map assets & decision needed
- All maps in the design are **one static raster image** (CARTO Voyager style) with vector overlays.
- Screens that need a map: Menu Home (decorative background), Buscar rutas (background), Resultados mapa, Mis viaje con mapa, Seleccionar/Confirmar Punto Recogida (interactive: pick point on route), Viaje programado/en curso (route + stops), Publicar Ruta (route preview + distance/time).
- Implementation options:
  1. Static placeholder image for the first iteration (matches the design 1:1).
  2. `react-native-maps` on native plus a web map library on web (e.g. Leaflet/MapLibre with CARTO tiles, matching the Voyager look).
- Route distance/time ("24 km • 50 min") implies a routing service. **Not specified.**

## 7. Sample data visible in assets (do not ship)
Names, emails, phone numbers, plates and the clear-text password ("Diego2026!" in `2961:8917`) appear in the mockups. They are placeholders. Use them only as fixtures in a mock layer, never as defaults in production code.
