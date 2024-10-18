<script setup lang="ts">
  import {ref} from 'vue'
  import type { IPower, ISimpleDictionary } from '@/interfaces';
  import { saveLog } from '@/api/log';

  import SelectSimpleList from '@/components/SelectSimpleList.vue';
  import InventorsList from '@/components/InventorsList.vue';
  import SelectPower from '@/components/SelectPower.vue';

  const invInputVolage      = ref<ISimpleDictionary[]>([])
  const invTypeOfControl    = ref<ISimpleDictionary[]>([])
  const invVariantOfControl = ref<ISimpleDictionary[]>([])
  const invEMC              = ref<ISimpleDictionary[]>([])
  const invDC               = ref<ISimpleDictionary[]>([])
  const invBreak            = ref<ISimpleDictionary[]>([])
  const invPower            = ref<IPower>({id:0, power: '0', error: 10})

  saveLog(7, '')
</script>

<template>
  <div class="grid">
    <div class="col">
        <SelectPower title="Мощность" v-model:power="invPower.power" v-model:error="invPower.error"/>
      </div>
    <div class="col">
      <SelectSimpleList url="/data/Inv_input_voltage" title="Входное напряжение" v-model="invInputVolage"/>
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Type_of_control" title="Метод управления" v-model="invTypeOfControl"/>
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Variants_of_control" title="Способ управления" v-model="invVariantOfControl"/>
    </div>
  </div>
  <div class="grid">
    <div class="col">
      <SelectSimpleList url="/data/Inv_EMC_drossel" title="ЕМС дроссель" v-model="invEMC"/>
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Inv_DC_drossel" title="DC дроссель" v-model="invDC"/>
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Inv_breake_module" title="Тормозной модуль" v-model="invBreak"/>
    </div>
  </div>

  <InventorsList 
  :invInputVolage="invInputVolage"
  :invTypeOfControl="invTypeOfControl"
  :invVariantOfControl="invVariantOfControl"
  :invEMC="invEMC"
  :invDC="invDC"
  :invBreak="invBreak"
  :power="invPower.power" 
  :error="invPower.error"
  />    

</template>
