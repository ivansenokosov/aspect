<script setup lang="ts">
    import {ref, watch} from 'vue'
    import InputNumber from 'primevue/inputnumber';
    import FloatLabel from 'primevue/floatlabel';
    import AutoComplete from 'primevue/autocomplete';
    import { powers } from '@/assets/powers';

    const props = defineProps(['title'])
    const power = defineModel<any>('power')
    const error = defineModel<number>('error')
    const range = ref<string>('')

    const powersDisplay = ref<Number[]>([]);

    const search = (event:any) => {
        powersDisplay.value = powers.filter((item) => item.toString().includes(event.query.replace(',','.')));
    }

    watch([power, error], () => {
        let d: number = 0
        if (error.value) {
            d = Number(power.value) * error.value / 100
        }
        const minPower:number = Number((Number(power.value) - d).toFixed(2))
        const maxPower:number = Number((Number(power.value) + d).toFixed(2))
        range.value = String(minPower) + ' - ' + String(maxPower)
    })

</script>

<template>
    <h3 class="font-bold">{{ title }}</h3>
    <div class="card flex justify-center">

        <div class="card flex flex-wrap gap-4">
            <div class="flex-auto mt-5">
                <FloatLabel>
                    <AutoComplete v-model="power" inputId="power" :suggestions="powersDisplay" @complete="search" dropdown /> 
                    <label for="power">Мощность</label>
                </FloatLabel>
                {{ range }}
            </div>
            <div class="flex-auto">
                <label for="deviation" class="block mb-2">Погрешность +/-</label>
                <InputNumber v-model="error" inputId="deviation" showButtons buttonLayout="horizontal" :step="0.25" suffix=" %" :min="0" :max="100" fluid>
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>        
            </div>
        </div>

    </div>
</template>