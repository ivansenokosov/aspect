<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import type { IDocument, IInvSerie, ISimpleDictionary, IInvOverload } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { RouterLink } from 'vue-router';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import { useBaseUrl } from '@/stores/baseUrl';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';

  const baseUrl = useBaseUrl()
  const data                   = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) 
  const manufacoryData         = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const outputVoltageData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const typeOfControlData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const typeOfPanelData        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const typeOfAccuracyFreqData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const ambientTemperatureData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const levelIPData            = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const typeOfOverloadData     = ref<IDocument<IInvOverload>>({data:[], error: null, loading: true})

  async function loadData() {
    data.value                     = await useFetch('Inv_series', {} );
    manufacoryData.value           = await useFetch('Manufactoty', {} );
    outputVoltageData.value        = await useFetch('Inv_output_voltage', {} );
    typeOfControlData.value        = await useFetch('Type_of_control', {} );
    typeOfPanelData.value          = await useFetch('Inv_type_of_panels', {} );
    typeOfOverloadData.value       = await useFetch('Inv_type_of_overload', {} );
    typeOfAccuracyFreqData.value   = await useFetch('Inv_accurancy_frenq', {} );
    ambientTemperatureData.value   = await useFetch('Ambient_temperatures', {} );
    levelIPData.value              = await useFetch('Level_IP', {} );
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
        <h1 class="pt-5">Справочник «Серии преобразователей частоты»</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/InvSeries/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data.length > 0 && typeOfOverloadData.data.length >0">
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem" :loading="data.loading" paginator  :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
        <Column field="name" header="Серия" sortable style="width: 10%"></Column>
        <Column header="Изображение" width="10%">
          <template #body="{ data }">
            <img v-if="data.photo" :src="`${baseUrl.baseUrl}${data.photo}`" width="100">
            <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="100"/>
          </template>          
        </Column>
        <Column header="Мощность" width="10%">
          <template #body="{ data }">
            <div class="mt-1" style="width: 100%"><Tag value="min" severity="info" /> {{ data.min_power }} кВт</div>
            <div class="mt-1" style="width: 100%"><Tag value="max" severity="info" /> {{ data.max_power }} кВт</div>
          </template>          
        </Column>
        <Column field="description" header="Описание" style="width: 10%"></Column>
        <Column header="Производитель" width="10">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(manufacoryData.data , data.manufactory) }}</span>
          </template>          
        </Column>
        <Column header="Выходное напряжение" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(outputVoltageData.data , data.output_voltage) }}</span>
          </template>          
        </Column>
        <Column header="Управление" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(typeOfControlData.data, data.type_of_control) }}</span>
          </template>          
        </Column>
        <Column header="Панель" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(typeOfPanelData.data, data.type_of_panel) }}</span>
          </template>          
        </Column>
        <Column header="Перегрузка" width="10%">
          <template #body="{ data }">
            <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ getValueFromDictionary(typeOfOverloadData.data, data.type_of_overload, 'g_mode') }} </div>
            <div class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ getValueFromDictionary(typeOfOverloadData.data, data.type_of_overload, 'p_mode') }} </div>
          </template>          
        </Column>
        <Column header="Точность регулирования частоты" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(typeOfAccuracyFreqData.data, data.type_of_accuracy_freq) }}</span>
          </template>          
        </Column>
        <Column header="Уровнь защиты" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(levelIPData.data, data.level_IP) }}</span>
          </template>          
        </Column>
        <Column header="Допустимые температуры окружающей среды" width="5%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(ambientTemperatureData.data, data.ambient_temperature) }}</span>
          </template>          
        </Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/InvSeries/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/InvSeries/Delete/${slotProps.data.id}`">
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