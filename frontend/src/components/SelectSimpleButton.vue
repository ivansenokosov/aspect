<script setup lang="ts">
    import {ref} from 'vue'
    import SelectButton from 'primevue/selectbutton';
    import Skeleton from 'primevue/skeleton';

    import { useFetch } from '@/api/useFetch';
    import type { IDocument, ISimpleDictionary } from '@/interfaces';

    const invInputVolage = ref<IDocument<ISimpleDictionary>>({data: [{name:'',id:0}], error: null, loading: true}) 
    const model          = defineModel<ISimpleDictionary[]>()
    const props          = defineProps(['url','title'])

    async function loadData() {
        invInputVolage.value = await useFetch(props.url,{})
        model.value = invInputVolage.value.data
    }

    loadData()
</script>

<template>
    <h3 class="font-bold">{{ title }}</h3>
    <div class="card flex justify-center" v-if="invInputVolage.loading">
        <Skeleton width="200" height="200"/>
    </div>
    <div class="card flex justify-center" v-else>
        <SelectButton v-model="model" :options="invInputVolage.data" optionLabel="name" multiple aria-labelledby="multiple" />
    </div>
</template>