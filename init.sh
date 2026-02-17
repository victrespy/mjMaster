#!/bin/bash

# Script para inicializar el proyecto después de clonarlo (git clone)

set -e

echo "=== Inicializando Project Skeleton ==="

# 1. Levantar contenedores
echo "Levantando contenedores Docker..."
docker compose up -d --build

# 2. Instalar dependencias Backend
echo "Instalando dependencias de Symfony (Composer)..."
# Usamos update para asegurar que el composer.lock se sincronice con los cambios manuales en composer.json
docker compose exec backend composer update

# 3. Instalar dependencias Frontend
echo "Instalando dependencias de React (NPM)..."
# Esto leerá el package.json actualizado con tailwindcss
docker compose exec frontend npm install

# 4. Preparar Base de Datos
echo "Esperando a que la base de datos esté lista..."
sleep 10 # Dar tiempo a Postgres para arrancar

echo "Creando base de datos (si no existe)..."
docker compose exec backend php bin/console doctrine:database:create --if-not-exists

echo "Ejecutando migraciones de base de datos..."
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# 5. Cargar Fixtures (Datos de prueba)
echo "Cargando datos de prueba (Fixtures)..."
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# 6. Limpiar caché
echo "Limpiando caché de Symfony..."
docker compose exec backend php bin/console cache:clear

echo ""
echo "=== ¡Proyecto listo! ==="
echo "Frontend: https://localhost:8443"
echo "Backend API: https://localhost:9443/api"
echo "Backend Hello: https://localhost:9443/api/hello"
