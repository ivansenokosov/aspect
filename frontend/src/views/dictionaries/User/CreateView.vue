<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { Form, Field, ErrorMessage  } from 'vee-validate';
    import { useForm } from 'vee-validate';

    import AxiosInstance from '@/api/axiosInstance';
    import type { IUser } from '@/interfaces';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Checkbox from 'primevue/checkbox';
    import Password from 'primevue/password';
    import { useUserStore } from '@/stores/user';
    import * as Yup from 'yup';    

    const router = useRouter()
    const user   = useUserStore()
    // const { handleSubmit, setFieldError, setErrors } = useForm();
    const data   = ref<IUser>({username:'', password:'', first_name:'', last_name:'', email:'', is_active:true, is_staff:false, is_superuser: false})
    const saving = ref<boolean>(false)

    const schema = computed(() => { //Yup.object().shape({
        return Yup.object({
        username: Yup.string().required('Укажите имя пользователя'),
        password: Yup.string().required('Укажите пароль'),
        email: Yup.string().required('Укажите имейл').email('Это не имейл'),
    });
    })    

    async function submission (values : any, { setErrors }:any) {

        const { username, password } = values;
        console.log(values)

        console.log(username, password)

        saving.value = true
        const url:string =  'Users/' 
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.post(url, data.value, config)
          .then(function(response) {
          router.push('/dictionaries/Users/Update/' + response.data.id + '/')
        }).catch(function(error) {
          console.log(error);
          setErrors({ apiError: error })
        })
        saving.value = false
    }

</script>

<template>
    <h1 class="pt-5">Пользователь. Создание</h1>

    <Form @submit="submission" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="field pt-5">
            <FloatLabel>
                <Field name="username" v-slot="{ field, handleChange }">
                    <InputText name="username" v-model="field.value" @change="handleChange" :invalid="errors.username" class="w-full"/>
                </Field>
                <label for="username">Логин</label>
            </FloatLabel>
            <div class="text-red-500">{{errors.username}}</div>
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Field name="password" v-slot="{ field, handleChange }">
                    <Password name="password" 
                              v-model="field.value"
                              @change="handleChange"
                              :invalid="errors.password"
                              promptLabel="Укажите пароль" 
                              weakLabel="Слишком простой" 
                              mediumLabel="Средней сложности" 
                              strongLabel="Достаточно сложный" 
                              toggleMask />
                </Field>
                <label for="password">Пароль</label>
            </FloatLabel>
            <div class="text-red-500">{{errors.password}}</div>          

        </div>


        <div class="field pt-5">
            <FloatLabel>
                <Field name="first_name" v-slot="{ field, handleChange }">
                    <InputText name="first_name" v-model="field.value"  @change="handleChange" :invalid="errors.first_name" class="w-full"/>
                </Field>
                <label for="first_name">Имя</label>
            </FloatLabel>
            <div class="text-red-500">{{errors.first_name}}</div>     
        </div>

        <div class="field pt-5">
            <FloatLabel>
                <Field name="email" v-slot="{ field, handleChange }">
                    <InputText name="email" v-model="field.value" :invalid="errors.email" @change="handleChange" class="w-full"/>
                </Field>                                    
                <label for="email">email</label>
            </FloatLabel>
            <div class="text-red-500">{{errors.email}}</div>     
        </div>

        <div class="card flex flex-wrap justify-center gap-4">
            <div class="flex items-center">
                    <Checkbox v-model="data.is_active" :binary="true" inputId="is_active"/>
                    <label for="is_active" class="ml-2">Активный</label>
            </div>

            <div class="flex items-center"  v-if="user.userIsSuperadmin">
                    <Checkbox v-model="data.is_staff" :binary="true" inputId="is_staff"/>
                    <label for="is_staff" class="ml-2">Сотрудник</label>
            </div>

            <div class="flex items-center" v-if="user.userIsSuperadmin">
                    <Checkbox v-model="data.is_superuser" :binary="true"  inputId="is_superuser" />
                    <label for="is_superuser" class="ml-2">Суперадмин</label>
            </div>
        </div>

        <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{errors.apiError}}</div>
        
    </Form>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
        <RouterLink :to="`/dictionaries/Users/List`" rel="noopener">
            <Button link label="Отменить" />
        </RouterLink>
        <Button label="Создать" severity="success" icon="pi pi-check" iconPos="right" @click="submission" :loading="saving"/>
    </div>
</template>

