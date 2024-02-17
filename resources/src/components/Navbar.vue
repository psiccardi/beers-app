<template>
    <b-navbar sticky="top" variant="light">
            <div>
                <div id="navbar-logout-btn" :onclick="logout">{{ t('logout') }}</div>
            </div>
            <Locale />
    </b-navbar>
</template>
<script setup>
    import { useI18n } from 'vue-i18n';
    import Locale from './Locale.vue';
    const {t, locale} = useI18n()
    const logout = function () {
        window.location.href = APP_URL + '/logout';
    }
</script>
<style scoped>
    #navbar-logout-btn {
        cursor: pointer;
        display: none;
    }
    @media (max-width: 762px) {
        #navbar-logout-btn {
            display: block;
        }
    }
</style>
