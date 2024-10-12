<script setup lang="ts">
    import { ref } from 'vue'
    import type { IInvOverload } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import { useRouter } from 'vue-router';
    import { insertData } from '@/api/dataActions';

    const router   = useRouter()
    const data     = ref<IInvOverload>({id:0, g_mode: '', p_mode: ''})
    const saving   = ref<boolean>(false)

    const submission = async () => {
        saving.value = true
        const url:string =  '/data/Inv_type_of_overload' 
        insertData(url,{"g_mode": data.value.g_mode, "p_mode": data.value.p_mode}).then(() => {
            router.push('/dictionaries/InvOverloads/List')
        })
        saving.value = false
    }

</script>

<template>

    <h1 class="pt-5">Прегрузка. Создание</h1>
        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.g_mode" class="w-full"/>
                <label for="title">Режим G</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.p_mode" class="w-full"/>
                <label for="title">Режим P</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvOverloads/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
</template>


