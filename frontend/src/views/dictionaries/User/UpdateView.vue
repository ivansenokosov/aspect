<script setup lang="ts">
    import { ref } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, IUser, ICompany, ICompanyUsers, IUserDiscount, ISimpleDictionary } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Toast from 'primevue/toast';
    import { useToast } from "primevue/usetoast";
    import { useUserStore } from '@/stores/user';
    import Checkbox from 'primevue/checkbox';
    import Password from 'primevue/password';
    import Select from 'primevue/select';
    import MyAutocomplete from '@/components/MyAutocomplete.vue';
    import { updateData, insertData } from '@/api/dataActions';

    const user             = useUserStore()
    const props            = defineProps(['id'])
    const toast            = useToast(); 

    const data             = ref<IDocument<IUser>>({data:[], error: null, loading: true})
    const companies        = ref<IDocument<ICompany>>({data:[], error: null, loading: true})
    const companyUsers     = ref<IDocument<ICompanyUsers>>({data:[], error: null, loading: true})
    const companyUser      = ref<ICompanyUsers>({user:0, company:0})
    const filtered         = ref<ICompanyUsers[]>([])
    const groups           = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 
    const group            = ref<ISimpleDictionary>()
    const userInvDiscounts = ref<IDocument<IUserDiscount>>({data:[], error: null, loading: true}) 
    const company          = ref<number>(0) // id организации пользователя из комбо

    const saving           = ref<boolean>(false)
    const loading          = ref<boolean>(true)

    const submission = async () => {
        saving.value = true
        const url:string  =  'Users/' + props.id + '/'
        const url2:string =  'discounts/UserInvDisount'

        updateData(url, data.value.data[0]).then(()=>{
            toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные пользователя обновлены', life: 3000 });
        })

        // проверяем наличие записи в CompanyUsers для этого пользователя
        if (company.value) {
            filtered.value = companyUsers.value.data.filter(item => item.user === Number(props.id))
            companyUser.value = {user: props.id, company: company.value}
            filtered.value.length > 0 ? updateData('CompanyUsers/' + filtered.value[0].id + '/', companyUser.value) : insertData('CompanyUsers/', companyUser.value)
        }

        //-------------------- Сохраняем группу скидок
        if (group.value) {
            const formData = {"user": props.id, "group": group.value.id.toString()}      

            userInvDiscounts.value.data.length>0 ? 
                updateData(url2 + '/' +  userInvDiscounts.value.data[0].id + '/', formData).then( () => {
                    toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные группы скидок обновлены', life: 3000 });
                }) 
                : 
                insertData(url2 + '/', formData)
        }

        saving.value = false
    }

    async function loadData() {
        data.value            = await useFetch('Users/' + props.id, {});
        companies.value       = await useFetch('Companies', {});
        companyUsers.value    = await useFetch('CompanyUsers', {});

        filtered.value        = companyUsers.value.data.filter(item => item.user === Number(props.id))
        if (filtered.value.length>0) {
            company.value = filtered.value[0].company
        }

        // Загражаем то, что нужно для группы скидок
        groups.value            = await useFetch('discounts/InvDisountGroup', {});
        userInvDiscounts.value  = await useFetch('discounts/UserInvDisount?user=' + props.id, {});
        if (userInvDiscounts.value.data.length > 0) {
            group.value = groups.value.data.filter(item => item.id === userInvDiscounts.value.data[0].group)[0]
        }

        loading.value         = false
    }

    loadData()
</script>

<template>
    <Toast />

    <h1 class="pt-5">Пользователь. Редактирование</h1>
    <div v-if="loading">
        loading ...
    </div>
    <div v-else class="pt-5">

      <div class="field pt-5">
            <FloatLabel>
                <InputText id="username" v-model="data.data[0].username" class="w-full"/>
                <label for="username">Логин</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Password id="password" v-model="data.data[0].password" class="w-full"/>
                <label for="password">Пароль</label>
            </FloatLabel>
        </div>


        <div class="field pt-5">
            <FloatLabel>
                <InputText id="first_name" v-model="data.data[0].first_name" class="w-full"/>
                <label for="first_name">Имя</label>
            </FloatLabel>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <InputText id="email" v-model="data.data[0].email" class="w-full"/>
                <label for="email">email</label>
            </FloatLabel>
        </div>

        <div class="card flex flex-wrap justify-center gap-4 pt-5">
            <div class="flex items-center">
                    <Checkbox v-model="data.data[0].is_active" :binary="true" inputId="is_active"/>
                    <label for="is_active" class="ml-2">Активный</label>
            </div>

            <div class="flex items-center" v-if="user.isSuperadmin()">
                    <Checkbox v-model="data.data[0].is_staff" :binary="true"  inputId="is_staff"/>
                    <label for="is_staff" class="ml-2">Сотрудник</label>
            </div>

            <div class="flex items-center" v-if="user.isSuperadmin()">
                    <Checkbox v-model="data.data[0].is_superuser" :binary="true"  inputId="is_superuser"/>
                    <label for="is_superuser" class="ml-2">Суперадмин</label>
            </div>
        </div>

        <div class="field pt-5">
            <MyAutocomplete v-model="company" :options="companies.data" :value="company" label="Организация"/>
        </div>

        <div class="field pt-5"> 
            <FloatLabel>
                <Select v-model="group" :options="groups.data" optionLabel="name" placeholder="Группа" class="w-full md:w-56" />
                <label for="group">Группа</label>
            </FloatLabel>
        </div>        


        <div class="flex flex-wrap justify-center gap-4 pt-5">
            <RouterLink :to="`/dictionaries/Users/List`" rel="noopener">
                <Button link label="Отменить" />
            </RouterLink>
            <Button label="Сохранить" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
        </div>
    </div>
</template>


