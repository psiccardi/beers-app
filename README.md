## Initialize laravel with Vue

- Install NodeJS
- Install Composer
- Create new Laravel project (see below)
- Edit package.json (see below)
- Run in console: **npm i**
- Run in console: **npm i vue vue-loader**
- Run in console: **npm i @vitejs/plugin-vue**
- Edit vite.config.js (see below)
- Install Visual Studio Code extensions for Vue (see below)
- Create main Vue component (see below)
- Edit resources/js/app.js (see below)
- Edit welcome.blade.php (see below)
- Run in console: **npm run dev**

### Create new Laravel project
In the console type:
**composer create-project laravel/laravel &lt;project-name&gt;**
then type:
**cd &lt;project-name&gt;**

### Edit package.json
Add, inside **"devDependencies"** object these lines:
```json
"axios": "^1.6.1",
"laravel-vite-plugin": "^0.8.0",
"lodash": "*4.17.19",
"postcss": "*8.1.14",
"vite": "^4.0.0"
```
### Edit vite.config.js ###
The file should be like this (in bold the edited parts):
import { defineConfig } from 'vite';
**import vue from "@vitejs/plugin-vue";**
```javascript
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
    ],
});
```

### Install Visual Studio Code extensions
- Install **Vue Language Features (Volar)**
- Install **Vetur**
- Install **TypeScript Vue Plugin (Volar)**

### Create main Vue component
Inside the resources folder add a new **src** folder.
Inside this new folder add a file **App.vue**
In this file add the following lines:
```html
<template>
   <div> 
        <h1>Laravel + Vue</h1>
        <hr>
        <h3>{{ title }}</h3>
    </div>
</template>

<script setup>
    const title = "Laravel Title using Vue Setup";
</script>

<style scoped>
div {
    text-align: center;
}

</style>
```

### Edit resources/js/app.js
Add these lines:
```javascript
import './bootstrap';
import { createApp } from "vue";
import App from "../src/App.vue";

createApp(App).mount("#app");
```

### Edit welcome.blade.php
Delete all content of the **&lt;body&gt;** tag and insert these lines:
```html
<div id="app"></div>
@vite('resources/js/app.js')
```
### Premium Partners

