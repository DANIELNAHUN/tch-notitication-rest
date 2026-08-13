import { createRouter, createWebHistory } from "vue-router";

import LoginView from '../views/LoginView.vue';
import NotificationView from '../views/NotificationView.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/notification',
        name: 'notification',
        component: NotificationView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;