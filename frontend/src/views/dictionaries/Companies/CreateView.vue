<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import AxiosInstance from '@/api/axiosInstance';
    import type { ICompany } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import InputMask from 'primevue/inputmask';

    const router = useRouter()
    const data   = ref<ICompany>({id: 0, name:'',inn:'',address:'',email:'',phone:'',info:'',agreement:''})
    const props  = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast  = useToast(); 
    const path   = ref<string>('')      

    const submission = async () => {
        saving.value = true
        const url:string =  'Companies/' 
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.post(url, data.value, config)
          .then(function(response) {
          toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
          router.push('/dictionaries/Companies/List')
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

</script>

<template>
    <Toast />

    <h1 class="pt-5">Организация. Создание</h1>

    <div class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.inn" class="w-full"/>
                <label for="title">ИНН</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.email" class="w-full"/>
                <label for="title">email</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputMask id="title" v-model="data.phone"  mask="+7 (999) 999-99-99" fluid  class="w-full"/>
                <label for="title">Телефон</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.address" class="w-full"/>
                <label for="title">Адрес</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.agreement" class="w-full"/>
                <label for="title">Договор</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.info" class="w-full"/>
                <label for="title">Примечение</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Companies/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


