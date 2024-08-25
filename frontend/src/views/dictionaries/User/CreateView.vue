<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import AxiosInstance from '@/api/axiosInstance';
    import type { IUser } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Checkbox from 'primevue/checkbox';
    import Password from 'primevue/password';
    import { useUserStore } from '@/stores/user';

    const router = useRouter()
    const user   = useUserStore()
    const data   = ref<IUser>({username:'', password:'', first_name:'', last_name:'', email:'', is_active:true, is_staff:false, is_superuser: false})
    const saving = ref<boolean>(false)

    const submission = async () => {
        saving.value = true
        const url:string =  'Users/' 
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.post(url, data.value, config)
          .then(function(response) {
          router.push('/dictionaries/Users/Update/' + response.data.id + '/')
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

</script>

<template>
    <h1 class="pt-5">Пользователь. Создание</h1>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="username" v-model="data.username" class="w-full"/>
                <label for="title">Логин</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Password id="password" v-model="data.password" class="w-full"/>
                <label for="title">Пароль</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="first_name" v-model="data.first_name" class="w-full"/>
                <label for="title">Имя</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="email" v-model="data.email" class="w-full"/>
                <label for="title">email</label>
            </FloatLabel>
        </div>

        <div class="card flex flex-wrap justify-center gap-4">
            <div class="flex items-center">
                    <Checkbox v-model="data.is_active" :binary="true" inputId="is_active"/>
                    <label for="is_active" class="ml-2">Активный</label>
            </div>

            <div class="flex items-center"  v-if="user.userIsSuperadmin">
                    <Checkbox v-model="data.is_staff" :binary="true" inputId="is_staff"/>
                    <label for="is_staff" class="ml-2">Сотрудник</label>
            </div>

            <div class="flex items-center" v-if="user.userIsSuperadmin">
                    <Checkbox v-model="data.is_superuser" :binary="true"  inputId="is_superuser" />
                    <label for="is_superuser" class="ml-2">Суперадмин</label>
            </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Users/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </template>


