<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRouter, useRoute  } from 'vue-router'
    import { useFetch } from '@/api/useFetch';
    import { useToast } from "primevue/usetoast";
    import { getPath } from '@/api/getPath';
    import type { ISimpleData, IInvSerieDisountData, IInvOptionDisountData, IInvSerieData } from '@/interfaces';
    import AxiosInstance from '@/api/axiosInstance';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import { getValueFromDictionary } from '@/api/getValueFromDictionary';


    const props = defineProps( {
      id: {
        type: String,
        required: true,
      }
    })

    const url:string = 'discounts/InvDisountGroup'
    const title:string = 'Группа скидок'

    const router = useRouter()
    const route = useRoute();
    const data = ref<ISimpleData>({data:[], error: null, loading: true}) // Группа скидок
    const options = ref<ISimpleData>({data:[], error: null, loading: true}) // типы опций
    const series = ref<IInvSerieData>({data:[], error: null, loading: true}) // серии
    const seriesDiscount = ref<IInvSerieDisountData>({data:[], error: null, loading: true}) // скидки для серий
    const optionsDiscount = ref<IInvOptionDisountData>({data:[], error: null, loading: true}) // скидки для опций

    const saving = ref<boolean>(false)
    const loading = ref<boolean>(true)
    const toast = useToast(); 
    const path = ref<string>('')      


    const submission = async () => {
        saving.value = true

        // сохраняем группу скидок
        const config = { headers: { 'content-type': 'application/json', }, };
        const formData = new FormData();        
        formData.append("name", data.value.data[0].name)
        const res = await AxiosInstance.put(url + '/' + props.id + '/', formData, config)
          .then(function(response) {
        }).catch(function(error) {
          console.log(error);
        })

        // сохраняем скидки для серий

        seriesDiscount.value.data.map(item => {
          const res = AxiosInstance.put('discounts/InvSerieDisount/' + item.id.toString() + '/', item, config)
            .then(function(response) {
          }).catch(function(error) {
            console.log(error);
          })
        })

        optionsDiscount.value.data.map(item => {
          const res = AxiosInstance.put('discounts/InvOptionDisount/' + item.id.toString() + '/', item, config)
            .then(function(response) {
          }).catch(function(error) {
            console.log(error);
          })
        })



        saving.value = false
        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
    }

    async function createSeries() {
      // удаление имеющихся скидок на серии группы
      seriesDiscount.value.data.map(item => {
        const url:string =  'discounts/InvSerieDisount/' + item.id.toString()
        AxiosInstance.delete(url,{})
                     .then((res) => {
                      console.log('удалено успешно')
                     })

      })
      // создание новых скидок на серии
      series.value.data.map(item => {
        const url_create:string =  'discounts/InvSerieDisount/'
        const config = { headers: { 'content-type': 'application/json', }, };
        const formData = new FormData();        
        formData.append("serie",    item.id.toString())
        formData.append("group",    props.id)
        formData.append("discount", '0')

        const res = AxiosInstance.post(url_create, formData, config)
          .then(function(response) {
            console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
      })

      // азгружаем то, что насоздавали
      seriesDiscount.value = await useFetch('discounts/InvSerieDisount/?group=' + props.id, {});  // не работает. Не дожидается полного создания серий
    }

    async function createOptions() {
      // удаление имеющихся скидок на опции группы
      optionsDiscount.value.data.map(item => {
        const url:string =  'discounts/InvOptionDisount/' + item.id.toString()
        AxiosInstance.delete(url,{})
                     .then((res) => {
                      console.log('удалено успешно')
                     })

      })

      // создание новых скидок на опции
      options.value.data.map(item => {
        const url_create:string =  'discounts/InvOptionDisount/'
        const config = { headers: { 'content-type': 'application/json', }, };
        const formData = new FormData();        
        formData.append("option",    item.id.toString())
        formData.append("group",     props.id)
        formData.append("discount",  '0')

        const res = AxiosInstance.post(url_create, formData, config)
          .then(function(response) {
            console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
      })

      // азгружаем то, что насоздавали
      optionsDiscount.value = await useFetch('discounts/InvOptionDisount/?group=' + props.id, {});  // не работает. Не дожидается полного создания серий
    }  


    const isPositiveInteger = (val:number) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        var n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (event:any) => {
      let { data, newValue, field } = event;
        if (isPositiveInteger(newValue)) data[field] = newValue;
              else event.preventDefault();

    };

    async function loadData() {
        data.value = await useFetch(url + '/' + props.id, {});
        series.value = await useFetch('Inv_series', {});
        options.value = await useFetch('Type_of_options', {});
        
        seriesDiscount.value = await useFetch('discounts/InvSerieDisount/?group=' + props.id, {});
        optionsDiscount.value = await useFetch('discounts/InvOptionDisount/?group=' + props.id, {});

        path.value = getPath(route.path)        
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">{{ title }}. Редактирование</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">

        <div class="field pt-5">
            <FloatLabel>
                <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full"/>
                <label for="id">id</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
          <div class="formgrid grid">
            <div class="field col">
              <h1>Серии</h1>
              <Button label="Пересоздать серии" @click="createSeries()"/>
              <DataTable :value="seriesDiscount.data" 
                     tableStyle="min-width: 50rem"  
                       editMode="cell" 
            @cell-edit-complete="onCellEditComplete"
                            :pt="{ table: { style: 'min-width: 50rem' }, column: { bodycell: ({ state }:any ) => ({ class: [{ 'pt-0 pb-0': state['d_editing'] }] }) } }">
                <Column field="serie" header="Серия">
                  <template #body="{ data }">
                    <span>{{ getValueFromDictionary(series.data, data.serie) }} </span>
                  </template>
                </Column>

                <Column field="discount" header="Скидка, %">
                  <template #body="{ data, field }">
                    {{ Number(data[field]).toFixed() }}
                  </template>
                  <template #editor="{ data, field }">
                      <InputNumber v-model="data[field]" inputId="deviation" showButtons buttonLayout="horizontal" :step="1" suffix=" %" :min="0" :max="100" fluid>
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>                              
                  </template>                  
                </Column>

              </DataTable>
            </div>
            <div class="field col">
              <h1>Опции</h1>
              <Button label="Пересоздать опции" @click="createOptions()"/>
              <DataTable :value="optionsDiscount.data" 
                     tableStyle="min-width: 50rem" 
                       editMode="cell" 
            @cell-edit-complete="onCellEditComplete"
                            :pt="{ table: { style: 'min-width: 50rem' }, column: { bodycell: ({ state }:any) => ({ class: [{ 'pt-0 pb-0': state['d_editing'] }] }) } }"
                            >
                <Column field="option" header="option">
                  <template #body="{ data }">
                    <span>{{ getValueFromDictionary(options.data, data.option) }} </span>
                  </template>
                </Column>
                <Column field="discount" header="Скидка, %">
                  <template #body="{ data, field }">
                    {{ Number(data[field]).toFixed() }}
                  </template>
                  <template #editor="{ data, field }">
                      <InputNumber v-model="data[field]" inputId="deviation" showButtons buttonLayout="horizontal" :step="1" suffix=" %" :min="0" :max="100" fluid>
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>                              
                  </template>                  
                </Column>
              </DataTable>              
            </div>
          </div>
        </div>


        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/${path}/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


