import type { IInvSerie, IInvSerieDisount, ISimpleDictionary, IInvOptionDisount } from "@/interfaces"
import { insertData, deleteData } from "./dataActions"

export async function createSeries(id : string, series: IInvSerie[], seriesDiscount: IInvSerieDisount[]) {
    // удаление имеющихся скидок на серии группы
    seriesDiscount.map((item:IInvSerieDisount) => {
         deleteData(`/data/InvSerieDisount/${item.id}`)
    })
    // создание новых скидок на серии
    for (let i in series){
      const payload = {        
        serie_id: series[i].id,
        group_id: Number(id),
        discount: 0
      }
      await insertData('/data/InvSerieDisount', payload)
    }


  }

  export async function createOptions(id: string, options: ISimpleDictionary[], optionsDiscount: IInvOptionDisount[], ) {
    // удаление имеющихся скидок на опции группы
    optionsDiscount.map((item:IInvOptionDisount) => {
      const url:string =  `/data/InvOptionDisount/${item.id}`
      deleteData(url)
    })

    // создание новых скидок на опции
    for (let i in options){
      const payload = {
        option_id: options[i].id,
        group_id: Number(id),
        discount: 0
      }       
      await insertData('/data/InvOptionDisount', payload)
    }

  }  

  export const isPositiveInteger = (val:number) => {
    let str = String(val);
  
    str = str.trim();
  
    if (!str) {
        return false;
    }
  
    str = str.replace(/^0+/, '') || '0';
    var n = Math.floor(Number(str));
  
    return n !== Infinity && String(n) === str && n >= 0;
  };
  

  export const onCellEditComplete = (event:any) => {
    let { data, newValue, field } = event;
      if (isPositiveInteger(newValue)) data[field] = newValue;
            else event.preventDefault();

  };
