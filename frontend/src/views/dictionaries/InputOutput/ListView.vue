<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import type { IDocument, IInvInputOuptput, ISimpleDictionary } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  
  const data    = ref<IDocument<IInvInputOuptput>>({data:[], error: null, loading: true}) // Входы/Выходы
  const signal  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Сигналы
  const serie   = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Серии
  const loading = ref<boolean>(true)

  async function loadData() {
    data.value      = await useFetch('Inv_spec_of_in_out', {} );
    signal.value    = await useFetch('Inv_type_of_signals', {} );
    serie.value     = await useFetch('Inv_series_dict', {} );
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
        <h1 class="pt-5">Справочник «Входы/выходы управления»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/InputOutput/Create/`" rel="noopener">
          <Button label="Создать" severity="info"/>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem" :loading="data.loading" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">

        <Column field="signal" header="Сигнал" sortable style="width: 15%">
          <template #body="{ data }">
              {{ getValueFromDictionary(signal.data, data.signal) }}
          </template>
        </Column>

        <Column field="serie" header="Серия" sortable style="width: 15%">
          <template #body="{ data }">
            {{ getValueFromDictionary(serie.data, data.serie) }}
          </template>
        </Column>

        <Column field="quantity" header="Количество" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.quantity }}
          </template>
        </Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/InputOutput/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/InputOutput/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

  </div>
</template>
  
<style scoped>
    .input {width: 100%}
</style>