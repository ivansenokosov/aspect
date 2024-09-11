<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router';
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IUserData } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import Checkbox from 'primevue/checkbox';

    const router = useRouter()
    const data   = ref<IUserData>({data:[], error: null, loading: true})

    const props = defineProps(['id'])

    const submission = async () => {
        const url:string =  'Users/' + props.id + '/'
        const config = { headers: { 'content-type': 'application/json', }, };

        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('/dictionaries/Users/List')
                     })
    }

    async function loadData() {
        data.value            = await useFetch('Users/' + props.id, {});
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Пользователь. Удалить?</h1>
    <div v-if="data.loading">
        loading ...
    </div>
    <div v-else class="pt-5">

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].username" disabled class="w-full"/>
                <label for="title">Логин</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].first_name" disabled class="w-full"/>
                <label for="title">Имя</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].email" disabled class="w-full"/>
                <label for="title">email</label>
            </FloatLabel>
        </div>

            <div class="card flex flex-wrap justify-center gap-4">
            <div class="flex items-center">
                    <Checkbox v-model="data.data[0].is_active" :binary="true" disabled inputId="is_active"/>
                    <label for="is_active" class="ml-2">Активный</label>
            </div>

            <div class="flex items-center">
                    <Checkbox v-model="data.data[0].is_staff" :binary="true" disabled inputId="is_staff"/>
                    <label for="is_staff" class="ml-2">Сотрудник</label>
            </div>

            <div class="flex items-center">
                    <Checkbox v-model="data.data[0].is_superuser" :binary="true" disabled inputId="is_superuser"/>
                    <label for="is_superuser" class="ml-2">Суперадмин</label>
            </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Users/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-times" iconPos="right" @click="submission"/>
        </div>
    </div>
</template>


