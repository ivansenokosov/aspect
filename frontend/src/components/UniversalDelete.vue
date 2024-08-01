<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRouter, useRoute  } from 'vue-router'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData } from '@/interfaces';
    import Button from 'primevue/button';
    import { getPath } from '@/api/getPath';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';

    const router = useRouter()
    const route = useRoute();
    const data = ref<ISimpleData>({data:[], error: null, loading: true})
    const props = defineProps(['url', 'id', 'title'])
    const path = ref<string>('')    


    const submission = () => {
        const url:string =  props.url + '/' + props.id
        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('/dictionaries/' + path.value + '/List')
                     })
    }

    async function loadData() {
        data.value = await useFetch(props.url + '/' + props.id, {});
        path.value = getPath(route.path)        
    }
    
    loadData()
</script>

<template>
    <h1 class="pt-5">{{ title }}. Удалить запись?</h1>
    <div v-if="data.loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <InputText id="id" v-model="data.data.id" disabled class="w-full"/>
                <label for="id">id</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data.name" disabled class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

                <div class="flex flex-wrap justify-center gap-4 pt-5">
                    <RouterLink :to="`/dictionaries/${path}/List`" rel="noopener">
                        <Button link label="Отменить" />
                    </RouterLink>
                    <Button label="Удалить" severity="danger" icon="pi pi-times" iconPos="right" @click="submission"/>
                </div>
    </div>
</template>


