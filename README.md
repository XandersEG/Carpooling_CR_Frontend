# Carpooling_CR_Frontend

Aplicación frontend del proyecto de **Carpooling**, desarrollada con React Native y Expo utilizando TypeScript.

El sistema contempla una aplicación móvil para los usuarios y una interfaz web para las funcionalidades de configuración y administración, utilizando una misma base de código.

## Tecnologías

- **React Native:** desarrollo de interfaces de usuario.
- **Expo:** plataforma y herramientas para el desarrollo de aplicaciones multiplataforma.
- **TypeScript:** lenguaje de programación utilizado para el desarrollo.
- **GitHub:** plataforma para el control de versiones y colaboración.
- **GitHub Desktop:** aplicación gráfica para gestionar el repositorio, las ramas, los commits y los Pull Requests.
- **Vercel:** plataforma prevista para el despliegue de la aplicación web.

## Requisitos previos

Para trabajar con el proyecto se necesita:

- **Node.js 26.13.0:** versión establecida para mantener un entorno de desarrollo uniforme.
- **GitHub Desktop:** para clonar el repositorio y gestionar los cambios.
- **Expo Go:** para probar la aplicación móvil en un dispositivo físico, o un emulador compatible.

> **Nota:** npm viene incluido con la instalación de Node.js, por lo que no es necesario instalarlo por separado.

Para comprobar las versiones instaladas, ejecutar en una terminal:

```bash
node --version
npm --version
```

La versión de Node.js debe ser `26.13.0`.

## Instalación y ejecución

### 1. Clonar el repositorio

1. Instalar y abrir GitHub Desktop.
2. Iniciar sesión con la cuenta de GitHub que tiene acceso al repositorio.
3. Seleccionar `File → Clone Repository`.
4. Buscar el repositorio o seleccionar la pestaña `URL`.
5. Ingresar la siguiente dirección:

   ```text
   https://github.com/XandersEG/Carpooling_CR_Frontend.git
   ```

6. Seleccionar la ubicación local donde se almacenará el proyecto y presionar `Clone`.

### 2. Instalar dependencias

Abrir una terminal en la carpeta del proyecto y ejecutar:

```bash
npm install
```

### 3. Ejecutar la aplicación

Iniciar el servidor de desarrollo:

```bash
npx expo start
```

**Aplicación móvil:**

Escanear el código QR desde Expo Go o ejecutar el proyecto en un emulador compatible.

**Aplicación web:**

```bash
npx expo start --web
```

La ejecución web requiere que el proyecto tenga configuradas las dependencias correspondientes para React Native Web.

## Organización del código

La estructura del proyecto se definirá durante la configuración inicial. Se recomienda mantener una organización modular que facilite el trabajo colaborativo.

Estructura propuesta:

```text
Carpooling_CR_Frontend/
├── app/                  # Pantallas y navegación
├── assets/               # Imágenes, iconos y fuentes
├── components/           # Componentes reutilizables
├── src/
│   ├── features/         # Funcionalidades del sistema
│   ├── services/         # Servicios y comunicación con API
│   ├── hooks/            # Hooks reutilizables
│   ├── constants/        # Constantes generales
│   └── types/            # Tipos e interfaces TypeScript
├── .env.example          # Ejemplo de variables de entorno
├── .nvmrc                # Versión de Node.js
├── .gitignore
├── app.json
├── package.json
└── README.md
```

Esta estructura puede ajustarse conforme avance el desarrollo, manteniendo la separación de responsabilidades y evitando duplicaciones.

## Lineamientos de desarrollo

1. Utilizar TypeScript para el desarrollo del proyecto.
2. Evitar el uso de `any`; definir los tipos e interfaces necesarios.
3. Mantener los componentes reutilizables cuando corresponda.
4. Separar las interfaces web y móviles cuando sus diseños o comportamientos lo requieran.
5. Centralizar la comunicación con el backend mediante servicios.
6. Evitar duplicar lógica que pueda compartirse entre plataformas.
7. Mantener los cambios pequeños y enfocados en una funcionalidad específica.
8. No incluir credenciales, contraseñas ni secretos directamente en el código fuente.

## Control de versiones y colaboración

El repositorio utiliza un flujo de trabajo basado en ramas y Pull Requests para mantener la estabilidad de `main` y facilitar la integración del trabajo de los colaboradores.

### **Rama principal**

`main` es la rama principal del proyecto y contiene el código integrado y estable.

**No se permite realizar cambios directamente sobre `main`.**

### **Creación de ramas**

Cada nueva funcionalidad o corrección debe desarrollarse en una rama independiente, creada a partir de la versión más reciente de `main`.

Para crear una rama utilizando GitHub Desktop:

1. Seleccionar el repositorio `Carpooling_CR_Frontend`.
2. Cambiar a la rama `main`.
3. Presionar `Fetch origin` para comprobar si hay cambios remotos.
4. Si hay cambios pendientes, actualizar `main` mediante `Pull origin`.
5. Abrir el menú `Current Branch` y seleccionar `New Branch`.
6. Escribir el nombre de la nueva rama según la convención explicada adelante y comprobar que se cree a partir de `main`.
7. Presionar `Create Branch`.

Convención para nombrar ramas:

- `feature/`: nuevas funcionalidades.
- `fix/`: correcciones de errores.
- `docs/`: cambios de documentación.
- `refactor/`: reorganización del código.

Ejemplos:

```text
feature/registro-usuarios
feature/busqueda-viajes
feature/perfil-usuario
fix/validacion-formulario
```

### **Commits**

Los cambios deben guardarse mediante commits descriptivos y relacionados con la tarea implementada.

Para realizar un commit desde GitHub Desktop:

1. Revisar los archivos modificados en la sección `Changes`.
2. Escribir un mensaje descriptivo en el campo `Summary`.
3. Presionar `Commit to [nombre-de-la-rama]`.

Ejemplos de mensajes:

- `feat: implement user registration`
- `fix: correct form validation`
- `docs: update frontend README`
- `refactor: organize user components`

### **Publicar los cambios**

Después de realizar uno o varios commits:

1. Presionar `Publish branch` para publicar la rama por primera vez.
2. En los siguientes cambios, utilizar la opción `Push origin` para enviar los commits al repositorio remoto.

### **Actualización antes de crear un Pull Request**

Antes de abrir un Pull Request, comprobar que la rama de trabajo esté actualizada con los cambios más recientes de `main`.

1. Presionar `Fetch origin`.
2. Si `main` recibió nuevos cambios después de crear la rama de trabajo, actualizar la rama actual utilizando la opción `Update from main`, cuando esté disponible.
3. Resolver los conflictos que puedan aparecer y comprobar que la funcionalidad continúe funcionando correctamente.

### **Pull Requests**

Todo cambio destinado a `main` debe integrarse mediante un Pull Request.

Para crear uno desde GitHub Desktop:

1. Confirmar que los cambios estén guardados y publicados en la rama de trabajo.
2. Seleccionar `Preview Pull Request`.
3. Presionar `Create Pull Request`.
4. Comprobar que la rama base (`base`) sea `main` y que la rama de comparación (`compare`) sea la rama de trabajo.
5. Completar el título y la descripción del Pull Request.
6. Enviar el Pull Request para revisión (`Create pull request`).

Los Pull Requests deben:

1. Tener como rama destino `main`.
2. Corresponder a una funcionalidad o corrección específica.
3. Incluir una descripción clara de los cambios realizados.
4. Mantener una cantidad razonable de archivos y líneas modificadas.
5. Ser revisados y aprobados por al menos otro integrante del equipo antes de integrarse.

No se deben crear Pull Requests que mezclen funcionalidades independientes o cambios innecesarios.

### **Integración**

Una vez aprobado el Pull Request, se podrá integrar el cambio en `main` mediante las opciones de merge habilitadas en el repositorio.

Después de la integración, eliminar la rama de trabajo y actualizar la rama local principal.

**Regla fundamental: ningún cambio debe llegar a `main` sin un Pull Request revisado y aprobado.**

## Variables de entorno

Las variables de entorno deben utilizarse para configurar direcciones de servicios y otros valores necesarios para la ejecución del proyecto.

No se deben subir archivos `.env` con información privada al repositorio.

Se utilizará `.env.example` como referencia para que cada colaborador pueda configurar su entorno local.

**Importante:** las variables con prefijo `EXPO_PUBLIC_` son accesibles desde el código del frontend. No deben contener contraseñas, claves privadas ni credenciales administrativas.

## Backend

La aplicación consume los servicios proporcionados por el repositorio de Backend, donde se implementa la lógica de negocio y la comunicación con la base de datos.

Los contratos de API, rutas y estructuras de respuesta deben coordinarse entre los integrantes de ambos equipos (Frontend y Backend).

## Información académica

Proyecto desarrollado para el curso **Administración de Proyectos**, de Ingeniería en Computación del Instituto Tecnológico de Costa Rica.
