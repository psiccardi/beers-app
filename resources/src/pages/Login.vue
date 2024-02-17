<script setup>
    console.log('LOGIN');
    import './../../css/login.css';

    import { ref } from 'vue';
    import Locale from '../components/Locale.vue'
    import { setCookie } from '../../js/utilities/cookies';
    import { useI18n } from 'vue-i18n';
    import { jsonPostAPI, jsonGetAPI, getAPI, loginWebAPI } from '../../js/utilities/api.js';
    const { t, locale } = useI18n();
    import Utils from '../../js/utilities/utils.js';
    const username = ref('');
    const password = ref('');
    const csrf = ref(document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
    function login() {
        getAPI('/sanctum/csrf-cookie', {}, resp => {
            loginWebAPI({
                username: username.value,
                password: password.value,
                _token: csrf.value
            }, resp => {
                Utils.response.handleError(resp, t);
                if (resp.token) {
                    setCookie('auth_token', resp.token);
                    setTimeout(() => window.location.href = APP_URL + '/beers', 100);
                }
            }, err => {
                Utils.DOM.toast(err.message, "error", t);
                console.log(err.stack)
            })
        }, err => {
            Utils.DOM.toast(err.message, "error", t);
            console.log(err.stack)
        })

        // jsonPostAPI('/api/login', {
        //     username: username.value,
        //     password: password.value
        // }, resp => {

        // }, err => {

        // })
    }
</script>
<template>
    <div class="login-wrapper">
        <div class="login-bar">
            <h1>Beers app</h1>
        </div>
        <div class="right-column">
            <div class="locale-bar">
                <div></div>
                <Locale />
            </div>
            <div class="form-container">
                <b-form @submit.prevent="login">
                    <input type="hidden" name="_token" :value="csrf">
                    <b-form-group
                        id="input-group-username"
                        label-for="username"
                        description=""
                    >
                        <label for="username">
                            {{ t('username') }}
                        </label>
                        <b-form-input id="username" class="form-control" v-model="username" type="username" placeholder="" />
                    </b-form-group>
                    <b-form-group
                        id="input-group-password"
                        label-for="password"
                        description=""
                    >
                        <label for="password">
                            {{ t('password') }}
                        </label>
                        <b-form-input id="password" class="form-control" v-model="password" type="password" />
                    </b-form-group>
                    <br>
                    <b-form-group
                    id="input-group-submit"
                    >
                        <b-button variant="primary" type="submit" id="submit" >{{ t('send') }}</b-button>
                    </b-form-group>
                </b-form>
            </div>
        </div>
    </div>
</template>
 <style scoped>

</style>
