#!/bin/bash
echo "♻️  Cargando fixtures (esto borrará los datos actuales)..."
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
echo "✅ ¡Fixtures cargadas con éxito!"
