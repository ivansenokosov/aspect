<script setup lang="ts">
  import UniversalDelete from '@/components/UniversalDelete.vue';
  import { useRouter } from "vue-router"  
  const props = defineProps( {
      id: {
        type: String,
        required: true,
      }
  })
</script>

<template>
  <UniversalDelete url="Waiting_period" :id="props.id" title="Срок ожидания"/>
</template>

