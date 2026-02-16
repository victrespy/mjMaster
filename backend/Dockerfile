FROM php:8.4-apache
RUN apt-get update && apt-get install -y \
    libpq-dev git unzip \
    && docker-php-ext-install pdo pdo_pgsql
RUN a2enmod rewrite
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf
WORKDIR /var/www/html
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
