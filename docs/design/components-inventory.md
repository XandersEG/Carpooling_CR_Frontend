# Components Inventory — Tuanis Carpooling

> Source: Figma file `gsw0VhFa56qIAcVPcYKjxg`, explored on 2026-11-13 (read-only).
> Related docs: [design-system.md](design-system.md) · [screens-inventory.md](screens-inventory.md) · [user-flows.md](user-flows.md) · [assets-inventory.md](assets-inventory.md)

This inventory has three parts:
1. **Formal Figma components**: real `COMPONENT` / `COMPONENT_SET` nodes, with their properties.
2. **De-facto patterns**: repeated UI drawn by hand (not componentized) that should still become one code component.
3. **Proposed code component map**, joining both.

No published library is attached and no Code Connect mappings exist. Every component is local to the file.

---

## 1. Formal Figma components

### 1.1 Mobile — Tokens page, section `Componentes (Punto 4)` (`2464:2842`)

These are the components used across Movil Punto 4–7. They are the most mature part of the file.

| Component | ID | Type | Size | Properties / variants | Used in |
|-----------|----|------|------|-----------------------|---------|
| **Card viaje** | `2446:2231` | Component | 359 × 148 | Text props: `Iniciales`, `Nombre`, `Vehiculo`, `Costo`, `Origen`, `Destino`, `Hora`, `Cupos`, `Pago` | Resultados (list & map), Mis Viajes, Historial |
| **Toggle Lista-Mapa** | `2461:2808` | Set | 359 × 40 | `Activo` = `Lista` \| `Mapa` | Resultados, Mis Viajes |
| **Resumen busqueda** | `2461:2830` | Component | 359 × 68 | none (route "TEC Cartago → San José", "Hoy · 6:30 a. m.", **Editar** link) | Resultados, Mis Viajes |
| **Boton CTA** | `2461:2855` | Component | 345 × 47 | Text prop `Etiqueta` | Buscar rutas ("Buscar viaje"), Detalle viaje ("Solicitar unirme"), Confirmar punto ("Confirmar punto de recolección") |
| **Campo busqueda** | `2461:2887` | Set | 333 × 34 each | `Campo` = `Origen` \| `Destino` \| `Fecha` \| `Horario` (leading icon: green dot / black square / calendar / clock) | Buscar rutas, Publicar Ruta/Horario, Confirmación |
| **Calendario** | `2466:3705` | Component | 402 × 364 | none ("Fecha de salida", month "Octubre 2026", Dom–Sáb grid) | Buscar rutas → Panel calendario |
| **Selector hora** | `2466:3826` | Component | 402 × 288 | none ("Hora de salida", 3 × 4 grid of time chips 5:30 a. m. … 6:30 p. m.) | Buscar rutas → Panel hora |
| **Atajo menu** | `2467:2453` | Set | 112 × 84 | `Atajo` = `Buscar viaje` \| `Publicar viaje` \| `Mis viajes` (icon in green circle + label on grey tile) | Menu Home |
| **Lugar guardado** | `2467:2454` | Component | 358 × 52 | Text props `Nombre`, `Detalle` (pin icon in green circle) | Menu Home |
| **Barra de estado** | `2472:2501` | Component | 402 × 50 | none ("9:41", signal/wifi/battery icons) | All mobile screens (mock only, not needed in code) |
| **Boton atras** | `2479:2756` | Component | 36 × 36 | none (circle `#E1E1E1`, arrow-left icon) | All mobile sub-screens |
| **Group 6** | `2429:2237` | Component | 33 × 31 | none (unnamed small graphic) | to verify |

### 1.2 Mobile/shared — Tokens page, sections `Buttons` (`84:4`) and `Icons` (`84:5`)

| Component | ID | Variants | Visual |
|-----------|----|----------|--------|
| **Primario** (button) | set `120:213` | `Property 1=Default` (`120:210`), `Property 1=Deshabilitado` (`120:214`), `Hover` (`228:160`) | 190 × 40 pill. Default `#75C217` white text, Disabled `#C9E5AE`, Hover `#A1D86E`. Label "Primario". |
| **Secundario** (button) | set `120:218` | Default `#C57346` · Deshabilitado `#EDD3C5` · Hover `#E1B69E` | Label "Acción" |
| **Terceario** (button) | set `120:221` | Default `#3F3334` · Deshabilitado `#AF9C9E` · Hover `#7F6769` | Label "Acción". Only `Property 1=Default` is a proper variant property. The other two variants are named just `Deshabilitado` / `Hover`. |
| Icon components | `2429:2225`–`2429:2232` (`Component 1…6`, `Completo`) | none | 52 × 52 circular outlined icons: Agregar (+), Completo (✓), Cancelar (✕), Otro (empty), Borrar (trash), Ayuda ("j" glyph, info), Atrás (←). Two colorways in the section: **terracotta** outline on light fill, and **grey**. Only the right-hand (grey) column is componentized. |

The same three button sets are duplicated on the Móvil page (`2099:4994`, `2099:5001`, `2099:5008`) and twice on the Web page (`230:168/175/182`, `271:75/82/89`). These are copies, not instances of one master. **Do not assume they are identical**: the Web `Terceario` copies are 238 × 186 vs 230 × 200 on Tokens.

Mobile icon/prop components seen as instances (main components not on the Tokens page): `navbar` (tab bar, 340 × 62, children `tab/home`, `tab/services`, `tab/activity`, `tab/account`), `Card Info Punto recoleccion`, `Toggle Pasajeros-Paradas`, `android keyboard`, `Generos`, `Fechas`, `Image`.

### 1.3 Web — section `7:434` (Grupo Xanders) and `7:440`/`7:432` (Grupo Steven)

| Component | ID | Variants | Purpose |
|-----------|----|----------|---------|
| **Menu lateral** | `316:1561` (set, 406 × 6620) | `Property 1` = `Default` \| `Consultas` \| `Estadísticas` \| `Instituciones` \| `Usuarios` \| `Parametros` (active item) | Sidebar for Gestión screens. Prototype links on every item, plus **Cerrar sesión** → Login. |
| **Consultas** (sidebar item) | `235:194` / copy `271:96` | `Default` \| `Block` \| `Hover` \| `Click` | Sidebar nav item "Consultas generales" |
| **Estadisticas** (sidebar item) | `237:281` / copy `271:109` | `Default` \| `Block` \| `Hover` \| `Click` | Sidebar nav item "Estadísticas" |
| **Top Conductores**, **Puntos Concurrentes**, **Usuarios Activos**, **Listado de viajes**, **Monto promedio**, **Usuarios nuevos** | `285:963`, `285:1637`, `285:1656`, `285:1675`, `285:1699`, `285:1718` | each `Default` \| `Hover` \| `Click` | The 6 numbered tab pills of *Consultas generales* |
| **Instituciones** (dropdown trigger) | `2050:1810` | `Default` \| `Click` | "Institución" select. On click it opens the **Menú Plegable** overlay. |
| **Generos** (dropdown trigger) | `2222:2258` | `Default` \| `Click` | Gender select on Estadísticas. Opens **Menú generos**. Also used on mobile Perfil/Registro. |
| **Fechas** (date trigger) | `2050:1839` | `Default` \| `Click` | Date input. Opens **Dropdown calendar**. Also used on mobile Perfil/Registro. |
| **Restablecer** | `2053:1974` | `Default` \| `Hover` | "Restablecer filtros" outlined button with reset icon |
| **Opciones** | `2055:2053` | `Default` \| `Hover` | Option row inside dropdown menus |
| **Menú Plegable** | `2055:2086` | — | Institution dropdown list (overlay) |
| **Menú generos** | `2222:2236` (frame) | — | Gender dropdown list (overlay) |
| **Dropdown calendar** | `2063:4321` | `Month` = `October 2026` \| `January 2026` | Date-picker popover with chevron-left/right |
| **Promedio1…4** | `2061:2722`, `2252:2166`, `2061:2730`, `2061:2734` (frames) | — | Hover tooltips on the Monto promedio bar chart |
| **Bell** | `280:96` | `Default` \| `Hover` | Header notification button |
| **Usuario** | `280:374` | `Default` \| `Hover` | Header user chip (avatar initials + name + role) |
| **Frame** (Listado de viajes) | `2287:3249` | `Property 1` = `1`…`6` | Trips table with row N expanded |
| **acc1** | `2277:2263` | `off` \| `on` | Accordion row (trip row collapsed/expanded) |
| **Vector** | `237:217` | — | Icon vector |
| **Generos/Property 13** | `2222:2278` | — | Gender select inside chart card |
| **Rectangle 62 / 65**, **Group 54** | `2212:4260`, `2212:4252`, `2212:4263` | — | Chart building blocks (age-range card) |
| **Component 1** | `270:453` | — | Institutions table row/button group |
| **Button** | `271:457`, `2950:10671`, `2950:11927` | — | Catalog tab pill (icon + label + count). Three separate local copies. |
| **Consultas/Variant5** | `271:997`, `2950:10682`, `2950:11938` | — | "Todos los estados" filter select. Three copies. |
| **Switch** (instance) | main not local | — | Estado toggle in Parámetros modals |
| **Checkboxes**, **check_small**, **Plus circle**, **keyboard_arrow_up**, **notifications** | instances | — | Material-style icon/checkbox instances (main components not local) |

---

## 2. De-facto patterns (drawn by hand, not componentized)

### 2.1 Mobile

| Pattern | Where | Description / variants |
|---------|-------|------------------------|
| **Screen header** | all sub-screens | `Boton atras` + title (DM Sans Bold 28). Optional right-side pill (e.g. **Solicitudes** on Mis Viajes). Optional status chip under the title ("Por iniciar", "En curso"). |
| **Bottom tab bar** | all logged-in screens | 4 tabs: Menú (home), Publicar (grid icon), Historial (bookmark), Perfil (person). Active state drawn inconsistently. |
| **Info/detail card** ("bloques" of Detalle/Resumen/Historial) | Detalle viaje, Resumen viaje ×3, Historial conductor/pasajero, Viaje finalizado/cancelado | White card, `#E1E1E1` border, radius 15, label/value rows (Cairo 13 `#7F6769` left, DM Sans Bold 14 right). Sub-variants: driver block (avatar + name + verified chip), vehicle block, route block (origin dot → destination square + Fecha/Hora rows), cost block. |
| **Chip / Tag** | trip cards, detail, results | Radius 12, Cairo 12. Green (`#C9E5AE`), orange (`#EDD3C5`), greyish-green (`#C9DAB9`, Pendiente). |
| **Avatar (initials)** | trip cards, passenger rows, profile | Circle `#A1D86E` with initials. "+2" variant for own trips. Large 96px profile avatar in mauve `#AF9C9E` with photo-edit badge. |
| **Route summary line** | trip cards | green dot + origin → black square + destination |
| **Segmented control (generic)** | Toggle Lista-Mapa (component), Toggle Pasajeros-Paradas (instance), Rol buttons (Perfil/Registro) | Only Lista-Mapa is a proper variant set |
| **Map label pill** | all map screens | White pill with `Sombra etiqueta mapa` ("San José", "TEC Cartago", "Punto seleccionado", "Mall San Pedro") |
| **Map pager pill** | Resultados mapa, Mis viaje con mapa | "1 de 3 viajes" |
| **Stop timeline** | Viaje programado/en curso – Paradas | Vertical line with filled/hollow green circles and a black square destination; time right-aligned |
| **Passenger row** | Viaje programado/en curso – Pasajeros, Solicitudes expanded | Avatar + name + green chip "Recogida: …" or amount + payment method |
| **Request card (Solicitud)** | Solicitudes1–6 | Collapsed: origin → destination mini-route + reject ✕ / accept ✓ outlined circles. Expanded: details + nested passengers card. Accepted: green fill, accept icon hidden. Rejected: removed or marked (to verify visually). |
| **Bottom action bar** | Viaje programado/en curso | Two buttons: **Cancelar** (outlined) + primary (**Iniciar viaje** with send icon / **Finalizar viaje** dark with flag icon) |
| **Confirm dialog** | Cancelar viaje (Punto 6), eliminar vehículo (Punto 2), activar vehículo (Punto 3) | Centered white card, top circular icon, title, body, two buttons. Visual style differs between Punto 6 and Punto 2/3 (see design-system §7). |
| **Result screen** | Confirmado, Viaje finalizado, Viaje cancelado | Large circular icon (green check / cancel), title, subtitle, optional summary card, CTA "Volver al inicio" |
| **Notice box** | Detalle viaje, Resumen Aprobado | `#EDD3C5` box with payment disclaimer text |
| **Form field (label + input)** | Registro, Perfil, Gestión de vehículos | Label above, filled grey input radius 14, optional trailing icon (eye, chevron). Login variant uses `#F7F4F0` fill + `#E4DDD5` border. |
| **Select / dropdown** | Género, Color del vehículo | Grey field with chevron-down (instances of `Generos`) |
| **Date field** | Edad (Registro/Perfil) | Instance of `Fechas` |
| **Stepper (− n +)** | Publicar horario (capacity 1–4), Gestión de vehículos (capacity) | Circular − / + buttons around a value. Publicar shows the max hint "Máximo permitido: 4 pasajeros". |
| **Radio list** | Publicar precio | Bordered card with radio + icon + label (Efectivo, SINPE Móvil) |
| **Currency input** | Publicar precio | "₡" prefix + numeric value |
| **Wizard step tabs** | Publicar Viaje (Punto 3) | 5 tabs Vehículo/Ruta/Horario/Pago/Confirmar, active in light green, inactive grey |
| **Vehicle card** | Lista carros (Punto 2), Lista carros viajes (Punto 3), Confirmación | Header (photo + model + "Activo" badge [+ chevron]) and spec grid (Placa, Marca, Modelo, Color, Capacidad with people icon). Variants: active (green header) / inactive (grey header); with or without Editar/Eliminar actions. |
| **Image upload** | Modificar fotografías | Dashed/bordered drop zone + thumbnail grid with remove ✕ |
| **FAB "+"** | Lista carros viajes | Green circular "+" bottom-right |
| **Home search bar** | Menu Home | Search icon, placeholder "¿A dónde vas?", **Ahora** chip with clock |

### 2.2 Web

| Pattern | Where | Description |
|---------|-------|-------------|
| **App shell** | all authenticated screens | Sidebar (366px, `#3F3334`) + header (126px, white: title, subtitle/breadcrumb, Bell, Usuario) + scrollable content area (`#C9DAB9`). Two separate implementations exist (component `Menu lateral` vs hand-drawn in Consultas/Estadísticas). |
| **Breadcrumb title** | Gestión screens | "Gestión > Usuarios > Detalle" (last segment bold) |
| **Auth split layout** | 8 login/recovery frames | Left dark brand panel, right sage background with a centered white card |
| **Text input (web)** | login, modals, filters | Label above, outlined input radius ~8–16, optional eye toggle |
| **Error banner** | Error de acceso | `#EDD3C5` box with message above the submit button |
| **Checkbox** | Recordarme, Instituciones "Validación" | Material-style |
| **Filter bar card** | Consultas, Estadísticas | Row of labelled selects/date pickers/search/number stepper + **Restablecer filtros** on the right |
| **Count badges** | Consultas results | "Mostrando N" (green pill) + "<Total>: N" (orange-light pill) |
| **Data table** | Usuarios, Instituciones, Parámetros, Consultas, Detalle Actividad | Header row (uppercase small labels in Consultas/Parámetros), row dividers, inline pills/buttons, optional bar-in-cell (Top N) and expandable rows (Listado de viajes) |
| **Rank badge** | Top N tables | Numbered circle (1–3 green filled, 4–5 light) |
| **Institution pill** | Top N tables, Usuarios nuevos | Grey pill "TEC", "UCR", "UNA", "UNED" |
| **Status pill** | Usuarios (Activo/Inactivo), Parámetros (Activo with dot), Detalle Actividad (Completado/Cancelado) | Green or orange-light |
| **Row action buttons** | Instituciones | Small pills: Editar (green or dark), Desactivar (terracotta), Activar (green), Validar (dark), Reenviar (mauve) |
| **Icon actions** | Parámetros | ✎ edit (`pen-square`), 🗑 delete (`trash-blank-alt`) |
| **Modal (dark header)** | Instituciones editar/agregar, Parámetros editar/nuevo/eliminar, Usuarios eliminar | Header bar `#3F3334` with icon + white title, body form, footer **Cancelar** (grey) + primary (green) or **Eliminar** (terracotta) |
| **Toast** | Instituciones notif (dark, bell, close ✕), Parámetros eliminado (green pill at bottom of table) | Two different toast styles |
| **Switch row** | Parámetros modals | Green-tinted box "Estado" + help text + switch |
| **Pill tab group with counts** | Parámetros catalogs | 5 pills, active filled green, inactive grey, count bubble |
| **Detail header card** | Usuario detalle | Large avatar initials + eyebrow "DETALLE DEL USUARIO" + name; optional action buttons (Eliminar Usuario dark, Dar rango Administrador terracotta) |
| **Underline tabs** | Usuario detalle | Información general / Actividad / Vehículos |
| **KPI tile** | Detalle Actividad, Estadísticas, Monto promedio, Usuarios nuevos | Big number + caption, with optional icon tile and color fill (orange-light/green-light) |
| **Charts** | Estadísticas (3 donuts + legend bars, horizontal bars), Monto promedio (vertical bars + hover tooltip), Usuarios nuevos (vertical bars) | Colors: terracotta, greens, mauve |
| **Pagination** | Usuarios | `<` `>` buttons only |

---

## 3. Proposed code component map

Names are suggestions. "Platform" means where the component is needed.

| Code component | Figma source(s) | Platform | Notes |
|----------------|-----------------|----------|-------|
| `Button` (`variant: primary \| secondary \| tertiary`, `state: default \| disabled \| hover/pressed`, `size`) | Primario / Secundario / Terceario, Boton CTA | both | CTA = primary, full width, 47 tall, radius 20 |
| `IconButton` / `BackButton` | Boton atras, icon set | both | |
| `Chip` (`tone: green \| orange \| sage \| neutral`) | chips, status pills, institution pills | both | |
| `Card` | Card viaje container, info blocks, web cards | both | |
| `TripCard` | **Card viaje** | mobile | Map the 9 text props directly to typed props. Add a `status` chip slot for Mis Viajes/Historial. |
| `SearchSummary` | **Resumen busqueda** | mobile | |
| `SegmentedControl` | **Toggle Lista-Mapa**, Toggle Pasajeros-Paradas, Rol | mobile | |
| `SearchField` (`kind: origin \| destination \| date \| time`) | **Campo busqueda** | mobile | |
| `CalendarPicker` | **Calendario**; web **Dropdown calendar** | both | |
| `TimeSlotPicker` | **Selector hora** | mobile | |
| `ShortcutTile` | **Atajo menu** | mobile | |
| `PlaceRow` | **Lugar guardado** | mobile | |
| `TabBar` | navbar | mobile | Via expo-router Tabs |
| `ScreenHeader` | back + title pattern | mobile | |
| `Avatar` (initials / image) | avatars | both | |
| `DetailBlock` + `DetailRow` | info/detail cards | mobile | |
| `RouteLine` / `StopTimeline` | route summary, Paradas timeline | mobile | |
| `RequestCard` | Solicitudes | mobile | collapsed / expanded / accepted / rejected |
| `VehicleCard` | vehicle cards | mobile | active / inactive, with/without actions |
| `Stepper` | − n + | both | |
| `RadioCardGroup` | payment method | mobile | |
| `TextField`, `PasswordField`, `SelectField`, `DateField`, `CurrencyField` | form fields | both | Extend the existing [TextField.tsx](../../components/TextField.tsx) |
| `ConfirmDialog` | mobile dialogs, web delete modals | both | Unify styles (design-system §7) |
| `Modal` (dark header) | web modals | web | |
| `Toast` | web notif / eliminado | both | |
| `ResultState` | Confirmado, Viaje finalizado/cancelado | mobile | |
| `MapView` (abstraction) | static map images | mobile (+ web for Publicar Ruta) | See assets-inventory (map) |
| `WizardSteps` | Publicar Viaje step tabs | mobile | |
| `ImageUploader` | Modificar fotografías | mobile | |
| `AdminShell` (`Sidebar`, `Header`, `UserChip`, `NotificationBell`) | Menu lateral, Bell, Usuario | web | One shell for both groups |
| `FilterBar` (+ `ResetFiltersButton`) | filter cards, Restablecer | web | |
| `DataTable` (+ expandable rows, bar cell, rank badge, pagination) | tables, acc1, Frame `2287:3249` | web | |
| `PillTabs` (with counts) / `NumberedTabs` | Parámetros catalogs; Consultas 6 tabs | web | |
| `UnderlineTabs` | Usuario detalle | web | |
| `StatCard` / `KpiTile` | KPI tiles | web | |
| `DonutChart`, `BarChart`, `HBarList` | Estadísticas, Monto promedio, Usuarios nuevos | web | Needs an SVG-capable chart approach |
| `Switch` | Estado | web | |
| `Checkbox` | Recordarme, Validación | web | |
