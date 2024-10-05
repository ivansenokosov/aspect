<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import type { IDocument, IInvOverload } from '@/interfaces.js';
  
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';

  const data      = ref<IDocument<IInvOverload>>({data:[], error: null, loading: true}) 

  async function loadData() {
    data.value     = await useFetch('Inv_type_of_overload');
  }

  loadData()
  
</script> 

<template>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Справочник «Перегрузкии»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/InvOverloads/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem">

        <Column field="g_mode" header="Режим G" width=""></Column>
        <Column field="p_mode" header="Режим P" width=""></Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/InvOverloads/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/InvOverloads/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

</template>
  
<style scoped>
    .input {width: 100%}
</style>