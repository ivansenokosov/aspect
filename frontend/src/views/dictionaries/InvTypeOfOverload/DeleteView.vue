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
  <UniversalDelete url="Inv_type_of_overload" :id="props.id" title="Перегрузка"/>
</template>

