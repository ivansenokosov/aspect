export interface ICSVRow {
    data: string[]
    id: number
    action: string
    uploaded: boolean
    price_uploaded: number
  }

export interface IParseResult {
    data: any  // array of parsed data
    errors: any // array of errors
    meta: any  // object with extra info
  }