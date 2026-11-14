# User Flows & Navigation — Tuanis Carpooling

> Source: Figma file `gsw0VhFa56qIAcVPcYKjxg`, explored on 2026-11-13 (read-only).
> These flows come from the **prototype interactions** in the file (408 links on Móvil, about 600 on Web, all extracted programmatically), cross-checked against the screen content. Links that are missing, contradictory or look like prototype shortcuts are flagged and not "fixed".
> Related docs: [design-system.md](design-system.md) · [screens-inventory.md](screens-inventory.md) · [components-inventory.md](components-inventory.md) · [assets-inventory.md](assets-inventory.md)

## 0. Users & platforms

| Actor | Platform | Evidence |
|-------|----------|----------|
| **Pasajero** (passenger) | Mobile app | Search, join request, my trips, history |
| **Conductor** (driver) | Mobile app | Vehicles, publish trip, requests, trip execution |
| A user can be **both** | Mobile app | "Rol" multi-select in Registro/Perfil. Variants Perfil - Conductor / Pasajero / Ambos. History shows trips as Conductor and as Pasajero. |
| **Administrador** | Web portal | "Portal administrativo", "Acceso exclusivo para personal autorizado" |

Prototype flow starting points defined in Figma (Móvil page only): `Flow 2` → Inicio de sesión (`2081:3`), `Flow 3` → Registro (`2102:1801`), `Flow 4` → Lista carros viajes (`2390:1976`), `4.4.4 Búsqueda y detalle de viaje` → Menu Home (`2467:2462`). The Web page has no flow starting points.

---

## 1. Mobile navigation structure

```mermaid
flowchart LR
  subgraph Auth["Auth stack (no tab bar)"]
    L["Inicio de sesión"] -->|"Regístrate"| R["Registro"]
    R -->|"Términos y condiciones"| T["Términos y condiciones"]
    R -->|"back"| L
  end
  L -->|"Iniciar sesión"| Home
  subgraph Tabs["Bottom tab bar"]
    Home["Menú: Menu Home"]
    Pub["Publicar: Lista carros viajes (wizard step 1)"]
    Hist["Historial: Historial de viajes"]
    Perf["Perfil: Perfil - Ambos (or Conductor)"]
  end
```

**Tab bar targets (from prototype):** `tab/home` → Menu Home · `tab/services` → Lista carros viajes · `tab/activity` → Historial de viajes · `tab/account` → Perfil - Ambos (from Menu Home it goes to Perfil - **Conductor**).

Flags:
- The labels say "Menú / Publicar / Historial / Perfil", but the layer names are `home / services / activity / account`.
- In the Publicar flow and the Perfil screens the bar is drawn with **Perfil** active. The active state is not reliable in the design.
- On some screens (Punto 3, Punto 4 Resultados/Detalle, Buscar rutas) only `tab/home` is wired.
- "Mis viajes" is **not a tab**. It is reached from the Home shortcut.

---

## 2. Mobile flows

### 2.1 Authentication
```mermaid
flowchart LR
  A["Inicio de sesión (2081:3)"] -->|"tap Iniciar sesión*"| H["Menu Home (2467:2462)"]
  A -->|"Regístrate"| B["Registro (2102:1801)"]
  B -->|"Términos y condiciones"| C["Términos y condiciones (3069:3947)"]
  B -->|"hotspot 'Margin' (unlabeled)"| A
  C -->|"‹ back"| B
```
\* In the prototype the whole login background is the hotspot. There is no validation, no error state and no "forgot password" on mobile. The **Registrar** button has no prototype link. There is no logout anywhere in the mobile app.

### 2.2 Passenger: search → join a trip
```mermaid
flowchart LR
  H["Menu Home"] -->|"search bar / Buscar viaje tile / Lugar frecuente"| S["Buscar rutas (2427:2341)"]
  S -->|"tap field"| P["Panels: keyboard origen / destino, calendario, hora (variables)"]
  P --> S
  S -->|"Buscar viaje"| RL["Resultados viajes (lista)"]
  RL <-->|"Lista / Mapa toggle"| RM["Resultados mapa"]
  RL -->|"Editar"| S
  RM -->|"Editar"| S
  RL -->|"tap Card viaje"| D["Detalle viaje (2448:2822)"]
  RM -->|"tap Card viaje"| D
  D -->|"Solicitar unirme"| SP["Seleccionar Punto Recogida (2506:5746)"]
  SP -->|"tap route"| CP["Confirmar Punto Recogida (2522:4082)"]
  CP -->|"tap another point"| CP2["Confirmar Punto Recogida V2 (2567:4861)"]
  CP -->|"Confirmar punto de recolección"| MV["Mis Viajes (2501:6043)"]
  CP2 -->|"Confirmar punto de recolección"| MV
```
Notes:
- Buscar rutas uses Figma variables to simulate state: `busqueda/origen` "TEC Cartago", `busqueda/destino` "San José", `busqueda/fecha` "Hoy", `busqueda/hora` "6:30 a. m.", and booleans `tecladoOrigen`, `tecladoDestino`, `calendarioAbierto`, `horaAbierta`. Tapping a **Lugar guardado** sets a variable (presumably the destination) and opens Buscar rutas.
- After confirming the pickup point the request is created. Mis Viajes then shows the trip with status **Pendiente/Aprobado/Cancelado**. How the passenger learns about approval is **not designed** (no notifications screen).

### 2.3 Passenger: my trips
```mermaid
flowchart LR
  H["Menu Home"] -->|"Mis viajes tile"| MV["Mis Viajes (lista)"]
  MV <-->|"Lista / Mapa"| MM["Mis viaje con mapa"]
  MV -->|"card Aprobado"| RA["Resumen viaje Aprobado"]
  MV -->|"card Pendiente"| RP["Resumen viaje Pendiente"]
  MV -->|"card Cancelado"| RC["Resumen viaje Cancelado"]
  MM -->|"card"| RA
  MV -->|"Editar"| S["Buscar rutas"]
  MV -->|"Solicitudes pill"| SOL["Solicitudes1 (driver view)"]
  MM -->|"Solicitudes pill"| SOL
```
Flags:
- The Resumen screens have no actions (no cancel-my-request button). Only back and tabs work.
- The **Solicitudes** pill on *Mis Viajes* opens the driver's incoming-requests screen. So "Mis Viajes" mixes passenger trips with a driver entry point. To clarify with product.

### 2.4 Driver: publish a trip (wizard)
```mermaid
flowchart LR
  H["Menu Home"] -->|"Publicar viaje tile / Publicar tab"| V["1 Vehículo: Lista carros viajes"]
  V -->|"tap inactive vehicle"| AD["¿Activar vehículo? dialog"]
  AD -->|"Activar"| V2["Lista carros viajes 2 (other vehicle active)"]
  AD -->|"Cancelar"| V
  V -->|"step tab Ruta"| RU["2 Ruta: Publicar Ruta"]
  RU -->|"step tab Horario"| HO["3 Horario: Publicar horario (1..4)"]
  HO -->|"+ / −"| HO
  HO -->|"step tab Pago"| PA["4 Pago: Publicar precio"]
  PA -->|"radio Efectivo / SINPE"| PA
  PA -->|"step tab Confirmar"| CF["5 Confirmación"]
  CF -->|"Confirmar viaje"| OK["Confirmado"]
  OK -->|"auto (timeout)"| H
```
Notes:
- Navigation between steps uses the **step tabs** (any step can be reached from any other). There are no "Siguiente" buttons.
- Header back from any step goes to **Menu Home**, not to the previous step.
- Stepper bounds: 1 to 4 ("Máximo permitido: 4 pasajeros", presumably the vehicle capacity).
- Only "Publicar precio 1" (SINPE selected) links to Confirmación.
- The capacity shown in Confirmación ("3 pasajeros") doesn't match the stepper. That's sample data.
- The FAB "+" on the vehicle list has no link. Presumably it means "add vehicle", see 2.7.

### 2.5 Driver: manage requests → run the trip
```mermaid
flowchart LR
  SOL1["Solicitudes1 (collapsed)"] -->|"tap card"| SOL2["Solicitudes2 (expanded)"]
  SOL1 -->|"✕ reject"| SOL3["Solicitudes3 (rejected)"]
  SOL2 -->|"✓ accept"| SOL5["Solicitudes5 (accepted + expanded)"]
  SOL2 -->|"✕ reject"| SOL3
  SOL3 -->|"✓ accept"| SOL4["Solicitudes4 (accepted)"]
  SOL5 -->|"collapse"| SOL6["Solicitudes6"]
  SOL4 & SOL5 & SOL6 -->|"Ir al viaje"| VP["Viaje programado · Pasajeros"]
  VP <-->|"Pasajeros / Paradas"| VPP["Viaje programado · Paradas"]
  VP -->|"Iniciar viaje"| VC["Viaje en curso · Pasajeros"]
  VPP -->|"Iniciar viaje"| VCP["Viaje en curso · Paradas"]
  VC <-->|"Pasajeros / Paradas"| VCP
  VC & VCP -->|"Finalizar viaje"| VF["Viaje finalizado"]
  VP & VPP & VC & VCP -->|"Cancelar"| CV["¿Cancelar viaje? dialog"]
  CV -->|"Volver"| VP
  CV -->|"Sí, cancelar"| VX["Viaje cancelado"]
  VF -->|"Volver al inicio*"| VP
  VX -->|"Volver al inicio*"| VP
```
\* **Prototype shortcut:** "Volver al inicio" links back to *Viaje programado – Pasajeros*, not to Home. The label suggests Home. Also, "Cancelar" is offered while the trip is **en curso**, and the dialog copy assumes a scheduled trip.

Not designed:
- How a driver reaches *Viaje programado* other than through Solicitudes (e.g. a list of "my published trips").
- How requests reach the driver (notifications).

### 2.6 Trip history
```mermaid
flowchart LR
  HT["Historial de viajes (tab)"] -->|"card as Conductor"| HC["Historial viaje conductor"]
  HT -->|"card as Pasajero"| HP["Historial viaje pasajero"]
  HC -->|"back"| HT
  HP -->|"back"| HT
```

### 2.7 Profile & vehicles
```mermaid
flowchart LR
  PA["Perfil - Ambos"] -->|"toggle Conductor off"| PP["Perfil - Pasajero"]
  PA -->|"toggle Pasajero off"| PC["Perfil - Conductor"]
  PP -->|"toggle Conductor on"| PA
  PC -->|"toggle Pasajero on"| PA
  PA -->|"Mis Vehículos"| LC["Lista carros"]
  PC -->|"Mis Vehículos"| LC
  LC -->|"Editar"| GV["Gestion de vehiculos"]
  LC -->|"card"| GV
  LC -->|"Eliminar"| DEL["¿Eliminar vehículo? dialog"]
  DEL -->|"Cancelar / Eliminar"| LC
  GV -->|"Cambiar imagen"| FO["Modificar fotografias del vehiculo"]
  FO -->|"Guardar imagen / Cancelar"| GV
  GV -->|"Guardar datos / Cancelar"| LC
```
Flags:
- "Mis Vehículos" appears only when the Conductor role is selected.
- **Agregar vehiculo** has no direct link. The photo screen is titled "Agregar vehículo" while being reached from "Cambiar imagen". The add-vehicle flow is ambiguous.
- **Guardar Cambios** on Perfil has no link.
- There is no logout and no avatar-photo flow beyond the badge.

---

## 3. Web admin portal navigation

### 3.1 Shell
Sidebar (present on every authenticated screen):
- **Análisis**
  - Consultas generales → `228:142` (tab 1)
  - Estadísticas → `285:483`
- **Gestión**
  - Instituciones → `270:36`
  - Usuarios → `259:13`
  - Parámetros → `271:254` (Métodos de Pago)
- **Cerrar sesión** → Login `277:600`

Header: Bell (hover state only, no notifications panel designed) and user chip (hover only, no menu designed).

### 3.2 Authentication & password recovery
```mermaid
flowchart LR
  L["Login (277:600)"] -->|"type email"| LE["Login con correo"]
  LE -->|"type password"| PN["Contraseña no visible"]
  PN <-->|"eye toggle"| PV["Contraseña visible"]
  PN & PV -->|"Iniciar sesión (valid)"| C1["Consultas generales · Top Conductores"]
  L & LE -->|"Iniciar sesión (invalid)"| ER["Error de acceso"]
  ER -->|"Iniciar sesión"| L
  L & LE & PN & PV -->|"¿Olvidaste tu contraseña?"| R1["Recuperar contraseña 1"]
  R1 -->|"Confirmar"| R2["Revisa tu correo"]
  R2 -->|"Cambiar la contraseña"| R3["Cambiar contraseña"]
  R3 -->|"Confirmar"| L
```
- Login uses variables `correoIngresado`, `contraseñaIngresada` (STRING) and `mostrarError` (BOOLEAN) with a **conditional** interaction on the button. In other words, the prototype simulates validation.
- "Recordarme" has no behavior designed.
- "Revisa tu correo" says the email sending is simulated in the prototype. In the real flow, step 3 would be reached through an emailed link.

### 3.3 Consultas generales (6 queries)
```mermaid
flowchart LR
  T1["1 Top Conductores"] --- T2["2 Puntos concurrentes"] --- T3["3 Usuarios activos"]
  T3 --- T4["4 Listado de viajes"] --- T5["5 Monto promedio"] --- T6["6 Usuarios nuevos"]
```
- The tab pills navigate between the 6 frames (every tab links to every other).
- Filters: **Institución** opens the `Menú Plegable` overlay. **Desde/Hasta** open the `Dropdown calendar` overlay. **Restablecer filtros** has a hover state only.
- *Listado de viajes*: "Ver detalles ⌄" expands a row (component `2287:3249` with 6 expanded-row variants). The expanded content was not reviewed visually.
- *Monto promedio*: hovering a bar shows tooltips `Promedio1–4`.

### 3.4 Estadísticas
- Filters as above, plus the gender dropdown (`Menú generos` overlay) on the age-range card.
- No drill-down interactions.

### 3.5 Instituciones
```mermaid
flowchart LR
  I["Instituciones (270:36)"] -->|"Agregar Institución"| IA["Agregar modal"]
  I -->|"Editar"| IE["Editar modal"]
  I -->|"Validar / Reenviar"| IN["Toast: correo de validación enviado"]
  I -->|"Desactivar"| ID["Desactivar state"]
  IA & IE -->|"Cancelar / Guardar / Agregar"| I
  IN -->|"✕"| I
  ID -->|"Desactivar / Secundario"| I
```
- Validation lifecycle per institution, as seen in the rows: **validated ✓** → (none) · **Validar** (not yet sent) · **Reenviar** (sent, waiting) · **N/A** (inactive institution).
- Active institutions show Editar + Desactivar. Inactive ones show Editar (dark) + Activar.
- The prototype wiring is overlapping and noisy: several "Primario" hotspots point to different overlays. The list above is the cleaned-up intent.

### 3.6 Usuarios
```mermaid
flowchart LR
  U["Tabla usuarios"] -->|"Ver detalle"| UD["Detalle · Información general"]
  U -->|"Activo pill"| UX["Tabla usuarios / Desactivado"]
  UX -->|"Inactivo pill"| U
  UD <-->|"tabs"| UA["Detalle · Actividad"]
  UD <-->|"tabs"| UV["Detalle · Vehículos"]
  UA <-->|"tabs"| UV
  UD -->|"Editar usuario"| M["MOD USER (edit mode)"]
  M -->|"Eliminar Usuario"| MD["Confirm: ¿Esta seguro que desea eliminar…?"]
  MD -->|"Aceptar"| U
  MD -->|"Cancelar"| M
  M -->|"Dar rango Administrador"| MA["MOD USER ADMIN"]
  MA -->|"Quitar Administrador"| M
  M & MA -->|"Salir"| UD
  UD & UA & UV -->|"Volver a usuarios"| U
```
- The search box, institution filter and pager have no designed behavior beyond the static frames.
- The field-level pencil icons in edit mode have no designed inline-edit state.

### 3.7 Parámetros (5 catalogs, same flow each)
```mermaid
flowchart LR
  LIST["Catalog list (e.g. Métodos de Pago)"] -->|"catalog pill"| OTHER["Other catalog list"]
  LIST -->|"Nuevo Parámetro"| NEW["NUEVO modal"]
  LIST -->|"✎"| EDIT["EDITAR modal"]
  LIST -->|"🗑"| DEL["ELIMINAR confirm"]
  NEW & EDIT -->|"Cancelar / Agregar / Guardar cambios"| LIST
  DEL -->|"Cancelar"| LIST
  DEL -->|"Eliminar"| DONE["ELIMINADO (toast, row removed, count −1)"]
```
- The modals include a **Catálogo** select, so the catalog can presumably be changed inside the modal.
- "Buscar parámetro…" and "Todos los estados" have no designed behavior.
- In the Métodos de Pago frames, the **Nuevo Parámetro** header button links to the NUEVO modal of the current catalog.

---

## 4. Gaps & open questions (not invented, listed for decision)

| # | Area | Gap |
|---|------|-----|
| 1 | Mobile auth | No login error/validation, forgot-password, logout or email-verification screens |
| 2 | Mobile roles | How does a pure passenger become a driver (only via the Perfil role toggle)? What does the Publicar tab do for a passenger-only user? |
| 3 | Mobile driver | No list of "my published trips" and no entry to *Viaje programado* except via Solicitudes |
| 4 | Mobile notifications | Request approval, trip cancellation ("Avisamos a los pasajeros") and new requests have no notification UI |
| 5 | Mobile passenger | No cancel-request action from Resumen viaje |
| 6 | Mobile vehicles | Add-vehicle flow ambiguous (button unlinked; photo screen titled "Agregar vehículo") |
| 7 | Mobile ratings/verification | "Verificada TEC" badge shown, but no verification flow |
| 8 | Mobile maps | All maps are static images. Real map interaction (pan, pick point) is implied but not specified. |
| 9 | Web | No notifications panel (Bell), no user menu, no pagination/search behavior, no empty/loading/error states for tables and charts |
| 10 | Web Instituciones | Meaning of "Validar"/"Reenviar"/"N/A" inferred from labels only |
| 11 | Web Usuarios | Edit-mode field editing is not designed beyond pencil icons |
| 12 | Both | No empty states, loading states or offline/error states anywhere |
| 13 | Mobile driver | On "Solicitudes", each card shows a route with accept/reject, but when expanded it lists several passengers and a total earning. Is a card one passenger's request or a whole trip? (`IncomingRequest` in `src/types/trip.ts` models the screen literally for now.) |
