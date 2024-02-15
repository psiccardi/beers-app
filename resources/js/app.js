import './bootstrap';
import { use, createApp } from "vue";
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from "../src/App.vue";

// Import Bootstrap and BootstrapVue CSS files (order is important)

// Make BootstrapVue available throughout your project
// use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// use(IconsPlugin)

createApp(App).mount("#app");
