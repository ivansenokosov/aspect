<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import AxiosInstance from '@/api/axiosInstance';
    import type { ICompanyUsersData, ICompanyData, IFile, IUserData, IUser } from '@/interfaces';
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

    const baseUrl      = useBaseUrl()
    const data         = ref<ICompanyData>({data:[], error: null, loading: true})
    const props        = defineProps(['id'])
    const saving       = ref<boolean>(false)
    const toast        = useToast(); 
    const logo         = ref<IFile>()
    const companyUsers = ref<ICompanyUsersData>({data:[], error: null, loading: true})
    const usersAll     = ref<IUserData>({data:[], error: null, loading: true})
    const users        = ref<IUser[]>([])


    const submission = async () => {
        saving.value = true
        const url:string =  'Companies/' + props.id + '/'
        const config = { headers: { 'content-type': 'multipart/form-data', }, };

        const formData = new FormData();        

        formData.append("name", data.value.data.name)
        formData.append("inn", data.value.data.inn)
        formData.append("address", data.value.data.address)
        formData.append("agreement", data.value.data.agreement)
        formData.append("info", data.value.data.info)
        formData.append("phone", data.value.data.phone)
        formData.append("email", data.value.data.email)

        logo.value && formData.append("logo", logo.value.file_blob, logo.value.file_name)


        const res = await AxiosInstance.put(url, formData, config)
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
        data.value            = await useFetch('Companies/' + props.id, {});
        companyUsers.value    = await useFetch('CompanyUsers/?company=' + props.id, {})
        usersAll.value        = await useFetch('Users', {})
        usersAll.value.data.map(user => {
            companyUsers.value.data.map(cu => {
                if (user.id == cu.user) {
                    users.value.push(user)
                }
            })
        })


        if (data.value.data.logo) {
            logo.value = await loadFile(baseUrl.baseUrl + data.value.data.logo)
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
                    <img v-if="logo" v-bind:src="logo.file_base64data" width="350">
                    <img v-else :src="`${baseUrl.baseUrl}media/inv_series/no_photo.jpg`" width="350" height="262"/>
                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" customUpload @uploader="upload_logo" :auto="true" chooseLabel="Выбрать" />
                </div>
                
                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.name" class="w-full"/>
                        <label for="title">Наименование</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.inn" class="w-full"/>
                        <label for="title">ИНН</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.email" class="w-full"/>
                        <label for="title">email</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputMask id="title" v-model="data.data.phone"  mask="+7 (999) 999-99-99" fluid  class="w-full"/>
                        <label for="title">Телефон</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.address" class="w-full"/>
                        <label for="title">Адрес</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.agreement" class="w-full"/>
                        <label for="title">Договор</label>
                    </FloatLabel>
                </div>

                <div class="field pt-5">
                    <FloatLabel>
                        <InputText id="title" v-model="data.data.info" class="w-full"/>
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


