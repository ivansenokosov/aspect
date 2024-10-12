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
  <UniversalUpdate url="/data/Type_of_items" :id="props.id" title="Тип элемента"/>
</template>

