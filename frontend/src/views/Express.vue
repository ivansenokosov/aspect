<script setup lang="ts">
    import {ref, onMounted} from 'vue'
    import type {IDocument, ICompany} from '@/interfaces'
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import axios from 'axios'
    import moment from 'moment'

    const date = new Date()
    const date2 = moment().format('YYYY-MM-DD');

</script>

<template>
    qqq
     {{  date.toISOString().split('T')[0] }}
     bb
     {{ date2 }}
</template>