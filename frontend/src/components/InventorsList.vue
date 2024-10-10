<script setup lang="ts">
  import { ref, watch } from 'vue' 
  import type { IInvertor, ISimpleDictionary, IDocument, IInvAvalControl, IUserDiscount, IInvSerieDisount } from '@/interfaces.js';
  import { useFetch } from '@/api/useFetch';
  import { priceFormat } from '@/api/priceFormat';
  import { useUserStore } from '@/stores/user';
  import { getDiscountSerie, getInvPrice } from '@/api/utils';
  import Tag from 'primevue/tag';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import OverlayBadge from 'primevue/overlaybadge';  
  import ProgressSpinner from 'primevue/progressspinner';
  import SelectButton from 'primevue/selectbutton';
  import SelectOptionsModal from './SelectOptionsModal.vue';
  import { filterInvertors } from '@/api/filtterInvertors';
  import { useBaseUrl } from '@/stores/baseUrl';
  import AxiosInstance from './../api/axiosInstance'
  import axios from 'axios' 

  const props      = defineProps(['invInputVolage','invTypeOfControl','invVariantOfControl','invEMC','invDC','invBreak','power','error'])
  const user       = useUserStore()
  const baseUrl    = useBaseUrl()

  let count:number = 0
  const discontGroups          = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})  // Группы скидок. Отопбаржается только для аспекта
  const discontGroupSelected   = ref<ISimpleDictionary>()  // Выбранная группа скидок. Отопбаржается только для аспекта
  const discontGroupId         = ref<number>(0)            // Id Выбранной группа скидок. Отопбаржается только для аспекта

  const data                   = ref<IDocument<IInvertor>>({data:[], error: null, loading: true})  // Все инверторы
  const dataDisplay            = ref<IInvertor[]>([]) // Инверторы после фильтров

  const invAvalControl         = ref<IDocument<IInvAvalControl>>({data:[], error: null, loading: true})  // способ управления для серии
  const userInvDisount         = ref<IDocument<IUserDiscount>>({data:[], error: null, loading: true}) // скидка для пользователя
  const serieDiscounts         = ref<IDocument<IInvSerieDisount>>({data:[], error: null, loading: true}) // скидка для серий

  //------- модал выбора опций {
  const product               = ref<IInvertor>({id: 0, item: 0, serie: 0, input_voltage: 0, size: 0, type_of_break_module: 0, type_of_dc_drossel: 0, type_of_emc_drossel: 0, name: '', p_heavy_g: '', p_pumps_p: '', current_g: '', current_p: '', type_of_control: ''});
  const productDialog         = ref<boolean>(false);

  const openProduct = async (prod:IInvertor) => {
    product.value = {...prod}
    productDialog.value = true
  };
  //------- модал выбора опций }

  async function loadDiscounts() {
    if (user.isUser()) {
      userInvDisount.value = await useFetch('/data/UserInvDisount?user=' + user.getUser().userId.value); 
      discontGroupId.value = userInvDisount.value.data[0].group
    }
  }

  // function loadInvertors() {
  //   for (let i=2; i<=count/20 + 1; i++) {
  //     AxiosInstance.get('/users/invertors2?page=' + i.toString())
  //          .then(data2 => data.value.data.push(...data2.data.results))
  //   }
  // }

  async function loadData() {
    invAvalControl.value = await useFetch('/data/Inv_type_of_control')

    // загружаем первые 20 ПЧ
    // let res:any = await useFetch('users/invertors2?page=1')
    // count = res.data[0].count
    // data.value.data = res.data[0].results
    // data.value.loading = false

    data.value = await useFetch('/data/Invertors')

    count = data.value.data.length

    discontGroups.value  = await useFetch('/data/InvDisountGroup')
    await loadDiscounts()      
    dataDisplay.value = data.value.data
    // загружаем оставльные ПЧ фоном
    // loadInvertors()
  }

  watch(() => [user.userId], async () => {  await loadDiscounts()  })

  watch(discontGroupId, async () => {  
    serieDiscounts.value = await useFetch('data/InvSerieDisount/?group_id=' + discontGroupId.value) //  django   serieDiscounts.value = await useFetch('discounts/InvSerieDisount/?group=' + discontGroupId.value)
  })

  watch(discontGroupSelected, () => {  
    if (discontGroupSelected.value) {
      discontGroupId.value = discontGroupSelected.value.id
    }  
  })

  watch(() => [props.invInputVolage, props.invTypeOfControl, props.invEMC, props.invDC, props.invBreak, props.invVariantOfControl, props.error, props.power], (selection) => {
    dataDisplay.value = filterInvertors(data.value.data, invAvalControl.value.data, props.invInputVolage, props.invTypeOfControl, props.invVariantOfControl, props.invEMC, props.invDC, props.invBreak, props.power, props.error)
  })

  loadData()

</script> 

<template>
  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="data.loading">
    <div class="card flex justify-center">
        <ProgressSpinner style="width: 200px; height: 200px" strokeWidth="8" fill="transparent"
            animationDuration="2s" aria-label="Custom ProgressSpinner" />
    </div>
  </div>
  <div v-else>
    <div v-if="user.isStaff()" class="mt-5">
      <h3 class="font-bold">Группа скидок</h3>
      <SelectButton v-model="discontGroupSelected" class="bg-primary" :options="discontGroups.data" optionLabel="name"/>
    </div>
    <h1 class="mt-5 pt-5">Преобразователи частоты ({{ dataDisplay.length }}/{{ count }})</h1>
    <div v-if="dataDisplay.length > 0">
      <DataTable :value="dataDisplay" stripedRows tableStyle="min-width: 50rem" paginator :rows="20" :rowsPerPageOptions="[10, 20, 50]"> 
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
              <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ data.overload_g_mode }}</div> 
              <div v-if="data.overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ data.overload_p_mode }}</div>
          </template>
        </Column>
        <Column field="type_of_control_str"      header="Управление" headerStyle="width: 10em"></Column>
        <Column field="type_of_panel_str"        header="Панель" headerStyle="width: 10em"></Column>
        <Column header="Количество" field="quantity" sortable headerStyle="width: 5em">
          <template #body="{ data }">
            <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
            <div v-if="data.quantity<=0" class="font-bold text-xl w-full"><Tag :value="data.waiting_period" severity="warn" /></div>
          </template>
        </Column>
        <Column header="Цена" field="price" sortable headerStyle="width: 8em">
          <template #body="{ data }">
            <span v-if = "data.price == 0" ><Tag value="По запросу" severity="danger" /></span>
            <span v-else>
              <div v-if="user.isUser()">
                <OverlayBadge :value="`- ${getDiscountSerie(data.serie, serieDiscounts.data)} %`" severity="warn" v-if="!serieDiscounts.loading && !userInvDisount.loading">
                  <div class="surface-700 text-white font-bold text-xl line-through border-round m-2 flex align-items-center justify-content-center" style="min-width: 80px; min-height: 40px">
                    {{ priceFormat(data.price) }} &#8381;
                  </div>
                </OverlayBadge>
                <div class="bg-primary font-bold text-xl border-round m-2 flex align-items-center justify-content-center" style="min-width: 80px; min-height: 40px" v-if="!serieDiscounts.loading && !userInvDisount.loading">
                  {{ priceFormat(getInvPrice(data.price, data.serie, serieDiscounts.data)) }} &#8381;
                </div>
              </div>
              <div v-else>
                <div class="font-bold text-xl border-round m-2 flex align-items-center justify-content-center">
                    {{ priceFormat(data.price) }} &#8381;
                </div>
              </div>  
            </span>
          </template>
        </Column>
        <Column header="" headerStyle="width: 5em">
          <template #body="{ data }">
            <Button label="Выбрать" severity="help"  rounded class="mr-2" @click="openProduct(data)"/>
          </template>
        </Column>

      </DataTable>
    </div>
    <div v-else>
      <h1>Не найдено для заданных параметров</h1>
    </div>

    <SelectOptionsModal v-model:dialogOpened="productDialog" :invertor="product" :discontGroupId="discontGroupId"/> 
  </div>
</template>