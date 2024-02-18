<template>
    <sidebar-menu
        :menu="menu"
        id="sidebar-left"
        title="Sidebar"
        shadow
        v-bind:relative="false"
        :disable-hover="true"
    >
        <template v-slot:footer>
            <ul class="vsm--menu">
                <li class="vsm--item">
                    <a :onclick="logout" class="vsm--link vsm--link_level-1" href="#">
                        <div class="vsm--title logout-btn">
                            {{ t('logout') }}
                        </div>
                    </a>
                </li>
            </ul>
        </template>
    </sidebar-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
import { SidebarMenu } from 'vue-sidebar-menu';
import { useI18n } from 'vue-i18n';
import Utils from '../../js/utilities/utils';
import { logoutWebAPI } from '../../js/utilities/api';
import { useRouter } from 'vue-router';
const router = useRouter();
const { t, locale } = useI18n();
const menu = ref([]);
const beersText = ref(t('beers'))
const props = defineProps({
    user: Object
});
const logout = () => {
    /**
     * I commented logoutWebAPI call because
     * if the user is logged for a long time
     * the CSRF token expires and he can't login
     * again
     */
    // logoutWebAPI({}, resp => {
    //     router.push('/login');
    // }, err => {
    //     console.log('Logout failed')
    // })
    window.location.href = APP_URL + '/logout';
}
const updateMenu = () => {
    menu.value = [
        {
            href: '/beers',
            title: beersText.value
        }
    ]
}
watch(locale, () => {
    beersText.value = t('beers');
    updateMenu();
})

updateMenu();

</script>

<style scoped>
.vsm_collapsed .logout-btn {
    display: none;
}

#sidebar-left {
    top: 40px !important;
}
</style>
