#!/bin/bash

# Nombre del archivo de backup
BACKUP_FILE="backup_db_full.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: No se encontró el archivo '$BACKUP_FILE'."
    exit 1
fi

echo "⚠️  ATENCIÓN: Esto borrará la base de datos actual y la restaurará desde el backup."
echo "Presiona ENTER para continuar o Ctrl+C para cancelar..."
read

echo "🔥 Desconectando usuarios y borrando base de datos..."

# 1. Matar conexiones activas
docker compose exec -e PGPASSWORD=app_password database psql -U app_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'app_db' AND pid <> pg_backend_pid();"

# 2. Borrar la base de datos
docker compose exec -e PGPASSWORD=app_password database psql -U app_user -d postgres -c "DROP DATABASE IF EXISTS app_db;"

echo "🏗️  Creando base de datos vacía..."
docker compose exec -e PGPASSWORD=app_password database psql -U app_user -d postgres -c "CREATE DATABASE app_db;"

echo "🔄 Restaurando base de datos desde '$BACKUP_FILE'..."

# Ejecutar psql dentro del contenedor para restaurar
cat "$BACKUP_FILE" | docker compose exec -T -e PGPASSWORD=app_password database psql -U app_user -d app_db

if [ $? -eq 0 ]; then
    echo "✅ Base de datos restaurada correctamente."
else
    echo "❌ Error al restaurar la base de datos."
    exit 1
fi
