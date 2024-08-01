<script setup lang="ts">
  import {ref} from 'vue'
  import type { ISimpleData, IPower } from '@/interfaces';

  import SelectSimpleList from '@/components/SelectSimpleList.vue';
  import SelectSimpleButton from '@/components/SelectSimpleButton.vue';
  import InventorsList from '@/components/InventorsList.vue';
  import SelectPower from '@/components/SelectPower.vue';


  const invInputVolage = ref<ISimpleData[]>()
  const invTypeOfControl = ref<ISimpleData[]>()
  const invVariantOfControl = ref<ISimpleData[]>()
  const invEMC = ref<ISimpleData[]>()
  const invDC = ref<ISimpleData[]>()
  const invBreak = ref<ISimpleData[]>()
  const invPower = ref<IPower>({power: '0', error: 10})
</script>

<template>
  <div class="grid">
    <div class="col">
        <SelectPower title="Мощность" v-model:power="invPower.power" v-model:error="invPower.error"/>
      </div>
    <div class="col">
      <SelectSimpleList url="Inv_input_voltage" title="Входное напряжение" v-model="invInputVolage"/>
    </div>
    <div class="col">
      <SelectSimpleList url="Type_of_control" title="Тип управления" v-model="invTypeOfControl"/>
    </div>
    <div class="col">
      <SelectSimpleList url="Variants_of_control" title="Способ управления" v-model="invVariantOfControl"/>
    </div>
  </div>
  <div class="grid">
    <div class="col">
      <SelectSimpleList url="Inv_EMC_drossel" title="ЕМС дроссель" v-model="invEMC"/>
    </div>
    <div class="col">
      <SelectSimpleList url="Inv_DC_drossel" title="DC дроссель" v-model="invDC"/>
    </div>
    <div class="col">
      <SelectSimpleList url="Inv_breake_module" title="Тормозной модуль" v-model="invBreak"/>
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

  <!-- <InventorsList :power="invPower.power" :error="invPower.error"/>     -->

</template>
