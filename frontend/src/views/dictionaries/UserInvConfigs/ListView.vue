<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import type { ISimpleData, IInvOptionData, IUserInvConfigData, IUserData } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { RouterLink } from 'vue-router';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import ConfirmDialog from 'primevue/confirmdialog';
  import Toast from 'primevue/toast';
  import AxiosInstance from '@/api/axiosInstance';
  import ProgressBar from 'primevue/progressbar';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import moment from 'moment'
  
  const data = ref<IUserInvConfigData>({data:[], error: null, loading: true}) 
  const invertors = ref<ISimpleData>({data:[], error: null, loading: true}) 
  const options = ref<IInvOptionData>({data:[], error: null, loading: true}) 
  const users = ref<IUserData>({data:[], error: null, loading: true}) 

  const confirm = useConfirm();
  const toast = useToast();

  async function loadData() {
    data.value = await useFetch('userconfigs/UserInvConfg/', {} );
    options.value = await useFetch('Inv_options', {} );
    invertors.value = await useFetch('Invertor_dict', {} );
    users.value = await useFetch('Users', {} );
  }

  function getOptionNames<String>(selectedOptions:String) {
    const optionDict = ref<String[]>([])
    let result: String = ''
    optionDict.value = JSON.parse(selectedOptions)
    optionDict.value.map(item => {
      result = result + getValueFromDictionary(options.value.data, item) + '<br/>'
    })
    return(result)
  }

  function getUserName<String>(dictionary: any[], id: number) {
    const record = dictionary.filter(item => item.id === Number(id))[0]
    if (record) {
      return record.first_name
    } else {
      return 'не определено'
    }    
  }
 
  loadData()

  function rnd<Number>(){
    let r = (Math.random()*100).toFixed()
    return Number(r)
  }

  function confirm_delete (id:number) {
    confirm.require({
        message: 'Удалить эту конфигурацию?',
        header: 'Удаление',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отменить',
        rejectProps: {
            label: 'Отменить',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Удалить',
            severity: 'danger'
        },
        accept: () => {
           AxiosInstance.delete('userconfigs/UserInvConfg/'+id.toString(),{})
                     .then((res) => {
                      loadData()
                      toast.add({ severity: 'info', summary: 'Подтверждено', detail: 'Конфигурация удалена', life: 3000 });
                    })
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Отмена', detail: 'Действие отменено', life: 3000 });
        }
    });
  };

</script> 

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="data.loading || options.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Конфигурации</h1>
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem" :loading="data.loading" paginator  :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
        <Column header="Пользователь" sortable style="width: 15%">
          <template #body="{ data }" >
            {{ getUserName(users.data, data.user) }}
          </template>
        </Column>
        <Column header="Преобразователь частоты" sortable style="width: 10%">
          <template #body="{ data }" >
            {{ getValueFromDictionary(invertors.data, data.invertor) }}
          </template>
        </Column>
        <Column field="options" header="Опции" width="">
          <template #body="{ data }" >
              <div v-html="getOptionNames(data.options)"></div>
          </template>
        </Column>
        <Column header="Дата конфигурации" width="">
          <template #body="{ data }">
              {{  moment(data.date).format('DD.MM.YYYY') }}
          </template>
        </Column>
        <Column header="Состояние" width="">
          <template #body="{ data }">
              <ProgressBar :value="rnd()" :showValue="false" style="height: 6px"></ProgressBar>
          </template>
        </Column>

        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/inv_config/?id=${slotProps.data.id}`">
                <Button icon="pi pi-eye" severity="info" />
              </RouterLink>
              <Button icon="pi pi-trash" severity="danger" @click="confirm_delete(slotProps.data.id)"/>
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