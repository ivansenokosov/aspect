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
  <UniversalUpdate url="logs/Actions" :id="props.id" title="Действие журналирования"/>
</template>

