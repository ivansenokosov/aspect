export interface IData {
	url         : string
	redis_prefix: string
	cached      : boolean
    sql_get_all : string
	sql_get_one : string
	sql_update  : string
	sql_insert  : string
	sql_delete  : string
    table       : string
    expire      : number | null
    prepare     : Function
}

export interface IFile {
    file_name       : string
    file_blob      ?: Blob
    file_base64data?: string
  }

export interface ISimpleDictionary {
    name: string
    id  : number
}

export interface IDocument<T> {
    data   : T[]
    error  : any
    loading: boolean
}

export interface IInvAvalControl {
    id        : number
    serie_id  : number
    control_id: number
}

export interface IInvOverload {
    id     : number
    p_mode : string
    g_mode : string
}

export interface IInvertor {
    id                      : number
    item_id                 : number                 
    serie_id                : number
    input_voltage_id        : number
    size_id                 : number
    type_of_break_module_id : number
    type_of_dc_drossel_id   : number
    type_of_emc_drossel_id  : number
    name                    : string
    p_heavy_g               : string
    p_pumps_p               : string
    current_g               : string
    current_p               : string

    serie_str              ?: string
    input_voltage_str      ?: string 
    size_str               ?: string
    type_of_dc_drossel_str ?: string 
    type_of_emc_drossel_str?: string        

    manufactory_str       ?: string  
    output_voltage_str    ?: string  
    min_power             ?: string  
    max_power             ?: string  
    type_of_control_id     : number  
    type_of_control_str   ?: string  
    type_of_panel_id      ?: number  
    type_of_panel_str     ?: string  
    overload_p_mode       ?: string  
    overload_g_mode       ?: string  
    type_of_overload_str  ?: string  
    type_of_accuracy_freq_str ?: string
    level_IP_id           ?: number  
    level_IP_str          ?: string  
    description           ?: string  

    price                 ?: string
    quantity              ?: number
    waiting_period_id     ?: number
    currency_id           ?: number
}

export interface IPower {
    id   : number
    power: string
    error: number
}

export interface IInvSerie {
    id                          : number
    name                        : string
    description                 : string
    manufactory_id              : number
    output_voltage_id           : number
    type_of_control_id          : number
    type_of_panel_id            : number
    type_of_overload_id         : number
    type_of_accuracy_freq_id    : number
    ambient_temperature_id      : number
    level_IP_id                 : number
    min_power                   : string
    max_power                   : string
    photo                       : string
    schema                      : string
}

export interface IInvOption {
    id                 : number 
    item_id            : number
    name               : string
    short_title        : string
    full_title         : string
    series             : string 
    option_id          : number 
    price             ?: string
    discount          ?: string
    waiting_period_str?: string
    quantity          ?: string
    option_type_str   ?: string
}

export interface IItem {
    id                : number
    type_id           : number
    name              : string
    quantity          : number
    waiting_period_id : number
}
export interface IUserInvConfig {
    id                  : number
    invertor_id         : number
    invertor_price      : string
    invertor_discount   : string
    options             : string
    options_prices      : string
    options_disccounts  : string
    date                : string
    user_id             : number
    staff_opened        : boolean
    info                : string
}

export interface IUser {
    id          : number
    username    : string
    password    : string
    first_name  : string
    last_name   : string
    email       : string
    is_staff    : boolean
    is_active   : boolean
    is_superuser: boolean
    date_joined : string
}

export interface IInvInputOuptput {
    id        : number
    serie_id  : number
    signal_id : number
    info      : string
    quantity  : number
}

export interface IInvSignalInputOutput {
    serie_id    : number
    signal_id   : number 
    signal_str  : string
    info       ?: string
    quantity    : number    
}

// ------------------------------- Скидки ------------------------------- 

export interface IInvSerieDisount {
    id      : number
    group_id: number
    serie_id: number
    discount: number
  }

export interface IInvOptionDisount {
    id        : number
    group_id  : number
    option_id : number
    discount  : number
  }

export interface IUserDiscount {
    id      : number
    user_id : number
    group_id: number
  }

// ------------------------------- Организации ------------------------------- 
export interface ICompany {
    id       : number
    name     : string
    inn      : string
    address  : string
    agreement: string
    info     : string
    phone    : string
    email    : string
    logo?    : string    
}

export interface ICompanyUsers {
    id?        : number
    company_id : number
    user_id    : number
}
// ------------------------------- Журналироание ------------------------------- 

export interface ILog {
    id       ?: number
    date      : string
    action_id : number
    user_id   : number
    params    : string
}


export interface IPrice {
    id         ?: number
	price       : number
	date        : string
	currency_id : number
	item_id     : number
}