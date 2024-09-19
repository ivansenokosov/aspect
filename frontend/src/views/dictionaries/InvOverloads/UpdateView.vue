<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, IInvOverload } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import { updateData } from '@/api/dataActions';

    const toast   = useToast(); 
    const props   = defineProps(['id'])
    const data    = ref<IDocument<IInvOverload>>({data:[], error: null, loading: true})
    const saving  = ref<boolean>(false)

    const submission = async () => {
        saving.value = true
        const url:string =  'Inv_type_of_overload/' + props.id + '/'
        updateData(url, {"p_mode":data.value.data[0].p_mode, "g_mode": data.value.data[0].g_mode}).then(() => {
            toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
        })
        saving.value = false
    }

    async function loadData() {
        data.value            = await useFetch('Inv_type_of_overload/' + props.id, {});
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Перегрузка. Редактирование</h1>
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
                <InputText id="title" v-model="data.data[0].g_mode" class="w-full"/>
                <label for="title">Режим G</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="item" v-model="data.data[0].p_mode" class="w-full"/>
                <label for="id">Режим P</label>
            </FloatLabel>
        </div>


        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvOverloads/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


