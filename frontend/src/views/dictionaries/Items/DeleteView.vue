<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData, ISimpleDictionary, IInvOptionData } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import Listbox from 'primevue/listbox';
    import { useRouter } from 'vue-router';

    const router          = useRouter()
    const series          = ref<ISimpleData>({data:[], error: null, loading: true})
    const invOption       = ref<IInvOptionData>({data:[], error: null, loading: true})
    const typeOfOption    = ref<ISimpleData>({data:[], error: null, loading: true})

    const optionForm      = ref<ISimpleDictionary>({name: '', id: 0})
    const seriesForm      = ref<ISimpleDictionary[]>([])

    const loading         = ref<boolean>(true)

    const props = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast = useToast(); 

    const submission = async () => {
        saving.value = true
        const url:string =  'Inv_options/' + props.id + '/'
        const config = { headers: { 'content-type': 'application/json', }, };


        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('dictionaries/InvOptions/List')
                     })
        saving.value = false
    }

    async function loadData() {
        invOption.value            = await useFetch('Inv_options/' + props.id, {});
        series.value               = await useFetch('Inv_series_dict', {});
        typeOfOption.value         = await useFetch('Type_of_options', {});

        seriesForm.value = series.value.data.filter(item => invOption.value.data[0].series.toString().includes(item.id.toString()))
        optionForm.value = typeOfOption.value.data.filter(item => invOption.value.data[0].option === item.id)[0]

        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Опция для преобразователя частоты. Удалить?</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <InputNumber id="id" v-model="invOption.data[0].id" disabled class="w-full"/>
                <label for="id">id</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="item" v-model="invOption.data[0].item" disabled class="w-full"/>
                <label for="id">item</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
              <label for="series">Серии</label>
              <Listbox v-model="seriesForm" :options="series.data" multiple disabled optionLabel="name" class="w-full md:w-56" listStyle="max-height:250px"/>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Select v-model="optionForm" :options="typeOfOption.data" disabled optionLabel="name" placeholder="Тип" class="w-full md:w-56" />
              <label for="id">Тип</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.data[0].name" disabled class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.data[0].full_title" disabled class="w-full"/>
                <label for="title">Наименование полное</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.data[0].short_title" disabled class="w-full"/>
                <label for="title">Наименование короткое</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvOptions/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


