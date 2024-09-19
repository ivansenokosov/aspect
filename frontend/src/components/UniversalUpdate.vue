<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRouter, useRoute  } from 'vue-router'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import { getPath } from '@/api/getPath';

    const route  = useRoute();
    const data   = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const props  = defineProps(['url', 'id', 'title'])
    const saving = ref<boolean>(false)
    const toast  = useToast(); 
    const path   = ref<string>('')      


    const submission = async () => {
        saving.value = true
        const url:string =  props.url + '/' + props.id + '/'
        const config = { headers: { 'content-type': 'application/json', }, };

        const formData = new FormData();        

        formData.append("name", data.value.data[0].name)

        const res = await AxiosInstance.put(url, formData, config)
          .then(function(response) {
//          console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
    }

    async function loadData() {
        data.value = await useFetch(props.url + '/' + props.id, {});
        path.value = getPath(route.path)        
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">{{ title }}. Редактирование</h1>
    <div v-if="data.loading">
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
                <InputText id="title" v-model="data.data[0].name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>



        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/${path}/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


