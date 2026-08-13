<template>
    <div class="login-page">
        <form @submit.prevent="login" class="login-form">
            <h2>Inicio de Sesión</h2>
            <div class="login-form-group">
                <label for="username">Usuario</label>
                <input id="username" type="text" v-model="username" />
            </div>
            <div class="login-form-group">
                <label for="password">Contraseña</label>
                <input id="password" type="password" v-model="password" />
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginService } from '../services/login';

const username = ref('');
const password = ref('');

const router = useRouter();

const login = async () => {
    try {
        const response = await loginService(username.value, password.value);
        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            router.push('/notification');
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
};
</script>


<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.login-form input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.login-form button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

.login-form button:hover {
    background-color: #0069d9;
}
</style>