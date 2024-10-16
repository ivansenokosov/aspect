<script setup lang="ts">
    import {ref, onUnmounted, watch} from 'vue'
    import Button from 'primevue/button';
    import { useWebSocketStore } from '@/stores/ws';    

    const ws = useWebSocketStore()

    // onUnmounted(() => ws.closeConnection())

    // watch(() => [ws.message], () => console.log('сообщение получено'))



</script>
  

<template>
    {{ ws.message }}
    <Button label="Отправить" @click="ws.sendMessage({username: 'qqq',message:'mmm',timestamp:1})" />

</template>
  
  