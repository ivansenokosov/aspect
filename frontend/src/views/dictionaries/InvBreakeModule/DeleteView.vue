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
  <UniversalDelete url="/data/Inv_breake_module" :id="props.id" title="Тормозной модуль"/>
</template>

