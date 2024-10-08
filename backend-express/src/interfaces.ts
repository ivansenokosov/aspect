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


export interface ICompany {
    id:number
    name:string
    inn: string
    address: string
    agreement: string
    info: string
    logo: string
    email:string
    phone: string
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
