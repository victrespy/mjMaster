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

## 🔄 2. Flujo de Trabajo con Git

Para mantener el código organizado y evitar conflictos:

1.  **Sincronización Diaria**: Antes de empezar, actualiza tu local con los cambios de tus compañeros:
    ```bash
    git checkout main
    git pull origin main
    git checkout mi-rama
    git merge main
    ```
2.  **Ramas por Funcionalidad**: Crea una rama descriptiva para cada tarea:
    `feature/login-form`, `feature/product-filters`, `feature/cart-logic`.
3.  **Pull Requests (PR)**: No fusiones directamente a `main`. Sube tu rama y pide a al menos uno de tus compañeros que revise tu código antes de hacer el merge.
4.  **Migraciones**: Si un compañero añade campos a la base de datos, tras hacer el merge deberás ejecutar:
    ```bash
    ./migrate.sh
    ```

---

## 🛠️ 3. Cómo trabajar si dependes de otro

Es normal que el encargado del Carrito necesite productos, o el de Pedidos necesite el Login. Para no deteneros:

*   **Contrato de API**: Las entidades ya están creadas. Consultad [https://localhost:9443/api](https://localhost:9443/api) para ver qué campos tiene cada objeto. Ese es vuestro "contrato".
*   **Uso de Fixtures**: Utilizad `./load-fixtures.sh` para tener datos reales en la base de datos desde el primer día. No esperéis a que el compañero termine el formulario de creación.
*   **Mocking**: Si necesitas una respuesta del servidor que aún no existe, simula un objeto JSON en tu código React temporalmente para seguir diseñando la interfaz.

---

## 🚀 4. Herramientas de Coordinación

*   **Swagger UI**: Vuestra referencia principal para saber qué endpoints están disponibles.
*   **Comunicación**: Avisad por el grupo antes de hacer cambios estructurales en las entidades (ej: cambiar el nombre de un campo en `Product`).
*   **Reset Rápido**: Si algo se rompe en tu base de datos local por las pruebas de tus compañeros, usa `./reset-db.sh` para volver a un estado limpio y funcional.

---

¡Mucho ánimo con el desarrollo! 🚀
