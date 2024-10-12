<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, IInvAvalControl, ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useRouter } from 'vue-router';
    import { getValueFromDictionary } from '@/api/getValueFromDictionary';

    const router    = useRouter()
    const data      = ref<IDocument<IInvAvalControl>>({data:[], error: null, loading: true})
    const series    = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
    const controls  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
    const loading   = ref<boolean>(true)

    const props     = defineProps(['id'])

    const submission = async () => {
        const url:string =  `/data/Inv_type_of_control/${props.id}`
        const config = { headers: { 'content-type': 'application/json', }, };

        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('/dictionaries/InvTypeOfControls/List')
                     })
    }

    async function loadData() {
        data.value     = await useFetch('/data/Inv_type_of_control');
        series.value   = await useFetch('/data/Inv_series_dict');
        controls.value = await useFetch('/data/Variants_of_control');
        loading.value  = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Способ управления для серии. Удалить?</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">

        <div class="field pt-5">
            <FloatLabel>
                <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full"/>
                <label for="id">id</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="item" v-model="data.data[0].serie" :value="getValueFromDictionary(series.data, data.data[0].serie)" disabled class="w-full"/>
                <label for="id">Серия</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="item" v-model="data.data[0].control" :value="getValueFromDictionary(controls.data, data.data[0].control)" disabled class="w-full"/>
                <label for="title">Способ упралвеия</label>
            </FloatLabel>
        </div>


        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvTypeOfControls/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-times" iconPos="right" @click="submission"/>
        </div>
    </div>
</template>


