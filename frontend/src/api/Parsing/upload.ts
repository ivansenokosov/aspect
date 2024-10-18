import {ref} from 'vue'
import type {ICSVRow} from '@/api/Parsing/interfaces'
import { updateData, insertData } from "../dataActions";
import type { IPrice, IItem } from '@/interfaces';
import AxiosInstance from "../axiosInstance";
import moment from "moment";

export async function upload(CSVDataInput: ICSVRow[], columnQuantityIndex: number, columnPriceIndex: number):Promise<ICSVRow[]> {
    const config = { headers: { 'content-type': 'application/json', }, };    
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateString = day + '.' + month + '.' + year
    const CSVData = ref<ICSVRow[]>([])

    CSVData.value = CSVDataInput


    return new Promise((resolve, reject) => {

        CSVData.value.forEach((item, index) => {
            switch (item.action) {
                case 'UPDATE':

                    // --- формируем данные для UPDATE таблицы Items для обновления колонки quantity
                    const itemData:IItem = {
                        quantity: Number(item.data[columnQuantityIndex]),  // Количество из источника данных
                        name: '',                                          // Имя не используется
                        type_id: 10,                                       // Инвертор 
                        waiting_period_id: 1                               // 4-6 недель по умолчанию
                    }        

                    updateData(`/data/Items/${item.id}`, itemData)
                        .then(() => { 
                                        CSVData.value[index].uploaded = true
                                    })
                        .catch((error) => { console.log(error); }) 
                
                                                

                    const itemPrice = item.data[columnPriceIndex].replace(' ','').replace(' ','').replace(' ','').replace('₽','')

                    AxiosInstance.get(`/data/Prices?column=item_id&operator=equal&value=${item.id}`)
                                 .then((response) => {
                                        if (response.data.length > 0) { // Цена найдена

                                            const itemPriceLoaded = Number(response.data[0].price).toFixed()

                                            if (Number(itemPrice) != Number(itemPriceLoaded)) { // не нашли такой цены или цена отличается от последней
                                                const formPriceData : IPrice = {
                                                                                    item_id: item.id,
                                                                                    price: Number(itemPrice),
                                                                                    currency_id: 1,
                                                                                    date: moment().format('YYYY-MM-DD')
                                                                                }
                                                insertData('/data/Prices/', formPriceData)
                                                    .then(() => CSVData.value[index].price_uploaded = 2)  // Отмечаем, что строка загружена
                                                    .catch((error) => console.log(error))
                                            } else {
                                                CSVData.value[index].price_uploaded = 1 // Отмечаем, что не загружена
                                            }            

                                        } else {
                                            console.log(item.id, 'Цена не найдена')
                                        }
                                        }).catch(function(error) {
                                            console.log(error);
                                        })
                 case 'INSERT': null;

            } // switch action


        }) // map

        resolve(CSVData.value)
    })
  }