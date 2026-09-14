#!/bin/bash
set -e

# Volume is empty on first boot; these dirs must exist before artisan runs.
mkdir -p \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  storage/app/public \
  bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache || true

php artisan migrate --force
php artisan db:seed --force
php artisan storage:link --force || php artisan storage:link || true

# Skip the web installer on Railway. Env vars come from the dashboard, not a local .env.
touch public/.installed
if [ ! -f .env ]; then
  : > .env
fi

php artisan config:cache
php artisan event:cache
php artisan view:cache || true
# Do not run optimize:clear or route:cache here.
# optimize:clear fails when an empty volume hides storage/framework/views.
# route:cache fails because this app registers closure routes.
