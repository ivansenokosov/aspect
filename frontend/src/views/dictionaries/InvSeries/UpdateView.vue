<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, IInvSerie, ISimpleDictionary, IFile } from '@/interfaces';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Select from 'primevue/select';
    import Toast from 'primevue/toast';
    import Textarea from 'primevue/textarea';
    import FileUpload from 'primevue/fileupload';
    import { useToast } from "primevue/usetoast";
    import { useBaseUrl } from '@/stores/baseUrl'
    import uploadFile from '@/api/uploadFile';
    import loadFile from '@/api/loadFile';
    import { updateData } from '@/api/dataActions'

    const baseUrl                = useBaseUrl()
    const toast                  = useToast(); 
    const props                  = defineProps(['id'])

    const data                   = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true})
    const manufactoryData        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const outputVoltageData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfControlData      = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfPanelData        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfOverloadData     = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const typeOfAccuracyFreqData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const ambientTemperatureData = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const levelIPData            = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})

    const manufactory            = ref<ISimpleDictionary>({name:'',id:0})
    const outputVoltage          = ref<ISimpleDictionary>({name:'',id:0})
    const typeOfControl          = ref<ISimpleDictionary>({name:'',id:0})
    const typeOfPanel            = ref<ISimpleDictionary>({name:'',id:0})
    const typeOfOverload         = ref<ISimpleDictionary>({name:'',id:0})
    const typeOfAccuracyFreq     = ref<ISimpleDictionary>({name:'',id:0})
    const ambientTemperature     = ref<ISimpleDictionary>({name:'',id:0})
    const levelIP                = ref<ISimpleDictionary>({name:'',id:0})
    const min_power              = ref<Number>()
    const max_power              = ref<Number>()
    const photo                  = ref<IFile>()
    const schema                 = ref<IFile>()
    const saving = ref<boolean>(false)

    const submission = async () => {
        saving.value = true

        const payload: IInvSerie = {name: data.value.data[0].name,
                                    description: data.value.data[0].description,
                                    manufactory: manufactory.value.id,
                                    output_voltage: outputVoltage.value.id,
                                    type_of_control: typeOfControl.value.id,
                                    type_of_panel: typeOfPanel.value.id,
                                    type_of_overload: typeOfOverload.value.id,
                                    type_of_accuracy_freq: typeOfAccuracyFreq.value.id,
                                    ambient_temperature: ambientTemperature.value.id,
                                    level_IP: levelIP.value.id,
                                    min_power: String(min_power.value),
                                    max_power: String(max_power.value),
                                    photo: '',
                                    schema: ''}

        // photo.value && photo.value.file_blob && formData.append("photo", photo.value.file_blob, String(photo.value.file_name))
        // schema.value && schema.value.file_blob && formData.append("schema", schema.value.file_blob, String(schema.value.file_name))

        updateData(`/data/Inv_series/${props.id}`, payload)
            .then(function(response) {
                          //          console.log(response);
                                    toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
                                    })
            .catch(function(error) {
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
        data.value                     = await useFetch(`/data/Inv_series/${props.id}`);
        manufactoryData.value          = await useFetch('/data/Manufactoty');
        outputVoltageData.value        = await useFetch('/data/Inv_output_voltage');
        typeOfControlData.value        = await useFetch('/data/Type_of_control');
        typeOfPanelData.value          = await useFetch('/data/Inv_type_of_panels');
        typeOfOverloadData.value       = await useFetch('/data/Inv_overload_dict');
        typeOfAccuracyFreqData.value   = await useFetch('/data/Inv_accurancy_frenq');
        ambientTemperatureData.value   = await useFetch('/data/Ambient_temperatures');
        levelIPData.value              = await useFetch('/data/Level_IP');

        manufactory.value              = manufactoryData.value.data.find(item => item.id === data.value.data[0].manufactory)!
        outputVoltage.value            = outputVoltageData.value.data.find(item => item.id === data.value.data[0].output_voltage)!
        typeOfControl.value            = typeOfControlData.value.data.find(item => item.id === data.value.data[0].type_of_control)!
        typeOfPanel.value              = typeOfPanelData.value.data.find(item => item.id === data.value.data[0].type_of_panel)!
        typeOfOverload.value           = typeOfOverloadData.value.data.find(item => item.id === data.value.data[0].type_of_overload)!

        typeOfAccuracyFreq.value       = typeOfAccuracyFreqData.value.data.find(item => item.id === data.value.data[0].type_of_accuracy_freq)!
        ambientTemperature.value       = ambientTemperatureData.value.data.find(item => item.id === data.value.data[0].ambient_temperature)!
        levelIP.value                  = levelIPData.value.data.find(item => item.id === data.value.data[0].level_IP)!

        min_power.value = Number(data.value.data[0].min_power)
        max_power.value = Number(data.value.data[0].max_power)

        if (data.value.data[0].photo) {
            photo.value = await loadFile(`${baseUrl.baseUrl}/${data.value.data[0].photo}`)
        }
        if (data.value.data[0].schema) {
            schema.value = await loadFile(`${baseUrl.baseUrl}/${data.value.data[0].schema}`)
        }

    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Серия преобразователя частоты. Редактирование</h1>
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
                <InputText id="title" v-model="data.data[0].name" class="w-full"/>
                <label for="title">Наименование</label>
            </FloatLabel>
        </div>

        <div class="field">

          <div class="grid">
              <div class="col-6">
                  <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
                  <img v-if="photo" v-bind:src="String(photo.file_base64data)" width="350">
                  <img v-else :src="`${baseUrl.baseUrl}/inv_series/no_photo.jpg`" width="350" height="262"/>
                  <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" customUpload @uploader="upload_photo" :auto="true" chooseLabel="Выбрать" />
              </div>
              <div class="col-6">
                <div class="width:100%"><h3 class="font-semibold">Схема</h3></div>
                <img v-if="schema" v-bind:src="String(schema.file_base64data)" width="350">
                <img v-else :src="`${baseUrl.baseUrl}/inv_series/no_photo.jpg`" width="350" height="262"/>
                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="10000000" customUpload @uploader="upload_schema" :auto="true" chooseLabel="Выбрать" />
              </div>
          </div>
        </div> 


        <div class="field pt-5">
            <FloatLabel>
                <Textarea id="description" v-model="data.data[0].description" class="w-full"/>
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
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


