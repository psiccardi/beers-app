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
    import { useRouter } from 'vue-router';
    import Locale from './Locale.vue';
    const {t, locale} = useI18n()
    const router = useRouter()
    const logout = () => {
        /**
         * I commented logoutWebAPI call because
         * if the user is logged for a long time
         * the CSRF token expires and he can't login
         * again
         */
        // logoutWebAPI({}, resp => {
        //     console.log(resp);
        //     router.push('/login');
        // }, err => {
        //     console.log('Logout failed')
        // })
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
