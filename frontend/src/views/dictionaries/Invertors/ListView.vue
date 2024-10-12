<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { IDocument, ISimpleDictionary, IInvertor, IInvSerie } from '@/interfaces.js';
  
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';

  const data      = ref<IDocument<IInvertor>>({data:[], error: null, loading: true}) 
  const invDC     = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const invEMC    = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const invBreak  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const series    = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true})
  const seriesStr = ref<String[]>([])
  const loading   = ref<boolean>(true)

  async function loadData() {
    data.value     = await useFetch('/data/Invertors');
    invDC.value    = await useFetch('/data/Inv_DC_drossel');
    invEMC.value   = await useFetch('/data/Inv_EMC_drossel');
    invBreak.value = await useFetch('/data/Inv_breake_module');
    series.value   = await useFetch('/data/Inv_series');

    series.value.data.map(item => seriesStr.value.push(item.name))
    loading.value = false
  }

  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },    
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    serie_str: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <h1 class="pt-5">Справочник «Преобразователи частоты»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/Invertors/Create/`" rel="noopener">
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

        <Column field="name" header="Модель" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>
        <Column field="serie_str" header="Серия" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.serie_str }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="seriesStr" placeholder="Серия" style="min-width: 12rem" :showClear="true"/>
          </template>
        </Column>
        <Column field="input_voltage_str" header="Входное напряжение" width=""></Column>
        <Column field="size_str" header="Размер" width=""></Column>
        <Column header="DC дроссель" width="">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(invDC.data, data.type_of_dc_drossel) }}</span>
          </template>          
        </Column>
        <Column header="EMC дроссель" width="">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(invEMC.data , data.type_of_emc_drossel) }}</span>
          </template>          
        </Column>
        <Column header="Тормозной модуль" width="">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(invBreak.data, data.type_of_break_module) }}</span>
          </template>          
        </Column> 

        <Column header="Мощность" style="width: 15%">
          <template #body="{ data }">
              <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ data.p_heavy_g }} кВт</div>
              <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ data.p_pumps_p }} кВт</div>
          </template>
        </Column>
        <Column header="Ток" style="width: 10%">
          <template #body="{ data }">
              <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ data.current_g }} А</div>
              <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ data.current_p }} А</div> 
          </template>
        </Column>
        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/Invertors/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/Invertors/Delete/${slotProps.data.id}`">
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