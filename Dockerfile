FROM php:8.2-apache

# Install packages
RUN apt-get update && apt-get install -y \
    git \
    zip \
    curl \
    sudo \
    unzip \
    libicu-dev \
    libbz2-dev \
    libpng-dev \
    libjpeg-dev \
    libmcrypt-dev \
    libreadline-dev \
    libfreetype6-dev \
    libpng-dev \
    libzip-dev \
    g++

# COPY files-cron /etc/cron.d/files-cron

# Give execution rights on the cron job
# RUN chmod 0644 /etc/cron.d/files-cron

# Apply cron job
#RUN crontab /etc/cron.d/files-cron

# Apache configuration
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite headers

# Common PHP Extensions
RUN docker-php-ext-install \
    bz2 \
    intl \
    iconv \
    bcmath \
    opcache \
    calendar \
    pdo_mysql \
    gd \
    zip

RUN apt-get update && apt-get install -y supervisor

#RUN pecl install apcu && docker-php-ext-enable apcu

# Ensure PHP logs are captured by the container
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1
# Set a volume mount point for your code
VOLUME /var/www/html

# Copy code and run composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY . /var/www/tmp
RUN cd /var/www/tmp &&  composer install --no-dev
COPY php.ini /usr/local/etc/php/php.ini
COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf
COPY laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf
#COPY php.ini /usr/local/etc/php/php.ini

#RUN echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini

# Ensure the entrypoint file can be run
RUN chmod +x /var/www/tmp/docker-entrypoint.sh
RUN mkdir -p /var/www/tmp/public/uploads
RUN chown -R 0777 /var/www/tmp/public/uploads

ENTRYPOINT ["/var/www/tmp/docker-entrypoint.sh"]

# The default apache run command
CMD ["apache2-foreground"]

