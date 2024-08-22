<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { ICompanyData } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { useBaseUrl } from '@/stores/baseUrl';
  
  const baseUrl = useBaseUrl()
  const data = ref<ICompanyData>({data:[], error: null, loading: true}) 

  async function loadData() {
    data.value = await useFetch('Companies', {} );
  }

  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },    
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });  

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
        <h1 class="pt-5">Организации</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/Companies/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data">
      <DataTable v-model:filters="filters" 
                :value="data.data" 
                stripedRows 
                tableStyle="min-width: 50rem" 
                :loading="data.loading" 
                filterDisplay="row" 
                paginator  
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :globalFilterFields="['name']"
                >

        <Column field="logo"      header=""             style="width: 10%">
          <template #body="{ data }">
            <img v-if="data.logo" :src="`${baseUrl.baseUrl}${data.logo}`" width="100">
            <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="100"/>
          </template>          
        </Column>
        <Column field="name" header="Наименование" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>
        <Column field="inn"       header="ИНН"     sortable style="width: 10%"></Column>
        <Column field="address"   header="Адрес"   sortable style="width: 10%"></Column>
        <Column field="phone"     header="Телефон" sortable style="width: 10%"></Column>
        <Column field="email"     header="@"   sortable style="width: 10%"></Column>
        <Column field="agreement" header="Договор" sortable style="width: 10%"></Column>
        <Column field="info"      header="Примечание"     sortable style="width: 10%"></Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/Companies/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/Companies/Delete/${slotProps.data.id}`">
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