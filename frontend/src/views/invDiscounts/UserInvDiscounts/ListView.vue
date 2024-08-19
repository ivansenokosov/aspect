<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import { getValueFromDictionary } from '@/api/getValueFromDictionary';
  import type { ISimpleData, IUserDiscountData, IUserData } from '@/interfaces.js';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import ConfirmDialog from 'primevue/confirmdialog';
  import Toast from 'primevue/toast';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import AxiosInstance from '@/api/axiosInstance';


  const confirm = useConfirm();
  const toast = useToast();

  const data = ref<IUserDiscountData>({data:[], error: null, loading: true}) 
  const users = ref<IUserData>({data:[], error: null, loading: true})
  const groups = ref<ISimpleData>({data:[], error: null, loading: true})
  const loading = ref<boolean>(true)
  
  function confirm_delete (id:number) {
    confirm.require({
        message: 'Удалить скидку?',
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
           AxiosInstance.delete('discounts/UserInvDisount/'+id.toString(),{})
                     .then((res) => {
                      loadData()
                      toast.add({ severity: 'info', summary: 'Подтверждено', detail: 'Скидка удалена', life: 3000 });
                    })
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Отмена', detail: 'Действие отменено', life: 3000 });
        }
    });
  };


  async function loadData() {
    data.value = await useFetch('discounts/UserInvDisount', {} );
    users.value = await useFetch('Users', {} );
    groups.value = await useFetch('discounts/InvDisountGroup', {} );
    loading.value = false
  }

  loadData()
  
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
        <h1 class="pt-5">Скидки для пользователей</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink to="/invDiscounts/UserInvDiscounts/Create" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
      <DataTable :value="data.data" stripedRows tableStyle="min-width: 50rem" :loading="data.loading" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">

        <Column field="id" header="id">
          <template #body="{ data }">
              {{ data.id }}
          </template>
        </Column>
        <Column field="user" header="Пользователь">
          <template #body="{ data }">
            {{ getValueFromDictionary(users.data, data.user, 'first_name') }}
          </template>
        </Column>
        <Column field="group" header="Группа скидок">
          <template #body="{ data }">
              {{ getValueFromDictionary(groups.data, data.group) }}
          </template>
        </Column>
        <Column header="Действия"> 
          <template #body="{ data }">
            <div class="flex gap-2">
              <RouterLink :to="`/invDiscounts/UserInvDiscounts/Update/${data.id}/`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <Button icon="pi pi-trash" severity="danger" @click="confirm_delete(data.id)"/>
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

</template>
  
<style scoped>
    .input {width: 100%}
</style>