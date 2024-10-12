<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { IDocument, IInvOption, IInvSerie } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import { getSerieNames } from '@/api/utils';
  
  const data          = ref<IDocument<IInvOption>>({data:[], error: null, loading: true}) // Опции
  const series        = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) // Серии
  const optionType    = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) // Типы опций
  const optionTypeStr = ref<string[]>([])
  const loading       = ref<boolean>(true)


  async function loadData() {
    data.value       = await useFetch('/data/Inv_options');
    series.value     = await useFetch('/data/Inv_series');
    optionType.value = await useFetch('/data/Type_of_options');
    optionType.value.data.map(item => optionTypeStr.value.push(item.name))
    loading.value = false
  }

  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },    
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    option_type: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <h1 class="pt-5">Справочник «Опции для преобразователей частоты»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/InvOptions/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data.length > 0 && series.data.length > 0">
      <DataTable v-model:filters="filters" 
                :value="data.data" 
                stripedRows 
                tableStyle="min-width: 50rem" 
                :loading="data.loading" 
                filterDisplay="row" 
                paginator  
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :globalFilterFields="['name', 'serie']"
                >

        <Column field="name" header="Наименование" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>

        <Column field="option_type" header="Тип опции" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.option_type }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="optionTypeStr" placeholder="Серия" style="min-width: 12rem" :showClear="true"/>
          </template>
        </Column>

        <Column field="short_title" header="Краткое наименоввние" width="">
          <template #body="{ data }">
            {{ data.short_title }}
          </template>
        </Column>

        <Column field="full_title" header="Полное наименоввние" width="">
          <template #body="{ data }">
            {{ data.full_title }}
          </template>
        </Column>


        <Column field="series" header="Серии" width="">
          <template #body="{ data }">
            {{ getSerieNames(series.data, data.series) }}
              <!-- {{ data.series}} -->
          </template>
        </Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/InvOptions/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/InvOptions/Delete/${slotProps.data.id}`">
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