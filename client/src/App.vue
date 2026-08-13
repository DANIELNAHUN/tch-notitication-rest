<script setup>
</script>

<template>
  <div class="page-container">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
