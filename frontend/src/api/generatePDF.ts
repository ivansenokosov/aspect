import { ref } from 'vue'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { dejavuFont } from "./dejavuFont";
import { useBaseUrl } from "@/stores/baseUrl";
import type { IInvertor, IInvOption, IInvSerie, IInvSignalInputOutput } from '@/interfaces';
import { priceFormat } from "./priceFormat";
import type { IDocument, ISimpleDictionary, IInvAvalControl } from "@/interfaces";
import { useFetch } from './useFetch';
import { getValueFromDictionary } from './getValueFromDictionary';

const baseUrl = useBaseUrl()
const typeOfOptions        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
const outputVoltage        = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
const breakModule          = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
const ambientTemperature   = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})

function calcPrice(price : number, discount : number): number {
    return Number((price - price/100 * discount).toFixed())
}

const getMeta = (url : string, cb : Function) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};

export async function generatePDF(invertor: IInvertor, 
                                     serie: IInvSerie,
                           optionsSelected: IInvOption[],
                                   signals: IInvSignalInputOutput[], 
                              optionsPrice: number, 
                          availableOptions: string,
                                invControl: string,
                               print_price: number, 
                                doc_number: string
                            ) {
    const filename = "aspect"
    const pdf      = new jsPDF({orientation: "portrait", unit: "px", format: "a4"});
    const logo     = baseUrl.baseUrl + 'media/logos/aspect_logo.jpg'
    const docs     = baseUrl.baseUrl + 'media/link_to_doc.png'
    const photo    = baseUrl.baseUrl + serie.photo.substring(1, serie.photo.length)
    const schema   = baseUrl.baseUrl + serie.schema.substring(1, serie.schema.length)
    var photoRatio : number = 1
    var schemaRatio : number = 1
    
    getMeta(photo, (err:any, img:any) => { photoRatio = img.naturalWidth / img.naturalHeight });
    getMeta(schema, (err:any, img:any) => { schemaRatio = img.naturalWidth / img.naturalHeight });

    breakModule.value          = await useFetch('Inv_breake_module/'      + invertor.type_of_break_module.toString() + '/', {} );
    ambientTemperature.value   = await useFetch('Ambient_temperatures/'   + serie.ambient_temperature.toString() + '/', {} );
    outputVoltage.value        = await useFetch('Inv_output_voltage/'     + serie.output_voltage.toString() + '/', {} );
    typeOfOptions.value        = await useFetch('Type_of_options', {} );

    const signals_table_header = ['Сигнал','Количество']
    var   signals_table_body:Array<[string, string]>=[['','']]

    const options_table_header = ['Наименование','Описание','Доп.описание','Тип','Цена']
    var   options_table_body:Array<[string, string, string, string, string]>=[['','','','','']]

    const invertor_table_header = ['Параметр','Значение']
    var   invertor_table_body:Array<[string, string]>=[
                                                         ['Тип оборудования','Преобразователь частоты'],
                                                         ['Цена преобразователя (с НДС)', priceFormat(Number(invertor.price)) + ' руб.'],
                                                         ['Цена выбранных опций (с НДС)', priceFormat(optionsPrice) + ' руб.'],
                                                         ['Итого (с НДС)', priceFormat(Number(invertor.price) + optionsPrice) + ' руб.' ], // не сделано
                                                         ['Наименование', invertor.name],
                                                         ['Серия', serie.name],
                                                         ['Мощность', 'Режим G: ' + invertor.p_heavy_g + ` кВт,
Режим P: ` +  invertor.p_pumps_p + ' кВт'], 
                                                         ['Ток', 'Режим G: ' + invertor.current_g + ` А, 
Режим P: ` +  invertor.current_p + ' А'], // отформатировать
                                                         ['Перегрузочная способность', 'Режиим G: ' + invertor.overload_g_mode + `
Режим P: ` + invertor.overload_p_mode + `
(не  чаще 1 раза в 10 мин)`], 
                                                         ['Диапазон напряжений на входе', invertor.input_voltage_str || ''],
                                                         ['Диапазон напряжений на выходе', outputVoltage.value.data[0].name],
                                                         ['Метод управления', invertor.type_of_control_str || ''],
                                                         ['Способ управления', invControl],
                                                         ['Точность регулирования частоты', invertor.type_of_accuracy_freq || ''],
                                                         ['Тип панели', invertor.type_of_panel_str || ''],
                                                         ['EMC дроссель', invertor.type_of_emc_drossel_str || ''],
                                                         ['DC дроссель', invertor.type_of_dc_drossel_str || ''],
                                                         ['Тормозной модуль', breakModule.value.data[0].name],
                                                         ['Уровень защиты', invertor.level_IP_str || ''],
                                                         ['Температура окр. среды', ambientTemperature.value.data[0].name],
                                                         ['Доступные опции', availableOptions],
                                                         ['Дополнительное описание', serie.description],
                                                         ['Прозизводитель', invertor.manufactory_str + '/Аспект']
                                                        ]
     

    
    pdf.addFileToVFS('DejaVuSans-normal.ttf', dejavuFont);
    pdf.addFont('DejaVuSans-normal.ttf', 'DejaVuSans', 'normal');
    pdf.setFont('DejaVuSans','normal')
    

    // -------- Предварительное ценовое предложение
    pdf.addImage(logo, 'JPEG', 50, 20, 130, 30);
    pdf.setFontSize(6)
    pdf.text('ООО "АСПЕКТ". +7 (343) 204‐94‐50, info@ids‐drives.ru, ids‐drives.ru', 50, 62)

    pdf.setFontSize(12)
    pdf.text("Технико-коммерческое предложение № " + doc_number, 50, 100)

    pdf.addImage(docs,  50, 120, 70, 70);
    pdf.addImage(photo, 200, 120, 100, 100/photoRatio);

    autoTable(pdf, {
        head: [invertor_table_header],
        body: invertor_table_body,
        startY: 300, 
        styles: { font: 'DejaVuSans', fontSize: 10,  fontStyle: "normal"  },
      });

// ------------------------------------------------- Входы/Выходы
    signals.forEach((item:IInvSignalInputOutput, index:number) => signals_table_body[index]= [item.signal_str,item.quantity.toString()]) 

    pdf.addPage()
    pdf.text("Входы/выходы управления", 50, 50)
    autoTable(pdf, {
        head: [signals_table_header],
        body: signals_table_body,
        startY: 80, 
        styles: { font: 'DejaVuSans' },
      });


// ------------------------------------------------- Выбранные опции
optionsSelected.forEach((item:IInvOption, index:number) => options_table_body[index]= [item.name, // Наименование
                                                                                       item.full_title, // Описание
                                                                                       item.short_title, // Доп.описание
                                                                                       getValueFromDictionary(typeOfOptions.value.data, item.option), // Тип
                                                                                       calcPrice(Number(item.price), Number(item.discount)).toString() // Цена
                                                                                       ]) 

    pdf.addPage()
    pdf.text("Выбранные опции", 50, 50)
    autoTable(pdf, {
        head: [options_table_header],
        body: options_table_body,
        startY: 80, 
        styles: { font: 'DejaVuSans' },
      });

// ------------------------------------------------- Схема
    pdf.addPage()
    pdf.text("Схема", 50, 50)
    pdf.addImage(schema, 'JPEG', 50, 70, 350, 350/schemaRatio);

    pdf.save(`${filename}.pdf`);
}



