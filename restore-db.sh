#!/bin/bash

# Nombre del archivo de backup
BACKUP_FILE="backup_db_full.sql"

# Verificar si el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: El archivo '$BACKUP_FILE' no existe en la raíz del proyecto."
    exit 1
fi

echo "🔄 Iniciando restauración de base de datos desde '$BACKUP_FILE'..."

# Ejecutar la restauración
# Usamos -T para desactivar la asignación de pseudo-tty, necesario para pipes
cat "$BACKUP_FILE" | docker compose exec -T database mariadb -u app_user -papp_password app_db

if [ $? -eq 0 ]; then
    echo "✅ Base de datos restaurada correctamente."
else
    echo "❌ Error al restaurar la base de datos."
    exit 1
fi
