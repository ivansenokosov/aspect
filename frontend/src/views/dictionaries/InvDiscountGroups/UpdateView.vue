<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRoute } from 'vue-router'
    import { useFetch } from '@/api/useFetch';
    import { useToast } from "primevue/usetoast";
    import { getPath } from '@/api/getPath';
    import type { ISimpleDictionary, IInvSerieDisount, IInvOptionDisount, IInvSerie, IDocument } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import { getValueFromDictionary } from '@/api/getValueFromDictionary';
    import { updateData } from '@/api/dataActions';
    import { createOptions, createSeries, onCellEditComplete } from '@/api/discounts';

    const props = defineProps( {
      id: {
        type: String,
        required: true,
      }
    })

    const route           = useRoute();
    const toast           = useToast(); 
    const data            = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Группа скидок
    const options         = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // типы опций
    const series          = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) // серии
    const seriesDiscount  = ref<IDocument<IInvSerieDisount>>({data:[], error: null, loading: true}) // скидки для серий
    const optionsDiscount = ref<IDocument<IInvOptionDisount>>({data:[], error: null, loading: true}) // скидки для опций

    const saving          = ref<boolean>(false)
    const loading         = ref<boolean>(true)
    const path            = ref<string>('')      
    const url:string      = 'discounts/InvDisountGroup'
    const title:string    = 'Группа скидок'

    const submission = async () => {
        saving.value = true
        updateData(url + '/' + props.id + '/', {"name": data.value.data[0].name})         // сохраняем группу скидок

        seriesDiscount.value.data.map((item:IInvSerieDisount) => {
          updateData('discounts/InvSerieDisount/' + item.id.toString() + '/', item)  // сохраняем скидки для серий
        })

        optionsDiscount.value.data.map((item:IInvOptionDisount) => {
          updateData('discounts/InvOptionDisount/' + item.id.toString() + '/', item)
        })

        saving.value = false
        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
    }

    async function loadSeriesDisount() {
      seriesDiscount.value  = await useFetch('discounts/InvSerieDisount/?group=' + props.id);  
    }    

    async function loadOptionsDisount() {
      optionsDiscount.value  = await useFetch('discounts/InvOptionDisount/?group=' + props.id);
    }    

    async function loadData() {
        data.value             = await useFetch(url + '/' + props.id);
        series.value           = await useFetch('Inv_series');
        options.value          = await useFetch('Type_of_options');
        await loadSeriesDisount()
        await loadOptionsDisount()
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
              <Button label="Пересоздать серии" @click="() => {
                createSeries(props.id, series.data, seriesDiscount.data)
                loadSeriesDisount()
              }"/>
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
              <Button label="Пересоздать опции" @click="() => {
                createOptions(props.id, options.data, optionsDiscount.data)
                loadOptionsDisount()
              }"/>
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


