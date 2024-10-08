<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import type {IDocument, ICompany} from '@/interfaces'
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import axios from 'axios'

    const company   = ref<IDocument<ICompany>>([])
    const companies = ref<IDocument<ICompany[]>>([])

    onMounted(async () => {
        await axios.get('http://127.0.0.1:3000/data/companies/5')
               .then((res) => company.value = res.data)
               .catch((err) => console.log(err))

        await axios.get('http://127.0.0.1:3000/data/companies')
               .then((res) => companies.value = res.data)
               .catch((err) => console.log(err))


    })

    const update = async () => {
        await axios.put('http://127.0.0.1:3000/data/companies/5', company.value)
               .then((res) => console.log(res))
               .catch((err) => console.log(err))
    }

    const insert = async () => {
        await axios.post('http://127.0.0.1:3000/data/companies', company.value)
               .then((res) => console.log(res))
               .catch((err) => console.log(err))
    }

    const delete2 = async () => {
        await axios.delete('http://127.0.0.1:3000/data/companies/8')
               .then((res) => console.log(res))
               .catch((err) => console.log(err))
    }

</script>

<template>
    <h1>company</h1>
    {{ company }}
    <h1>companies</h1>
    {{ companies }}
    <h1>form</h1>
    <InputText v-model="company.name"/>
    <Button label="update" @click="update"/>
    <Button label="insert" @click="insert"/>
    <Button label="delete" @click="delete2"/>

</template>