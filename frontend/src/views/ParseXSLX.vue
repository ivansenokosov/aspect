<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { FilterMatchMode } from '@primevue/core/api';
  import { useFetch } from '@/api/useFetch';
  import type { IItemData } from '@/interfaces';

  import Papa from 'papaparse';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Select from 'primevue/select';
  import FloatLabel from 'primevue/floatlabel';
  import Tag from 'primevue/tag';
  import InputText from 'primevue/inputtext';  
  import AxiosInstance from '@/api/axiosInstance';
  import { priceFormat } from '@/api/priceFormat';

  interface ICSVRow {
    data: string[]
    id: number
    action: string
    uploaded: boolean
    price_uploaded: number
  }

  const text = ref<string>('')
  const data = ref<any[]>([])
  const items = ref<IItemData>({data:[], loading: true, error: null})
  const column_id = ref<string>('')
  const column_price = ref<string>('')
  const column_quantity = ref<string>('')
  const csv_columns = ref<string[]>([])
  const columnIdIndex = ref<number>(0)
  const columnPriceIndex = ref<number>(0)
  const columnQuantityIndex = ref<number>(0)
  const CSVData = ref<ICSVRow[]>([{data:[], id:0, action: '', uploaded: false, price_uploaded: 0}])

  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },    
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },    
  });  

  async function loadData() {
    items.value = await useFetch('Items',{})
  }

  function parse() {
    data.value = Papa.parse(text.value)
    csv_columns.value = data.value.data[0]
    // data.value.data.map(item => CSVData.value.row.push(item))
    data.value.data.map(item => {
      CSVData.value.push({data: item, id: 0, action: 'IGNORE', uploaded: false, price_uploaded: 0})
    })
  }

  function setID() {
    CSVData.value.map((item, index) => {
      const id = getItemId(item.data[columnIdIndex.value])
      CSVData.value[index].id = id
      if (id>0) {
        CSVData.value[index].action = 'UPDATE'
      } else {
        CSVData.value[index].action = 'IGNORE'
      }
    })
  }

  async function upload() {
    const config = { headers: { 'content-type': 'application/json', }, };    
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateString = day + '.' + month + '.' + year

    CSVData.value.map((item, index) => {
      if (item.action == 'UPDATE') {

        // --- формируем данные для UPDATE Items
        const formData = new FormData();        
        formData.append("quantity", item.data[columnQuantityIndex.value])
        formData.append("name", '')
        formData.append("type", '10')
        formData.append("waiting_period", '1')

        const res = AxiosInstance.put('Items/'+ item.id + '/', formData, config)
          .then(function(response) {
          // console.log(response);
          CSVData.value[index].uploaded = true
        }).catch(function(error) {
          console.log(error);
        })

        // ------- чтобы не плодить сущности, проверяем есть ли в таблице Price за эту дату запись с такой же ценой
        const itemPrice = item.data[columnPriceIndex.value].replace(' ','').replace(' ','')
        const priceUrl = 'Prices?item=' + item.id 
        const priceData = AxiosInstance.get(priceUrl)
        .then(function(response) {
          if (response.data.length > 0) { // Цена найдена
            const itemPriceLoaded = Number(response.data[0].price).toFixed()
            console.log(item.id, itemPrice, itemPriceLoaded)
            if (Number(itemPrice) != Number(itemPriceLoaded)) { // не нашли такой цены или цена отличается от последней
              const formPriceData = new FormData();        
              formPriceData.append("item", String(item.id))
              formPriceData.append("date", String(dateString))
              formPriceData.append("price", String(itemPrice))
              formPriceData.append("currency", '1')

              const res = AxiosInstance.post('Prices', formPriceData, config)
                .then(function(response) {
                console.log(response);
                CSVData.value[index].price_uploaded = 2
              }).catch(function(error) {
                console.log(error);
              })
            } else {
              CSVData.value[index].price_uploaded = 1
            }            
          } else {
            console.log(item.id, 'Цена не найдена')
          }
        }).catch(function(error) {
          console.log(error);
        })


      }

      // if (item.action == 'INSERT') {
      //   console.log('insert', item)
       
      // }
    })
  }


  function getItemId(csv_id:string) {
    let result: any 
    result = items.value.data.filter(item => Number(csv_id) === Number(item.id)) 
    if (result.length>0) {
      return result[0].id
    } else {
      return -1
    }
  }

  function getSeverity(action:string) {
    if (action == 'UPDATE') {
      return 'info' 
    } else if (action == 'INSERT') {
      return 'success'
    } else {
      return 'danger'
    }
  }

  watch(column_id, () => {  
    for (let i=0; i<data.value.data[0].length; i++) {
      if (data.value.data[0][i] == column_id.value) {
        columnIdIndex.value = i
        break
      }
    }
  })

  watch(column_price, () => {  
    for (let i=0; i<data.value.data[0].length; i++) {
      if (data.value.data[0][i] == column_price.value) {
        columnPriceIndex.value = i
        break
      }
    }
  })

  watch(column_quantity, () => {  
    for (let i=0; i<data.value.data[0].length; i++) {
      if (data.value.data[0][i] == column_quantity.value) {
        columnQuantityIndex.value = i
        break
      }
    }
  })

  loadData()

</script>

<template>
  <h1 class="mt-5">Загрузка справочника Items</h1>
  <div v-if="items.loading">
    Загружаю...
  </div>
  <div v-else>
    <div class="mt-5 font-semibold text-xl">Исходные данные (Ctrl+V)</div>
    <div class="card flex justify-center">
        <Textarea v-model="text" rows="5" cols="80" class="w-full md:w-56"/>
    </div>
  
    <div class="mt-1">
      <Button label="Разобрать" icon="pi pi-sparkles" @click="parse"/>
      <Button label="Установить ID" icon="pi pi-link" class="ml-2" @click="setID"/>
      <Button label="Загрузить данные" icon="pi pi-upload" severity="help" class="ml-2" @click="upload"/>
    </div>

    <template v-if="csv_columns.length>0">
      <div class="mt-5 font-semibold text-xl">Сопоставление колонок</div>
      <div class="grid">
        <div class="col">
            <FloatLabel>
              <Select v-model="column_id" :options="csv_columns" placeholder="id" class="w-full md:w-56"/>
              <label for="username">id</label>
            </FloatLabel>
        </div>
        <div class="col">
          <FloatLabel>
            <Select v-model="column_price" :options="csv_columns" placeholder="id" class="w-full md:w-56"/>
            <label for="username">Цена</label>
          </FloatLabel>
        </div>
        <div class="col">
          <FloatLabel>
            <Select v-model="column_quantity" :options="csv_columns" placeholder="id" class="w-full md:w-56"/>
            <label for="username">Количество</label>
          </FloatLabel>
        </div>
      </div>

      <div class="mt-5 font-semibold text-xl">Данные для загрузки</div>
      <DataTable :value="CSVData" 

                 v-model:filters="filters"
                 filterDisplay="row" 
                 
                  tableStyle="min-width: 50rem" 
                  stripedRows
                  v-if="column_id && column_price && column_quantity && csv_columns.length >0">
        <Column header="id">
          <template #body="slotProps">
            {{ slotProps.data.data[columnIdIndex] }}
          </template>      
        </Column>
        <Column header="Цена">
          <template #body="{data}">
            <!-- {{ data.data[columnPriceIndex] }} -->
            <span class="font-bold text-xl">{{ data.data[columnPriceIndex] }} &#8381;</span>
          </template>      
        </Column>
        <Column header="Количество">
          <template #body="slotProps">
            {{ slotProps.data.data[columnQuantityIndex] }}
          </template>      
        </Column>
        <Column field="id" header="id">
          <template #body="{ data }">
            {{ data.id }}
          </template>    
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>
        <Column header="Действие">
            <template #body="{ data }">
                <Tag :value="data.action" :severity="getSeverity(data.action)" v-if="data.id<0" @click="() => {data.action == 'IGNORE' ? data.action = 'INSERT': data.action = 'IGNORE' }"/>
                <Tag :value="data.action" :severity="getSeverity(data.action)" v-else/>
            </template>          
        </Column>
        <Column header="Количество">
            <template #body="{ data }">
                <Tag value="ЗАГРУЖЕНО" severity="success" v-if="data.uploaded"/>
            </template>          
        </Column>
        <Column header="Цена">
            <template #body="{ data }">
              <Tag value="БЕЗ ИЗМЕНЕНИЙ" severity="success" v-if="data.price_uploaded == 1"/>
              <Tag value="ДОБАВЛЕНО" severity="danger" v-if="data.price_uploaded == 2"/>
            </template>          
        </Column>
      </DataTable>

    </template>


  </div>
</template>