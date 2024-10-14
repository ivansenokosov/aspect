<script setup lang="ts">
    import {ref} from 'vue'
    import axios from "axios";
    import { useBaseUrl } from '@/stores/baseUrl'
    import FileUpload from 'primevue/fileupload';
    import Button from 'primevue/button';

    const fileupload = ref();

    const upload = () => { console.log(fileupload.value);  fileupload.value.upload(); };
    const onUpload = () => { consoloe.log('file uploaded') };
    async function onFileSelect(event) {
        // const file = event.files[0];
        const formData = new FormData();
        console.log(event.files[0])
        formData.append("file", event.files[0]);
        await axios.post(`${baseUrl.baseUrl}/upload_inv_photo`, formData)
                    .then((res:any) => console.log(res.data))
                    .catch((err) => {
                                        console.log(err);
                                        message.value = err.response.data.error;
                                    })

        // const reader = new FileReader();

        // reader.onload = async (e) => {
        //     src.value = e.target.result;
        // };

        // reader.readAsDataURL(file);
    }

    const baseUrl = useBaseUrl()
    const message = ref<string>('')
    const file_input = ref<any>(null)

    const onSelect = () => {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            const file = file_input.value.files[0];

            if (!allowedTypes.includes(file.type)) {
                message.value = "Filetype is wrong!!";
            }
            if (file.size > 2000000) {
                message.value = "Too large, max size allowed is 2 mb";
            }
    }

    const onSubmit = async () => {
        const formData = new FormData();
        console.log(file_input.value.files[0])
        formData.append("file", file_input.value.files[0]);
        await axios.post(`${baseUrl.baseUrl}/upload_inv_photo`, formData)
                    .then((res:any) => console.log(res.data))
                    .catch((err) => {
                                        console.log(err);
                                        message.value = err.response.data.error;
                                    })
    }
    
  </script>
  

<template>
    <div class="file">
      <form @submit.prevent="onSubmit" enctype="multipart/form-data">
        <div class="fields">
          <label>Upload File</label><br />
          <input type="file" ref="file_input" @change="onSelect" />
        </div>
        <div class="fields">
          <button>Submit</button>
        </div>
        <div class="message">
          <h5>{{ message }}</h5>
        </div>
      </form>
    </div>

    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
    <!-- <FileUpload ref="fileupload" mode="basic" name="file[]" :url='`${baseUrl.baseUrl}/upload_inv_photo`' accept="image/*" :maxFileSize="2000000" @upload="onUpload" /> -->
    <!-- <Button label="Upload" @click="upload" severity="secondary" /> -->

  </template>
  
  