<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import type {IDocument, ICompany} from '@/interfaces'
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import moment from 'moment'
    import axiosInstance from '@/api/axiosInstance'
    import FileUpload from 'primevue/fileupload';


    const date = new Date()
    const date2 = moment().format('YYYY-MM-DD');
    const fileupload = ref();

    const upload = () => {
        fileupload.value.upload();
    };

    const onUpload = () => {
        toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };
</script>

<template>

    <FileUpload ref="fileupload" mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
    <Button label="Upload" @click="upload" severity="secondary" />



    qqq
     {{  date.toISOString().split('T')[0] }}
     bb
     {{ date2 }}
</template>