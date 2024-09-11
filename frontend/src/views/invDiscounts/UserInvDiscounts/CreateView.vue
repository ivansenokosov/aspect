<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRouter } from 'vue-router'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IUserDiscountData, ISimpleData, ISimpleDictionary, IUser, IUserData } from '@/interfaces';
    import Button from 'primevue/button';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';

    const router          = useRouter()
    const data            = ref<IUserDiscountData>({data:[], error:null, loading: false})
    const users           = ref<IUserData>({data:[], error:null, loading: false})
    const user            = ref<IUser>({id:0, username: '', password: '', first_name : '', last_name: '', email: '', is_staff: false, is_active: false, is_superuser: false})
    const groups          = ref<ISimpleData>({data:[], error:null, loading: false})
    const group           = ref<ISimpleDictionary>({name: '', id: 0})
    const loading         = ref<boolean>(true)
    const saving          = ref<boolean>(false)

    const submission = async () => {
        saving.value = true
        const url:string =  'discounts/UserInvDisount/' 
        const config = { headers: { 'content-type': 'application/json', }, };

        const formData = new FormData();        

        formData.append("user",  String(user.value.id))
        formData.append("group", String(group.value.id))

        const res = await AxiosInstance.post(url, formData, config)
          .then(function(response) {
          console.log(response);
          router.push('/invDiscounts/UserInvDiscounts/List')
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

    async function loadData() {
        users.value           = await useFetch('UsersDict', {});
        groups.value          = await useFetch('discounts/InvDisountGroup', {});
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Назначение скидок. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <Select v-model="group" :options="groups.data" optionLabel="name" placeholder="Группа" class="w-full md:w-56" />
                <label for="group">Группа</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="user" :options="users.data" optionLabel="first_name" placeholder="Пользователь" class="w-full md:w-56" />
              <label for="title">Пользователь</label>
            </FloatLabel>
        </div>


        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink to="/invDiscounts/UserInvDiscounts/List" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


