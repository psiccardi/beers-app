let i18nText = `import { createI18n } from 'vue-i18n';

{{ IMPORT_SECTION }}

export default createI18n({
    locale: localStorage.getItem("locale") ? localStorage.getItem("locale") : 'en', // <--- 1
    fallbackLocale: 'it', // <--- 2
    legacy: false, // <--- 3
    messages: { {{ LOCALES_SECTION }} },
    globalInjection: true
})`

export default i18nText;
