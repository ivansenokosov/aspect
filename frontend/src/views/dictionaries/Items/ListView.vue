<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { IDocument, ISimpleDictionary, IItem } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  
  const data          = ref<IDocument<IItem>>({data:[], error: null, loading: true}) // Элементы
  const typeOfItems   = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Типы элементов
  const waitingPeriod = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Сроки ожидания
  const loading       = ref<boolean>(true)
  
  async function loadData() {
    data.value            = await useFetch('/data/Items');
    typeOfItems.value     = await useFetch('/data/Type_of_items');
    waitingPeriod.value   = await useFetch('/data/Waiting_period');
    loading.value = false
  }

  const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });  

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
        <h1 class="pt-5">Справочник «Items»</h1>
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable  
                :value="data.data" 
                stripedRows 
                tableStyle="min-width: 50rem" 
                :loading="data.loading" 
                paginator  
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]"

                filterDisplay="row" 
                v-model:filters="filters"
                >

        <Column field="id" header="id" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.id }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>


        <Column field="type" header="Тип" sortable style="width: 15%">
          <template #body="{ data }">
              {{ getValueFromDictionary(typeOfItems.data, data.type_id) }}
          </template>
        </Column>


        <Column field="quantity" header="Количество" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.quantity }}
          </template>
        </Column>

        <Column field="waiting_period" header="Срок ожидания" sortable style="width: 15%">
          <template #body="{ data }">
              {{ getValueFromDictionary(waitingPeriod.data, data.waiting_period_id) }}

          </template>
        </Column>
      </DataTable>
    </div>

  </div>
</template>
  
<style scoped>
    .input {width: 100%}
</style>