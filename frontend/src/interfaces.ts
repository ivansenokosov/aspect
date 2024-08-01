import type { ComputedRef } from 'vue'

export interface IMenuItem {
    label?: string
    route?: string
    icon?: string
    show?: ComputedRef<boolean>
    badge?: number
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

export interface ISimpleData {
    data: ISimpleDictionary[]
    error: any
    loading: boolean
}

export interface IInvAvalControl {
    id: number
    serie: number
    control: number
}

export interface IInvAvalControlData {
    data: IInvAvalControl[]
    error: any
    loading: boolean
}


export interface IInvOverload {
    id: number
    p_mode: string
    g_mode: string
}

export interface IInvOverloadData {
    data: IInvOverload[]
    error: any
    loading: boolean
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
    serie_str: string
    input_voltage_str: string 
    size_str: string
    type_of_dc_drossel_str: string 
    type_of_emc_drossel_str: string        

    manufactory_str       : string  
    output_voltage_str    : string  
    min_power             : string  
    max_power             : string  
    type_of_control       : string  
    type_of_control_str   : string  
    type_of_panel         : string  
    type_of_panel_str     : string  
    overload_p_mode       : string  
    overload_g_mode       : string  
    type_of_overload_str  : string  
    type_of_accuracy_freq : string  
    level_IP              : string  
    level_IP_str          : string  
    description           : string  

    price                 : string
    quantity              : number
    waiting_period        : string
    currency              : string
}

export interface IInvertorData {
    data: IInvertor[]
    error: any
    loading: boolean
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
}

export interface IInvSerieData {
    data: IInvSerie[]
    error: any
    loading: boolean
}

export interface IInvOption {
    item : number
    name : string
    short_title : string
    full_title : string
    series : number
    option : number 
    price: string
    waiting_period: string
    quantity: string
}

export interface IInvOptionData {
    data: IInvOption[]
    error: any
    loading: boolean
}

export interface IItem {
    type : number
    name : string
    quantity : number
    waiting_period : number
}

export interface IItemData {
    data: IItem[]
    error: any
    loading: boolean
}

export interface IUserInvConfig {
    id : number
    invertor : number
    options : string
    date : string
    user: number
}

export interface IUserInvConfigData {
    data: IUserInvConfig[]
    error: any
    loading: boolean
}

export interface IUser {
    id : number
    first_name : string
    last_name : string
}

export interface IUserData {
    data: IUserInvConfig[]
    error: any
    loading: boolean
}
