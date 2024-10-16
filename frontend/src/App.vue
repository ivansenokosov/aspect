<script setup lang="ts">
  import { useUserStore } from './stores/user';
  import AppHeader from '@/components/AppHeader.vue'
  import Divider from 'primevue/divider';
  document.title = 'Аспект';

  const user = useUserStore()
  user.checkIsAuth() // проверка был ли пользователь уже авторизован
</script>

<template>
  <div class="container">
    <AppHeader/>
    <div class="content">
      <RouterView />
    </div>
    <div class="footer mt-5">
      <Divider/>
       © 2024. ООО Аспект
    </div>
  </div>
  </template>

<style scoped>
  .container {
    max-width: 1920px;
    min-width: 1280px;
    margin: auto;
    padding: 20px;
  }
</style>

