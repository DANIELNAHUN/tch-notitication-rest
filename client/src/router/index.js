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
        path: '/',
        alias: '/notification',
        name: 'notification',
        component: NotificationView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {
    const token = localStorage.getItem('token');
    if (!token && to.name !== 'login') {
        return { name: 'login' };
    }
    if (token && to.name === 'login') {
        return { name: 'notification' };
    }
});

export default router;