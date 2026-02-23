#!/bin/bash

# Nombre del archivo de backup
BACKUP_FILE="backup_db_full.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: No se encontró el archivo '$BACKUP_FILE'."
    exit 1
fi

echo "🔄 Restaurando base de datos desde '$BACKUP_FILE'..."

# Ejecutar psql dentro del contenedor para restaurar
# Usamos la variable de entorno PGPASSWORD para evitar que pida contraseña interactivamente
cat "$BACKUP_FILE" | docker compose exec -T -e PGPASSWORD=app_password database psql -U app_user -d app_db

if [ $? -eq 0 ]; then
    echo "✅ Base de datos restaurada correctamente."
else
    echo "❌ Error al restaurar la base de datos."
    exit 1
fi
