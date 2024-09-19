<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import type { IDocument, IInvOption, IUserInvConfig, IUser, ICompanyUsers, ICompany, ISimpleDictionary } from '@/interfaces.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { RouterLink } from 'vue-router';
  import Button from 'primevue/button';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import ConfirmDialog from 'primevue/confirmdialog';
  import Toast from 'primevue/toast';
  import AxiosInstance from '@/api/axiosInstance';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import moment from 'moment'
  import { useUserStore } from '@/stores/user';
  import { FilterMatchMode } from '@primevue/core/api';
  import Checkbox from 'primevue/checkbox';
  import InputText from 'primevue/inputtext';
  import { saveLog } from '@/api/log';
  import { getOptionNames, getCompanyName } from '@/api/utils';

  const user         = useUserStore()
  const data         = ref<IDocument<IUserInvConfig>>({data:[], error: null, loading: true}) 
  const invertors    = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
  const options      = ref<IDocument<IInvOption>>({data:[], error: null, loading: true}) 
  const users        = ref<IDocument<IUser>>({data:[], error: null, loading: true}) 
  const companyUsers = ref<IDocument<ICompanyUsers>>({data:[], error: null, loading: true}) 
  const companies    = ref<IDocument<ICompany>>({data:[], error: null, loading: true}) 
  const userNames    = ref<string[]>([]) 
  const loading      = ref<boolean>(true)

  const confirm      = useConfirm();
  const toast        = useToast();

  async function loadData() {
    let url:string
    if (user.isUser()) {
      url = 'userconfigs/UserInvConfg/' // загружаем всё
    } else {
      url = 'userconfigs/UserInvConfg?user_id=' + String(user.userId) // загружаем только конфигурации пользователя
    }
    data.value            = await useFetch(url, {} ); 
    options.value         = await useFetch('Inv_options', {} );
    invertors.value       = await useFetch('Invertor_dict', {} );
    users.value           = await useFetch('UsersDict', {} );
    companyUsers.value    = await useFetch('CompanyUsers', {} );
    companies.value       = await useFetch('Companies', {} );

    users.value.data.map(item => userNames.value.push(item.first_name))

    loading.value = false

    saveLog(8, '')
  }

 
  loadData()

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

  const filters = ref({
    staff_opened: { value: null, matchMode: FilterMatchMode.EQUALS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS  }    
  });

</script> 

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Конфигурации преобразователей частоты ({{ data.data.length }})</h1>
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable :value="data.data" 
                  stripedRows 
                  tableStyle="min-width: 50rem" 
                  removableSort 
                  :loading="data.loading" 
                  paginator 
                  :rows="10" 
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  
                  v-model:filters="filters"
                  filterDisplay="row"
                  >
        <Column header="" field="staff_opened" v-if="user.isStaff()" style="width: 5%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-eye text-green-500': data.staff_opened, 'pi-eye-slash text-red-400': !data.staff_opened }"></i>
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary @change="filterCallback()" />
          </template>          
        </Column>
        <Column header="Номер" field="id" sortable style="width: 15%" v-if="user.isStaff()">
          <template #body="{ data }" >
            {{ data.user }}/{{ data.id }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать..." />
          </template>        
        </Column>
        <Column header="Заказчик"  sortable style="width: 15%" v-if="user.isStaff()">
          <template #body="{ data }">
            <div v-html="getCompanyName(companyUsers.data, companies.data, data.user, true)"></div>
          </template>
        </Column>
        <Column header="Преобразователь частоты" field="invertor" sortable style="width: 10%">
          <template #body="{ data }" >
            {{ getValueFromDictionary(invertors.data, data.invertor) }}
          </template>
        </Column>
        <Column field="options" header="Опции" width="">
          <template #body="{ data }" >
              <div v-html="getOptionNames(options.data, data.options)"></div>
          </template>
        </Column>
        <Column header="Дата конфигурации" field="date" sortable width="">
          <template #body="{ data }">
              {{  moment(data.date).format('DD.MM.YYYY') }}
          </template>
        </Column>
        <Column header="Комментарий" field="info" sortable width="">
        </Column>


        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/inv_config/?id=${slotProps.data.id}`">
                <Button icon="pi pi-folder-open" severity="info" />
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