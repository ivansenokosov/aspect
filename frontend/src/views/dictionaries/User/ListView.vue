<script setup lang="ts">
  import { ref } from 'vue' 
  import { useFetch } from '@/api/useFetch';
  import { RouterLink } from 'vue-router';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { ICompanyData, ICompanyUsersData, IUserData, ICompanyUsers, ICompany } from '@/interfaces.js';
  
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  
  const data          = ref<IUserData>({data:[], error: null, loading: true}) 
  const companies     = ref<ICompanyData>({data:[], error: null, loading: true}) 
  const companyUsers  = ref<ICompanyUsersData>({data:[], error: null, loading: true}) 

  const loading       = ref<boolean>(true)

  async function loadData() {
    data.value            = await useFetch('Users', {} );
    companies.value       = await useFetch('Companies', {});
    companyUsers.value    = await useFetch('CompanyUsers', {});
    loading.value         = false        
  }

  function getCompanyName(userId:number) {
    const user     = ref<ICompanyUsers[]>([])
    const company  = ref<ICompany>()
    user.value = companyUsers.value.data.filter(item => item.user === userId) // находим строку CompanyUser для этого пользователя
    if (user.value.length > 0) { 
        company.value = companies.value.data.filter(item => item.id === user.value[0].company)[0]
        return company.value.name
    } 
    return ''
  }

  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },    
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });  

  loadData()
  
</script> 

<template>

  <div v-if="data.error">
    <h2>Error: {{ data.error }}</h2>
  </div>
  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Пользователи</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/dictionaries/Users/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data">
      <DataTable v-model:filters="filters" 
                :value="data.data" 
                stripedRows 
                tableStyle="min-width: 50rem" 
                :loading="data.loading" 
                filterDisplay="row" 
                paginator  
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                :globalFilterFields="['name']"
                >

        <Column field="username" header="login" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.username }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Искать" />
          </template>          
        </Column>
        <Column field="first_name"       header="Имя"     sortable style="width: 10%"></Column>
        <!-- <Column field="second_name"      header="second_name"   sortable style="width: 10%"></Column> -->
        <Column field="email"            header="email" sortable style="width: 10%"></Column>
        <Column field="is_staff"         header="Сотрудник" sortable style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_staff, 'pi-times text-red-400': !data.is_staff }"></i>
          </template>
        </Column>
        <Column field="is_active"        header="Активный"   sortable style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_active, 'pi-times text-red-400': !data.is_active }"></i>
          </template>
        </Column>
        <Column field="is_superuser"     header="Суперадмин"             style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_superuser, 'pi-times text-red-400': !data.is_superuser }"></i>
          </template>
        </Column>
        <Column header="Организация"             style="width: 10%" v-if="!companies.loading && !companyUsers.loading">
          <template #body="{ data }" >
            {{ getCompanyName(data.id) }}
          </template>
        </Column>


        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/Users/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/Users/Delete/${slotProps.data.id}`">
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