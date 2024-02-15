import { createI18n } from 'vue-i18n';


import en from './../../locales/en.json'
import es from './../../locales/es.json'
import it from './../../locales/it.json'

export default createI18n({
    locale: localStorage.getItem("locale") ? localStorage.getItem("locale") : 'en', // <--- 1
    fallbackLocale: 'it', // <--- 2
    legacy: false, // <--- 3
    messages: { en, es, it,  },
    globalInjection: true
})