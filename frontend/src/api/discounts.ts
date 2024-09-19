import type { IInvSerie, IInvSerieDisount, ISimpleDictionary, IInvOptionDisount } from "@/interfaces"
import { insertData, deleteData } from "./dataActions"

export async function createSeries(id : string, series: IInvSerie[], seriesDiscount: IInvSerieDisount[]) {
    // удаление имеющихся скидок на серии группы
    seriesDiscount.map((item:IInvSerieDisount) => {
      const url:string =  'discounts/InvSerieDisount/' + item.id.toString()
      deleteData(url)
    })
    // создание новых скидок на серии
    series.map((item:IInvSerie) => {
      const url_create:string =  'discounts/InvSerieDisount/'
      const formData = {        
        "serie": item.id.toString(),
        "group": id,
        "discount": '0'
      }
      insertData(url_create, formData)
    })

  }

  export async function createOptions(id: string, options: ISimpleDictionary[], optionsDiscount: IInvOptionDisount[], ) {
    // удаление имеющихся скидок на опции группы
    optionsDiscount.map((item:IInvOptionDisount) => {
      const url:string =  'discounts/InvOptionDisount/' + item.id.toString()
      deleteData(url)
    })

    // создание новых скидок на опции
    options.map((item:ISimpleDictionary) => {
      const url_create:string =  'discounts/InvOptionDisount/'
      const config = { headers: { 'content-type': 'application/json', }, };
      const formData = {
        "option": item.id.toString(),
        "group": id,
        "discount": '0'
      }       
      insertData(url_create, formData)
    })

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
