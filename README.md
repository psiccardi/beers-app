# Beers app
This project consists of a login form and a page that exposes a list of beers.

## Init the project ##
The first steps are:
1) run **npm install** to install al node_modules packages
2) run **npm run build** to build the Vue app
3) run **composer install** to install project php dependencies

## Test with docker ##
To test this project with docker you should:
1) create a folder **&lt;project root folder&gt;/../docker-volumes/beers-app/db**, this is the volume 
   where is stored all database data
2) run **docker-compose build** and **docker-compose up** or **docker-compose up --build**
3) navigate in the browser to **http://localhost:8000**
4) Type **root** as username **password** as password in the login form

## Run Unit tests ##
To run unit tests from terminal:
1) Go to project root folder
2) run **php artisan test**

## Test APIs with Postman (or equivalent) ##
### Login API ###
***Endpoint***: /api/login
***Method***: POST
***Parameters***:
 - ***username***: root
 - ***password***: password

This API returns a JSON object with the following keys:
 - ***token***: the token that should be used for subsequent API requests
 - ***user***: an object representing the current user

### Beers List API ###
***Endpoint***: /api/beers
***Method***: GET
***Parameters***:
 - ***page***: 0 or any positive integer
 - ***limit***: 1-80 (if limit > 80 this API returns a Bad Request Error)

***Authentication***:
This route is protected, so you have to add a Bearer Authentication header with the token retrieved from ***Login API***.

An example with curl:
```
curl --location 'https://www.beers-app.me/api/beers?page=0&limit=20' --header 'Authorization: Bearer <token>'
```
