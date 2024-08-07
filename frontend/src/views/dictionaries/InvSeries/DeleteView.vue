<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ISimpleData, IInvSerieData, ISimpleDictionary, IFile } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import Listbox  from 'primevue/listbox';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import Textarea from 'primevue/textarea';
    import FileUpload from 'primevue/fileupload';
    import { useToast } from "primevue/usetoast";
    import { useBaseUrl } from '@/stores/baseUrl'
    import uploadFile from '@/api/uploadFile';
    import loadFile from '@/api/loadFile';

    const baseUrl = useBaseUrl()

    const data                   = ref<IInvSerieData>({data:[], error: null, loading: true})
    const manufactoryData        = ref<ISimpleData>({data:[], error: null, loading: true})
    const outputVoltageData      = ref<ISimpleData>({data:[], error: null, loading: true})
    const typeOfControlData      = ref<ISimpleData>({data:[], error: null, loading: true})
    const typeOfPanelData        = ref<ISimpleData>({data:[], error: null, loading: true})
    const typeOfOverloadData     = ref<ISimpleData>({data:[], error: null, loading: true})
    const typeOfAccuracyFreqData = ref<ISimpleData>({data:[], error: null, loading: true})
    const ambientTemperatureData = ref<ISimpleData>({data:[], error: null, loading: true})
    const levelIPData            = ref<ISimpleData>({data:[], error: null, loading: true})

    const manufactory        = ref<ISimpleDictionary>()
    const outputVoltage      = ref<ISimpleDictionary>()
    const typeOfControl      = ref<ISimpleDictionary>()
    const typeOfPanel        = ref<ISimpleDictionary>()
    const typeOfOverload     = ref<ISimpleDictionary>()
    const typeOfAccuracyFreq = ref<ISimpleDictionary>()
    const ambientTemperature = ref<ISimpleDictionary>()
    const levelIP            = ref<ISimpleDictionary>()
    const min_power          = ref<Number>()
    const max_power          = ref<Number>()
    const photo              = ref<IFile>()
    const schema             = ref<IFile>()


    const props = defineProps(['id'])
    const saving = ref<boolean>(false)
    const toast = useToast(); 

    const submission = async () => {
        saving.value = true
        const url:string =  'Inv_series/' + props.id + '/'
        const config = { headers: { 'content-type': 'multipart/form-data', }, };

        AxiosInstance.delete(url,{})
                     .then((res) => {
                        router.push('dictionaries/InvSeries/List')
                     })
        saving.value = false
    }

    async function loadData() {
        data.value                     = await useFetch('Inv_series/' + props.id, {});
        manufactoryData.value          = await useFetch('Manufactoty', {} );
        outputVoltageData.value        = await useFetch('Inv_output_voltage', {} );
        typeOfControlData.value        = await useFetch('Type_of_control', {} );
        typeOfPanelData.value          = await useFetch('Inv_type_of_panels', {} );
        typeOfOverloadData.value       = await useFetch('Inv_overload_dict', {} );
        typeOfAccuracyFreqData.value   = await useFetch('Inv_accurancy_frenq', {} );
        ambientTemperatureData.value   = await useFetch('Ambient_temperatures', {} );
        levelIPData.value              = await useFetch('Level_IP', {} );

        manufactory.value              = manufactoryData.value.data.filter(item => item.id === data.value.data.manufactory)[0]
        outputVoltage.value            = outputVoltageData.value.data.filter(item => item.id === data.value.data.output_voltage)[0]
        typeOfControl.value            = typeOfControlData.value.data.filter(item => item.id === data.value.data.type_of_control)[0]
        typeOfPanel.value              = typeOfPanelData.value.data.filter(item => item.id === data.value.data.type_of_panel)[0]
        typeOfOverload.value           = typeOfOverloadData.value.data.filter(item => item.id === data.value.data.type_of_overload)[0]
        typeOfAccuracyFreq.value       = typeOfAccuracyFreqData.value.data.filter(item => item.id === data.value.data.type_of_accuracy_freq)[0]
        ambientTemperature.value       = ambientTemperatureData.value.data.filter(item => item.id === data.value.data.ambient_temperature)[0]
        levelIP.value                  = levelIPData.value.data.filter(item => item.id === data.value.data.level_IP)[0]

        min_power.value = Number(data.value.data.min_power)
        max_power.value = Number(data.value.data.max_power)

        if (data.value.data.photo) {
            photo.value = await loadFile(baseUrl.baseUrl + data.value.data.photo)
        }
        if (data.value.data.schema) {
            schema.value = await loadFile(baseUrl.baseUrl + data.value.data.schema)
        }

    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Серия преобразователя частоты. Удалить?</h1>
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
                <InputText id="title" v-model="data.data.name" disabled class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field">

          <div class="grid">
              <div class="col-6">
                  <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
                  <img v-if="photo" v-bind:src="photo.file_base64data" width="350">
                  <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
              </div>
              <div class="col-6">
                <div class="width:100%"><h3 class="font-semibold">Схема</h3></div>
                <img v-if="schema" v-bind:src="schema.file_base64data" width="350">
                <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
              </div>
          </div>
        </div> 


        <div class="field pt-5">
            <FloatLabel>
                <Textarea id="description" v-model="data.data.description" disabled class="w-full"/>
                <label for="title">Описание</label>
            </FloatLabel>
        </div>

        <div class="grid">
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                  <InputNumber id="min_power" v-model="min_power" disabled class="w-full"/>
                  <label for="min_power">Мощность минимальная</label>
                </FloatLabel>
              </div>
            </div>
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                  <InputNumber id="max_power" v-model="max_power" disabled class="w-full"/>
                  <label for="max_power">Мощность максимальная</label>
                </FloatLabel>
            </div>
          </div>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="manufactory" :options="manufactoryData.data" optionLabel="name" placeholder="Производитель" disabled class="w-full md:w-56" />
              <label for="serie">Производитель</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="outputVoltage" :options="outputVoltageData.data" optionLabel="name" placeholder="Выходное напряжение" disabled class="w-full md:w-56" />
              <label for="serie">Выходное напряжение</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfControl" :options="typeOfControlData.data" optionLabel="name" placeholder="Управление" disabled class="w-full md:w-56" />
              <label for="serie">Управление</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfOverload" :options="typeOfOverloadData.data" optionLabel="name" placeholder="Перегрузка" disabled class="w-full md:w-56" />
              <label for="serie">Перегрузка</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfAccuracyFreq" :options="typeOfAccuracyFreqData.data" optionLabel="name" placeholder="Точность регулирования" disabled class="w-full md:w-56" />
              <label for="serie">Точность регулирования</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="ambientTemperature" :options="ambientTemperatureData.data" optionLabel="name" placeholder="Допустимая температура окружающей среды" disabled class="w-full md:w-56" />
              <label for="serie">Допустимая температура окружающей среды</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="levelIP" :options="levelIPData.data" optionLabel="name" placeholder="Допустимая температура окружающей среды" disabled class="w-full md:w-56" />
              <label for="serie">Уровень защиты</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvSeries/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Удалить" severity="danger" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


