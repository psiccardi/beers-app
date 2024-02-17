#!/bin/bash

sudo cp -R /var/www/tmp/. /var/www/html/
chown -R www-data:www-data /var/www/html

cd /var/www/html

php artisan migrate --force

exec "$@"
