<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import type { IInvSerie, IInvSerieData, ISimpleData } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { RouterLink, useRoute } from 'vue-router';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Tag from 'primevue/tag';
  const route = useRoute();

  const props = defineProps(['url','title'])
  const data = ref<IInvertorData>({data:[], error: null, loading: true}) 
  const invDC = ref<ISimpleData>({data:[], error: null, loading: true})
  const invEMC = ref<ISimpleData>({data:[], error: null, loading: true})
  const invBreak = ref<ISimpleData>({data:[], error: null, loading: true})

  async function loadData() {
    data.value = await useFetch('Invertors', {} );
    invDC.value = await useFetch('Inv_DC_drossel', {} );
    invEMC.value = await useFetch('Inv_EMC_drossel', {} );
    invBreak.value = await useFetch('Inv_breake_module', {} );
  }

  function getDCname(id:number) {
    const record = invDC.value.data.filter(item => item.id === id)[0]
    if (record) {
      return record.name
    } else {
      return 'не определено'
    }
  }

  function getEMCname(id:number) {
    const record = invEMC.value.data.filter(item => item.id === id)[0]
    if (record) {
      return record.name
    } else {
      return 'не определено'
    }
  }

  function getBreakname(id:number) {
    const record = invBreak.value.data.filter(item => item.id === id)[0]
    if (record) {
      return record.name
    } else {
      return 'не определено'
    }    
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
        <h1 class="pt-5">Справочник «Преобразователи частоты»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/Invertors/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem" :loading="data.loading" paginator  :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
        <Column field="name" header="Модель" sortable style="width: 15%"></Column>
        <Column field="serie_str" header="Серия" sortable style="width: 10%"></Column>
        <Column field="input_voltage_str" header="Входное напряжение" width=""></Column>
        <Column field="size_str" header="Размер" width=""></Column>
        <Column header="DC дроссель" width="">
          <template #body="{ data }">
            <span>{{ getDCname(data.type_of_dc_drossel) }}</span>
          </template>          
        </Column>
        <Column header="EMC дроссель" width="">
          <template #body="{ data }">
            <span>{{ getEMCname(data.type_of_emc_drossel) }}</span>
          </template>          
        </Column>
        <Column header="Тормозной модуль" width="">
          <template #body="{ data }">
            <span>{{ getBreakname(data.type_of_break_module) }}</span>
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