import type { ICompany, 
              IInvAvalControl, 
              ISimpleDictionary, 
              IInvOverload,
              IInvertor,
              IPower,
              IInvSerie,
              IInvOption, 
              IItem,
              IUserInvConfig,
              IUser,
              IInvInputOuptput,
              IInvSignalInputOutput,
              IUserDiscount,
              IInvSerieDisount,
              IInvOptionDisount,
              ICompanyUsers,
              ILog
            } from "./interfaces"

export function prepareCompany(data:ICompany, id:number = 0) {
    var params:Array<string|number> = [data.name, 
                                       data.inn, 
                                       data.address, 
                                       data.agreement, 
                                       data.email, 
                                       data.info, 
                                       data.logo ?? '', 
                                       data.phone]
    id && params.push(id)
    return params
} 

export function prepareSimpleDictionary(data:ISimpleDictionary, id:number) {
    var params:Array<string|number> = [data.name]
    id && params.push(id)
    return params
}

export function prepareInvAvalControl(data:IInvAvalControl, id:number) {
    var params:Array<string|number> = [data.serie, data.control]
    id && params.push(id)
    return params
}

export function prepareInvOverload(data:IInvOverload, id:number) {
    var params:Array<string|number> = [data.p_mode, data.g_mode]
    id && params.push(id)
    return params
}

export function prepareInvertor(data:IInvertor, id:number) {
    var params:Array<string|number> = [data.item, 
                                       data.serie, 
                                       data.input_voltage, 
                                       data.size, 
                                       data.type_of_break_module, 
                                       data.type_of_dc_drossel, 
                                       data.type_of_emc_drossel,
                                       data.name,
                                       data.p_heavy_g,
                                       data.p_pumps_p,
                                       data.current_g,
                                       data.current_p
                                    ]
    id && params.push(id)
    return params
}

export function preparePower(data:IPower, id:number) {
    var params:Array<string|number> = [data.power, data.error]
    id && params.push(id)
    return params
}

export function prepareSerie(data:IInvSerie, id:number) {
    var params:Array<string|number> = [data.name, 
                                       data.description, 
                                       data.manufactory, 
                                       data.output_voltage, 
                                       data.type_of_control, 
                                       data.type_of_panel, 
                                       data.type_of_overload, 
                                       data.type_of_accuracy_freq, 
                                       data.ambient_temperature,
                                       data.level_IP,
                                       data.min_power,
                                       data.max_power,
                                       data.photo,
                                       data.schema]
    id && params.push(id)
    return params
}

export function prepareInvOption(data:IInvOption, id:number) {
    var params:Array<string|number> = [data.item, 
                                       data.name, 
                                       data.short_title, 
                                       data.full_title, 
                                       data.series, 
                                       data.option]
    id && params.push(id)
    return params
}

export function prepareItem(data:IItem, id:number) {
    var params:Array<string|number> = [data.type, 
                                       data.name, 
                                       data.quantity, 
                                       data.waiting_period]
    id && params.push(id)
    return params
}

export function prepareUserInvConfig(data:IUserInvConfig, id:number) {
    var params:Array<string|number|boolean> =  [data.date, 
                                                data.user,
                                                data.invertor, 
                                                data.invertor_price,
                                                data.invertor_discount,
                                                data.options, 
                                                data.options_prices,
                                                data.options_disccounts, 
                                                data.info,
                                                data.staff_opened]

    id && params.push(id)
    return params
}

export function prepareUser(data:IUser, id:number) {
    var params:Array<string|number|boolean> =  [data.username, 
                                                data.password,
                                                data.first_name,
                                                data.last_name, 
                                                data.email,
                                                data.is_staff, 
                                                data.is_active, 
                                                data.is_superuser,
                                                data.date_joined]
    id && params.push(id)
    return params
}

export function prepareInvInputOuptput(data:IInvInputOuptput, id:number) {
    var params:Array<string|number|boolean> =  [data.serie, 
                                                data.signal,
                                                data.info,
                                                data.quantity]
    id && params.push(id)
    return params
}

export function prepareInvSignalInputOutput(data:IInvSignalInputOutput, id:number) {
    var params:Array<string|number|boolean> =  [data.serie, 
                                                data.signal,
                                                data.quantity]
    id && params.push(id)
    return params
}

// ------------------------------- Скидки ------------------------------- 

export function prepareUserDisount(data:IUserDiscount, id:number) {
    var params:Array<string|number|boolean> =  [data.group,
                                                data.user]
    id && params.push(id)
    return params
}


export function prepareInvSerieDisount(data:IInvSerieDisount, id:number) {
    var params:Array<string|number|boolean> =  [data.group, 
                                                data.serie,
                                                data.discount]
    id && params.push(id)
    return params
}

export function prepareInvOptionDisount(data:IInvOptionDisount, id:number) {
    var params:Array<string|number|boolean> =  [data.group, 
                                                data.option,
                                                data.discount]
    id && params.push(id)
    return params
}

export function prepareCompanyUsers(data:ICompanyUsers, id:number) {
    var params:Array<string|number|boolean> =  [data.company, 
                                                data.user]
    id && params.push(id)
    return params
}

// ------------------------------- Журналироание ------------------------------- 

export function prepareLog(data:ILog, id:number) {
    var params:Array<string|number|boolean> =  [data.date, 
                                                data.action,
                                                data.user,
                                                data.params]
    id && params.push(id)
    return params
}

