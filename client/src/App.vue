<script setup>
import NotificationView from './views/NotificationView.vue'
import { ref } from 'vue';

const showLogin = ref(false);
</script>

<template>
  <nav>
    <button @click="showLogin = true">Login</button>
  </nav>
  <NotificationView/>
</template>
