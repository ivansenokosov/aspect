export function getValueFromDictionary<String>(dictionary: any[], id: number, param_name = 'name') {
    const record = dictionary.filter(item => item.id === Number(id))[0]
    if (record) {
      return record[param_name]
    } else {
      return 'не определено'
    }    
  }