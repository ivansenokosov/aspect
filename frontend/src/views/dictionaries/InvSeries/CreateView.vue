<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, ISimpleDictionary, IFile, IInvSerie } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Textarea from 'primevue/textarea';
    import FileUpload from 'primevue/fileupload';
    import { useBaseUrl } from '@/stores/baseUrl'
    import uploadFile from '@/api/uploadFile';
    import { useRouter } from 'vue-router';

    const baseUrl                = useBaseUrl()
    const router                 = useRouter()

    const data                   = ref<IInvSerie>({id:0, name: '', 
                                                   description: '', 
                                                   manufactory: 0, 
                                                   output_voltage: 0, 
                                                   type_of_control: 0, 
                                                   type_of_panel: 0, 
                                                   type_of_overload: 0, 
                                                   type_of_accuracy_freq: 0, 
                                                   ambient_temperature: 0,
                                                   level_IP: 0,
                                                   min_power: '',
                                                   max_power: '',
                                                   photo: '',
                                                   schema: ''})
    const manufactoryData        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const outputVoltageData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfControlData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfPanelData        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfOverloadData     = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfAccuracyFreqData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const ambientTemperatureData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const levelIPData            = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})

    const manufactory            = ref<ISimpleDictionary>({name:'', id:0})
    const outputVoltage          = ref<ISimpleDictionary>({name:'', id:0})
    const typeOfControl          = ref<ISimpleDictionary>({name:'', id:0})
    const typeOfPanel            = ref<ISimpleDictionary>({name:'', id:0})
    const typeOfOverload         = ref<ISimpleDictionary>({name:'', id:0})
    const typeOfAccuracyFreq     = ref<ISimpleDictionary>({name:'', id:0})
    const ambientTemperature     = ref<ISimpleDictionary>({name:'', id:0})
    const levelIP                = ref<ISimpleDictionary>({name:'', id:0})
    const min_power              = ref<number>()
    const max_power              = ref<number>()
    const photo                  = ref<IFile>()
    const schema                 = ref<IFile>()
    const saving                 = ref<boolean>(false)
    const loading                = ref<boolean>(true)

    const submission = async () => {
        saving.value = true
        const url:string =  'Inv_series/'
        const config = { headers: { 'content-type': 'multipart/form-data', }, };

        const formData = new FormData();        

        formData.append("name", data.value.name)
        formData.append("description", data.value.description)
        formData.append("manufactory", String(manufactory.value.id))
        formData.append("output_voltage", String(outputVoltage.value.id))
        formData.append("type_of_control", String(typeOfControl.value.id))
        formData.append("type_of_panel", String(typeOfPanel.value.id))
        formData.append("type_of_overload", String(typeOfOverload.value.id))
        formData.append("type_of_accuracy_freq", String(typeOfAccuracyFreq.value.id))
        formData.append("ambient_temperature", String(ambientTemperature.value.id))
        formData.append("level_IP", String(levelIP.value.id))
        formData.append("min_power", String(min_power.value))
        formData.append("max_power", String(max_power.value))
    
        photo.value && photo.value.file_blob && formData.append("photo", photo.value.file_blob, String(photo.value.file_name))
        schema.value && schema.value.file_blob && formData.append("schema", schema.value.file_blob, String(schema.value.file_name))

        const res = await AxiosInstance.post(url, formData, config)
          .then(function(response) {
            router.push('Inv_series/' + response.data.id)
        }).catch(function(error) {
          console.log(error);
        })
        saving.value = false
    }

    const upload_photo = async (event:any) => { 
        photo.value = await uploadFile(event)
    }
    const upload_schema = async (event:any) => { 
        schema.value = await uploadFile(event)
    }

    async function loadData() {
        manufactoryData.value          = await useFetch('Manufactoty');
        outputVoltageData.value        = await useFetch('Inv_output_voltage');
        typeOfControlData.value        = await useFetch('Type_of_control');
        typeOfPanelData.value          = await useFetch('Inv_type_of_panels');
        typeOfOverloadData.value       = await useFetch('Inv_overload_dict');
        typeOfAccuracyFreqData.value   = await useFetch('Inv_accurancy_frenq');
        ambientTemperatureData.value   = await useFetch('Ambient_temperatures');
        levelIPData.value              = await useFetch('Level_IP');
        loading.value = false
    }
    
    loadData()
</script>

<template>

    <h1 class="pt-5">Серия преобразователя частоты. Создание</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">
        <div class="field pt-5">
            <FloatLabel>
                <InputText id="title" v-model="data.name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field">

          <div class="grid">
              <div class="col-6">
                  <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
                  <img v-if="photo" v-bind:src="String(photo.file_base64data)" width="350">
                  <img v-else :src='`${baseUrl.baseUrl}/media/inv_series/no_photo.jpg`' width="350" height="262"/>
                  <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" customUpload @uploader="upload_photo" :auto="true" chooseLabel="Выбрать" />
              </div>
              <div class="col-6">
                <div class="width:100%"><h3 class="font-semibold">Схема</h3></div>
                <img v-if="schema" v-bind:src="String(schema.file_base64data)" width="350">
                <img v-else :src='`${baseUrl.baseUrl}/media/inv_series/no_photo.jpg`' width="350" height="262"/>
                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="10000000" customUpload @uploader="upload_schema" :auto="true" chooseLabel="Выбрать" />
              </div>
          </div>
        </div> 


        <div class="field pt-5">
            <FloatLabel>
                <Textarea id="description" v-model="data.description" class="w-full"/>
                <label for="title">Описание</label>
            </FloatLabel>
        </div>

        <div class="grid">
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                  <InputNumber id="min_power" v-model="min_power" class="w-full"/>
                  <label for="min_power">Мощность минимальная</label>
                </FloatLabel>
              </div>
            </div>
            <div class="col">
              <div class="field pt-5">
                <FloatLabel>
                  <InputNumber id="max_power" v-model="max_power" class="w-full"/>
                  <label for="max_power">Мощность максимальная</label>
                </FloatLabel>
            </div>
          </div>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="manufactory" :options="manufactoryData.data" optionLabel="name" placeholder="Производитель" class="w-full md:w-56" />
              <label for="serie">Производитель</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="outputVoltage" :options="outputVoltageData.data" optionLabel="name" placeholder="Выходное напряжение" class="w-full md:w-56" />
              <label for="serie">Выходное напряжение</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfControl" :options="typeOfControlData.data" optionLabel="name" placeholder="Управление" class="w-full md:w-56" />
              <label for="serie">Управление</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfOverload" :options="typeOfOverloadData.data" optionLabel="name" placeholder="Перегрузка" class="w-full md:w-56" />
              <label for="serie">Перегрузка</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfPanel" :options="typeOfPanelData.data" optionLabel="name" placeholder="Панель" class="w-full md:w-56" />
              <label for="serie">Панель</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="typeOfAccuracyFreq" :options="typeOfAccuracyFreqData.data" optionLabel="name" placeholder="Точность регулирования" class="w-full md:w-56" />
              <label for="serie">Точность регулирования</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="ambientTemperature" :options="ambientTemperatureData.data" optionLabel="name" placeholder="Допустимая температура окружающей среды" class="w-full md:w-56" />
              <label for="serie">Допустимая температура окружающей среды</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
              <Select v-model="levelIP" :options="levelIPData.data" optionLabel="name" placeholder="Допустимая температура окружающей среды" class="w-full md:w-56" />
              <label for="serie">Уровень защиты</label>
            </FloatLabel>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/InvSeries/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


