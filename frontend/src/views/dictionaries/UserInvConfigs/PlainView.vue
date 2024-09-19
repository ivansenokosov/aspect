<script setup lang="ts">
  import {useRoute} from "vue-router";
  import { ref } from 'vue'
  import type { IDocument, IInvSerie, IInvertor, IUserInvConfig, IInvOption, IInvAvalControl, IInvSignalInputOutput, ISimpleDictionary } from "@/interfaces";
  import { useFetch } from "@/api/useFetch";
  import { useBaseUrl } from "@/stores/baseUrl";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import Tag from "primevue/tag";
  import Button from "primevue/button";
  import { priceFormat } from "@/api/priceFormat";
  import Divider from "primevue/divider";
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import axios from "axios";
  import { getValueFromDictionary } from "@/api/getValueFromDictionary";
  import { useUserStore } from "@/stores/user";
  import moment from 'moment'
  import OverlayBadge from "primevue/overlaybadge";
  import Textarea from "primevue/textarea";
  import FloatLabel from "primevue/floatlabel";
  import Toast from 'primevue/toast';
  import { useToast } from "primevue/usetoast";
  import { saveLog } from "@/api/log";
  import { updateData } from '@/api/dataActions'
  import { generatePDF } from "@/api/generatePDF";

  const route                = useRoute()
  const baseUrl              = useBaseUrl()
  const user                 = useUserStore()
  const toast                = useToast()

  const id                   = ref<number>(0)

  const invConfig            = ref<IDocument<IUserInvConfig>>({data:[], error: null, loading: true})
  const serie                = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true})
  const invertor             = ref<IDocument<IInvertor>>({data:[], error: null, loading: true})
  const options              = ref<IDocument<IInvOption>>({data:[], error: null, loading: true})
  const optionsSelected      = ref<IInvOption[]>([])
  const typeOfOptions        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const outputVoltage        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const breakModule          = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const ambientTemperature   = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const InvTypeOfControl     = ref<IDocument<IInvAvalControl>>({data:[], error: null, loading: true})
  const invVariantOfControl  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
  const signals              = ref<IDocument<IInvSignalInputOutput>>({data:[], error: null, loading: true})
  const invControl           = ref<string>('') // Способы управления
  const availableOptions     = ref<string>('') // Доступные типы опций

  const optionsPrice         = ref<number>(0)
  const optionsDiscountPrice = ref<number>(0)
  const optionsJSON          = ref<any[]>([])
  const pricesJSON           = ref<any[]>([])
  const discountsJSON        = ref<any[]>([])
  const saving               = ref<boolean>(false)
  const loading              = ref<boolean>(true)
  const docNumber            = ref<string>('')

  async function savePDF(print_price: number) {
    generatePDF(invertor.value.data[0], 
                serie.value.data[0],
                optionsSelected.value, 
                signals.value.data, 
                optionsPrice.value, 
                availableOptions.value,
                invControl.value,
                print_price, 
                docNumber.value)

    // const pdfurl = baseUrl.baseUrl + 'users/invpdf?id=' + String(id.value) + '&print_price=' + String(print_price)

    // if (print_price == 1) { saveLog(5, '') } else { saveLog(6, '') }   
    // // console.log(pdfurl)

    // axios({
    //   method: 'get',
    //   url: pdfurl,
    //   responseType: 'arraybuffer'
    // }).then(function(response) {
    //   let blob = new Blob([response.data], { type: 'application/pdf' })
    //   let link = document.createElement('a')
    //   link.href = window.URL.createObjectURL(blob)
    //   link.download = 'aspect.pdf'
    //   link.click()
    // })    
  }

  const submission = async () => {
      saving.value = true
      const url:string =  'userconfigs/UserInvConfg/' + id.value.toString() + '/'
      updateData(url, invConfig.value.data[0]).then(() => {toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });})
      saving.value = false
  }

  async function setRead() { // установка флага, что конфигурация просмотрена
      const url:string =  'userconfigs/UserInvConfg/' + id.value.toString() + '/'
      invConfig.value.data[0].staff_opened = true
      updateData(url, invConfig.value.data[0])
  }

  async function loadData() {
    saveLog(9, '')

    id.value                   = Number(route.query.id)
    invConfig.value            = await useFetch('userconfigs/UserInvConfg/' + id.value.toString() + '/', {})
    invertor.value             = await useFetch('Invertors/' + invConfig.value.data[0].invertor + '/', {})
    serie.value                = await useFetch('Inv_series/' + invertor.value.data[0].serie, {})
    options.value              = await useFetch('Inv_options/?serie=' + serie.value.data[0].id, {})
    typeOfOptions.value        = await useFetch('Type_of_options', {} );
    outputVoltage.value        = await useFetch('Inv_output_voltage/'     + serie.value.data[0].output_voltage.toString() + '/', {} );
    breakModule.value          = await useFetch('Inv_breake_module/'      + invertor.value.data[0].type_of_break_module.toString() + '/', {} );
    ambientTemperature.value   = await useFetch('Ambient_temperatures/'   + serie.value.data[0].ambient_temperature.toString() + '/', {} );
    signals.value              = await useFetch('Inv_spec_of_in_out/?serie=' + invertor.value.data[0].serie.toString() , {} );
    InvTypeOfControl.value     = await useFetch('Inv_type_of_control', {} );
    invVariantOfControl.value  = await useFetch('Variants_of_control', {} );

    optionsJSON.value   = JSON.parse(invConfig.value.data[0].options);
    pricesJSON.value    = JSON.parse(invConfig.value.data[0].options_prices);
    discountsJSON.value = JSON.parse(invConfig.value.data[0].options_disccounts);

    // формирования способов управляния для серии
    InvTypeOfControl.value.data = InvTypeOfControl.value.data.filter(item => item.serie === invertor.value.data[0].serie)
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

    let i = 0
    optionsJSON.value && options.value.data.map(item => {
      optionsJSON.value.map((selected, index) => {
        if (item.id == selected) {
          optionsSelected.value.push(item)
          optionsSelected.value[i].price = pricesJSON.value[index]
          optionsSelected.value[i].discount = discountsJSON.value[index]
          i++
        }
      })
    })

    optionsSelected.value.map((item : IInvOption) => { 
      optionsPrice.value += Number(item.price)
      if (item.discount && item.price) {
        optionsDiscountPrice.value += getOptionPrice(item.price, item.discount)
      }
    }) // Итого цена опций

    if (invConfig.value.data[0].staff_opened === false && user.isStaff()) { 
      await setRead()
    }

    docNumber.value = invConfig.value.data[0].user.toString() + '/' +  invConfig.value.data[0].id.toString() + ' от ' + moment(invConfig.value.data[0].date).format('DD.MM.YYYY')

    loading.value = false
  }

  function getOptionPrice(price: string, discount: string) {
    return Number(price) * (100-Number(discount))/100
  }


  loadData()
</script>

<template>
  <Toast/>
  <div v-if="loading">
    Загружаю ...
  </div>
  <div v-else>
    <h1 class="pt-5">Технико-коммерческое предложение № {{ docNumber }}</h1>
      <div class="field pt-5">
        <FloatLabel>
            <Textarea id="info" v-model="invConfig.data[0].info" class="w-full"/>
            <label for="info">Комментарий</label>
        </FloatLabel>
    </div>

    <div  class="grid">
      

      <div class="col-3 mt-5">
        <!-- <RouterLink to="/config">
          <Button icon="pi pi-arrow-circle-left" label="Мои конфигурации" severity="info"/>          
        </RouterLink> -->
        <Button label="PDF" severity="help" icon="pi pi-download" @click="savePDF(1)" class="ml-2"/>
        <Button label="PDF без цен" severity="secondary" icon="pi pi-download" @click="savePDF(0)" class="ml-2"/>
        <Button label="Сохранить" severity="primary" icon="pi pi-save" @click="submission" class="ml-2"/>
        <!-- <p class="text-sm mt-5">Преобразователь частоты</p> -->
        <p class="text-3xl font-bold  mt-5">{{ invertor.data[0].name }}</p>
        <p class="text-sm">Серия: {{ serie.data[0].name }}</p>
        <p class="text-sm pb-5">Призводитель: {{ invertor.data[0].manufactory_str }}/Аспект</p>
        
        <div class="mt-5">
          <img v-if="serie.data[0].photo" :src="`${baseUrl.baseUrl}${serie.data[0].photo}`" height="350">
          <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
        </div>
      </div>

      <div class="col-5 mt-5">
        <img v-if="serie.data[0].schema" :src="`${baseUrl.baseUrl}${serie.data[0].schema}`" width="600">
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
              <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ invertor.data[0].p_heavy_g }} кВт</div>
              <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ invertor.data[0].p_pumps_p }} кВт</div>
            </div>
          </div>
        </div>

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Перегрузка</label>
          <div class="col">
            <div>
              <div v-if="invertor.data[0].overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ invertor.data[0].overload_p_mode }}</div>
              <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ invertor.data[0].overload_g_mode }}</div> 
            </div>
            <p class="text-sm pt-3">Перегрузочная способность (не  чаще 1 раза в 10 мин)</p>
          </div>
        </div>
        
        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Диапазон напряжений</label>
          <div class="col">
            <div>
              <div class="mt-1" style="width: 100%"><Tag value="На входе" severity="warn" /> {{ invertor.data[0].input_voltage_str }}</div>
              <div class="mt-1" style="width: 100%"><Tag value="На выходе" severity="danger" /> {{ outputVoltage.data[0].name }}</div> 
            </div>
          </div>
        </div>        

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Ток</label>
          <div class="col">
            <div>
              <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ invertor.data[0].current_g }} А</div>
              <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ invertor.data[0].current_p }} А</div> 
            </div>
          </div>
        </div>

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Управление</label>
          <div class="col">
            <div>
                <div class="mt-1" style="width: 100%"><Tag value="Метод" severity="warn" /> {{ invertor.data[0].type_of_control_str }}</div>
                <div class="mt-1" style="width: 100%"><Tag value="Способ" severity="danger" /> {{ invControl }}</div> 
              </div>
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Панель</label>
          <div class="col">
            {{ invertor.data[0].type_of_panel_str }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Дроссель</label>
          <div class="col">
            <div>
                <div class="mt-1" style="width: 100%"><Tag value="EMC" severity="warn" /> {{ invertor.data[0].type_of_emc_drossel_str }}</div>
                <div class="mt-1" style="width: 100%"><Tag value="DC" severity="danger" /> {{ invertor.data[0].type_of_dc_drossel_str }}</div> 
              </div>
          </div>
        </div>  

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Тормозной модуль</label>
          <div class="col">
            {{ breakModule.data[0].name }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Точность регулирования частоты</label>
          <div class="col">
            {{ invertor.data[0].type_of_accuracy_freq }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Уровень защиты</label>
          <div class="col">
            {{ invertor.data[0].level_IP_str }}
          </div>
        </div>            

        <Divider/>
        <div class="field grid">
          <label class="col-fixed font-semibold" style="width:200px">Температура окружающей среды</label>
          <div class="col">
            {{ ambientTemperature.data[0].name }}
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
            {{ serie.data[0].description }}
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
    <template #empty> <tag severity="contrast"> Нет выбранных опций </tag> </template>
        <Column field="name" header="Наименование" headerStyle="width: 10%"></Column>
        <Column field="full_title" header="Описание" headerStyle="width: 10%"></Column>
        <Column field="short_title" header="Доп. описание" headerStyle="width: 10%"></Column>
        <Column header="Тип" headerStyle="width: 10%">
          <template #body="{ data }">
            <span>{{ getValueFromDictionary(typeOfOptions.data, data.option) }} </span>
          </template>
        </Column>
        
        <Column header="Доступное количество" headerStyle="width: 10%">
          <template #body="{ data }">
            <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
            <div v-if="data.quantity<=0" class="font-bold text-xl w-full"><Tag :value="data.waiting_period" severity="warn" /></div>
          </template>
        </Column>
        <Column header="Цена" headerStyle="width: 10%">
          <template #body="{ data }">
            <OverlayBadge :value="`- ${Number(data.discount).toFixed()} %`" severity="warn" class="mr-4">
              <div class="surface-700 text-white font-bold text-xl line-through border-round m-2 flex align-items-center justify-content-center" style="min-width: 80px; min-height: 40px">
                {{ priceFormat(data.price) }} &#8381;
              </div>
            </OverlayBadge>

            <div class="bg-primary font-bold text-xl border-round m-2 flex align-items-center justify-content-center mr-5" style="min-width: 80px; min-height: 40px">
              {{ priceFormat(getOptionPrice(data.price, data.discount)) }} &#8381;
            </div>
          </template>
        </Column>
      </DataTable>

      <Divider class="mt-5"/>

      <p class="font-semibold text-lg">Цена частотного преобразователя {{ invertor.data[0].name }}: 
        <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
          {{ priceFormat(invConfig.data[0].invertor_price) }} &#8381;
        </a>
        <a class="bg-primary font-bold text-xl border-round p-2 " style="min-width: 80px; min-height: 40px">
          {{ priceFormat(getOptionPrice(invConfig.data[0].invertor_price, invConfig.data[0].invertor_discount)) }} &#8381;
        </a>
      </p>
        
      <p class="font-semibold text-lg">Цена выбранных опций: 
        <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
          {{ priceFormat(optionsPrice) }} &#8381;
        </a>
        <a class="bg-primary font-bold text-xl border-round p-2 " style="min-width: 80px; min-height: 40px">
          {{ priceFormat(optionsDiscountPrice) }} &#8381;
        </a>
      </p> 

      <Divider class="mt-5"/>
      
      <p class="font-bold text-xl">Итого: 
        <span class="font-bold text-xl" v-if="!user.isUser()"> {{ priceFormat(Number(optionsPrice) + Number(invConfig.data[0].invertor_price)) }} &#8381;</span>
        <span  v-else> 
          <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
              {{ priceFormat(Number(invConfig.data[0].invertor_price) + Number(optionsPrice)) }} &#8381;
            </a>
          <a class="bg-primary font-bold text-xl border-round p-2" style="min-width: 80px; min-height: 40px">
              {{ priceFormat(getOptionPrice(invConfig.data[0].invertor_price, invConfig.data[0].invertor_discount) + Number(optionsDiscountPrice)) }} &#8381;
          </a>
        </span>
      </p>

    </div>

     


</template>

