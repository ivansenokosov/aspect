import type { ICSVRow } from '@/api/Parsing/interfaces'
import type { IItem } from '@/interfaces'


// Ищет ид в Items по Артикулу в исходных данных
export function getItemId(items: IItem[], csv_id:string) {
    const item = items.find(item => Number(csv_id) == Number(item.id))
    if (item) return item.id
              return -1
}

// Устанавливает ID и action в таблице данных для разбора
export function setID(items: IItem[], CSVData:ICSVRow[], columnIdIndex:number) {
    var result : ICSVRow[] = []
    CSVData.forEach((item:ICSVRow, index:number) => {
        result.push(item)
        const id = getItemId(items, item.data[columnIdIndex])
        result[index].id = id!
        if (id!>0) {
            result[index].action = 'UPDATE'
        } else {
            result[index].action = 'IGNORE'
        }
    })
    return result

}

// Переключатель действий
export function getSeverity(action:string) {
    switch (action) {
        case 'UPDATE': 
            return 'info' 
        case 'INSERT':
            return 'success'
        default:
            return 'danger'
    }
  }
