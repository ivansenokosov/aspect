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
  <UniversalUpdate url="/data/Type_of_options" :id="props.id" title="Тип опции"/>
</template>

