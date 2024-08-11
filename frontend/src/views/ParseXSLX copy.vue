<script setup lang="ts">
  import { ref } from 'vue';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import Papa from 'papaparse';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { useFetch } from '@/api/useFetch';
  import type { IItemData } from '@/interfaces';


  const text = ref<string>('')
  const data = ref<any[]>([])
  const items = ref<IItemData>({data:[], loading: true, error: null})
  
  async function loadData() {
    items.value = await useFetch('Items',{})
  }

  function parse() {
    data.value = Papa.parse(text.value)
  }

  function getItemId(csv_id:string) {
    let id: number = 0
    let result: any 

    result = items.value.data.filter(item => Number(csv_id) === Number(item.id)) 
    if (result.length>0) {
      return result[0].id
    } else {
      return -1
    }
  }

  loadData()

</script>

<template>
  <h1 class="mt-5">Загрузка справочника Items</h1>
  <div v-if="items.loading">
    Загружаю...
  </div>
  <div v-else>
    <Textarea v-model="text" rows="5" cols="80"/>
    <Button label="Разобрать" @click="parse"/>

    <DataTable :value="data.data" tableStyle="min-width: 50rem">
      <Column header="column1">
        <template #body="slotProps">
          {{ slotProps.data[0] }}
        </template>      
      </Column>
      <Column header="column2">
        <template #body="slotProps">
          {{ slotProps.data[1] }}
        </template>      
      </Column>
      <Column header="column3">
        <template #body="slotProps">
          {{ slotProps.data[2] }}
        </template>      
      </Column>
      <Column header="column4">
        <template #body="slotProps">
          {{ slotProps.data[3] }}
        </template>      
      </Column>
      <Column header="column5">
        <template #body="slotProps">
          {{ slotProps.data[4] }}
        </template>      
      </Column>
      <Column header="id Items">
        <template #body="{ data }">
          {{ getItemId(data[0]) }}
        </template>      
      </Column>
      <Column header="Действие">
        <template #body="slotProps">
          <template #body="{ data }">
              <Tag :value="getAction(data)" :severity="getSeverity(data.status)" />
          </template>          
        </template>      
      </Column>

    </DataTable>
  </div>
</template>