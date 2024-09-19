export function getValueFromDictionary(dictionary: any[], id: number, param_name = 'name'):string {
    const record = dictionary.filter(item => item.id === Number(id))[0]
    if (record) {
      return record[param_name]
    } else {
      return 'не определено'
    }    
  }

  export function getRecordFromDictionaray(dictionary: any[], id: number):any {
    const record = dictionary.filter(item => item.id === Number(id))[0]
    if (record) {
      return record
    } else {
      return null
    }    
  }