# Beers app
This project consists of a login and a protected route with a list of beers.

## Init the project ##
The first steps are:
1) run **npm install** to install al node_modules packages
2) run **npm run build** to build the Vue app
3) run **composer install** to install project php dependencies

## Test with docker ##
To test this project with docker you should:
1) create a folder **&lt;project root folder>&gt;/../docker-volumes/beers-app/db**, this is the volume 
   where is stored all database data
2) run **docker-compose build** and **docker-compose up** or **docker-compose up --build**
3) navigate in the browser to **http://localhost:8000**
4) Type **root** as username **password** as password in the login form

## Run Unit tests ##
To run unit tests from terminal:
1) Go to project root folder
2) run **php artisan test**
