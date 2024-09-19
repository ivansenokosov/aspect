<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import type { IInvSerie, ISimpleDictionary, IDocument, IInvAvalControl } from '@/interfaces.js';
  
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';

  import { getValueFromDictionary } from '@/api/getValueFromDictionary';

  const data      = ref<IDocument<IInvAvalControl>>({data:[], error: null, loading: true}) 
  const series    = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) 
  const controls  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
  const loading   = ref<boolean>(true)

  async function loadData() {
    data.value     = await useFetch('Inv_type_of_control', {} );
    series.value   = await useFetch('Inv_series', {} );
    controls.value = await useFetch('Variants_of_control', {} );
    loading.value = false
  }

  loadData()
  
</script> 

<template>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Справочник «Способы управления для серии»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/InvTypeOfControls/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem">

        <Column field="serie" sortable header="Серия">
          <template #body="{ data }">
              {{ getValueFromDictionary(series.data, data.serie) }}
          </template>
        </Column>
        <Column field="control" sortable header="Способ управления">
          <template #body="{ data }">
              {{ getValueFromDictionary(controls.data, data.control) }}
          </template>
        </Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/InvTypeOfControls/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/InvTypeOfControls/Delete/${slotProps.data.id}`">
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