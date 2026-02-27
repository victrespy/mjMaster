#!/bin/bash

echo "🔧 Arreglando permisos en contenedores Docker..."

# 1. Backend (Symfony/Apache)
echo "👉 Ajustando permisos del Backend (public/ y var/)..."
docker compose exec backend chown -R www-data:www-data /var/www/html/public /var/www/html/var
docker compose exec backend chmod -R 775 /var/www/html/public /var/www/html/var

# Asegurar que la carpeta de productos existe y tiene permisos
docker compose exec backend mkdir -p /var/www/html/public/products
docker compose exec backend chown -R www-data:www-data /var/www/html/public/products
docker compose exec backend chmod -R 777 /var/www/html/public/products

# 2. Frontend (Node) - Opcional, pero útil para node_modules o build
echo "👉 Ajustando permisos del Frontend..."
# A veces node necesita escribir en node_modules o .vite
docker compose exec frontend chmod -R 777 /app/node_modules 2>/dev/null || true

echo "✅ ¡Permisos arreglados! Intenta subir la imagen de nuevo."
