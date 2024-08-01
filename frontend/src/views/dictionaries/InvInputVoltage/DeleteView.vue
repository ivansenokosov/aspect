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
  <UniversalDelete url="Inv_input_voltage" :id="props.id" title="Входные напряжения"/>
</template>

