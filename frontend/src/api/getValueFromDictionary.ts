export function getValueFromDictionary(dictionary: any[], id: number, param_name = 'name'):string {
    const record = dictionary.find(item => item.id === Number(id))
    if (record) {
      return record[param_name]
    } else {
      return 'не определено'
    }    
  }

  export function getRecordFromDictionaray(dictionary: any[], id: number):string {
    const record = dictionary.find(item => item.id === Number(id))
    if (record) {
      return record
    } else {
      return ''
    }    
  }