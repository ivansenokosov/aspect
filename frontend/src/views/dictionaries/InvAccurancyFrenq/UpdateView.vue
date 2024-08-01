<script setup lang="ts">
  import UniversalUpdate from '@/components/UniversalUpdate.vue';
  const props = defineProps( {
      id: {
        type: String,
        required: true,
      }
  })
</script>

<template>
  <UniversalUpdate url="Inv_accurancy_frenq" :id="props.id" title="Точность регулирования частоты"/>
</template>

