#!/bin/bash
echo "🛠️  Generando nueva migración (en Docker)..."
docker compose exec backend php bin/console make:migration
echo "✅ ¡Migración generada! Revisa la carpeta 'backend/migrations'."
