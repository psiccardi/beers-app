FROM php:8.1-apache

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
    g++

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
    gd

#RUN pecl install apcu && docker-php-ext-enable apcu

# Ensure PHP logs are captured by the container
ENV LOG_CHANNEL=stderr

# Set a volume mount point for your code
#VOLUME /var/www/html

# Copy code and run composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY . /var/www/tmp
# COPY ./app /var/www/tmp
# COPY ./bootstrap /var/www/tmp
# COPY ./config /var/www/tmp
# COPY ./database /var/www/tmp
# COPY ./lang /var/www/tmp
# COPY ./node_modules /var/www/tmp
# COPY ./public /var/www/tmp
# COPY ./resources /var/www/tmp
# COPY ./routes /var/www/tmp
# COPY ./storage /var/www/tmp
# COPY ./tests /var/www/tmp
# COPY .editorconfig /var/www/tmp
# COPY .env /var/www/tmp
# COPY artisan /var/www/tmp
# COPY composer.json /var/www/tmp
# COPY composer.lock /var/www/tmp
# COPY docker-entrypoint.sh /var/www/tmp
# COPY package-lock.json /var/www/tmp
# COPY package.json /var/www/tmp
# COPY phpunit.xml /var/www/tmp
# COPY vite.config.js /var/www/tmp

RUN cd /var/www/tmp && composer install --no-dev
RUN mkdir -p /Applications/XAMPP/xamppfiles/logs/
RUN chmod -R 0777 /Applications/XAMPP/xamppfiles/logs/
RUN mkdir -p /Applications/XAMPP/xamppfiles/temp/
RUN chmod -R 0777 /Applications/XAMPP/xamppfiles/temp/

COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf
COPY php.ini /usr/local/etc/php/php.ini

#RUN echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini

# Ensure the entrypoint file can be run
RUN chmod +x /var/www/tmp/docker-entrypoint.sh
ENTRYPOINT ["/var/www/tmp/docker-entrypoint.sh"]

# The default apache run command
CMD ["apache2-foreground"]

