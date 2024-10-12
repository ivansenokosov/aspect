<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, ISimpleDictionary, IInvSerie, IItem, IInvOption } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Listbox from 'primevue/listbox';
    import AutoComplete from 'primevue/autocomplete';
    import { useRouter } from 'vue-router';
    import { insertData } from '@/api/dataActions';
    import MyAutocomplete from '@/components/MyAutocomplete.vue';

    const series          = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const items           = ref<IDocument<IItem>>({data:[], error: null, loading: true})
    const typeOfOption    = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const invOption       = ref<IInvOption>({id:0, item:0, name: '', short_title: '', full_title: '', series: 0, option: 0})
    const itemsDisplay    = ref<IItem[]>([]);
    const optionForm      = ref<ISimpleDictionary>({name: '', id: 0})
    const seriesForm      = ref<IInvSerie[]>([])
    const item            = ref<number>(0)    
    const loading         = ref<boolean>(true)
    const saving          = ref<boolean>(false)
    const router          = useRouter()

    const submission = async () => {
        saving.value = true
        const url:string =  '/data/Inv_options'
        const config = { headers: { 'content-type': 'application/json', }, };
        var seriesStr : String = ''

        seriesForm.value.map(item => seriesStr += item.id + ',')
        seriesStr = seriesStr.substring(0, seriesStr.length - 1)

        const formData = {"item"       : item.value.toString(),
                          "name"       : invOption.value.name,
                          "short_title": invOption.value.short_title,
                          "full_title" : invOption.value.full_title,
                          "series"     : seriesStr,
                          "option"     : String(optionForm.value.id)}

        insertData(url, formData).then((response:any) => {
            router.push(url + response.data.id)
        })
        saving.value = false
    }

    const search = (event: any) => {
        itemsDisplay.value = event.query ? items.value.data.filter((item) => item.id.toString().includes(event.query.toString())) : items.value.data;
    }    

    async function loadData() {
        series.value               = await useFetch('/data/Inv_series_dict');
        typeOfOption.value         = await useFetch('/data/Type_of_options');
        items.value                = await useFetch('/data/Items');
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <h1 class="pt-5">Опция для преобразователя частоты. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <MyAutocomplete v-model="item" optionLabel="id" :options="items.data" label="item" value="1"/>
            <!-- <FloatLabel>
                <AutoComplete v-model="itemForm" dropdown :suggestions="itemsDisplay" optionLabel="id" placeholder="item" @complete="search" class="w-full md:w-56" />
                <label for="item">item</label>
            </FloatLabel> -->
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


