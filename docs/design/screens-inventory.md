# Screens Inventory — Tuanis Carpooling

> Source: Figma file `gsw0VhFa56qIAcVPcYKjxg`, explored on 2026-11-13 (read-only).
> Related docs: [design-system.md](design-system.md) · [components-inventory.md](components-inventory.md) · [user-flows.md](user-flows.md) · [assets-inventory.md](assets-inventory.md)

## 0. File structure

| Page | ID | Content |
|------|----|---------|
| **Móvil** | `0:1` | 7 sections "Movil Punto 1…7" (each 5000 × 5000), a duplicated tokens section `COLORES - ICONOS - LETRAS` (`2501:5820`), and `TerminosYCondiciones` (`3069:4227`) |
| **Tokens** | `84:2` | Fonts, Icons, Colores, Colores (Variación Móvil 4), Buttons, Componentes (Punto 4) |
| **Web** | `5:2` | 3 sections: `Web Parte 1, punto 1 (Grupo Steven)` (`7:432`), `Web Parte 1, punto 2 (Grupo Steven)` (`7:440`), `Web Parte 2, puntos 3, 4 y 5 (Grupo Xanders)` (`7:434`), plus 2 stray vectors and a stray text node |

Section names ("Punto N", "Grupo X") come from the course deliverables and team split. They are not product areas, so the tables below also give each screen a **product area**.

**Totals:** 57 mobile frames (52 canonical + 5 discarded café variants), 54 web frames (including 1 abandoned draft), plus component/specimen sections.

## 1. Inspection coverage log

| Level | Meaning |
|-------|---------|
| **T** | Structure (layer tree), every rendered text string, component instances used, and every prototype interaction were extracted programmatically. **All frames below have T.** |
| **V** | A screenshot was also downloaded and visually reviewed. |
| — | Not applicable |

What was **not** done for any frame:
- `get_design_context` (generated reference code with exact per-node paddings) was not called. Pixel-level measurements were taken only on the sample frames named in design-system.md §3.
- Hidden layers were ignored.
- Prototype transition and animation details (easing, duration) were not extracted.
- File comments were checked: there are none.

**MCP limits:** none were hit. Two responses exceeded size limits (the full metadata dumps for the Móvil and Web pages and one Web prototype dump). Both were recovered by saving to disk or splitting the query, so nothing was skipped.

---

## 2. Mobile app (page `Móvil`)

All frames are 402 × 874 unless noted. Unless marked otherwise, every screen has the status bar (`Barra de estado`) and the bottom tab bar (`navbar`).

### 2.1 Movil Punto 1 — Authentication (`7:415`)

| ID | Frame | Product area | Purpose / key content | States | Insp. |
|----|-------|--------------|-----------------------|--------|-------|
| `2081:3` | Inicio de sesión (421 × 844, inside unnamed section `2081:2`) | Auth | Logo, "Bienvenido de nuevo", "Inicia sesión para continuar tu viaje.", email field (`nombre@correo.com`), password field with eye toggle, **Iniciar sesión** (dark `#413333`), "¿No tienes cuenta? **Regístrate**". No status bar or tab bar. | default only (no error state drawn) | V |
| `2102:1801` | Registro | Auth | Fields: Nombre completo, Correo electrónico, Género (dropdown "Todos los géneros"), Rol (toggle buttons **Conductor** / **Pasajero**), Edad (date "01/01/2026"), Contraseña, Confirmar contraseña. Link "Términos y condiciones". **Registrar** button. No tab bar. | default only | V |
| `3069:3947` | Frame → "Términos y condiciones" (section `3069:4227`, 424 × 861 frame, content 6,417 tall) | Auth / legal | Header "‹ Información legal". Eyebrow "TUANIS CARPOOLING", H1 "Términos y condiciones", intro, then numbered sections 01–10+: Objeto y funcionamiento, Aceptación, Registro y cuenta, Publicación y reserva, Obligaciones de conductores, Obligaciones de pasajeros, Convivencia y conducta, Gastos compartidos y pagos, Cancelaciones y cambios, Seguridad y emergencias… (long scroll). | — | T (rendered text extracted; screenshot too tall to review) |
| `2833:6031` | *Boton atras* (stray instance on canvas) | — | Back button placed next to Registro. Its prototype goes back to Inicio de sesión. | — | T |
| `2786:3337` | *Container* (stray 131 × 17 frame) | — | Empty helper | — | T |

### 2.2 Movil Punto 2 — Profile & vehicle management (`7:416`)

| ID | Frame | Product area | Purpose / key content | States | Insp. |
|----|-------|--------------|-----------------------|--------|-------|
| `2519:8506` | Perfil - Conductor | Profile | "Mi Perfil", avatar "DJ" with photo-edit badge, name "Danny", institution. Fields: Nombre completo, Correo Institucional (read-only), Género (dropdown), Edad (date). Rol buttons Conductor/Pasajero (Conductor selected). **Guardar Cambios**. Floating **Mis Vehículos** button. | role = driver | T |
| `2519:8588` | Perfil - Pasajero | Profile | Same as above, Pasajero selected, **no "Mis Vehículos"** button | role = passenger | T |
| `2519:8693` | Perfil - Ambos | Profile | Both roles selected, "Mis Vehículos" shown. Gray background. | role = both | V |
| `2295:4283` | Lista carros | Vehicles | "Mis vehículos", subtitle "Gestiona los vehículos que utilizas para publicar viajes". Three vehicle cards (photo, model, "Activo" badge, chevron; Placa/Marca/Modelo/Color/Capacidad) with **Editar** / **Eliminar**. **+ Agregar vehiculo** button. | list | V |
| `2295:4571` | Lista carros mansaje eliminar vehiculo | Vehicles | Same list with modal: trash icon, "¿Eliminar vehículo?", "¿Seguro que deseas eliminar el Toyota Corolla ABC-123?", "Esta acción no se puede deshacer", **Cancelar** / **Eliminar** | delete-confirm dialog | V |
| `2389:2635` | Gestion de vehiculos | Vehicles | "Datos del vehículo" / "Edita la información del vehículo". Photo card with **Cambiar imagen**. Fields: Nombre del modelo, Marca, Placa, Color (dropdown "Todos los colores"), Capacidad (stepper − 4 +). **Guardar datos** / **Cancelar**. | edit form | V |
| `2389:3214` | Modificar fotografias del vehiculo | Vehicles | Title "Agregar vehículo" / "Agrega fotografias del vehículo". Upload box "Agregar imagen – Selecciona una imagen JPG, PNG, o SVG" (+). "Imagenes del vehículo" with 3 thumbnails, each with ✕. **Guardar imagen** / **Cancelar**. | photo management | V |

### 2.3 Movil Punto 3 — Publish a trip (driver) (`7:442`)

All screens share the header "Publicar Viaje" and a 5-step tab strip: **Vehículo · Ruta · Horario · Pago · Confirmar**, with the active step in green.

| ID | Frame | Step | Purpose / key content | States | Insp. |
|----|-------|------|-----------------------|--------|-------|
| `2390:1976` | Lista carros viajes | 1 Vehículo | "Mis vehículos – Elige el vehículo que utilizas para realizar viajes". Toyota Corolla is active (green header, "Activo" badge); Tucson and Versa inactive (grey header). FAB "+". | Corolla active | V |
| `2390:2633` | Lista carros viajes 2 | 1 Vehículo | Same list with **Hyundai Tucson** active | Tucson active | T |
| `2390:2181` | mensaje cambiar activo | 1 Vehículo | Dialog: info icon, "¿Activar vehículo?", "¿Seguro que deseas activar el Hyundai Tucson XYZ-789?", **Cancelar** / **Activar** | activate dialog (from Corolla-active) | V |
| `2390:2721` | mensaje cambiar activo 2 | 1 Vehículo | Same dialog over the Tucson-active list ("…activar el Toyota Corolla ABC-123?") | activate dialog (from Tucson-active) | T |
| `2538:7479` | Publicar Ruta | 2 Ruta | "Ruta – Indica el punto de partida y el destino del viaje". Origin/destination fields (San José → TEC Cartago), map with route, "Distancia aproximada: 24 km • Tiempo estimado: 50 min" | — | V |
| `2538:7929` | Publicar horario | 3 Horario | "Fecha y hora – Indique cuándo será el viaje" (Hoy, 6:30 a. m.). "Capacidad de pasajeros – Indique cuántos pasajeros se pueden llevar (sin contar conductor)". Stepper **1**, "Máximo permitido: 4 pasajeros". | count = 1 | V |
| `2538:8112` | Publicar horario 2 | 3 Horario | same | count = 2 | T |
| `2538:8210` | Publicar horario 3 | 3 Horario | same | count = 3 | T |
| `2538:8308` | Publicar horario 4 | 3 Horario | same, at max | count = 4 (max) | T |
| `2538:8511` | Publicar precio | 4 Pago | "Costo – Define el valor del viaje": ₡ input "1500". Note: "El pago se realizará directamente entre el conductor y el pasajero. Si el monto es 0 se publicará como gratis." "Método de pago – Define cómo se realizará el pago": radio **Efectivo** / **SINPE Móvil**. | Efectivo selected | V |
| `2538:8676` | Publicar precio 1 | 4 Pago | same | SINPE Móvil selected | T |
| `2649:3251` | Confirmación | 5 Confirmar | "Confirmación – Confirma que los datos son correctos": vehicle card, route + date + time summary, payment method "SINPE Móvil", **Confirmar viaje** | — | V |
| `2649:3473` | Confirmado | (result) | Green check, "Tu viaje ha sido publicado". Auto-advances (timeout) to Home. | success | V |
| `2538:8634` | *Info* (18 × 18 frame) | — | Loose icon frame | — | T |

### 2.4 Movil Punto 4 — Home, search & trip detail (passenger) (`7:444`)

**Canonical (green) row**

| ID | Frame | Purpose / key content | States | Insp. |
|----|-------|-----------------------|--------|-------|
| `2467:2462` | Menu Home | Logo, "Hola, Danny", "¿A dónde quieres ir hoy?". Search bar "¿A dónde vas?" with **Ahora** chip over a map. Shortcut tiles **Buscar viaje** / **Publicar viaje** / **Mis viajes**. "Lugares frecuentes" list (San José centro – Avenida Central; UCR San Pedro – Montes de Oca; Heredia centro – Parque Central). | default | V |
| `2427:2341` | Buscar rutas | "Buscar rutas". Search card with 4 fields: Origen (TEC Cartago), Destino (San José), Fecha (Hoy), Horario (6:30 a. m.). Map background. **Buscar viaje** CTA. Contains 4 hidden panels toggled by variables (see below). | default + 4 panels | V |
| ↳ `2466:2849` | Panel teclado origen | Origin text entry with on-screen keyboard (`android keyboard`) | panel | T |
| ↳ `2466:2956` | Panel teclado destino | Destination text entry with keyboard | panel | T |
| ↳ `2466:3869` | Panel calendario | `Calendario` component ("Fecha de salida", Octubre 2026 grid) | panel | T (component V) |
| ↳ `2466:3962` | Panel hora | `Selector hora` component ("Hora de salida", 12 time chips 5:30 a. m. … 6:30 p. m.) | panel | T (component V) |
| `2446:2252` | Resultados viajes | Search summary "TEC Cartago → San José · Hoy · 6:30 a. m." with **Editar**. Toggle **Lista**/Mapa. "3 viajes encontrados". Three trip cards (Ana Rojas ₡1 500 / Luis Mora Gratis / Karla Vargas ₡1 200; chips: time, seats, payment). | list view | V |
| `2448:2302` | Resultados mapa | Same header, toggle on **Mapa**. Map with route and labels, "1 de 3 viajes" pager, floating trip card. | map view | V |
| `2448:2822` | Detalle viaje | "Detalle del viaje": driver block (AR Ana Rojas, "Conductora · Verificada TEC"), vehicle block (Toyota Corolla, Placa, Color, Capacidad), route block (TEC Cartago → San José, Fecha "Hoy, 25 oct", Hora de salida), cost block (Costo, Método de pago, Cupos disponibles). Notice "El pago se realiza directamente con el conductor. Coordina el encuentro por medios externos a la app." **Solicitar unirme**. | — | V |

**Discarded café exploration (do not implement)**: `2506:5826` **Menu No Usar** (V), `2506:5704` Buscar rutas (V), `2506:5732` Resultados viajes (T), `2522:3649` Resultados mapa (T), `2506:5771` Detalle viaje (T). They have the same content and panels (`2506:5719/5722/5725/5728`) with a brown primary color. Canvas note `2506:6392`: *"Solo es para ver como se vería de café. Es que verde se ve muy chillón"*.

### 2.5 Movil Punto 5 — Join request & My trips (passenger) (`7:446`)

| ID | Frame | Purpose / key content | States | Insp. |
|----|-------|-----------------------|--------|-------|
| `2506:5746` | Seleccionar Punto Recogida | "Seleccionar punto de recolección". Full map with the route TEC Cartago → San José; user taps the route. | before selection | T |
| `2522:4082` | Confirmar Punto Recogida | Same map with "Punto seleccionado" marker and a bottom card "Mall San Pedro – 100 metros al este de la Fuente de la Hispanidad, San Pedro de Montes de Oca, San José, Costa Rica". **Confirmar punto de recolección**. | point A selected | V |
| `2567:4861` | Confirmar Punto Recogida V2 | Same, alternative point "Parada de buses Ochomogo – Diagonal a la salida de RECOPE, autopista Florencio del Castillo, Cartago." | point B selected | T |
| `2501:6043` | Mis Viajes | "Mis Viajes" with **Solicitudes** pill (top right). Search summary + Editar, toggle **Lista**/Mapa. Trip cards with a status chip: Aprobado (Ana Rojas), Pendiente (Luis Mora, Gratis), Cancelado (Karla Vargas). | list view | V |
| `2633:9509` | Mis viaje con mapa | Same, **Mapa** view, "1 de 3 viajes", floating card | map view | T |
| `2501:5937` | Resumen viaje Aprobado | "Resumen del viaje": driver, vehicle, route, date/time, cost, payment, **Estado Solicitud: Aprobada**, payment notice | approved | T |
| `2501:6580` | Resumen viaje Pendiente | Same layout; Luis Mora, Gratis / "Sin Costo", **Estado Solicitud: Pendiente** | pending | V |
| `2501:6684` | Resumen viaje Cancelado | Same layout; Karla Vargas, Efectivo, **Estado Solicitud: Cancelado** | cancelled | T |

### 2.6 Movil Punto 6 — Driver: requests & trip execution (`7:448`)

| ID | Frame | Purpose / key content | States | Insp. |
|----|-------|-----------------------|--------|-------|
| `2726:6159` | Solicitudes1. | "Solicitudes": list of collapsed request cards (route origin → destination with reject ✕ / accept ✓ circles): San José→TEC Cartago, TEC Cartago→Heredia, Heredia→TEC SJO, TEC Cartago→Alajuela | all collapsed | T |
| `2726:6456` | Solicitudes2-Expandir | One card expanded: route, Fecha, Hora de salida/llegada, inner card Pasajeros 2, Ganancia total ₡3000, passenger rows (LM Lucy Madrigal ₡1 500 SINPE Móvil; KV José Solís ₡1 500 Efectivo) | expanded | V |
| `2726:6289` | Solicitudes3-Rechazar | State after rejecting a request | rejected | T |
| `2726:6647` | Solicitudes4-Aceptar | One card accepted (green fill, only ✕ left). **Ir al viaje** CTA appears. | accepted | V |
| `2726:6805` | Solicitudes5-AceptarExpandido | Accepted + expanded, with **Ir al viaje** | accepted expanded | T |
| `2726:6996` | Solicitudes6 | Further accept/reject combination with **Ir al viaje** | mixed | T |
| `2642:3781` | Viaje programado - Por iniciar - Pasajeros | "Viaje programado", chip "Por iniciar". Map with route and stops (TEC Cartago, Ochomogo, Mall San Pedro, San José). Segmented **Pasajeros (2)** / Paradas (4). Passenger rows (avatar, name, "Recogida: …"). **Cancelar** / **Iniciar viaje**. | scheduled · passengers tab | V |
| `2642:3670` | Viaje programado - Por iniciar - Paradas | Same, **Paradas (4)** tab: timeline (TEC Cartago "Origen · sale el conductor" 6:30 p.m.; Parada Ochomogo "Lucy Madrigal · recogida" 6:40; Mall San Pedro "José Solís · recogida" 7:00; San José "Destino · TEC San José" 7:30) | scheduled · stops tab | T |
| `2642:3832` | Viaje en curso - En curso - Pasajeros | "Viaje en curso", chip "En curso", passengers tab, **Cancelar** / **Finalizar viaje** (dark) | in progress · passengers | T |
| `2642:3725` | Viaje en curso - En curso - Paradas | Same, stops tab | in progress · stops | V |
| `2642:3953` | Cancelar viaje | Dialog over the scheduled trip: ✕ icon, "¿Cancelar viaje?", "Se avisará a los 2 pasajeros aceptados y el viaje se cerrará. Esta acción no se puede deshacer.", **Volver** / **Sí, cancelar** | cancel-confirm dialog | V |
| `2642:3884` | Viaje finalizado | Green check, "Llegaste a tu destino", "Viaje completado con 2 pasajeros". Summary: Ruta, Fecha, Hora de salida/llegada, Pasajeros "2 de 4 cupos", Ganancia total ₡3 000, Estado "Finalizado". **Volver al inicio**. | finished | V |
| `2642:3920` | Viaje cancelado | Result icon, "Viaje cancelado", "Avisamos a los pasajeros aceptados". Summary: Ruta, Fecha, Hora, Pasajeros avisados 2, Estado Cancelado. **Volver al inicio**. | cancelled | T |

### 2.7 Movil Punto 7 — Trip history (`7:450`)

| ID | Frame | Purpose / key content | States | Insp. |
|----|-------|-----------------------|--------|-------|
| `2518:3432` | Historial de viajes | "Historial de viajes" (no back button). Cards: "+2 Tú" (own trip as driver, ₡3 000, chip **Conductor**), Luis Mora (**Pasajero**), Karla Vargas, Rafael Díaz (Gratis) | list | V |
| `2518:3471` | Historial viaje conductor | "Viaje de conductor": vehicle, route, Fecha/Hora de salida/llegada, Pasajeros 2, Ganancia total ₡3000, passenger rows with amount and payment method | driver detail | V |
| `2518:3789` | Historial viaje pasajero | "Viaje de pasajero": driver (Conductor · Verificado TEC), vehicle, route, date/times, Costo, Método de pago | passenger detail | T |

### 2.8 Mobile non-screen sections
- `COLORES - ICONOS - LETRAS` (`2501:5820`): copy of the Tokens-page specimens (Cairo, Comfortaa, Buttons, Icons, Colores). T.

---

## 3. Web admin portal (page `Web`)

All frames are 1920 × 1080. Every authenticated screen has the left sidebar (Análisis: Consultas generales, Estadísticas · Gestión: Instituciones, Usuarios, Parámetros · Cerrar sesión) and a header with title, subtitle, bell and user chip "DA Diego Araya · Administrador".

### 3.1 Authentication — section `7:432` "Web Parte 1, punto 1 (Grupo Steven)"

Layout: left dark brand panel ("Viaja seguro, / ahorra en cada recorrido", "Un solo lugar para gestionar el servicio y acompañar a nuestra comunidad.", decorative dashed route). Right side: sage background with a white card (logo, "PORTAL ADMINISTRATIVO"). Footer "Tuanis Carpooling - Portal administrativo".

| ID | Frame | Purpose / key content | State | Insp. |
|----|-------|-----------------------|-------|-------|
| `277:600` | Login | "Bienvenido", "Inicia sesión para administrar Tuanis.", Correo electrónico, Contraseña (eye), **Iniciar sesión**, Recordarme checkbox, "¿Olvidaste tu contraseña?", "Acceso exclusivo para personal autorizado" | empty | V |
| `2349:3642` | Login con correo | Email filled (`d.araya.2@estudiantec.cr`) | email typed | T |
| `319:1269` | Contraseña no visible | Email + masked password | ready to submit | T |
| `2961:8917` | Contraseña visible | Password shown in clear ("Diego2026!") | password revealed | T |
| `319:1327` | Error de acceso | Title "Bienvenido de nuevo", error banner "Revisa tu correo y contraseña para continuar." (orange-light) above the button, inputs outlined | error | V |
| `281:650` | Recuperar contraseña parte 1 | "Recuperar contraseña – Ingrese su correo electrónico para recuperar la contraseña.", email, "¿Recordaste tu contraseña?", **Confirmar** | request reset | T |
| `277:1090` | Solicitud enviada para recuperar contraseña | "Revisa tu correo – Si el correo está registrado, recibirás un enlace para restablecer tu contraseña." "En este prototipo el envío es simulado." **Cambiar la contrseña** *(typo in design)* | reset sent | V |
| `281:717` | Recuperar contraseña parte 2 | "Cambiar contraseña – Escriba su nueva contraseña.", Nueva contraseña, confirm field, **Confirmar** | set new password | T |
| `271:179` | Web Parte 2, punto 2 (Grupo HECTOR!!) | **Abandoned draft**: dark overlay, partial sidebar ("ANÁLISIS", Consultas generales, Estadísticas), title "Estadísticas". Do not implement. | — | V |
| `316:1561` | Menu lateral (component set, 406 × 6620) | Sidebar component, 6 variants (see components inventory) | — | T |
| `271:180/181/182` | Rectangle 1/2/3 | Stray layout rectangles | — | T |

### 3.2 Management — section `7:440` "Web Parte 1, punto 2 (Grupo Steven)"

**Usuarios**

| ID | Frame | Purpose / key content | State | Insp. |
|----|-------|-----------------------|-------|-------|
| `259:13` | Web - Tabla usuarios | "Gestión > Usuarios / Uso del servicio". Search "Buscar", filter "Todas las instituciones". Table Nombre / Detalle (**Ver detalle**) / Estado (**Activo** pill), 18 rows. Pager `<` `>`. | default | V |
| `259:1459` | Web - Tabla usuarios / Desactivado | Same table with one user toggled **Inactivo** | user deactivated | T |
| `259:1878` | Web - Tabla usuarios / Detalle | "Gestión > Usuarios > Detalle". "Volver a usuarios". Header card (avatar DA, "DETALLE DEL USUARIO", Diego Jose Araya Cordero). Tabs **Información general** / Actividad / Vehículos. "Información personal" (Nombre completo, Identificación académica 2024087949, Correo, Teléfono +506 8451 4072). Institution card (Institución, Estado de la cuenta Activo). **Editar usuario**. | info tab | V |
| `259:2633` | Web - Tabla usuarios / Detalle Act | **Actividad** tab: KPI tiles 24 Viajes completados / 18 Como conductor / 6 Como pasajero. "Historial de viajes" table (Fecha, Ruta, Participación, Estado: Completado/Cancelado). | activity tab | V |
| `366:3989` | Web - Tabla usuarios / Detalle Vehiculo | **Vehículos** tab: "Vehículo registrado" + Activo; Marca Toyota, Modelo Yaris, Placa ABC-123, Año 2018, Color Gris, Espacios para pasajeros 4 | vehicles tab | V |
| `2979:6043` | Web - Tabla MOD USER | Edit mode: pencil icons on fields; buttons **Eliminar Usuario**, **Dar rango Administrador**, **Salir** | edit mode | T |
| `3013:10219` | Web - Tabla MOD USER | Edit mode + modal "Atención – ¿Esta seguro que desea eliminar a este usuario?" **Aceptar** / **Cancelar** | delete-confirm | V |
| `3017:9251` | Web - Tabla MOD USER ADMIN | Edit mode for a user who is admin: "Diego Jose Araya Cordero - Administrador", **Quitar Administrador**, **Eliminar Usuario**, **Salir** | admin user | T |

**Instituciones**

| ID | Frame | Purpose / key content | State | Insp. |
|----|-------|-----------------------|-------|-------|
| `270:36` | Web Parte 2, punto 2-inicial | "Gestión > Instituciones – Configuración de instituciones afiliadas al servicio." Table Nombre Institución / Correo Institución / Validación. **Agregar Institución**. Rows: ICE (validated ✓), INS (**Validar**), Tecnológico de Costa Rica (N/A, row highlighted, **Editar** dark + **Activar**, i.e. inactive), Universidad de Costa Rica (**Reenviar**), Universidad Nacional (**Validar**). Each row: **Editar** + **Desactivar**/**Activar**. | default | V |
| `270:2476` | …-desactivar | State after a "Desactivar" action (not visually reviewed) | deactivate | T |
| `270:1922` | …-notif | Toast (dark, bell icon, ✕): "Correo de validación enviado, esperando confirmación de carlos.arayaleandro@ucr.ac.cr" | validation sent | V |
| `270:2074` | …-editar | Modal "Editar": Nombre, Correo electrónico, **Cancelar** / **Guardar** | edit modal | V |
| `270:2793` | …-agregar | Modal "Agregar Institución": Nombre, Correo electrónico, **Cancelar** / **Agregar** | add modal | V |

**Parámetros** (5 catalogs × 5 states = 25 frames)

Shared layout: "Gestión de Parámetros – Administra los catálogos de opciones que se muestran en la app móvil y el portal web." **Nuevo Parámetro** sits in the header. A catalog selector card holds 5 pill tabs with counts: Métodos de Pago (3), Tipos de Vehículo (5), Rangos de Edad (4), Opciones de Género (4), Reglas y Tarifas (4), plus "Buscar parámetro…". Below is the table card ("Catálogo de …", filter "Todos los estados") with edit ✎ and delete 🗑 actions per row.

| Catalog | List | EDITAR (modal) | NUEVO (modal) | ELIMINAR (confirm) | ELIMINADO (toast) | Columns / form fields |
|---------|------|----------------|---------------|--------------------|-------------------|-----------------------|
| Métodos de Pago | `271:254` V | `271:2023` V | `271:3127` T | `2950:10658` V | `2950:11914` V | Método de pago, Descripción, Estado, Acciones · Form: Catálogo (select), Nombre, Descripción, Estado (switch, "Si está inactivo, no aparecerá como opción en la app ni en el portal.") |
| Tipos de Vehículo | `2944:6468` T | `2950:8451` T | `2950:8717` T | `2950:10767` T | `2950:12113` T | Tipo de vehículo, Capacidad máxima, Descripción, Estado · Form adds Capacidad máxima |
| Rangos de Edad | `2944:6044` T | `2950:8983` T | `2950:9237` T | `2950:10896` T | `2950:12340` T | Rango de edad, Edad mínima, Edad máxima, Estado · Form: Nombre del rango, Edad mínima, Edad máxima |
| Opciones de Género | `2944:6680` T | `2950:9491` T | `2950:9737` T | `2950:11013` T | `2950:12555` T | Opción, (Usuarios registrados in EDITAR/NUEVO/ELIMINAR frames only), Estado · Form: Nombre de la opción |
| Reglas y Tarifas | `2944:7104` T | `2950:9983` T | `2950:10237` V | `2950:11125` T | `2950:12765` T | Regla, Valor, Descripción, Estado · Form: Nombre de la regla, Valor, Unidad |

Sample catalog data from the designs:
- Métodos de Pago: SINPE Móvil, Efectivo, Gratuito / Solidario.
- Tipos de Vehículo: Sedán (4), Hatchback, SUV (6), Pick-up, Microbús (12, Inactivo).
- Rangos de Edad: 18–24, 25–34, 35–49, 50+.
- Opciones de Género: Femenino, Masculino, No binario, Prefiero no indicarlo.
- Reglas y Tarifas: Tarifa máxima por kilómetro ₡150 por km; Aporte máximo por viaje ₡3 000; Cancelación sin penalización 30 minutos; Tiempo de espera del conductor 5 minutos.

Delete confirm text: "¿Seguro que deseas eliminar «SINPE Móvil» del catálogo de Métodos de Pago? Esta acción no se puede deshacer. Si solo quieres ocultarlo, puedes desactivarlo desde Editar." **Cancelar** / **Eliminar**. Toast: "«SINPE Móvil» se eliminó correctamente".

> Inconsistency: the "Opciones de Género" list frame `2944:6680` has no "Usuarios registrados" column, but its EDITAR/NUEVO/ELIMINAR frames do (412 / 538 / 17 usuarios).

The section also contains a copy of the color swatches, the Primario/Secundario/Terceario button sets, Consultas/Estadisticas sidebar-item components, and logo vectors (`271:124`, `271:148`).

### 3.3 Analytics — section `7:434` "Web Parte 2, puntos 3, 4 y 5 (Grupo Xanders)"

**Consultas generales** ("Consulta registros específicos del servicio y aplica filtros por institución y fechas."). A row of 6 numbered tab cards switches the query. Each query has a filter card and a results card with "Mostrando N" and a total badge.

| ID | Frame | Tab | Filters | Results | Insp. |
|----|-------|-----|---------|---------|-------|
| `228:142` | …(1) | 1 Top Conductores | Institución, Buscar (Nombre de usuario…), Top N (5) "conductores", **Restablecer filtros** | "Top 5 conductores – Conductores que han brindado más servicios de transporte." Badge "Conductores con viajes: 109". Table Posición / Conductor / Institución (pill) / Viajes brindados (bar + number) | V |
| `340:3557` | …(2) | 2 Puntos concurrentes | Institución, Desde, Hasta (date pickers), Top N "puntos más concurrentes" | "Top 5 puntos más concurrentes – Puntos de recogida con mayor concurrencia · 341 viajes en el periodo." Badge "Puntos con registros: 24". Same table pattern. | V |
| `340:3858` | …(3) | 3 Usuarios activos | Institución, Buscar, Top N | "Top 5 usuarios más activos – Usuarios con más viajes registrados, como conductor o pasajero." Badge "Usuarios con viajes: 225" | T |
| `340:2884` | …(4) | 4 Listado de viajes | Institución, Desde, Hasta, Buscar | "Listado de viajes – Viajes realizados mediante la aplicación." Table ID / Fecha y hora / Institución / Conductor / Salida → Destino / Monto / **Ver detalles** ⌄ (expandable rows, see `2287:3249`) | V |
| `340:3079` | …(5) | 5 Monto promedio | Institución, Desde, Hasta | "Promedio del monto cobrado". KPI "Monto promedio por viaje ₡1 242 – Calculado sobre 253 viajes con cobro". Mínimo ₡500, Máximo ₡2 000. Bar chart "Promedio por institución" (UCR/TEC/UNA/UNED) with hover tooltips. Footnote "88 viajes sin cobro no se incluyen en el promedio." | V |
| `340:3224` | …(6) | 6 Usuarios nuevos | Institución, Buscar, "Últimos N meses" (3) | "Usuarios nuevos - últimos 3 meses – Registrados entre 26 de julio 2026 y 26 octubre 2026". KPI 37 "15.4% de los usuarios totales". Monthly bar chart (jul 4, ago 17, sep 9, oct 7). Scrollable table Usuario / Institución / Rol / Registro. | V |
| `2287:3249` | Frame (component set, 3543 × 2122) | — | — | 6 variants (`Property 1=1…6`) of the **Listado de viajes** table, each with a different row expanded (accordion `acc1`, `off/on`) | T |

**Estadísticas**

| ID | Frame | Content | Insp. |
|----|-------|---------|-------|
| `285:483` | Web Parte 2, punto 2 (Grupo Xanders) — "Estadísticas" | "Uso del servicio y consulta de datos". Filters Institución (Tecnológico de Costa Rica), Desde, Hasta, **Restablecer**. KPI cards: Conductores activos 25, Pasajeros activos 46, Usuarios únicos 57 ("14 personas fueron conductoras y pasajeras"). Donuts "Conductores por género" (25) and "Pasajeros por género" (46) with legend bars (Femenino/Masculino/Otro / No indica). Donut "Viajes por método de pago" (98: Efectivo 34, SINPE móvil 41, Gratuito 23). "Usuarios por rango de edad" horizontal bars + table (Rango, Cantidad, %) with a gender dropdown. **Content extends to y ≈ 1549, so the page scrolls.** | V |

Also in this section: component sets (Estadisticas, Consultas, Top Conductores…Usuarios nuevos tabs, Instituciones/Generos/Fechas dropdown triggers, Restablecer, Opciones, Menú Plegable, Menú generos, Dropdown calendar, Promedio1–4 tooltips, Bell, Usuario, Primario/Secundario/Terceario), color swatches, Cairo specimen, logos, and loose chart labels (text nodes `2222:*`, `331:*`, `379:*`, `391:*`, `400:*`). Also a canvas text "Tuanis - Carpooling / Ride - Carpooling" (`2410:4623`), which looks like naming notes.

---

## 4. Screens explicitly excluded from implementation

| ID(s) | Reason |
|-------|--------|
| `2506:5704`, `2506:5732`, `2522:3649`, `2506:5771`, `2506:5826` | Café color exploration, "Menu No Usar" |
| `271:179` | Abandoned web draft (Grupo HECTOR) |
| Stray nodes `2786:3337`, `2538:8634`, `271:180–182`, `209:30`, `209:31`, `2950:7927` | Not screens |
