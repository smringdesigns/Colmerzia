#!/bin/sh
set -e

# Se corre en CADA arranque de contenedor (backend, queue-worker y
# scheduler comparten esta misma imagen/entrypoint, solo cambia el
# comando final). config:clear primero por si el contenedor viene
# de un `docker compose restart` (no un rebuild) y quedó un cache
# viejo en la capa escribible.
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
