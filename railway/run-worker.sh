#!/bin/bash
set -e
php artisan queue:work database --sleep=3 --tries=3 --max-time=3600 --timeout=300
