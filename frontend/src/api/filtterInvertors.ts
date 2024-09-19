import { ref } from 'vue'
import type { ISimpleDictionary, IInvertor, IInvAvalControl } from "@/interfaces";

export function filterInvertors(data               : IInvertor[],
                                invAvalControl     : IInvAvalControl[],
                                invInputVolage     : ISimpleDictionary[],
                                invTypeOfControl   : ISimpleDictionary[],
                                invVariantOfControl: ISimpleDictionary[],
                                invEMC             : ISimpleDictionary[],
                                invDC              : ISimpleDictionary[],
                                invBreak           : ISimpleDictionary[],
                                power              : string,
                                error              : number):IInvertor[] {

    const dataDisplay            = ref<IInvertor[]>([]) // Инверторы после фильтров
    const invInputVolageStr      = ref<string>('')
    const invTypeOfControlStr    = ref<string>('')
    const invVariantOfControlStr = ref<string>('') 
    const invEMCStr              = ref<string>('')
    const invDCStr               = ref<string>('')
    const invBreakStr            = ref<string>('')
  
    const d:number = Number(power) * error / 100
    const minPower:number = Number(power) - d
    const maxPower:number = Number(power) + d

    invInputVolage && (invInputVolageStr.value           = JSON.stringify(invInputVolage.map((a:ISimpleDictionary) => a.id.toString())))
    invTypeOfControl && (invTypeOfControlStr.value       = JSON.stringify(invTypeOfControl.map((a:ISimpleDictionary) => a.id.toString())))
    invEMC && (invEMCStr.value                           = JSON.stringify(invEMC.map((a:ISimpleDictionary) => a.id.toString())))
    invDC && (invDCStr.value                             = JSON.stringify(invDC.map((a:ISimpleDictionary) => a.id.toString())))
    invBreak && (invBreakStr.value                       = JSON.stringify(invBreak.map((a:ISimpleDictionary) => a.id.toString())))
    invVariantOfControl && (invVariantOfControlStr.value = JSON.stringify(invVariantOfControl.map((a:ISimpleDictionary) => a.id.toString())))
    // // снчала фильтруем список возможных вариантов контроля для серии
    const aval = invAvalControl.filter((item) => invVariantOfControlStr.value.includes(item.control.toString()) )
    // формируем строку из доступных серий
    const avalSeriesStr = aval.map(a => a.serie.toString())

    dataDisplay.value = data.filter((item) => (((Number(item.p_heavy_g.replace(',','.')) >= minPower && Number(item.p_heavy_g.replace(',','.')) <= maxPower) || (Number(item.p_pumps_p.replace(',','.')) >= minPower && Number(item.p_pumps_p.replace(',','.')) <= maxPower))
                                                      && invInputVolageStr.value.includes(item.input_voltage.toString()) 
                                                      && invTypeOfControlStr.value.includes(item.type_of_control.toString())
                                                      && invEMCStr.value.includes(item.type_of_emc_drossel.toString())
                                                      && invDCStr.value.includes(item.type_of_dc_drossel.toString())
                                                      && invBreakStr.value.includes(item.type_of_break_module.toString())
                                                      && avalSeriesStr.includes(item.serie.toString())
                                              ))
    return dataDisplay.value
}