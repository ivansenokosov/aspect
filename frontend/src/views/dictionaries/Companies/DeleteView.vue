<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router';
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, ICompany } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { deleteData } from '@/api/dataActions';

    const router = useRouter()
    const data   = ref<IDocument<ICompany>>({data:[], error: null, loading: true})
    const props = defineProps(['id'])

    const submission = async () => {
        const url:string =  `/data/Companies/${props.id}`
        deleteData(url).then(() =>{
            router.push('/dictionaries/Companies/List')
        })
    }

    async function loadData() {
        data.value            = await useFetch(`/data/Companies/${props.id}`);
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Организация. Удалить?</h1>
    <div v-if="data.loading">
        loading ...
    </div>
    <div v-else class="pt-5">

      <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].name" disabled class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].inn" disabled class="w-full"/>
                <label for="title">ИНН</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].email" disabled class="w-full"/>
                <label for="title">email</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].phone" disabled class="w-full"/>
                <label for="title">Телефон</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].address" disabled class="w-full"/>
                <label for="title">Адрес</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].agreement" disabled class="w-full"/>
                <label for="title">Договор</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data[0].info" disabled class="w-full"/>
                <label for="title">Примечение</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Invertors/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-times" iconPos="right" @click="submission"/>
        </div>
    </div>
</template>


