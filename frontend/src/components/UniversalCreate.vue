<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink, useRouter, useRoute  } from 'vue-router'
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import { getPath } from '@/api/getPath';
    import { insertData } from '@/api/dataActions'


    const router = useRouter()
    const route  = useRoute();
    const data   = ref<ISimpleDictionary>({id:0, name:''})
    const props  = defineProps(['url', 'id', 'title'])
    const saving = ref<boolean>(false)
    const toast  = useToast(); 
    const path   = ref<string>('')          

    const submission = async () => {
        saving.value = true
        const url:string =  props.url

        await insertData(url, {name: data.value.name})
                .then(function(response) {
                        console.log('responnse', response)
                        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Запись создана', life: 3000 });
                        router.push('/dictionaries/' + path.value + '/List')
                    })
                .catch(function(error) {
                        console.log(error);
                    })

        saving.value = false
    }

    function loadData() {
        path.value = getPath(route.path) 
    }

    loadData()

</script>

<template>
    <Toast />
    <h1 class="pt-5">{{ title }}. Создание</h1>
    <div class="pt-5">

        <div class="field pt-5">
            <FloatLabel>        
                <InputText id="title" v-model="data.name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>



        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/${path}/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


