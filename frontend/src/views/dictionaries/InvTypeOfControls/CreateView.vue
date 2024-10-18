<script setup lang="ts">
    import { ref } from 'vue'
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, IInvAvalControl, ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import MyAutocomplete from '@/components/MyAutocomplete.vue';
    import { useRouter } from 'vue-router';
    import { useFetch } from '@/api/useFetch';
    import { insertData } from '@/api/dataActions'

    const router    = useRouter()
    const series    = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
    const controls  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
    const serie     = ref<number>(0)
    const control   = ref<number>(0)
    const loading   = ref<boolean>(true)
    const saving    = ref<boolean>(false)


    const submission = async () => {
        saving.value = true

        await insertData('/data/Inv_type_of_control', {control_id: control.value, serie_id: serie.value})
          .then(function(response) {
            router.push('/dictionaries/InvTypeOfControls/List')
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

    async function loadData() {
        series.value   = await useFetch('/data/Inv_series_dict');
        controls.value = await useFetch('/data/Variants_of_control');
        loading.value  = false
    }
    
    loadData()


</script>

<template>

    <h1 class="pt-5">Способ управления для серии. Создание</h1>
        <div class="field pt-5">
            <MyAutocomplete :options="series.data" label="Серия" :value="serie" v-model="serie"/>
        </div>

        <div class="field pt-5">
            <MyAutocomplete :options="controls.data" label="Способ управления" :value="control" v-model="control"/>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvTypeOfControls/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
</template>


