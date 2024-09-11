<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData, ISimpleDictionary, IInvSerie, IInvOptionData, IItemData, IItem, IInvOption } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import Listbox from 'primevue/listbox';
    import AutoComplete from 'primevue/autocomplete';

    const series          = ref<ISimpleData>({data:[], error: null, loading: true})
    const invOption       = ref<IInvOption>({id:0, item:0, name: '', short_title: '', full_title: '', series: 0, option: 0})
    const typeOfOption    = ref<ISimpleData>({data:[], error: null, loading: true})
    const items           = ref<IItemData>({data:[], error: null, loading: true})
    const itemsDisplay    = ref<IItem[]>([]);

    const optionForm      = ref<ISimpleDictionary>({name: '', id: 0})
    const seriesForm      = ref<IInvSerie[]>([])
    const itemForm        = ref<IItem>({id:0, type: 0, name: '', quantity: 0, waiting_period: 0})    

    const loading         = ref<boolean>(true)

    const props = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast = useToast(); 

    const submission = async () => {
        saving.value = true
        const url:string =  'Inv_options/'
        const config = { headers: { 'content-type': 'application/json', }, };
        var seriesStr : String = ''

        seriesForm.value.map(item => seriesStr += item.id + ',')
        seriesStr = seriesStr.substring(0, seriesStr.length - 1)

        const formData = new FormData();        

        formData.append("item",        String(itemForm.value.id))
        formData.append("name",        invOption.value.name)
        formData.append("short_title", invOption.value.short_title)
        formData.append("full_title",  invOption.value.full_title)
        formData.append("series",      String(seriesStr))
        formData.append("option",      String(optionForm.value.id))

        const res = await AxiosInstance.post(url, formData, config)
          .then(function(response) {
          // console.log(response);
          toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

    const search = (event: any) => {
        itemsDisplay.value = event.query ? items.value.data.filter((item) => item.id.toString().includes(event.query.toString())) : items.value.data;
    }    

    async function loadData() {
        series.value               = await useFetch('Inv_series_dict', {});
        typeOfOption.value         = await useFetch('Type_of_options', {});
        items.value                = await useFetch('Items', {});
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Опция для преобразователя частоты. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <AutoComplete v-model="itemForm" dropdown :suggestions="itemsDisplay" optionLabel="id" placeholder="item" @complete="search" class="w-full md:w-56" />
                <label for="item">item</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
              <label for="series">Серии</label>
              <Listbox v-model="seriesForm" :options="series.data" multiple optionLabel="name" class="w-full md:w-56" listStyle="max-height:250px"/>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Select v-model="optionForm" :options="typeOfOption.data" optionLabel="name" placeholder="Тип" class="w-full md:w-56" />
              <label for="id">Тип</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.full_title" class="w-full"/>
                <label for="title">Наименование полное</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="invOption.short_title" class="w-full"/>
                <label for="title">Наименование короткое</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvOptions/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


