<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, ISimpleDictionary, IInvInputOuptput } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import MyAutocomplete from '@/components/MyAutocomplete.vue';
    import { useRouter } from 'vue-router';

    const data    = ref<IInvInputOuptput>({id:0, serie:0, signal:0, quantity:0, info:''}) // Входы/Выходы
    const signals = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Сигналы
    const series  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Серии
    const signal  = ref<number>(0)
    const serie   = ref<number>(0)
    const loading = ref<boolean>(true)

    const saving  = ref<boolean>(false)
    const toast   = useToast(); 
    const router  = useRouter()

    const submission = async () => {
        saving.value = true
        const url:string =  '/data/Inv_spec_of_in_out'
        const config = { headers: { 'content-type': 'application/json', }, };
        const res = await AxiosInstance.post(url, {"serie": serie.value, "signal": signal.value, "quantity": data.value.quantity, info: ''}, config)
          .then(function(response) {
          router.push('/dictionaries/InputOutput/List')
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }


    async function loadData() {
        signals.value    = await useFetch('/data/Inv_type_of_signals');
        series.value     = await useFetch('/data/Inv_series_dict');
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Входы/выходы управления. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <MyAutocomplete v-model="serie" :value="serie" label="Серия" :options="series.data"/>
        </div>

        <div class="field pt-5">
            <MyAutocomplete v-model="signal" :value="signal" label="Сигнал" :options="signals.data"/>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.quantity" class="w-full"/>
                <label for="title">Количество</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink to="/dictionaries/InputOutput/List" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


