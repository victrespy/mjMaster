# Skeleton Project (HTTPS)

Este proyecto es un esqueleto base para aplicaciones web modernas utilizando **Symfony 8 (Backend)** y **React + Vite (Frontend)**, orquestado con **Docker** y servido vía **HTTPS** mediante Caddy.

## 🚀 Inicio Rápido (Nuevo Proyecto)

Si estás creando el proyecto desde cero:

```bash
chmod +x setup.sh
./setup.sh
```

## 🔄 Inicio Rápido (Clonar Proyecto Existente)

Si acabas de clonar este repositorio desde Git en un equipo nuevo:

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

Hemos incluido scripts en la carpeta `backend/` para facilitar las tareas comunes de desarrollo. Ejecútalos desde la raíz del proyecto o desde la carpeta `backend/`.

### Scripts de Utilidad (en `backend/`)
- **`./clean-cache.sh`**: Limpia la caché de Symfony dentro del contenedor.
- **`./make-migration.sh`**: Genera una nueva migración basada en los cambios de tus entidades.
- **`./migrate.sh`**: Aplica las migraciones pendientes a la base de datos.
- **`./load-fixtures.sh`**: Borra la base de datos y carga los datos de prueba iniciales.

> **Nota**: Si tu usuario no está en el grupo `docker`, recuerda ejecutarlos con `sudo`.

### Datos de Prueba (Fixtures)
El proyecto viene con usuarios preconfigurados para pruebas:
- **Admin**: `admin@example.com` (Password: `admin123`) - Rol: `ROLE_ADMIN`
- **User**: `user@example.com` (Password: `user123`) - Rol: `ROLE_USER`
- **Guest**: `guest@example.com` (Password: `guest123`) - Rol: `ROLE_GUEST`

---

## 🌿 Flujo de Trabajo Recomendado (Git)

Para mantener el proyecto ordenado, **nunca trabajes directamente en la rama `main`**.

1. **Asegúrate de estar actualizado**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Crea una Rama (Branch)** para tu tarea:
   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```

3. **Desarrolla tus cambios**, haz commit y sube la rama:
   ```bash
   git add .
   git commit -m "Descripción clara de lo que hice"
   git push origin feature/nombre-funcionalidad
   ```

---

## 🛠️ Guía de Desarrollo

### Acceso Seguro (HTTPS)
- **Frontend**: [https://localhost:8443](https://localhost:8443)
- **Backend API**: [https://localhost:9443/api](https://localhost:9443/api)
- **Base de Datos**: Puerto `5432` (User: `app_user`, Pass: `app_password`, DB: `app_db`)

### Comandos Backend (Symfony)
Ejecutar siempre dentro del contenedor:
```bash
docker compose exec backend php bin/console [comando]
```
- Crear Entidad: `make:entity`
- Crear Controlador: `make:controller`

---

## 📦 Estructura del Repositorio

### Backend (`backend/`)
- `src/Entity/`: Entidades de Doctrine (Base de Datos).
- `src/DataFixtures/`: Datos de prueba para la base de datos.
- `src/Repository/`: Lógica de consulta a la base de datos.

### Frontend (`frontend/`)
- `src/components/`: Componentes reutilizables.
- `src/pages/`: Vistas completas.
- `src/App.jsx`: Componente raíz y rutas.

---

## 🔧 Solución de Problemas

**Permisos de Docker (Linux)**
Si recibes errores de "permission denied" al usar Docker, añade tu usuario al grupo docker:
```bash
sudo usermod -aG docker $USER
# Reinicia sesión para aplicar cambios
```

**Puerto ocupado**
Si el puerto 8888, 8443 o 9443 está ocupado, edita `docker-compose.yml`.
