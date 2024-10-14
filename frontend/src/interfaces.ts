import type { ComputedRef } from 'vue'

export interface IData {
	url: string
	redis_prefix: string
	cached: boolean
    sql_get_all: string
	sql_get_one: string
	sql_update: string
	sql_insert: string
	sql_delete: string
    table: string
    expire: number | null
    prepare: Function
}

export interface IMenuItem {
    label?: string
    route?: string
    icon?: string
    show?: ComputedRef<boolean>
    badge?: number | ComputedRef<number>
    items?: IMenuItem[]
    separator?: boolean
    level?: number
}

export interface IFile {
    file_name: String
    file_blob?: Blob
    file_base64data?: String
  }

export interface ISimpleDictionary {
    name: string
    id: number
}

export interface IDocument<T> {
    data   : T[]
    error  : any
    loading: boolean
}

export interface IInvAvalControl {
    id: number
    serie: number
    control: number
}

export interface IInvOverload {
    id: number
    p_mode: string
    g_mode: string
}

export interface IInvertor {
    id: number
    item: number                 
    serie: number
    input_voltage: number
    size: number
    type_of_break_module: number
    type_of_dc_drossel: number
    type_of_emc_drossel: number
    name: string
    p_heavy_g: string
    p_pumps_p: string
    current_g: string
    current_p: string
    serie_str              ?: string
    input_voltage_str      ?: string 
    size_str               ?: string
    type_of_dc_drossel_str ?: string 
    type_of_emc_drossel_str?: string        

    manufactory_str       ?: string  
    output_voltage_str    ?: string  
    min_power             ?: string  
    max_power             ?: string  
    type_of_control        : string  
    type_of_control_str   ?: string  
    type_of_panel         ?: string  
    type_of_panel_str     ?: string  
    overload_p_mode       ?: string  
    overload_g_mode       ?: string  
    type_of_overload_str  ?: string  
    type_of_accuracy_freq ?: string  
    level_IP              ?: string  
    level_IP_str          ?: string  
    description           ?: string  

    price                 ?: string
    quantity              ?: number
    waiting_period        ?: string
    currency              ?: string
}

export interface IPower {
    power: string
    error: number
}

export interface IInvSerie {
    id: number
    name: string
    description: string
    manufactory: number
    output_voltage: number
    type_of_control: number
    type_of_panel: number
    type_of_overload: number
    type_of_accuracy_freq: number
    ambient_temperature: number
    level_IP: number
    min_power: string
    max_power: string
    photo: string
    schema: string
}

export interface IInvOption {
    id             : number 
    item           : number
    name           : string
    short_title    : string
    full_title     : string
    series         : number
    option         : number 
    price         ?: string
    discount      ?: string
    waiting_period?: string
    quantity      ?: string
    option_type   ?: string
}

export interface IItem {
    id             : number
    type           : number
    name           : string
    quantity       : number
    waiting_period : number
}
export interface IUserInvConfig {
    id : number
    invertor : number
    invertor_price : string
    invertor_discount : string
    options : string
    options_prices : string
    options_disccounts : string
    date : string
    user: number
    staff_opened: boolean
    info: string
}

export interface IUser {
    id ?: number
    username?: string
    password?: string
    first_name : string
    last_name?: string
    email?: string
    is_staff?: boolean
    is_active?: boolean
    is_superuser?: boolean
    date_joined?: string
}

export interface IInvInputOuptput {
    id : number
    serie : number
    signal : number
    info: string
    quantity: number
}

export interface IInvSignalInputOutput {
    serie    : number
    signal   : number 
    signal_str: string
    info    ?: string
    quantity : number    
}

// ------------------------------- Скидки ------------------------------- 

export interface IInvSerieDisount {
    id:   number
    group: number
    serie: number
    discount: number
  }

export interface IInvOptionDisount {
    id:number
    group: number
    option: number
    discount: number
  }

export interface IUserDiscount {
    id: number
    user: number
    group: number
  }

// ------------------------------- Организации ------------------------------- 
export interface ICompany {
    id: number
    name:string
    inn:string
    address:string
    agreement:string
    info:string
    phone:string
    email:string
    logo?:string    
}

export interface ICompanyUsers {
    id?     : number
    company : number
    user    : number
}
// ------------------------------- Журналироание ------------------------------- 

export interface ILog {
    id    ?: number
    date  ?: string
    action : number
    user   : number
    params : string
}
