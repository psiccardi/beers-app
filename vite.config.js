import { defineConfig } from 'vite';
import vue from "@vitejs/plugin-vue";
import laravel from 'laravel-vite-plugin';
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolve from 'unplugin-icons/resolver'
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/css/backoffice.css', 'resources/css/login.css', 'resources/js/index.js'],
            refresh: true,
        }),
        vue(),
        Components({
            resolvers: [BootstrapVueNextResolver(), IconsResolve()],
        }),
        Icons({
            compiler: 'vue3',
            autoInstall: true
        })
    ],
    optimizeDeps: {
        // exclude: ['bootstrap-vue']
    },

});
