<script setup lang="ts">
    import { ref } from 'vue'
    import Listbox from 'primevue/listbox';
    import Skeleton from 'primevue/skeleton';

    import { useFetch } from '@/api/useFetch';
    import type { IDocument, ISimpleData, ISimpleDictionary } from '@/interfaces';

    const data = ref<IDocument<ISimpleDictionary>>({data: [{name:'',id:0}], error: null, loading: true}) 
    const model = defineModel<ISimpleDictionary[]>()
    const props = defineProps(['url','title'])

    async function loadData() {
        data.value = await useFetch(props.url,{})
        model.value = data.value.data
    }

    loadData()
</script>

<template>
    <h3 class="font-bold">{{ title }}</h3>
    <div class="card flex justify-center" v-if="data.loading">
        <Skeleton width="200" height="200"/>
    </div>
    <div class="card flex justify-center" v-else>
        <Listbox v-model="model" :options="data.data" multiple checkmark optionLabel="name" class="w-full md:w-56" />
    </div>
</template>

