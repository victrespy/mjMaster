# 🤝 Guía de Trabajo en Equipo - Growshop Project

Esta guía establece el flujo de trabajo y la división de tareas para el desarrollo colaborativo del proyecto entre los 3 integrantes del equipo.

---

## 🏗️ 1. División de Responsabilidades (Vertical Slices)

Para evitar bloqueos y que todos toquen tanto el Frontend como el Backend, dividiremos el proyecto por funcionalidades completas:

### 👤 Alumno A: Gestión de Usuarios y Seguridad
*   **Backend**: Configuración de autenticación JWT (LexikJWTBundle), registro de usuarios, protección de rutas privadas y gestión del perfil (`/api/users/me`).
*   **Frontend**: Formularios de Login, Registro, validación de sesiones y página de "Mi Cuenta".

### 🌿 Alumno B: Catálogo de Productos y Búsqueda
*   **Backend**: Configuración de filtros en API Platform (búsqueda por nombre, filtrado por categoría, rango de precios) y gestión de imágenes de productos.
*   **Frontend**: Listado de productos (Grid), filtros laterales, buscador en tiempo real y página de detalle del producto.

### 🛒 Alumno C: Carrito de Compra y Pedidos
*   **Backend**: Lógica de creación de pedidos (`POST /orders`), cálculo automático del total, validación de stock y relación con `OrderProducts`.
*   **Frontend**: Estado global del carrito (añadir/quitar/vaciar), persistencia en LocalStorage, proceso de Checkout y listado de "Mis Pedidos".

---

## 🌳 2. Estrategia de Ramas (Gitflow Simplificado)

Para ver el trabajo junto sin romper `master`, usaremos una rama intermedia llamada `develop`.

### Jerarquía de Ramas
1.  **`master` (Producción)**: 🔴 **INTOCABLE**. Solo contiene código 100% funcional y probado. Es lo que entregaréis al profesor.
2.  **`develop` (Integración)**: 🟡 **ZONA DE MEZCLA**. Aquí es donde juntáis vuestras partes. Si algo falla aquí, no es grave.
3.  **`feature/nombre-tarea`**: 🟢 **TU ZONA**. Donde trabajas día a día.

### Paso a Paso: Cómo integrar cambios

**1. Crear la rama `develop` (Solo una vez al principio)**
El líder del equipo crea esta rama desde `master` y la sube:
```bash
git checkout master
git checkout -b develop
git push origin develop
```

**2. Tu día a día (Trabajar)**
Siempre creas tu rama desde `develop`, no desde `master`:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/mi-funcionalidad
# ... trabajas, haces commits ...
```

**3. Juntar tu trabajo con el de los demás**
Cuando termines tu parte:
1.  Sube tu rama: `git push origin feature/mi-funcionalidad`.
2.  Haz un **Pull Request (PR)** en GitHub/GitLab apuntando a **`develop`**.
3.  Tus compañeros revisan y aprueban.
4.  Se fusiona (Merge) en `develop`.

**4. Ver todo junto (Sin tocar `master`)**
Para ver cómo queda el Login (Alumno A) con el Carrito (Alumno C):
```bash
git checkout develop
git pull origin develop
# Ahora en tu local tienes TODO mezclado.
# Levanta Docker y prueba que nada haya explotado.
```

**5. Pasar a `master` (Entrega)**
Solo cuando `develop` funcione perfecto y todos estéis contentos:
```bash
git checkout master
git merge develop
git push origin master
```

---

## 🔑 3. Configuración de Credenciales (Token de GitHub)

Para evitar que Git te pida usuario y contraseña cada vez que haces un `push` o `pull`, configura tu entorno local para recordar las credenciales.

1.  **Ejecuta este comando una sola vez**:
    ```bash
    git config --global credential.helper store
    ```

2.  **La próxima vez que Git te pida credenciales**:
    *   **Usuario**: Tu nombre de usuario de GitHub.
    *   **Contraseña**: Pega el **Token de Acceso Personal (PAT)** que os ha proporcionado el profesor o el líder del equipo (empieza por `ghp_...`).
    
    > ⚠️ **IMPORTANTE**: Nunca subas el token al repositorio (ni en este archivo ni en el código). Compártelo solo por canales privados seguros.

---

## 🛠️ 4. Cómo trabajar si dependes de otro

Es normal que el encargado del Carrito necesite productos, o el de Pedidos necesite el Login. Para no deteneros:

*   **Contrato de API**: Las entidades ya están creadas. Consultad [https://localhost:9443/api](https://localhost:9443/api) para ver qué campos tiene cada objeto. Ese es vuestro "contrato".
*   **Uso de Fixtures**: Utilizad `./load-fixtures.sh` para tener datos reales en la base de datos desde el primer día. No esperéis a que el compañero termine el formulario de creación.
*   **Mocking**: Si necesitas una respuesta del servidor que aún no existe, simula un objeto JSON en tu código React temporalmente para seguir diseñando la interfaz.

---

## 🚀 5. Herramientas de Coordinación

*   **Swagger UI**: Vuestra referencia principal para saber qué endpoints están disponibles.
*   **Comunicación**: Avisad por el grupo antes de hacer cambios estructurales en las entidades (ej: cambiar el nombre de un campo en `Product`).
*   **Reset Rápido**: Si algo se rompe en tu base de datos local por las pruebas de tus compañeros, usa `./reset-db.sh` para volver a un estado limpio y funcional.

---

## ⚠️ 6. Solución de Problemas Comunes

### Error de Login / Network Error / CORS
Si al intentar hacer Login recibes un error de red o CORS en la consola:
1.  Abre [https://localhost:9443/api/hello](https://localhost:9443/api/hello) en una nueva pestaña.
2.  Verás una advertencia de seguridad ("La conexión no es privada").
3.  Haz clic en **Avanzado** -> **Continuar a localhost (no seguro)**.
4.  Vuelve a la aplicación y prueba el Login de nuevo.

### Error "Unable to create token" (Backend)
Si el backend falla al generar tokens JWT:
1.  Asegúrate de haber generado las claves JWT en tu máquina:
    ```bash
    docker compose exec backend php bin/console lexik:jwt:generate-keypair
    ```
2.  Si acabas de hacer `git pull`, instala las nuevas dependencias:
    ```bash
    docker compose exec backend composer install
    ```

¡Mucho ánimo con el desarrollo! 🚀
