# Tuanis Carpooling — Casos de uso

Este documento describe 50 casos de uso del sistema Tuanis Carpooling: la **app móvil** (pasajeros y conductores, Expo) y el **portal web administrativo** (Vercel), ambos sobre el API en NestJS con la base de datos en Supabase.

## Actores

| Actor | Descripción |
|---|---|
| **Visitante** | Persona con la app instalada que todavía no ha iniciado sesión. |
| **Usuario** | Persona con cuenta verificada y sesión iniciada en la app móvil. Todo usuario puede viajar como pasajero. |
| **Pasajero** | Usuario que busca viajes y solicita unirse a ellos. |
| **Conductor** | Usuario con el rol de conductor y al menos un vehículo registrado; publica viajes. |
| **Administrador** | Persona que gestiona el servicio desde el portal web. |
| **Sistema** | El API (NestJS) y sus servicios: correo, base de datos, reglas de negocio. |

## Resumen

| ID | Caso de uso | Actor principal | Plataforma |
|---|---|---|---|
| CU-01 | Registrarse con correo institucional | Visitante | Móvil |
| CU-02 | Consultar términos y condiciones | Visitante | Móvil |
| CU-03 | Verificar el correo institucional | Visitante | Correo / navegador |
| CU-04 | Reenviar el enlace de verificación | Visitante | Móvil |
| CU-05 | Iniciar sesión | Visitante | Móvil |
| CU-06 | Reabrir la app con la sesión guardada | Usuario | Móvil |
| CU-07 | Cerrar sesión | Usuario | Móvil |
| CU-08 | Volver a iniciar sesión cuando la sesión vence | Usuario | Móvil |
| CU-09 | Consultar mi perfil | Usuario | Móvil |
| CU-10 | Editar el nombre completo | Usuario | Móvil |
| CU-11 | Cambiar la opción de género | Usuario | Móvil |
| CU-12 | Cambiar la fecha de nacimiento | Usuario | Móvil |
| CU-13 | Registrar o borrar el teléfono | Usuario | Móvil |
| CU-14 | Activar el rol de conductor | Usuario | Móvil |
| CU-15 | Quitar el rol de conductor | Conductor | Móvil |
| CU-16 | Ver el saludo personalizado en el inicio | Usuario | Móvil |
| CU-17 | Ver mis lugares frecuentes | Usuario | Móvil |
| CU-18 | Buscar viajes hacia un lugar frecuente | Pasajero | Móvil |
| CU-19 | Marcar un destino en el mapa del inicio | Pasajero | Móvil |
| CU-20 | Ver mis vehículos | Conductor | Móvil |
| CU-21 | Registrar un vehículo | Usuario | Móvil |
| CU-22 | Consultar los datos de un vehículo | Conductor | Móvil |
| CU-23 | Editar un vehículo | Conductor | Móvil |
| CU-24 | Eliminar un vehículo | Conductor | Móvil |
| CU-25 | Activar un vehículo | Conductor | Móvil |
| CU-26 | Publicar un viaje | Conductor | Móvil |
| CU-27 | Revisar las solicitudes recibidas | Conductor | Móvil |
| CU-28 | Aceptar una solicitud | Conductor | Móvil |
| CU-29 | Rechazar una solicitud | Conductor | Móvil |
| CU-30 | Consultar un viaje programado (pasajeros y paradas) | Conductor | Móvil |
| CU-31 | Iniciar un viaje | Conductor | Móvil |
| CU-32 | Finalizar un viaje | Conductor | Móvil |
| CU-33 | Cancelar un viaje | Conductor | Móvil |
| CU-34 | Buscar viajes disponibles | Pasajero | Móvil |
| CU-35 | Revisar los resultados de búsqueda | Pasajero | Móvil |
| CU-36 | Consultar el detalle de un viaje | Pasajero | Móvil |
| CU-37 | Elegir el punto de recogida en el mapa | Pasajero | Móvil |
| CU-38 | Solicitar unirse a un viaje | Pasajero | Móvil |
| CU-39 | Consultar "Mis viajes" | Pasajero | Móvil |
| CU-40 | Consultar el resumen de un viaje solicitado | Pasajero | Móvil |
| CU-41 | Consultar el historial de viajes | Usuario | Móvil |
| CU-42 | Ver el detalle de un viaje del historial como conductor | Conductor | Móvil |
| CU-43 | Ver el detalle de un viaje del historial como pasajero | Pasajero | Móvil |
| CU-44 | Iniciar sesión en el portal administrativo | Administrador | Web |
| CU-45 | Recuperar la contraseña del administrador | Administrador | Web |
| CU-46 | Gestionar instituciones afiliadas | Administrador | Web |
| CU-47 | Consultar y activar/desactivar usuarios | Administrador | Web |
| CU-48 | Gestionar administradores | Administrador | Web |
| CU-49 | Gestionar parámetros (catálogos) | Administrador | Web |
| CU-50 | Consultar estadísticas y consultas generales | Administrador | Web |

---

## 1. Cuenta y sesión (app móvil)

### CU-01 — Registrarse con correo institucional
- **Actor:** Visitante. **Endpoint:** `POST /api/auth/register`, `GET /api/catalogs/genders`.
- **Precondición:** La institución del correo está registrada y activa en el portal.
- **Flujo principal:**
  1. El visitante toca **Regístrate** en la pantalla de inicio de sesión.
  2. La app carga las opciones de género activas desde el API.
  3. El visitante escribe nombre completo, correo institucional, género, rol (pasajero, conductor o ambos), fecha de nacimiento, contraseña y su confirmación.
  4. Marca **He leído y acepto los Términos y condiciones** y toca **Registrar**.
  5. El sistema valida los datos, cifra la contraseña (scrypt), crea la cuenta pendiente de verificación y envía un enlace al correo.
  6. La app muestra la pantalla **Verifica tu correo**.
- **Flujos alternos:**
  - 3a. Campo vacío, correo mal escrito, contraseña de menos de 12 caracteres o contraseñas distintas → la app marca el campo con el error.
  - 4a. No aceptó los términos → "Debes aceptar los términos y condiciones."
  - 5a. El dominio del correo no pertenece a una institución activa → "El correo debe pertenecer a una institución activa."
  - 5b. Ya existe una cuenta con ese correo → "Ya existe una cuenta con ese correo." (409).
- **Postcondición:** Existe un usuario con correo sin verificar; si eligió conductor, queda con el rol de conductor.

### CU-02 — Consultar términos y condiciones
- **Actor:** Visitante.
- **Flujo principal:** 1. En **Registro**, toca **Términos y condiciones**. 2. La app muestra el texto legal por secciones. 3. Toca **← Volver al registro** y el formulario conserva lo escrito.

### CU-03 — Verificar el correo institucional
- **Actor:** Visitante. **Endpoint:** `GET /api/auth/verify-email?token=…`
- **Precondición:** Completó CU-01.
- **Flujo principal:** 1. Abre el correo "Verifica tu cuenta de Tuanis Carpooling". 2. Toca el enlace. 3. El sistema marca el correo como verificado y muestra la página **¡Correo verificado!**.
- **Flujos alternos:** 2a. El enlace ya se usó, se reemplazó por otro o está incompleto → página **Enlace no válido** con la indicación de pedir otro (CU-04).
- **Postcondición:** La cuenta puede iniciar sesión.

### CU-04 — Reenviar el enlace de verificación
- **Actor:** Visitante. **Endpoint:** `POST /api/auth/resend-verification`
- **Flujo principal:** 1. Desde **Verifica tu correo**, o desde el inicio de sesión cuando la cuenta no está verificada, toca **Reenviar enlace**. 2. El sistema genera un enlace nuevo (el anterior deja de servir) y lo envía. 3. La app confirma el envío.
- **Flujos alternos:** 2a. El correo no existe o ya está verificado → la respuesta es la misma, para no revelar qué cuentas existen. 2b. Más de 10 intentos por minuto → "Demasiados intentos…".

### CU-05 — Iniciar sesión
- **Actor:** Visitante. **Endpoint:** `POST /api/auth/login`
- **Flujo principal:** 1. Escribe correo y contraseña. 2. Toca **Iniciar sesión**. 3. El sistema verifica las credenciales y entrega un token de sesión (válido 30 días). 4. La app guarda el token cifrado en el teléfono y abre **Inicio**.
- **Flujos alternos:**
  - 3a. Correo o contraseña incorrectos, o cuenta desactivada → "Correo o contraseña incorrectos." (el mensaje no revela cuál falló).
  - 3b. Correo sin verificar → "Verifica tu correo institucional antes de iniciar sesión." y aparece **Reenviar enlace de verificación** (CU-04).
  - 3c. Demasiados intentos → "Demasiados intentos. Espera un minuto…".

### CU-06 — Reabrir la app con la sesión guardada
- **Actor:** Usuario.
- **Flujo principal:** 1. Abre la app. 2. La app lee el token guardado (Keychain/Keystore). 3. Si existe, entra directamente a **Inicio**.
- **Flujo alterno:** 3a. No hay token guardado → muestra **Inicio de sesión**.

### CU-07 — Cerrar sesión
- **Actor:** Usuario. **Endpoint:** `POST /api/auth/logout`
- **Flujo principal:** 1. En **Mi Perfil** toca **Cerrar sesión**. 2. El sistema revoca el token. 3. La app borra el token del teléfono y vuelve al inicio de sesión.
- **Flujo alterno:** 2a. Sin conexión → la app igual borra el token local.

### CU-08 — Volver a iniciar sesión cuando la sesión vence
- **Actor:** Usuario / Sistema.
- **Disparador:** El token venció, fue revocado o el administrador desactivó la cuenta.
- **Flujo principal:** 1. Cualquier petición recibe 401. 2. La app borra la sesión. 3. Las pantallas privadas redirigen a **Inicio de sesión**.

---

## 2. Perfil

### CU-09 — Consultar mi perfil
- **Actor:** Usuario. **Endpoint:** `GET /api/me/profile`
- **Flujo principal:** 1. Toca la pestaña **Perfil**. 2. La app muestra foto o iniciales, nombre, institución, nombre completo, correo institucional (solo lectura), teléfono, género, fecha de nacimiento y roles.

### CU-10 — Editar el nombre completo
- **Actor:** Usuario. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. Cambia **Nombre completo**. 2. Toca **Guardar Cambios**. 3. El sistema guarda la primera palabra como nombre y el resto como apellidos. 4. Se muestra "Cambios guardados.".
- **Flujo alterno:** 1a. Nombre vacío o demasiado largo → mensaje de error.

### CU-11 — Cambiar la opción de género
- **Actor:** Usuario. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. Abre **Género** y elige una opción activa del catálogo. 2. Guarda.
- **Flujo alterno:** 2a. La opción fue desactivada por un administrador mientras tanto → "Selecciona una opción de género activa y válida."

### CU-12 — Cambiar la fecha de nacimiento
- **Actor:** Usuario. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. Escribe la fecha en **Edad** (dd/mm/aaaa). 2. Guarda.
- **Flujo alterno:** 1a. Fecha inválida o futura → "Ingresa una fecha válida."

### CU-13 — Registrar o borrar el teléfono
- **Actor:** Usuario. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. Escribe el teléfono (8 a 20 dígitos, puede llevar `+`, espacios o guiones) o lo deja vacío para borrarlo. 2. Guarda.
- **Flujo alterno:** 1a. Formato inválido → "Ingresa un teléfono válido."

### CU-14 — Activar el rol de conductor
- **Actor:** Usuario. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. En **Rol** marca **Conductor**. 2. Guarda. 3. Aparece el botón **Mis Vehículos**.
- **Nota:** Registrar un vehículo (CU-21) también activa el rol automáticamente.

### CU-15 — Quitar el rol de conductor
- **Actor:** Conductor. **Endpoint:** `PATCH /api/me/profile`
- **Flujo principal:** 1. Desmarca **Conductor**. 2. Guarda.
- **Flujo alterno:** 2a. Tiene viajes publicados sin finalizar → "Tienes viajes publicados sin finalizar. Finalízalos o cancélalos antes de quitar el rol de conductor." (409).

---

## 3. Inicio

### CU-16 — Ver el saludo personalizado
- **Actor:** Usuario. **Endpoint:** `GET /api/me/profile`
- **Flujo principal:** Al abrir **Inicio** se muestra "Hola, *nombre*" con el primer nombre real del usuario.

### CU-17 — Ver mis lugares frecuentes
- **Actor:** Usuario. **Endpoint:** `GET /api/me/frequent-places`
- **Flujo principal:** 1. En **Inicio**, sección **Lugares frecuentes**. 2. El sistema calcula los 5 lugares (origen o destino) que más aparecen en sus viajes como conductor o pasajero aceptado, sin contar viajes cancelados. 3. Cada lugar muestra cuántas veces lo ha usado.
- **Flujo alterno:** 2a. Aún no tiene viajes → "Aquí aparecerán los lugares a los que viajas con más frecuencia."

### CU-18 — Buscar viajes hacia un lugar frecuente
- **Actor:** Pasajero.
- **Flujo principal:** 1. Toca un lugar frecuente. 2. Se abre **Buscar** con ese destino y sus coordenadas ya cargados. 3. Continúa en CU-34.

### CU-19 — Marcar un destino en el mapa del inicio
- **Actor:** Pasajero.
- **Flujo principal:** 1. Toca un punto del mapa. 2. La app obtiene el nombre del lugar. 3. Toca **Buscar viajes a *lugar*** y continúa en CU-34.

---

## 4. Vehículos (conductor)

### CU-20 — Ver mis vehículos
- **Actor:** Conductor. **Endpoint:** `GET /api/driver/vehicles`
- **Precondición:** Rol de conductor.
- **Flujo principal:** 1. En **Mi Perfil** toca **Mis Vehículos**. 2. La app lista solo los vehículos del usuario con la sesión iniciada; el activo aparece primero.
- **Flujos alternos:** 2a. No tiene vehículos → mensaje para agregar uno. 2b. Error de conexión → se muestra el mensaje del error.

### CU-21 — Registrar un vehículo
- **Actor:** Usuario. **Endpoint:** `POST /api/driver/vehicles`
- **Flujo principal:** 1. Toca **Agregar vehículo**. 2. Escribe marca, modelo, placa, color y capacidad de pasajeros. 3. Guarda. 4. Si es su primer vehículo queda activo y el usuario pasa a ser conductor.
- **Flujo alterno:** 3a. La placa ya está registrada → "Ya existe un vehículo registrado con esa placa." (409).

### CU-22 — Consultar los datos de un vehículo
- **Actor:** Conductor. **Endpoint:** `GET /api/driver/vehicles/:id`
- **Flujo principal:** Toca un vehículo de la lista y se abre **Datos del vehículo**.
- **Flujo alterno:** El vehículo es de otro usuario → "El vehículo no existe." (404).

### CU-23 — Editar un vehículo
- **Actor:** Conductor. **Endpoint:** `PATCH /api/driver/vehicles/:id`
- **Flujo principal:** 1. En **Datos del vehículo** cambia los campos. 2. Guarda.
- **Flujo alterno:** 2a. La nueva placa pertenece a otro vehículo → 409.

### CU-24 — Eliminar un vehículo
- **Actor:** Conductor. **Endpoint:** `DELETE /api/driver/vehicles/:id`
- **Flujo principal:** 1. Toca el ícono de basurero. 2. Confirma en **¿Eliminar vehículo?**. 3. El vehículo desaparece de la lista.
- **Flujo alterno:** 3a. El vehículo tiene viajes asociados → "No se puede eliminar el vehículo porque tiene viajes asociados."

### CU-25 — Activar un vehículo
- **Actor:** Conductor. **Endpoint:** `PATCH /api/driver/vehicles/:id/activate`
- **Flujo principal:** 1. Al publicar un viaje elige un vehículo inactivo y confirma **¿Activar vehículo?**. 2. El sistema lo deja como único vehículo activo.

---

## 5. Viajes como conductor

### CU-26 — Publicar un viaje
- **Actor:** Conductor. **Endpoints:** `GET /api/catalogs/payment-methods`, `POST /api/driver/trips`
- **Precondición:** Tiene al menos un vehículo.
- **Flujo principal:** 1. Pestaña **Publicar**. 2. Elige origen y destino (búsqueda o toque en el mapa), fecha, hora, vehículo, cupos, aporte por pasajero y método de pago. 3. Toca **Publicar**. 4. Se muestra **Viaje publicado**.
- **Flujos alternos:** 3a. Fecha/hora en el pasado → "La fecha de salida debe ser futura". 3b. Cupos mayores a la capacidad del vehículo → "El vehículo solo admite *N* pasajeros."
- **Postcondición:** Viaje en estado **Programado** visible en las búsquedas.

### CU-27 — Revisar las solicitudes recibidas
- **Actor:** Conductor. **Endpoint:** `GET /api/driver/requests`
- **Flujo principal:** Abre **Solicitudes** y ve, por cada solicitud, el pasajero, su punto de recogida, la ruta, la hora y el monto.

### CU-28 — Aceptar una solicitud
- **Actor:** Conductor. **Endpoint:** `POST /api/driver/requests/:id/accept`
- **Flujo principal:** 1. Toca **Aceptar**. 2. El sistema descuenta un cupo y el pasajero queda en el viaje.
- **Flujos alternos:** 2a. Ya no hay cupos → "El viaje ya no tiene cupos disponibles." 2b. Ya fue respondida → mensaje de solicitud respondida.

### CU-29 — Rechazar una solicitud
- **Actor:** Conductor. **Endpoint:** `POST /api/driver/requests/:id/reject`
- **Flujo principal:** Toca **Rechazar** y la solicitud queda rechazada; el pasajero lo ve en **Mis viajes**.

### CU-30 — Consultar un viaje programado
- **Actor:** Conductor. **Endpoint:** `GET /api/driver/trips/:id`
- **Flujo principal:** 1. Abre el viaje. 2. Ve las pestañas **Pasajeros** (aceptados, en orden de recogida) y **Paradas** (origen, puntos de recogida agrupados y destino), con el mapa de la ruta.

### CU-31 — Iniciar un viaje
- **Actor:** Conductor. **Endpoint:** `POST /api/driver/trips/:id/start`
- **Flujo principal:** Toca **Iniciar viaje**; el viaje pasa a **En curso**.
- **Flujo alterno:** El viaje no está programado → "Solo se puede iniciar un viaje programado." (409).

### CU-32 — Finalizar un viaje
- **Actor:** Conductor. **Endpoint:** `POST /api/driver/trips/:id/finish`
- **Flujo principal:** 1. Toca **Finalizar viaje**. 2. Se registra la hora de llegada y se muestra **Viaje finalizado**.
- **Postcondición:** El viaje aparece en el historial del conductor y de sus pasajeros (CU-41).

### CU-33 — Cancelar un viaje
- **Actor:** Conductor. **Endpoint:** `POST /api/driver/trips/:id/cancel`
- **Flujo principal:** 1. Toca **Cancelar viaje** y confirma. 2. El sistema marca el viaje como cancelado y envía un correo a cada pasajero aceptado. 3. Se muestra **Viaje cancelado**.
- **Flujo alterno:** El viaje ya finalizó → "Este viaje ya no se puede cancelar."

---

## 6. Viajes como pasajero

### CU-34 — Buscar viajes disponibles
- **Actor:** Pasajero. **Endpoint:** `GET /api/passenger/trips`
- **Flujo principal:** 1. Toca **¿A dónde vas?** o **Buscar viaje**. 2. Elige origen y destino de las sugerencias (OpenStreetMap, solo Costa Rica), fecha y hora. 3. Toca **Buscar**.
- **Regla:** Se buscan viajes programados con cupos, en un radio aproximado de 5 km, desde la hora elegida hasta el final del día; nunca aparecen los viajes propios.

### CU-35 — Revisar los resultados de búsqueda
- **Actor:** Pasajero.
- **Flujo principal:** Ve tarjetas con conductor, vehículo, hora, cupos y aporte; puede volver a ajustar la búsqueda.
- **Flujo alterno:** Sin resultados → mensaje de búsqueda vacía.

### CU-36 — Consultar el detalle de un viaje
- **Actor:** Pasajero. **Endpoint:** `GET /api/passenger/trips/:id`
- **Flujo principal:** Toca un resultado y ve conductor, vehículo (marca, modelo, color, placa), ruta en el mapa, hora, cupos, costo y método de pago.

### CU-37 — Elegir el punto de recogida en el mapa
- **Actor:** Pasajero.
- **Flujo principal:** 1. En el detalle toca **Solicitar unirme**. 2. Toca en el mapa el lugar donde quiere que lo recojan. 3. La app muestra el nombre del lugar.

### CU-38 — Solicitar unirse a un viaje
- **Actor:** Pasajero. **Endpoint:** `POST /api/passenger/trips/:id/join-requests`
- **Flujo principal:** 1. Confirma el punto de recogida. 2. El sistema crea la solicitud **Pendiente**. 3. La app abre el resumen de la solicitud.
- **Flujos alternos:** 2a. Es su propio viaje → "No puedes solicitar tu propio viaje". 2b. Ya lo solicitó → "Ya enviaste una solicitud para este viaje". 2c. Sin cupos o el viaje ya salió → mensaje correspondiente.

### CU-39 — Consultar "Mis viajes"
- **Actor:** Pasajero. **Endpoint:** `GET /api/passenger/requests`
- **Flujo principal:** Abre **Mis viajes** y ve sus solicitudes con su estado (pendiente, aprobada, rechazada, cancelada) y la última búsqueda realizada.

### CU-40 — Consultar el resumen de un viaje solicitado
- **Actor:** Pasajero. **Endpoint:** `GET /api/passenger/requests/:id`
- **Flujo principal:** Toca una solicitud y ve el conductor (con su institución verificada), el vehículo, la ruta, el punto de recogida, el costo y el estado.

---

## 7. Historial

### CU-41 — Consultar el historial de viajes
- **Actor:** Usuario. **Endpoint:** `GET /api/history`
- **Flujo principal:** 1. Pestaña **Historial**. 2. El sistema devuelve los viajes **finalizados o cancelados** en los que participó: los que publicó como conductor y aquellos en los que fue pasajero aceptado, del más reciente al más antiguo. 3. Cada tarjeta muestra fecha, rol, monto, ruta, vehículo y, si aplica, la etiqueta **Cancelado**.
- **Flujos alternos:** 2a. No tiene viajes terminados → mensaje de historial vacío. 2b. Error de conexión → mensaje del error.
- **Regla de montos:** Como conductor, ganancia = aporte × pasajeros aceptados; como pasajero, el aporte pagado. Un viaje cancelado registra ₡0.

### CU-42 — Ver el detalle de un viaje del historial como conductor
- **Actor:** Conductor. **Endpoint:** `GET /api/history/c-<viajeId>`
- **Flujo principal:** Toca una tarjeta con rol **Conductor** y ve vehículo, ruta, fecha, horas de salida y llegada, número de pasajeros, ganancia total y cada pasajero con su monto y método de pago.
- **Flujo alterno:** El viaje fue cancelado → aviso con el motivo de la cancelación.

### CU-43 — Ver el detalle de un viaje del historial como pasajero
- **Actor:** Pasajero. **Endpoint:** `GET /api/history/p-<solicitudId>`
- **Flujo principal:** Toca una tarjeta con rol **Pasajero** y ve el conductor, vehículo, ruta, fecha, horas, punto de recogida, costo y método de pago.
- **Flujo alterno:** El id no es suyo o no existe → "El viaje no está en tu historial." (404).

---

## 8. Portal web administrativo

### CU-44 — Iniciar sesión en el portal administrativo
- **Actor:** Administrador. **Endpoint:** `POST /api/admin/auth/login`
- **Flujo principal:** 1. Abre el portal en el navegador. 2. Escribe correo y contraseña. 3. Entra a **Instituciones**.
- **Flujo alterno:** Credenciales incorrectas o demasiados intentos → mensaje de error.

### CU-45 — Recuperar la contraseña del administrador
- **Actor:** Administrador. **Endpoint:** `/api/admin/auth/password-reset`
- **Flujo principal:** 1. Toca **¿Olvidaste tu contraseña?**. 2. Escribe su correo. 3. Recibe un enlace. 4. En **Cambiar contraseña** define la nueva.

### CU-46 — Gestionar instituciones afiliadas
- **Actor:** Administrador. **Endpoint:** `/api/admin/institutions`
- **Flujo principal:** Lista, agrega, edita (nombre, acrónimo, dominio de correo) y activa o desactiva instituciones.
- **Regla:** Solo los correos de dominios de instituciones activas pueden registrarse (CU-01).

### CU-47 — Consultar y activar/desactivar usuarios
- **Actor:** Administrador. **Endpoint:** `/api/admin/users`
- **Flujo principal:** 1. Abre **Usuarios** y filtra o busca. 2. Abre el detalle: información personal, historial de viajes y vehículo registrado. 3. Desactiva o reactiva la cuenta.
- **Postcondición:** Al desactivar, se cierran todas las sesiones del usuario (CU-08).

### CU-48 — Gestionar administradores
- **Actor:** Administrador. **Endpoint:** `/api/admin/administrators`
- **Flujo principal:** Registra un nuevo administrador, edita sus datos o lo desactiva.

### CU-49 — Gestionar parámetros (catálogos)
- **Actor:** Administrador. **Endpoint:** `/api/admin/catalogs`
- **Flujo principal:** En **Parámetros** administra métodos de pago, tipos de vehículo, rangos de edad, opciones de género y reglas y tarifas: agregar, editar, activar/desactivar y eliminar.
- **Postcondición:** La app móvil muestra solo las opciones activas (géneros en registro y perfil, métodos de pago al publicar).

### CU-50 — Consultar estadísticas y consultas generales
- **Actor:** Administrador. **Endpoints:** `/api/statistics`, `/api/admin/consultas/*`
- **Flujo principal:** 1. **Estadísticas**: gráficos de usuarios por institución y género, viajes por estado y por mes. 2. **Consultas generales**: top de conductores, puntos concurrentes, usuarios activos, listado de viajes por rango de fechas, monto promedio y usuarios nuevos, con filtros por institución y fechas.
