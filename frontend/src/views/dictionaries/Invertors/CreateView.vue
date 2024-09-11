<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData, IInvertor, IInvSerieData, ISimpleDictionary, IItem, IItemData } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import Listbox  from 'primevue/listbox';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import AutoComplete from 'primevue/autocomplete';
    import { useToast } from "primevue/usetoast";

    const data            = ref<IInvertor>({id:0, 
                                            item: 0, 
                                            serie: 0, 
                                            input_voltage: 0, 
                                            size: 0, 
                                            type_of_break_module: 0, 
                                            type_of_dc_drossel: 0, 
                                            type_of_emc_drossel: 0, 
                                            name: '', 
                                            p_heavy_g: '',
                                            p_pumps_p: '',
                                            current_g: '',
                                            current_p: '',
                                            type_of_control: ''})
    const items           = ref<IItemData>({data:[], error: null, loading: true})
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
    const item                = ref<IItem>({id:0, type: 0, name: '', quantity: 0, waiting_period: 0})
    const itemsDisplay        = ref<IItem[]>([]);


    const p_heavy_g           = ref<number>(0)
    const p_pumps_p           = ref<number>(0)
    const current_g           = ref<number>(0)
    const current_p           = ref<number>(0)

    const props = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast = useToast(); 
    const path = ref<string>('')      

    const loading = ref<boolean>(true)

    const submission = async () => {
        saving.value = true
        const url:string =  'Invertors/' 
        const config = { headers: { 'content-type': 'application/json', }, };

        const formData = new FormData();        

        formData.append("item", String(item.value.id))
        formData.append("name", data.value.name)
        formData.append("serie", String(invSerieData.value.id))
        formData.append("size", String(invSizeData.value.id))
        formData.append("type_of_emc_drossel", String(invEMCdata.value.id))
        formData.append("type_of_dc_drossel", String(invDCdata.value.id))
        formData.append("type_of_break_module", String(invBreakModuleData.value.id))
        formData.append("input_voltage", String(invInputVoltageData.value.id))
        formData.append("p_heavy_p", String(p_heavy_g.value))
        formData.append("p_pumps_p", String(p_pumps_p.value))
        formData.append("current_p", String(current_p.value))
        formData.append("current_g", String(current_g.value))

        const res = await AxiosInstance.post(url, formData, config)
          .then(function(response) {
          console.log(response);
          toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

    const search = (event:any) => {
        itemsDisplay.value = event.query ? items.value.data.filter((item) => item.id.toString().includes(event.query.toString())) : items.value.data;
    }    

    async function loadData() {
        items.value           = await useFetch('Items', {});
        series.value          = await useFetch('Inv_series_dict', {});
        invInputVoltage.value = await useFetch('Inv_input_voltage', {});
        sizes.value           = await useFetch('Inv_sizes_dict', {});
        invBreakModule.value  = await useFetch('Inv_breake_module', {});
        invDC.value           = await useFetch('Inv_DC_drossel', {});
        invEMC.value          = await useFetch('Inv_EMC_drossel', {});
        loading.value = false
    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Преобразователь частоты. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <AutoComplete v-model="item" dropdown :suggestions="itemsDisplay" optionLabel="id" placeholder="item" @complete="search" class="w-full md:w-56" />
                <label for="item">item</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invSerieData" :options="series.data" optionLabel="name" placeholder="Серия" class="w-full md:w-56" />
              <label for="serie">Серия</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invInputVoltageData" :options="invInputVoltage.data" optionLabel="name" placeholder="Входное напряжение" class="w-full md:w-56" />
              <label for="invInputVoltage">Входное напряжение</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="invSizeData" :options="sizes.data" optionLabel="name" placeholder="Входное напряжение" class="w-full md:w-56" />
              <label for="invInputVoltage">Размер</label>
            </FloatLabel>
        </div>

        <div class="grid pt-5">
            <div class="col">
              <label for="invInputVoltage">Тормозной модуль</label>
              <Listbox v-model="invBreakModuleData" :options="invBreakModule.data" optionLabel="name" placeholder="Тормозной модуль" class="w-full md:w-56" />
            </div>
            <div class="col">
              <label for="invInputVoltage">DC дроссель</label>
              <Listbox v-model="invDCdata" :options="invDC.data" optionLabel="name" placeholder="DC дроссель" class="w-full md:w-56" />
            </div>
            <div class="col">
              <label for="invInputVoltage">EMC дроссель</label>
              <Listbox  v-model="invEMCdata" :options="invEMC.data" optionLabel="name" placeholder="EMC дроссель" class="w-full md:w-56" />
            </div>
        </div>

        <div class="grid pt-5">
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="p_heavy_g" v-model="p_heavy_g" class="w-full"/>
                <label for="p_heavy_g">p_heavy_g</label>
              </FloatLabel>
              </div>
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="p_pumps_p" v-model="p_pumps_p" class="w-full"/>
                <label for="p_pumps_p">p_pumps_p</label>
              </FloatLabel>
            </div>
          </div>
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="current_g" v-model="current_g" class="w-full"/>
                <label for="current_g">current_g</label>
              </FloatLabel>
            </div>
            <div class="field pt-5">
                <FloatLabel>
                <InputNumber id="current_p" v-model="current_p" class="w-full"/>
                <label for="current_p">current_p</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Invertors/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


