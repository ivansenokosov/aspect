<script setup lang="ts">
  import { ref, watch, defineProps } from 'vue' 
  import { useRouter } from 'vue-router'
  import type { IInvertorData, IInvertor, IInvAvalControlData,  IInvSerieData, IInvOptionData, IInvOption, ISimpleData, ISimpleDictionary } from '@/interfaces.js';
  import { useFetch } from '@/api/useFetch';
  import Tag from 'primevue/tag';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Divider from 'primevue/divider';
  import Fieldset from 'primevue/fieldset';
  import { useBaseUrl } from '@/stores/baseUrl'
  import { priceFormat } from '@/api/priceFormat';
  import SelectSimpleList from './SelectSimpleList.vue';
  import { useUserStore } from '@/stores/user';
  import Toast from 'primevue/toast';
  import { useToast } from "primevue/usetoast";
  import AxiosInstance from '@/api/axiosInstance';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import { useLoginStore } from '@/stores/login';
  

  const props = defineProps(['invInputVolage','invTypeOfControl','invVariantOfControl','invEMC','invDC','invBreak','power','error'])
  const baseUrl = useBaseUrl()
  const user = useUserStore()
  const toast = useToast()  
  const router = useRouter()
  const loginModal = useLoginStore()

  const data = ref<IInvertorData>({data:[], error: null, loading: true})  // Все инверторы
  const dataDisplay = ref<IInvertor[]>([]) // Инверторы после фильтров

  const invInputVolageStr = ref<string>('')
  const invTypeOfControlStr = ref<string>('')
  const invVariantOfControlStr = ref<string>('') 
  const invEMCStr = ref<string>('')
  const invDCStr = ref<string>('')
  const invBreakStr = ref<string>('')
  const invAvalControl = ref<IInvAvalControlData>({data:[], error: null, loading: true})  // способ управления для серии

  //------- данные модала {
  const saving = ref<Boolean>(false)
  const serie = ref<IInvSerieData>({data:[], error: null, loading: true})
  const submitted = ref(false);
  const options = ref<IInvOptionData>({data:[], error: null, loading: true})
  const optionsDisplay = ref<IInvOptionData>({data:[], error: null, loading: true})
  const typeOfOptions = ref<ISimpleData>({data:[], error: null, loading: true})
  const selectedOptions = ref<IInvOption[]>([])
  const selectedTypeOFOptions = ref<ISimpleDictionary[]>([])
  const optionsPrice = ref<Number>(0)
  const typeOfOptionsStr = ref<String>('')

  const openProduct = async (prod) => {
    product.value = {...prod};
    productDialog.value = true;
    selectedOptions.value = []
    serie.value   = await useFetch('Inv_series/' + prod.serie,{})//prod.serie,{})
    options.value = await useFetch('Inv_options/?serie=' + prod.serie,{})//prod.serie,{})
    optionsDisplay.value = {...options.value}
  };

  async function addUserInvConfig() {
      if (user.userId > 0) {
        saving.value = true
        const url:string =  'userconfigs/UserInvConfg/'
        const config = { headers: { 'content-type': 'application/json', }, };
        const selectedOptionsStr = ref<String>('')

        if (selectedOptions) {
          selectedOptionsStr.value  = selectedOptions.value.map(a => a.id.toString())
        }

        const formData = new FormData();        

        formData.append("user", user.userId)
        formData.append("invertor", product.value.id)
        formData.append("options", JSON.stringify(selectedOptionsStr.value))
        
        const res = await AxiosInstance.post(url, formData, config)
          .then(function(response) {
            toast.add({ severity: 'info', summary: 'Успешно', detail: 'Запись создана', life: 3000 });
            router.push('inv_config/?id=' + response.data.id)
            console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
      } else {
        // noAuthVisible.value = true
        loginModal.visible = true // если пользлватель не авторизован, открываем модал
      }
    }

  watch(selectedTypeOFOptions, () => {
    if (selectedTypeOFOptions) {
      typeOfOptionsStr.value  = selectedTypeOFOptions.value.map(a => a.id.toString())
    }
    let filtered = options.value.data.filter((item) => typeOfOptionsStr.value.includes(item.option.toString()) )
    optionsDisplay.value.data = filtered
  })

  const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

  watch(selectedOptions, () => {
    optionsPrice.value = 0
    selectedOptions.value.map(item => optionsPrice.value = optionsPrice.value + Number(item.price))
  })
  //------- данные модала } 

  //------- моддал с требованием авторизации {
    const noAuthVisible = ref(false);
  //------- моддал с требованием авторизации }
  

  const product = ref<IInvertor>([{name: ''}]);
  const productDialog = ref(false);

  async function loadData() {
    invAvalControl.value = await useFetch('Inv_type_of_control',{})
    typeOfOptions.value  = await useFetch('Type_of_options', {} );
    data.value           = await useFetch('Invertors', {} );
    dataDisplay.value = data.value.data
  }

  watch(() => [props.invInputVolage, 
               props.invTypeOfControl,
               props.invEMC,
               props.invDC,
               props.invBreak,
               props.invVariantOfControl,
               props.error, 
               props.power], (selection) => { 
        const d:number = Number(props.power) * props.error / 100
        const minPower:number = Number(props.power) - d
        const maxPower:number = Number(props.power) + d

        if (props.invInputVolage) {
          invInputVolageStr.value   = props.invInputVolage.map(a => a.id.toString())
        }
        if (props.invTypeOfControl) {
          invTypeOfControlStr.value = props.invTypeOfControl.map(a => a.id.toString())    
        }
        if (props.invEMC) {
          invEMCStr.value           = props.invEMC.map(a => a.id.toString())
        }
        if (props.invDC) {
          invDCStr.value            = props.invDC.map(a => a.id.toString())
        }
        if (props.invBreak) {
          invBreakStr.value         = props.invBreak.map(a => a.id.toString())
        }
        if (props.invVariantOfControl) {
          invVariantOfControlStr.value = props.invVariantOfControl.map(a => a.id.toString())
        }
        // снчала фильтруем список возможных вариантов контроля для серии
        const aval = invAvalControl.value.data.filter((item) => invVariantOfControlStr.value.includes(item.control.toString()) )
        // формируем строку из доступных серий
        const avalSeriesStr = aval.map(a => a.serie.toString())

        dataDisplay.value = data.value.data.filter((item) => (((Number(item.p_heavy_g.replace(',','.')) >= minPower && Number(item.p_heavy_g.replace(',','.')) <= maxPower) || (Number(item.p_pumps_p.replace(',','.')) >= minPower && Number(item.p_pumps_p.replace(',','.')) <= maxPower))
                                                          && invInputVolageStr.value.includes(item.input_voltage.toString()) 
                                                          && invTypeOfControlStr.value.includes(item.type_of_control.toString())
                                                          && invEMCStr.value.includes(item.type_of_emc_drossel.toString())
                                                          && invDCStr.value.includes(item.type_of_dc_drossel.toString())
                                                          && invBreakStr.value.includes(item.type_of_break_module.toString())
                                                          && avalSeriesStr.includes(item.serie.toString())
                                                  ))
    })

    loadData()
  
</script> 

<template>
  <Toast/>
  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <h1 class="mt-5 pt-5">Преобразователи частоты ({{ dataDisplay.length }})</h1>
    
    <div v-if="dataDisplay.length > 0">
      <DataTable :value="dataDisplay" stripedRows tableStyle="min-width: 50rem"> 
        <Column field="name" header="Модель" sortable headerStyle="width: 10em"></Column>
        <Column field="serie_str" header="Серия" sortable headerStyle="width: 3em"></Column>
        <Column header="Мощность" headerStyle="width: 6em">
          <template #body="{ data }">
              <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ data.p_heavy_g }} кВт</div>
              <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ data.p_pumps_p }} кВт</div>
          </template>
        </Column>
        <Column header="Ток" headerStyle="width: 6em">
          <template #body="{ data }">
              <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ data.current_g }} А</div>
              <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ data.current_p }} А</div> 
          </template>
        </Column>
        <Column header="Перегрузка" headerStyle="width: 15em">
          <template #body="{ data }">
              <div v-if="data.overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ data.overload_p_mode }}</div>
              <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ data.overload_g_mode }}</div> 
          </template>
        </Column>
        <Column field="type_of_control_str"      header="Управление" headerStyle="width: 10em"></Column>
        <Column field="type_of_panel_str"        header="Панель" headerStyle="width: 10em"></Column>
        <Column header="Количество" headerStyle="width: 5em">
          <template #body="{ data }">
            <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
            <div v-if="data.quantity<=0" class="font-bold text-xl w-full"><Tag :value="data.waiting_period" severity="warn" /></div>
          </template>
        </Column>
        <Column header="Цена" headerStyle="width: 8em">
          <template #body="{ data }">
            <span v-if="data.price>0" class="font-bold text-xl">{{ priceFormat(data.price) }} &#8381;</span>
            <span v-else><Tag value="По запросу" severity="danger" /></span>
          </template>
        </Column>
        <Column header="" headerStyle="width: 5em">
          <template #body="{ data }">
            <Button label="Выбрать" severity="info"  rounded class="mr-2" @click="openProduct(data)"/>
          </template>
        </Column>

      </DataTable>
    </div>
    <div v-else>
      <h1>Не найдено для заданных параметров</h1>
    </div>


    <Dialog v-model:visible="productDialog" :style="{ width: '1280px' }" :header="product.name" :modal="true">
      <div class="grid">
        <div class="col-4">
          <template v-if="!serie.loading">
            <img v-if="serie.data.photo" :src="`${baseUrl.baseUrl}${serie.data.photo}`" height="350">
            <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
          </template>
        </div>
        <div class="col-8" >
          <div class="formgrid grid">
            <div class="field col" >
              <Fieldset legend="Мощность" style="height:170px">
                <div>
                  <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ product.p_heavy_g }} кВт</div>
                  <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ product.p_pumps_p }} кВт</div>
                </div>
              </Fieldset>
            </div>
            <div class="field col">
              <Fieldset legend="Ток" style="height:170px">
                <div>
                  <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ product.current_g }} А</div>
                  <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ product.current_p }} А</div> 
                </div>
              </Fieldset>
            </div>
            <div class="field col">
              <Fieldset legend="Перегрузка" style="height:170px">
                <div>
                  <div v-if="product.overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ product.overload_p_mode }}</div>
                  <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ product.overload_g_mode }}</div> 
                </div>
              </Fieldset>
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col" >
              <Fieldset legend="Управление" style="height:200px">
                {{ product.type_of_control_str }}
              </Fieldset>
            </div>
            <div class="field col">
              <Fieldset legend="Панель" style="height:200px">
                {{ product.type_of_panel_str }}
              </Fieldset>
            </div>
            <div class="field col">
              <Fieldset legend="Описание" style="height:200px">
                  {{ serie.data.description }}
              </Fieldset>
            </div>
          </div>          
        </div>
        
      </div>

      <SelectSimpleList url="Type_of_options" title="Тип опции" v-model="selectedTypeOFOptions"/>

      <h1 class="mt-5">Опции ({{ optionsDisplay.data.length }})</h1>

      <DataTable v-if="!options.loading" :value="optionsDisplay.data" v-model:selection="selectedOptions" stripedRows tableStyle="min-width: 50rem">
        <Column selectionMode="multiple" headerStyle="width: 5%"></Column>
        <Column field="name" header="Наименование" headerStyle="width: 10%"></Column>
        <Column field="full_title" header="Описание" headerStyle="width: 10%"></Column>
        <Column field="short_title" header="Доп. описание" headerStyle="width: 10%"></Column>
        <Column header="Тип" headerStyle="width: 10%">
          <template #body="{ data }" v-if="!typeOfOptions.loading">
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
      <p class="font-semibold text-lg">Цена частотного преобразователя {{ product.name }}: <span class="font-bold text-xl"> {{ priceFormat(product.price) }} &#8381;</span></p>
      <p class="font-semibold text-lg">Цена выбранных опций: <span class="font-bold text-xl"> {{ priceFormat(optionsPrice) }} &#8381;</span></p>


            <template #footer>
                <Button label="Закрыть" severity="secondary" icon="pi pi-times" text @click="hideDialog" />
                <!-- <Button label="Скачать PDF" severity="help"  icon="pi pi-download" @click="savePDF" /> -->
                <Button label="Сохранить в мои конфигурации" :loading="saving" icon="pi pi-save" @click="addUserInvConfig" />
            </template> 
        </Dialog>
<!-- Модал нет авторизации -->
        <Dialog v-model:visible="noAuthVisible" modal header="Войдите в личный кабинет" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                <p>Для использования этой функции войдите в личный кабинет.</p>
                <p>Если у вас нет личного кабинета, свяжитесь с ..... </p>
            </p>
        </Dialog>


  </div>
</template>