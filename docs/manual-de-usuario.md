# Tuanis Carpooling — Manual de usuario

Tuanis Carpooling conecta a estudiantes y personal de instituciones de Costa Rica para compartir viajes en carro. Tiene dos partes:

- **App móvil** (Android y iOS): para **pasajeros** y **conductores**.
- **Portal web administrativo**: solo para **administradores** del servicio.

> Este manual describe la versión conectada al servidor real: todos los datos (perfil, vehículos, viajes e historial) vienen de la base de datos; la app ya no usa datos de ejemplo.

---

## Parte A — App móvil

### A.1 Requisitos

- Un teléfono con Android o iOS y conexión a internet.
- Un **correo institucional** de una institución afiliada (por ejemplo, `@estudiantec.cr`). Si tu institución no aparece, pide al administrador que la agregue.
- Permiso de ubicación (opcional): sirve para centrar el mapa en tu posición.

### A.2 Crear una cuenta

1. Abre la app y toca **Regístrate**.
2. Completa el formulario:
   - **Nombre completo**: tu nombre y apellidos.
   - **Correo electrónico**: tu correo institucional.
   - **Género**: elige una opción de la lista.
   - **Rol**: *Pasajero*, *Conductor* o ambos. Puedes cambiarlo después.
   - **Edad**: tu fecha de nacimiento (día/mes/año).
   - **Contraseña** y **Confirmar contraseña**: mínimo **12 caracteres**.
3. Lee los **Términos y condiciones** (enlace bajo el formulario) y marca la casilla **He leído y acepto**.
4. Toca **Registrar**.
5. Verás la pantalla **Verifica tu correo**. Abre tu correo institucional y toca el enlace del mensaje *"Verifica tu cuenta de Tuanis Carpooling"*. Se abrirá una página que dice **¡Correo verificado!**
6. Vuelve a la app y toca **Ir a iniciar sesión**.

**¿No llegó el correo?** Revisa la carpeta de correo no deseado. Si no está, toca **Reenviar enlace**. Cada enlace nuevo anula el anterior.

| Mensaje | Qué significa | Qué hacer |
|---|---|---|
| *El correo debe pertenecer a una institución activa.* | Tu dominio de correo no está afiliado. | Usa tu correo institucional o contacta al administrador. |
| *Ya existe una cuenta con ese correo.* | Ya te registraste antes. | Inicia sesión; si no verificaste, reenvía el enlace. |
| *Debes aceptar los términos y condiciones.* | Falta marcar la casilla. | Márcala y vuelve a tocar **Registrar**. |

### A.3 Iniciar y cerrar sesión

- **Iniciar sesión:** escribe tu correo y contraseña y toca **Iniciar sesión**.
- La app **recuerda tu sesión** durante 30 días, aunque la cierres. La sesión se guarda cifrada en el teléfono.
- Si aparece *"Verifica tu correo institucional antes de iniciar sesión"*, toca **Reenviar enlace de verificación** y sigue el paso 5 de A.2.
- Si aparece *"Tu sesión venció"*, vuelve a iniciar sesión. Pasa cuando han pasado 30 días, cuando cerraste sesión desde otro lugar o si un administrador desactivó tu cuenta.
- **Cerrar sesión:** pestaña **Perfil** → botón **Cerrar sesión** (al final de la pantalla).

### A.4 Navegación

La barra inferior tiene cuatro pestañas:

| Pestaña | Para qué sirve |
|---|---|
| **Menú** | Inicio, buscar viajes y "Mis viajes" (pasajero). |
| **Publicar** | Publicar viajes, ver solicitudes y manejar tus viajes (conductor). |
| **Historial** | Viajes terminados, como conductor y como pasajero. |
| **Perfil** | Tus datos, tus vehículos y cerrar sesión. |

### A.5 Inicio

- Arriba verás **Hola, *tu nombre***.
- **¿A dónde vas?** abre la búsqueda de viajes.
- **Mapa:** toca un punto para marcarlo como destino y luego **Buscar viajes a…**.
- **Accesos rápidos:** *Buscar viaje*, *Publicar viaje* y *Mis viajes*.
- **Lugares frecuentes:** los 5 lugares que más usas en tus viajes, con cuántas veces los has usado. Tócalo para buscar viajes hacia ese lugar. Si todavía no has viajado, la lista aparece vacía.

### A.6 Mi Perfil

1. Pestaña **Perfil**.
2. Puedes cambiar **Nombre completo**, **Teléfono (opcional)**, **Género**, **Edad** y **Rol**. El **correo institucional** no se puede cambiar.
3. Toca **Guardar Cambios**. Verás *"Cambios guardados."*

Notas:
- Al marcar **Conductor** aparece el botón **Mis Vehículos**.
- No puedes quitar el rol de conductor si tienes viajes publicados sin finalizar: finalízalos o cancélalos primero.
- El teléfono debe tener al menos 8 dígitos; déjalo vacío para borrarlo.

### A.7 Mis vehículos (conductor)

Ruta: **Perfil → Mis Vehículos**. Solo verás los vehículos registrados con **tu** cuenta.

- **Agregar:** toca **Agregar vehículo**, escribe marca, modelo, placa, color y capacidad de pasajeros (sin contarte), y guarda. Tu primer vehículo queda **activo** automáticamente.
- **Ver o editar:** toca el vehículo o el ícono de lápiz, cambia los datos y guarda.
- **Eliminar:** toca el basurero y confirma. Si el vehículo ya se usó en viajes, no se puede eliminar (se conserva para el historial).
- **Vehículo activo:** es con el que publicas. Solo puede haber uno; al publicar puedes activar otro.

### A.8 Buscar y solicitar un viaje (pasajero)

1. Toca **¿A dónde vas?** o **Buscar viaje**.
2. Escribe el **origen** y el **destino** y elige una sugerencia de la lista (son lugares reales de Costa Rica).
3. Elige **fecha** y **hora** y toca **Buscar**. Se muestran viajes con cupos que salen desde esa hora hasta el final del día, cerca (≈5 km) de los lugares elegidos. Tus propios viajes no aparecen.
4. Toca un resultado para ver el **detalle**: conductor, vehículo y placa, ruta, hora, cupos, aporte y método de pago.
5. Toca **Solicitar unirme**, marca en el mapa **dónde quieres que te recojan** y confirma.
6. Tu solicitud queda **Pendiente** hasta que el conductor responda.

**Mis viajes** (Menú → *Mis viajes*) muestra tus solicitudes con su estado:

| Estado | Significado |
|---|---|
| Pendiente | El conductor aún no responde. |
| Aprobada | Tienes un lugar en el viaje. Sé puntual en tu punto de recogida. |
| Rechazada | El conductor no aceptó la solicitud. Busca otro viaje. |
| Cancelada | El conductor canceló el viaje (también recibes un correo). |

El pago se acuerda directamente con el conductor según el método indicado (efectivo, SINPE Móvil, gratuito, etc.).

### A.9 Publicar y manejar un viaje (conductor)

**Publicar**
1. Pestaña **Publicar**.
2. Elige **origen** y **destino** (búsqueda o toque en el mapa), **fecha** y **hora** de salida.
3. Elige el **vehículo**, la cantidad de **cupos** (no más que la capacidad del vehículo), el **aporte por pasajero** (₡0 = gratuito) y el **método de pago**.
4. Toca **Publicar**. Verás **Viaje publicado**.

**Solicitudes**
- En **Solicitudes** verás quién quiere unirse, su punto de recogida y el monto. Toca **Aceptar** o **Rechazar**. Al aceptar se descuenta un cupo.

**Durante el viaje**
- Abre el viaje para ver las pestañas **Pasajeros** y **Paradas** (ordenadas según la ruta) y el mapa.
- **Iniciar viaje** cuando salgas → estado *En curso*.
- **Finalizar viaje** al llegar → se registra la hora de llegada y el viaje pasa al historial.
- **Cancelar viaje** si no puedes realizarlo → cada pasajero aceptado recibe un correo de aviso.

### A.10 Historial de viajes

Pestaña **Historial**. Muestra los viajes **finalizados** o **cancelados** en los que participaste, del más reciente al más antiguo. Se actualiza cada vez que abres la pestaña.

Cada tarjeta muestra la fecha, si fuiste **Conductor** o **Pasajero**, el monto, la ruta y el vehículo. Los viajes cancelados llevan la etiqueta **Cancelado** y monto ₡0.

Toca una tarjeta para ver el detalle:
- **Como conductor:** vehículo, ruta, fecha, hora de salida y llegada, número de pasajeros, **ganancia total** y lo que aportó cada pasajero.
- **Como pasajero:** conductor, vehículo, ruta, horas, tu punto de recogida, costo y método de pago.
- Si el viaje se canceló, verás el motivo indicado por el conductor.

### A.11 Problemas frecuentes

| Problema | Solución |
|---|---|
| *No se pudo conectar con el servidor.* | Revisa tu conexión a internet e inténtalo de nuevo. |
| *Demasiados intentos. Espera un minuto…* | Protección contra intentos repetidos; espera un minuto. |
| *Correo o contraseña incorrectos.* | Revisa mayúsculas y que el correo sea el institucional. |
| La lista de vehículos está vacía | Agrega un vehículo; solo se muestran los de tu cuenta. |
| El historial está vacío | Solo aparecen viajes finalizados o cancelados. |
| No encuentro viajes | Prueba otra hora o un lugar cercano; solo se muestran viajes con cupos. |

---

## Parte B — Portal web administrativo

### B.1 Acceso

1. Abre en el navegador la dirección del portal (publicada en Vercel) y entra a `/admin/login`.
2. Escribe tu correo y contraseña de administrador y toca **Iniciar sesión**.
3. **¿Olvidaste tu contraseña?** → escribe tu correo → abre el enlace que llega → escribe la nueva contraseña en **Cambiar contraseña**.
4. Para salir, usa **Cerrar sesión** en el menú lateral.

> Las cuentas de la app móvil no sirven en el portal, y viceversa.

### B.2 Menú lateral

| Sección | Para qué sirve |
|---|---|
| **Consultas generales** | Reportes con filtros. |
| **Estadísticas** | Gráficos del uso del servicio. |
| **Instituciones** | Instituciones afiliadas y sus dominios de correo. |
| **Usuarios** | Usuarios de la app y administradores. |
| **Parámetros** | Catálogos de opciones de la app. |

### B.3 Instituciones

- **Agregar institución:** nombre, acrónimo (opcional) y **dominio de correo** (por ejemplo `estudiantec.cr`).
- **Editar** o **activar/desactivar**. Solo los correos de instituciones **activas** pueden registrarse en la app.

### B.4 Usuarios

- Busca y filtra usuarios. Abre uno para ver **Información personal**, **Historial de viajes** y **Vehículo registrado**.
- **Desactivar** una cuenta cierra todas sus sesiones y le impide iniciar sesión. **Reactivar** la habilita de nuevo.
- **Administradores:** registra, edita o desactiva a otros administradores. No puedes desactivar tu propia cuenta sin confirmación explícita.

### B.5 Parámetros

Catálogos: **Métodos de pago**, **Tipos de vehículo**, **Rangos de edad**, **Opciones de género** y **Reglas y tarifas**. Puedes agregar, editar, activar/desactivar y eliminar valores.

Efecto en la app: solo las opciones **activas** aparecen (por ejemplo, los géneros del registro y del perfil, y los métodos de pago al publicar un viaje).

### B.6 Estadísticas y consultas generales

- **Estadísticas:** usuarios por institución y por género, viajes por estado y viajes por mes.
- **Consultas generales:** top de conductores, puntos concurrentes, usuarios activos, listado de viajes por rango de fechas, monto promedio y usuarios nuevos. Usa los filtros de institución y fechas.

---

## Anexo — Configuración para el equipo técnico

**Backend (`Carpooling_CR_Backend/.env`)**

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL en Supabase. |
| `PORT` | Puerto local (por defecto 3000). |
| `PUBLIC_API_URL` | URL pública del API (p. ej. la de Vercel). Se usa para armar el enlace de verificación del correo. Si falta, se toma de la petición. |
| `SMTP_USER`, `SMTP_PASS` | Cuenta que envía los correos (con Gmail, una contraseña de aplicación). Sin ellas, los correos —incluido el enlace de verificación— se escriben en la consola del servidor en vez de enviarse. |
| `SMTP_HOST`, `SMTP_PORT` | Opcionales; por defecto `smtp.gmail.com:465`. |

**Frontend (`Carpooling_CR_Frontend/.env`)**

| Variable | Uso |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL del API **incluyendo** `/api` (p. ej. `https://mi-api.vercel.app/api`). En un teléfono físico no uses `localhost`: usa la IP de tu computadora en la red local. |

**Endpoints nuevos de la app móvil**

| Método y ruta | Descripción |
|---|---|
| `GET /api/auth/verify-email?token=` | Verifica el correo (enlace del email). |
| `POST /api/auth/resend-verification` | Reenvía el enlace `{ correo }`. |
| `GET /api/catalogs/genders` | Opciones de género activas (sin sesión). |
| `GET /api/me/profile` · `PATCH /api/me/profile` | Ver y editar el perfil. |
| `GET /api/me/frequent-places` | Lugares frecuentes del usuario. |
| `GET /api/history` · `GET /api/history/:id` | Historial de viajes (`c-<viaje>` / `p-<solicitud>`). |
