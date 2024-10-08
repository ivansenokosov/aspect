import type { ICompany } from "./interfaces";

export function prepareCompany(data:ICompany, id:number = 0) {
    if (id) {
        return [data.name, data.inn, data.address, data.agreement, data.email, data.info, data.logo, data.phone, id]
    } else {
        return [data.name, data.inn, data.address, data.agreement, data.email, data.info, data.logo, data.phone]
    }
} 