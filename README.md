# Growshop Skeleton Project (HTTPS)

Este proyecto es un esqueleto base para un e-commerce de **Growshop** utilizando **Symfony 8 (Backend)** y **React + Vite (Frontend)**, orquestado con **Docker** y servido vía **HTTPS** mediante Caddy.

## 🚀 Tecnologías Principales

*   **Backend**: Symfony 8, API Platform 4, Doctrine ORM, PostgreSQL.
*   **Frontend**: React 19, Vite, Tailwind CSS 3.
*   **Infraestructura**: Docker Compose, Caddy (HTTPS/Proxy).

## 🔄 Inicio Rápido

Si acabas de clonar este repositorio:

1. Dale permisos al script de inicialización:
   ```bash
   chmod +x init.sh
   ```

2. Ejecuta el script para instalar dependencias, levantar contenedores y cargar datos de prueba:
   ```bash
   sudo ./init.sh
   ```

---

## 🛠️ Automatización y Base de Datos

Hemos incluido scripts en la **raíz del proyecto** para facilitar las tareas comunes de desarrollo.

### Scripts de Utilidad
- **`./init.sh`**: Inicialización completa del proyecto (Docker, dependencias, BD y fixtures).
- **`./clean-cache.sh`**: Limpia la caché de Symfony dentro del contenedor.
- **`./make-migration.sh`**: Genera una nueva migración basada en los cambios de tus entidades.
- **`./migrate.sh`**: Aplica las migraciones pendientes a la base de datos.
- **`./load-fixtures.sh`**: Carga los datos de prueba iniciales (borra los datos actuales).
- **`./reset-db.sh`**: **Reset total**. Borra migraciones, recrea la BD desde cero y carga fixtures.
- **`./backup-db.sh`**: Crea una copia de seguridad de la base de datos PostgreSQL.
- **`./restore-db.sh`**: Restaura la base de datos desde una copia de seguridad.
- **`./setup.sh`**: Script de scaffolding inicial (solo para creación del proyecto).

> **Nota**: Si tu usuario no está en el grupo `docker`, recuerda ejecutarlos con `sudo`.

### Datos de Prueba (Fixtures)
El proyecto incluye un catálogo inicial de Growshop (Semillas, Bongs, Grinders) y usuarios:
- **Admin**: `admin@example.com` (Pass: `admin123`) - Rol: `ROLE_ADMIN`
- **User**: `user@example.com` (Pass: `user123`) - Rol: `ROLE_USER`
- **Guest**: `guest@example.com` (Pass: `guest123`) - Rol: `ROLE_GUEST`

---

## 🌿 Flujo de Trabajo Recomendado

### 1. Gestión de Ramas (Git)
**Nunca trabajes directamente en `main`**.
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-funcionalidad
```

### 2. Cambios en el Modelo (Entidades)
Si necesitas añadir campos o nuevas tablas:
1. Modifica la entidad en `backend/src/Entity/`.
2. Ejecuta `./make-migration.sh`.
3. Ejecuta `./migrate.sh`.
4. (Opcional) Si el cambio es muy grande, usa `./reset-db.sh`.

### 3. Desarrollo Frontend
El frontend se sirve en [https://localhost:8443](https://localhost:8443).
Usa Tailwind CSS para los estilos. Las imágenes de producto por defecto están en `frontend/public/products/placeholder.avif`.

---

## 🛠️ Guía de Acceso

- **Frontend**: [https://localhost:8443](https://localhost:8443)
- **Backend API (Swagger)**: [https://localhost:9443/api](https://localhost:9443/api)
- **Base de Datos**: Puerto `5432` (User: `app_user`, Pass: `app_password`, DB: `app_db`)

---

## 📦 Estructura del Repositorio

### Backend (`backend/`)
- `src/Entity/`: Entidades de la base de datos (User, Product, Category, Order, Review).
- `src/DataFixtures/`: Catálogo inicial y usuarios de prueba.

### Frontend (`frontend/`)
- `src/components/`: Componentes React reutilizables.
- `src/pages/`: Vistas principales (Home, Login, etc.).
- `public/products/`: Almacenamiento temporal de imágenes de producto.

---

## 🔧 Solución de Problemas

**Permisos de Docker (Linux)**
```bash
sudo usermod -aG docker $USER
# Reinicia sesión para aplicar cambios
```

**Error de Tailwind/PostCSS**
Si Vite falla al cargar Tailwind, asegúrate de que las dependencias estén instaladas:
```bash
sudo docker compose exec frontend npm install
```

**⚠️ Error de Login / Network Error (CORS)**
Si al intentar hacer Login recibes un error de red o CORS en la consola:
1. Abre [https://localhost:9443/api/hello](https://localhost:9443/api/hello) en una nueva pestaña.
2. Verás una advertencia de seguridad ("La conexión no es privada").
3. Haz clic en **Avanzado** -> **Continuar a localhost (no seguro)**.
4. Vuelve a la aplicación y prueba el Login de nuevo.
   
> Esto ocurre porque el navegador bloquea las peticiones al Backend (puerto 9443) si no has aceptado explícitamente su certificado SSL autofirmado.
