<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, ISimpleDictionary, IInvInputOuptput } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import MyAutocomplete from '@/components/MyAutocomplete.vue';
    import { updateData } from '@/api/dataActions'

    const data    = ref<IDocument<IInvInputOuptput>>({data:[], error: null, loading: true}) // Входы/Выходы
    const signals = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Сигналы
    const series  = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) // Серии
    const signal  = ref<number>(0)
    const serie   = ref<number>(0)
    const loading = ref<boolean>(true)

    const props   = defineProps(['id'])
    const saving  = ref<boolean>(false)
    const toast   = useToast(); 

    const submission = async () => {
        saving.value = true

        const payload: IInvInputOuptput = {serie_id: serie.value, 
                                           signal_id: signal.value, 
                                           quantity: data.value.data[0].quantity}

        updateData(`/data/Inv_spec_of_in_out/${props.id}`, payload)
          .then(function(response) { toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 }); })
          .catch(function(error) { console.log(error); })
        saving.value = false
    }

    async function loadData() {
        data.value       = await useFetch(`/data/Inv_spec_of_in_out/${props.id}`);
        signals.value    = await useFetch('/data/Inv_type_of_signals');
        series.value     = await useFetch('/data/Inv_series_dict');
        serie.value      = data.value.data[0].serie_id
        signal.value     = data.value.data[0].signal_id
        loading.value    = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Входы/выходы управления. Редактирование</h1>
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
            <MyAutocomplete v-model="serie" :value="serie" label="Серия" :options="series.data"/>
        </div>

        <div class="field pt-5">
            <MyAutocomplete v-model="signal" :value="signal" label="Сигнал" :options="signals.data"/>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].quantity" class="w-full"/>
                <label for="title">Количество</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InputOutput/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


