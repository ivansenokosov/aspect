export function getValueFromDictionary<String>(dictionary: any[], id: number) {
    const record = dictionary.filter(item => item.id === Number(id))[0]
    if (record) {
      return record.name
    } else {
      return 'не определено'
    }    
  }