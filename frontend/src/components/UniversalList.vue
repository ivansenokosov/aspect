<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import type { ISimpleData, ISimpleDictionary } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { RouterLink, useRoute } from 'vue-router';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { getPath } from '@/api/getPath';

  const route       = useRoute();
  const props       = defineProps(['url','title'])
  const data        = ref<ISimpleData>({data:[], error: null, loading: true}) 
  const dataDisplay = ref<ISimpleDictionary[]>([])
  const searchText  = ref<string>('')
  const path        = ref<string>('')

  async function loadData() {
    data.value = await useFetch(props.url, {} );
    dataDisplay.value = data.value.data
    path.value = getPath(route.path)
  }


  const search = () => {
        if (searchText.value.length > 0) {
            const searchData = data.value.data.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()) || item.id.toString().includes(searchText.value.toLowerCase())   );
            dataDisplay.value =  searchData
        } else {
            dataDisplay.value =  data.value.data
        }
    }


  loadData()
  
</script> 

<template>
        
  <div class="field mt-5">
      <InputText class="input" v-model="searchText" type="text" size="large" placeholder="Поиск..." @input="search"></InputText>
  </div>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">{{ title }}</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/${path}/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>

    <DataTable :value="dataDisplay" stripedRows tableStyle="min-width: 50rem">
      <Column field="id" header="id" sortable ></Column>
      <Column field="name" header="Наименование" sortable ></Column>
      <Column header="Действия"> 
        <template #body="slotProps">
          <div class="flex gap-2">
            <RouterLink :to="`/dictionaries/${path}/Update/${slotProps.data.id}`">
              <Button icon="pi pi-pencil" severity="info" />
            </RouterLink>
            <RouterLink :to="`/dictionaries/${path}/Delete/${slotProps.data.id}`">
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