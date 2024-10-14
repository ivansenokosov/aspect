<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { IDocument, ICompanyUsers, ICompany, IFile, IUser } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import InputMask from 'primevue/inputmask';
    import { useBaseUrl } from '@/stores/baseUrl';
    import loadFile from '@/api/loadFile';
    import uploadFile from '@/api/uploadFile';
    import FileUpload from 'primevue/fileupload';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import { updateData } from '@/api/dataActions'
    import axios from 'axios'

    const baseUrl        = useBaseUrl()
    const data           = ref<IDocument<ICompany>>({data:[], error: null, loading: true})
    const props          = defineProps(['id'])
    const saving         = ref<boolean>(false)
    const toast          = useToast(); 
    const logo           = ref<IFile>()
    const companyUsers   = ref<IDocument<ICompanyUsers>>({data:[], error: null, loading: true})
    const usersAll       = ref<IDocument<IUser>>({data:[], error: null, loading: true})
    const users          = ref<IUser[]>([])
    const logo_filename  = ref<string>('')    

    async function onLogoSelect(event) {
        const formData = new FormData();
        formData.append("file", event.files[0]);
        await axios.post(`${baseUrl.baseUrl}/upload_logo`, formData)
                    .then((res:any) => logo_filename.value=`/logos/${res.data.file.filename}`)
                    .catch((err:any) => console.log(err))
    }

    const submission = async () => {
        saving.value = true

        const payload = {"name" : data.value.data[0].name,
                          "inn" : data.value.data[0].inn,
                          "address": data.value.data[0].address,
                          "agreement": data.value.data[0].agreement,
                          "email" : data.value.data[0].email,
                          "info" : data.value.data[0].info,
                          "logo": logo_filename.value,
                          "phone": data.value.data[0].phone}

        // logo.value.length>5 && logo.value.file_blob && formData.append("logo", logo.value.file_blob, String(logo.value.file_name))

        updateData(`/data/Companies/${props.id}`, payload)
          .then(function(response) {
//          console.log(response);
          toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 });
        }).catch(function(error) {
           console.log(error);
        })
        saving.value = false
    }

    const upload_logo = async (event:any) => { 
        logo.value = await uploadFile(event)
    }
    
    async function loadData() {
        data.value            = await useFetch(`/data/Companies/${props.id}`);
        companyUsers.value    = await useFetch(`/data/CompanyUsers?column=company&operator=equal&value=${props.id}`)
        usersAll.value        = await useFetch('/data/Users')
        usersAll.value.data.map(user => {
            companyUsers.value.data.map(cu => {
                if (user.id == cu.user) {
                    users.value.push(user)
                }
            })
        })

        if (data.value.data[0].logo) {
            logo.value = await loadFile(`${baseUrl.baseUrl}/${data.value.data[0].logo}`)
            logo_filename.value = data.value.data[0].logo
        }

    }
    
    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Организация. Редактирование</h1>
    <div v-if="data.loading">
        loading ...
    </div>
    <div v-else class="pt-5">

        <div class="formgrid grid">
            <div class="field col">

                <div class="field pt-5">
                    <div class="width:100%"><h3 class="font-semibold">Логотип</h3></div>
                    <img v-if="data.data[0].logo.length>5" v-bind:src="String(logo.file_base64data)" width="350">
                    <img v-else :src="`${baseUrl.baseUrl}/inv_series/no_photo.jpg`" width="350" height="262"/>
                    <FileUpload mode="basic" @select="onLogoSelect" @uploader="upload_logo" customUpload :auto="true" chooseLabel="Выбрать" severity="primary" />

                </div>
                
                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].name" class="w-full"/>
                        <label for="title">Наименование</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].inn" class="w-full"/>
                        <label for="title">ИНН</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].email" class="w-full"/>
                        <label for="title">email</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputMask id="title" v-model="data.data[0].phone"  mask="+7 (999) 999-99-99" fluid  class="w-full"/>
                        <label for="title">Телефон</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].address" class="w-full"/>
                        <label for="title">Адрес</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].agreement" class="w-full"/>
                        <label for="title">Договор</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data[0].info" class="w-full"/>
                        <label for="title">Примечение</label>
                    </FloatLabel>
                </div>

            </div>
            <div class="field col">
                <DataTable 
                :value="users" 
                stripedRows 
                tableStyle="min-width: 50rem" 
                :loading="data.loading" 
                paginator  
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]"
                >

        <Column field="username" header="login" sortable style="width: 15%">
          <template #body="{ data }">
              {{ data.username }}
          </template>
        </Column>
        <Column field="first_name"       header="Имя"     sortable style="width: 10%"></Column>
        <Column field="email"            header="email" sortable style="width: 10%"></Column>
        <Column field="is_staff"         header="Сотрудник" sortable style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_staff, 'pi-times text-red-400': !data.is_staff }"></i>
          </template>
        </Column>
        <Column field="is_active"        header="Активный"   sortable style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_active, 'pi-times text-red-400': !data.is_active }"></i>
          </template>
        </Column>
        <Column field="is_superuser"     header="Суперадмин"             style="width: 10%">
          <template #body="{ data }" >
            <i class="text-green-500 pi" :class="{ 'pi-check text-green-500': data.is_superuser, 'pi-times text-red-400': !data.is_superuser }"></i>
          </template>
        </Column>
        <Column header="Действия"> 
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/dictionaries/Users/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/dictionaries/Users/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>

      </DataTable>            </div>
        </div>



        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Companies/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


