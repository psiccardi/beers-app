import { createRouter, createWebHistory } from "vue-router";
import { getUserAPI } from "../js/utilities/api";

/**
 * First level components
 */
// Index (main component)
import Index from './Index.vue'
import Backoffice from './pages/Backoffice.vue'
import Beers from './pages/Beers.vue'

// 404 page
import NotFound from './NotFound.vue';

/**
 * Index sub-components
 */
//Login page
import Login from './pages/Login.vue';

import { ref, defineEmits } from "vue";
import Utils from "./../js/utilities/utils.js";
import { useI18n } from "vue-i18n";
const routes = [
    {
        path: '/',
        component: Index,
        name: 'Index',
        children: [
            {
                path: 'login',
                component: Login,
                name: 'Login'
            },
            {
                path: 'beers',
                component: Backoffice,
                name: 'Beers',
                meta: {
                    protected: true
                },
                children: [
                    {
                        path: '',
                        component: Beers,
                        name: 'Beers',
                        meta: {
                            protected: true
                        }
                    },
                ]
            }

        ]
    },

    {
        path: "/:catchAll(.*)",
        component: NotFound,
        name: 'NotFound'
    }
    // {
    //     path: '/:pathMatch(.*)*',
    //     component: notFound
    // }
]

const router = createRouter({

    history: createWebHistory(),

    routes

})

const checkUser = async function (fn) {
    return new Promise(function (resolve, reject) {
        getUserAPI(
            {},
            (resp) => {
                Utils.response.handleError(resp);
                resolve(resp);
            },
            (err) => {
                console.log(err.stack);
                resolve(null)
            }
        );
    })
};

router.beforeEach(async (to, from) => {
    let user = null;
    try {
        user = await checkUser()
    } catch (e) {}
    if (!user && to?.meta?.protected) {
        return false;
    }
    return true;
    // if (!to.meta) {
    //     return true;
    // }
    // if (to.meta.protected && user?.id) {
    //     return true;
    // }
    // return false;

})

export default router
