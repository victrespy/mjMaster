#!/bin/bash
echo "🧹 Limpiando caché de Symfony (en Docker)..."
docker compose exec backend php bin/console cache:clear
echo "✅ ¡Caché limpiada correctamente!"
