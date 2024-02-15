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
import { logoutWebAPI } from '../../../js/utilities/api';
import Utils from '../../../js/utilities/utils';
import { useRouter } from 'vue-router';
import { setCookie } from '../../../js/utilities/cookies';
const { t, locale } = useI18n();
const menu = ref([]);
const profileText = ref(t('backoffice.profile'))
const usersText = ref(t('backoffice.users'));
const postsText = ref(t('backoffice.posts'));
const router = useRouter();
const props = defineProps({
    user: Object
});
const logout = () => {
    console.log(Utils, APP_NAME, Utils.string.toUnderscoreSlug(APP_NAME));
    logoutWebAPI({}, resp => {
        Utils.response.handleError(resp);
        setCookie('auth_token','', -1);
        setCookie(Utils.string.toUnderscoreSlug(APP_NAME) + '_session','', -1);
        window.location.href = APP_URL + '/login';
    })
}
const updateMenu = () => {
    const administratorSidebar = [
        {
            href: '/backoffice/profile',
            title: profileText.value,
        },
        {
            href: '/backoffice/admin/users',
            title: usersText.value,
        },
        {
            href: '/backoffice/admin/posts',
            title: postsText.value,
        },
    ];

    const operatorSidebar = [
        {
            href: '/backoffice/profile',
            title: profileText.value,
        },
        {
            href: '/backoffice/operator/posts',
            title: postsText.value,
        },
    ]

    switch (props.user.role?.name) {
        case 'administrator':
            menu.value = administratorSidebar;
            break;
        case 'operator':
            menu.value = operatorSidebar;
            break;
    }

    // menu.value = [
    //     {
    //         href: '/backoffice/profile',
    //         title: profileText.value,
    //     },
    //     {
    //         href: '/backoffice/users',
    //         title: usersText.value,
    //     },
    // ]
}
watch(locale, () => {
    //console.log('locale', locale.value);
    profileText.value = t('backoffice.profile')
    usersText.value = t('backoffice.users')
    postsText.value = t('backoffice.posts')
    updateMenu();
})

updateMenu();
// menu.value = [
//     {
//         href: '/backoffice/profile',
//         title: profileText.value,
//     },
//     {
//         href: '/backoffice/users',
//         title: usersText.value,
//     },

// ]

// export default {
//     components: {
//         Locale,
//         SidebarMenu
//     },
//     setup() {
//         const { t, locale } = useI18n();
//     },
//     data() {
//         return {
//             menu: [
//                 {
//                     href: APP_URL + '/backoffice/dashboard',
//                     title: t('Dashboard')
//                 }
//             ]
//         }
//     }
// }
</script>

<style scoped>
.vsm_collapsed .logout-btn {
    display: none;
}

#sidebar-left {
    top: 40px !important;
}

/* #sidebar-right {
    position: static;
} */
</style>
