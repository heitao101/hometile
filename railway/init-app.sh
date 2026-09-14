#!/bin/bash
set -e

mkdir -p storage/framework/{cache,sessions,views} storage/logs storage/app/public bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

php artisan migrate --force
php artisan db:seed --force
php artisan storage:link --force || true

# Skip the web installer on Railway. Env vars come from the dashboard, not a local .env.
touch public/.installed

php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan view:cache
# Do not run route:cache — this app registers closure routes.
