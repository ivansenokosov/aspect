<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData, IInvertorData, IInvSerieData, ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import Listbox  from 'primevue/listbox';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";

    const data            = ref<ISimpleData>({data:[], error: null, loading: true})
//    const items           = 
    const series          = ref<IInvSerieData>({data:[], error: null, loading: true})
    const invInputVoltage = ref<ISimpleData>({data:[], error: null, loading: true})
    const sizes           = ref<ISimpleData>({data:[], error: null, loading: true})
    const invBreakModule  = ref<ISimpleData>({data:[], error: null, loading: true})
    const invDC           = ref<ISimpleData>({data:[], error: null, loading: true})
    const invEMC          = ref<ISimpleData>({data:[], error: null, loading: true})

    const invDCdata           = ref<ISimpleDictionary>({name: '', id: 0})
    const invEMCdata          = ref<ISimpleDictionary>({name: '', id: 0})
    const invBreakModuleData  = ref<ISimpleDictionary>({name: '', id: 0})
    const invInputVoltageData = ref<ISimpleDictionary>({name: '', id: 0})
    const invSizeData         = ref<ISimpleDictionary>({name: '', id: 0})
    const invSerieData        = ref<ISimpleDictionary>({name: '', id: 0})

    const p_heavy_g           = ref<number>(0)
    const p_pumps_p           = ref<number>(0)
    const current_g           = ref<number>(0)
    const current_p           = ref<number>(0)

    const props = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast = useToast(); 
    const path = ref<string>('')      

    const submission = async () => {
        const url:string =  'Invertors/' + props.id + '/'
        const config = { headers: { 'content-type': 'application/json', }, };

        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('/dictionaries/' + path.value + '/List')
                     })
    }

    async function loadData() {
        data.value            = await useFetch('Invertors/' + props.id, {});
        series.value          = await useFetch('Inv_series_dict', {});
        invInputVoltage.value = await useFetch('Inv_input_voltage', {});
        sizes.value           = await useFetch('Inv_sizes_dict', {});
        invBreakModule.value  = await useFetch('Inv_breake_module', {});
        invDC.value           = await useFetch('Inv_DC_drossel', {});
        invEMC.value          = await useFetch('Inv_EMC_drossel', {});

        invSerieData.value        = series.value.data.filter(item => item.id === data.value.data.serie)[0]
        invDCdata.value           = invDC.value.data.filter(item => item.id === data.value.data.type_of_dc_drossel)[0]
        invEMCdata.value          = invEMC.value.data.filter(item => item.id === data.value.data.type_of_emc_drossel)[0]
        invBreakModuleData.value  = invBreakModule.value.data.filter(item => item.id === data.value.data.type_of_break_module)[0]
        invInputVoltageData.value = invInputVoltage.value.data.filter(item => item.id === data.value.data.input_voltage)[0]
        invSizeData.value         = sizes.value.data.filter(item => item.id === data.value.data.size)[0]

        p_heavy_g.value = Number(data.value.data.p_heavy_g)
        p_pumps_p.value = Number(data.value.data.p_pumps_p)
        current_g.value = Number(data.value.data.current_g)
        current_p.value = Number(data.value.data.current_p)
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Преобразователь частоты. Удалить?</h1>
    <div v-if="data.loading">
        loading ...
    </div>
    <div v-else class="pt-5">

        <div class="field pt-5">
            <FloatLabel>
                <InputNumber id="id" v-model="data.data.id" disabled class="w-full"/>
                <label for="id">id</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="item" v-model="data.data.item" disabled class="w-full"/>
                <label for="id">item</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.data.name" disabled class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invSerieData" :options="series.data" optionLabel="name" placeholder="Серия" disabled class="w-full md:w-56" />
              <label for="serie">Серия</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invInputVoltageData" :options="invInputVoltage.data" optionLabel="name" placeholder="Входное напряжение" disabled class="w-full md:w-56" />
              <label for="invInputVoltage">Входное напряжение</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invSizeData" :options="sizes.data" optionLabel="name" placeholder="Входное напряжение" disabled class="w-full md:w-56" />
              <label for="invInputVoltage">Размер</label>
            </FloatLabel>
        </div>

        <div class="grid pt-5">
            <div class="col">
              <label for="invInputVoltage">Тормозной модуль</label>
              <Listbox v-model="invBreakModuleData" :options="invBreakModule.data" optionLabel="name" placeholder="Тормозной модуль" disabled class="w-full md:w-56" />
            </div>
            <div class="col">
              <label for="invInputVoltage">DC дроссель</label>
              <Listbox v-model="invDCdata" :options="invDC.data" optionLabel="name" placeholder="DC дроссель" disabled class="w-full md:w-56" />
            </div>
            <div class="col">
              <label for="invInputVoltage">EMC дроссель</label>
              <Listbox  v-model="invEMCdata" :options="invEMC.data" optionLabel="name" placeholder="EMC дроссель" disabled class="w-full md:w-56" />
            </div>
        </div>

        <div class="grid pt-5">
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="p_heavy_g" v-model="p_heavy_g" disabled class="w-full"/>
                <label for="p_heavy_g">p_heavy_g</label>
              </FloatLabel>
              </div>
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="p_pumps_p" v-model="p_pumps_p" disabled class="w-full"/>
                <label for="p_pumps_p">p_pumps_p</label>
              </FloatLabel>
            </div>
          </div>
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="current_g" v-model="current_g" disabled class="w-full"/>
                <label for="current_g">current_g</label>
              </FloatLabel>
            </div>
            <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="current_p" v-model="current_p" disabled class="w-full"/>
                <label for="current_p">current_p</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Invertors/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-times" iconPos="right" @click="submission"/>
        </div>
    </div>
</template>


