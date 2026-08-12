<template>
    <form @submit.prevent="login">
        <input type="text" v-model="username" />
        <input type="password" v-model="password" />
        <button type="submit">Login</button>
    </form>
</template>
<script setup>
import { ref } from 'vue';
import { loginService } from '../services/login';

const username = ref('');
const password = ref('');

const login = async () => {
    const response = await loginService(username.value, password.value);
    console.log(response);
};
</script>