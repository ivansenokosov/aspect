<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ICompany, ICompanyData, IUserData, ICompanyUsersData, ICompanyUsers } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import { useBaseUrl } from '@/stores/baseUrl';
    import Checkbox from 'primevue/checkbox';
    import Password from 'primevue/password';
    import AutoComplete from 'primevue/autocomplete';

    const baseUrl      = useBaseUrl()
    const data         = ref<IUserData>({data:[], error: null, loading: true})
    const companies    = ref<ICompanyData>({data:[], error: null, loading: true})
    const companyUsers = ref<ICompanyUsersData>({data:[], error: null, loading: true})
    const companyUser  = ref<ICompanyUsers>()
    const filtered     = ref<ICompanyUsers[]>([])
    const company      = ref<ICompany>()
    const props        = defineProps(['id'])
    const saving       = ref<boolean>(false)
    const toast        = useToast(); 
    const loading      = ref<boolean>(true)
    
    

    const submission = async () => {
        saving.value = true
        const url:string =  'Users/' + props.id + '/'
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.put(url, data.value.data, config)
          .then(function(response) {
          toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
        }).catch(function(error) {
          console.log(error);
        })

        // проверяем наличие записи в CompanyUsers для этого пользователя
        filtered.value = companyUsers.value.data.filter(item => item.user === Number(props.id))
        companyUser.value = {user: props.id, company: company.value.id}

        if (filtered.value.length > 0) { // нашли, обновляем
            const res = await AxiosInstance.put('CompanyUsers/' + filtered.value[0].id + '/', companyUser.value, config)
                                           .then(function(response) {
                                                // console.log(response)
                                               })
                                            .catch(function(error) {
                                                console.log(error);
                                            })
        } else { // не нашли, добавлям
            const res = await AxiosInstance.post('CompanyUsers/', companyUser.value, config)
                                           .then(function(response) {
                                                // console.log(response)
                                           })
                                           .catch(function(error) {
                                                console.log(error);
                                            })
        }

        saving.value = false
    }

    async function loadData() {
        data.value            = await useFetch('Users/' + props.id, {});
        companies.value       = await useFetch('Companies', {});
        companyUsers.value    = await useFetch('CompanyUsers', {});

        filtered.value = companyUsers.value.data.filter(item => item.user === Number(props.id))
        if (filtered.value.length > 0) { 
            company.value = companies.value.data.filter(item => item.id === filtered.value[0].company)[0]
        }

        loading.value         = false
    }

    const items = ref<ICompany[]>([]);
    const search = (event) => {
        items.value = event.query ? companies.value.data.filter(item => item.name.toUpperCase().includes(event.query.toUpperCase())) : companies.value.data;
    }    
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Пользователь. Редактирование</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">

      <div class="field pt-5">
            <FloatLabel>
                <InputText id="username" v-model="data.data.username" class="w-full"/>
                <label for="username">Логин</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Password id="password" v-model="data.data.password" class="w-full"/>
                <label for="password">Пароль</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="first_name" v-model="data.data.first_name" class="w-full"/>
                <label for="first_name">Имя</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="email" v-model="data.data.email" class="w-full"/>
                <label for="email">email</label>
            </FloatLabel>
        </div>

        <div class="card flex flex-wrap justify-center gap-4 pt-5">
            <div class="flex items-center">
                    <Checkbox v-model="data.data.is_active" :binary="true" inputId="is_active"/>
                    <label for="is_active" class="ml-2">Активный</label>
            </div>

            <div class="flex items-center">
                    <Checkbox v-model="data.data.is_staff" :binary="true"  inputId="is_staff"/>
                    <label for="is_staff" class="ml-2">Сотрудник</label>
            </div>

            <div class="flex items-center">
                    <Checkbox v-model="data.data.is_superuser" :binary="true"  inputId="is_superuser"/>
                    <label for="is_superuser" class="ml-2">Суперадмин</label>
            </div>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <AutoComplete v-model="company" dropdown :suggestions="items" @complete="search" optionLabel="name" class="w-full"/>
                <label for="email">Организация</label>
            </FloatLabel>
        </div>




        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Users/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


