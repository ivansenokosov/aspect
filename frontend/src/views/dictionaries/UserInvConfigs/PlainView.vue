<script setup lang="ts">
  import {useRoute} from "vue-router";
  import { ref } from 'vue'
  import type { IInvSerieData, IInvOptionData, IInvertorData, ISimpleData, IUserInvConfigData, IInvOption, IInvAvalControlData } from "@/interfaces";
  import { useFetch } from "@/api/useFetch";
  import { useBaseUrl } from "@/stores/baseUrl";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import Tag from "primevue/tag";
  import Button from "primevue/button";
  import { priceFormat } from "@/api/priceFormat";
  import Divider from "primevue/divider";
  import { RouterLink } from "vue-router";
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import axios from "axios";
  import { getValueFromDictionary } from "@/api/getValueFromDictionary";

  const route = useRoute()
  const baseUrl = useBaseUrl()
  const id = ref<Number>(0)

  const invConfig = ref<IUserInvConfigData>({data:[], error: null, loading: true})
  const serie = ref<IInvSerieData>({data:[], error: null, loading: true})
  const invertor = ref<IInvertorData>({data:[], error: null, loading: true})
  const options = ref<IInvOptionData>({data:[], error: null, loading: true})
  const optionsSelected = ref<IInvOption[]>([])
  const typeOfOptions = ref<ISimpleData>({data:[], error: null, loading: true})
  const outputVoltage = ref<ISimpleData>({data:[], error: null, loading: true})
  const breakModule = ref<ISimpleData>({data:[], error: null, loading: true})
  const ambientTemperature = ref<ISimpleData>({data:[], error: null, loading: true})
  const InvTypeOfControl = ref<IInvAvalControlData>({data:[], error: null, loading: true})
  const invVariantOfControl = ref<ISimpleData>({data:[], error: null, loading: true})
  const signals = ref<any[]>([])
  const invControl = ref<String>('') // Способы управления
  const availableOptions = ref<String>('') // Доступные типы опций

  const optionsPrice = ref<Number>(0)
  const optionsJSON = ref<any[]>([])

    async function savePDF() {
    axios({
      method: 'get',
      url: baseUrl.baseUrl + 'users/invpdf?id=' + String(id.value),
      responseType: 'arraybuffer'
    }).then(function(response) {
      let blob = new Blob([response.data], { type: 'application/pdf' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'aspect.pdf'
      link.click()
    })    
  }

  async function loadData() {
    id.value = route.query.id
    invConfig.value   = await useFetch('userconfigs/UserInvConfg/' + id.value.toString() + '/', {})
    invertor.value    = await useFetch('Invertors/' + invConfig.value.data.invertor + '/', {})
    serie.value       = await useFetch('Inv_series/' + invertor.value.data.serie, {})
    options.value     = await useFetch('Inv_options/?serie=' + serie.value.data.id, {})
    typeOfOptions.value        = await useFetch('Type_of_options', {} );
    outputVoltage.value        = await useFetch('Inv_output_voltage/'     + serie.value.data.output_voltage.toString() + '/', {} );
    breakModule.value          = await useFetch('Inv_breake_module/'      + invertor.value.data.type_of_break_module.toString() + '/', {} );
    ambientTemperature.value   = await useFetch('Ambient_temperatures/'   + serie.value.data.ambient_temperature.toString() + '/', {} );
    signals.value              = await useFetch('Inv_spec_of_in_out/?serie=' + invertor.value.data.serie.toString() , {} );
    InvTypeOfControl.value     = await useFetch('Inv_type_of_control', {} );
    invVariantOfControl.value  = await useFetch('Variants_of_control', {} );

    optionsJSON.value = JSON.parse(invConfig.value.data.options);

    // формирования способов управляния для серии
    InvTypeOfControl.value.data = InvTypeOfControl.value.data.filter(item => item.serie === invertor.value.data.serie)
    InvTypeOfControl.value.data.map( item => {
      invVariantOfControl.value.data.map( variant => {
        if (item.control === variant.id) {
          invControl.value = invControl.value + variant.name + ', '
        }
      })
    })
    invControl.value = invControl.value.substring(0, invControl.value.length-2)

    // доступные опции
    const arrayUniqueByKey = [...new Map(options.value.data.map(item => [item['option_type'], item])).values()];
    arrayUniqueByKey.map(item => availableOptions.value = availableOptions.value + item.option_type + ', ')
    availableOptions.value = availableOptions.value.substring(0, availableOptions.value.length-2)


    options.value.data.map(item => {
      optionsJSON.value.map(selected => {
        if (item.id == selected) {
          optionsSelected.value.push(item)
        }
      })
    })

    optionsSelected.value.map(item => optionsPrice.value = optionsPrice.value + Number(item.price)) // Итого цена опций
  }

  loadData()

</script>

<template>
  <h1 class="pt-5">Конфигурация преобразователя частоты</h1>
  <div v-if="options.loading || invertor.loading">
    Загружаю ...
  </div>
  <div v-else>
    <div  class="grid">

      <div class="col-3 mt-5">
        <RouterLink to="/config">
          <Button icon="pi pi-arrow-circle-left" label="Мои конфигурации" severity="info"/>          
        </RouterLink>
        <Button label="Скачать PDF" severity="help" icon="pi pi-download" @click="savePDF" class="ml-2"/>
        <!-- <p class="text-sm mt-5">Преобразователь частоты</p> -->
        <p class="text-3xl font-bold  mt-5">{{ invertor.data.name }}</p>
        <p class="text-sm">Серия: {{ serie.data.name }}</p>
        <p class="text-sm pb-5">Призводитель: {{ invertor.data.manufactory_str }}/Аспект</p>
        
        <div class="mt-5">
          <img v-if="serie.data.photo" :src="`${baseUrl.baseUrl}${serie.data.photo}`" height="350">
          <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
        </div>
      </div>

      <div class="col-5 mt-5">
        <img v-if="serie.data.schema" :src="`${baseUrl.baseUrl}${serie.data.schema}`" width="600">
        <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
      </div>


      <div class="col-4" >
      <Tabs value="0">
        <TabList>
            <Tab value="0">Характеристики</Tab>
            <Tab value="1">Входы/Выходы управления</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
     
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Мощность</label>
          <div class="col">
            <div>
              <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ invertor.data.p_heavy_g }} кВт</div>
              <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ invertor.data.p_pumps_p }} кВт</div>
            </div>
          </div>
        </div>

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Перегрузка</label>
          <div class="col">
            <div>
              <div v-if="invertor.data.overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ invertor.data.overload_p_mode }}</div>
              <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ invertor.data.overload_g_mode }}</div> 
            </div>
            <p class="text-sm pt-3">Перегрузочная способность (не  чаще 1 раза в 10 мин)</p>
          </div>
        </div>
        
        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Диапазон напряжений</label>
          <div class="col">
            <div>
              <div class="mt-1" style="width: 100%"><Tag value="На входе" severity="warn" /> {{ invertor.data.input_voltage_str }}</div>
              <div class="mt-1" style="width: 100%"><Tag value="На выходе" severity="danger" /> {{ outputVoltage.data.name }}</div> 
            </div>
          </div>
        </div>        

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Ток</label>
          <div class="col">
            <div>
              <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ invertor.data.current_g }} А</div>
              <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ invertor.data.current_p }} А</div> 
            </div>
          </div>
        </div>

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Управление</label>
          <div class="col">
            <div>
                <div class="mt-1" style="width: 100%"><Tag value="Метод" severity="warn" /> {{ invertor.data.type_of_control_str }}</div>
                <div class="mt-1" style="width: 100%"><Tag value="Способ" severity="danger" /> {{ invControl }}</div> 
              </div>
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Панель</label>
          <div class="col">
            {{ invertor.data.type_of_panel_str }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Дроссель</label>
          <div class="col">
            <div>
                <div class="mt-1" style="width: 100%"><Tag value="EMC" severity="warn" /> {{ invertor.data.type_of_emc_drossel_str }}</div>
                <div class="mt-1" style="width: 100%"><Tag value="DC" severity="danger" /> {{ invertor.data.type_of_dc_drossel_str }}</div> 
              </div>
          </div>
        </div>  

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Тормозной модуль</label>
          <div class="col">
            {{ breakModule.data.name }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Точность регулирования частоты</label>
          <div class="col">
            {{ invertor.data.type_of_accuracy_freq }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Уровень защиты</label>
          <div class="col">
            {{ invertor.data.level_IP_str }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Температура окружающей среды</label>
          <div class="col">
            {{ ambientTemperature.data.name }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Доступные типы опций</label>
          <div class="col">
            {{ availableOptions }}
          </div>
        </div>            


        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Описание</label>
          <div class="col">
            {{ serie.data.description }}
          </div>
        </div>            
      </TabPanel>

      <TabPanel value="1">
        <div class="field grid">
          <div class="col">
            <DataTable v-if="!signals.loading" :value="signals.data" stripedRows tableStyle="min-width: 40rem">
              <Column field="signal_str" header="Сигнал" headerStyle="width: 10%"></Column>
              <Column field="quantity" header="Количество" headerStyle="width: 10%"></Column>
            </DataTable>
          </div>
        </div>            
      </TabPanel>
    </TabPanels>
  </Tabs>



    </div>
  </div>

  <h1 class="mt-5">Выбранные опции ({{ optionsSelected.length }})</h1>

  <DataTable v-if="!options.loading" :value="optionsSelected" stripedRows tableStyle="min-width: 50rem">
        <Column field="name" header="Наименование" headerStyle="width: 10%"></Column>
        <Column field="full_title" header="Описание" headerStyle="width: 10%"></Column>
        <Column field="short_title" header="Доп. описание" headerStyle="width: 10%"></Column>
        <Column header="Тип" headerStyle="width: 10%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(typeOfOptions.data, data.option) }} </span>
          </template>
        </Column>
        
        <Column header="Количество" headerStyle="width: 10%">
          <template #body="{ data }">
            <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
            <div v-if="data.quantity<=0" class="font-bold text-xl w-full"><Tag :value="data.waiting_period" severity="warn" /></div>
          </template>
        </Column>
        <Column header="Цена" headerStyle="width: 10%">
          <template #body="{ data }">
            <span class="font-bold text-xl">{{ priceFormat(data.price) }} &#8381;</span>
          </template>
        </Column>
      </DataTable>

      <Divider/>
      <h1>Итого</h1>
      <p class="font-semibold text-lg">Цена частотного преобразователя {{ invertor.data.name }}: <span class="font-bold text-xl"> {{ priceFormat(invertor.data.price) }} &#8381;</span></p>
      <p class="font-semibold text-lg">Цена выбранных опций: <span class="font-bold text-xl"> {{ priceFormat(optionsPrice) }} &#8381;</span></p> 
    </div>

</template>

