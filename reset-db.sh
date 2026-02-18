#!/bin/bash
echo "⚠️  ¡ATENCIÓN! Este script borrará TODA la base de datos y las migraciones actuales."
echo "Presiona ENTER para continuar o Ctrl+C para cancelar..."
read

echo "🗑️  Borrando archivos de migración antiguos..."
rm -f backend/migrations/Version*.php

echo "🔥 Borrando base de datos..."
docker compose exec backend php bin/console doctrine:database:drop --force --if-exists

echo "🏗️  Creando base de datos vacía..."
docker compose exec backend php bin/console doctrine:database:create

echo "🛠️  Generando migración limpia..."
docker compose exec backend php bin/console make:migration

echo "🚀 Aplicando migración..."
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

echo "♻️  Cargando datos de prueba (Fixtures)..."
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

echo "✅ ¡Base de datos reseteada y lista!"
