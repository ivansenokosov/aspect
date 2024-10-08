import { invertorSQL } from "./sqls"
import type { IData } from "./interfaces" 
import { prepareCompany } from "./prepare"

export const data:IData[] = [
    {url: '/companies', 
     redis_prefix: 'company',  
     sql_get_all: 'select * from d_companies', 
     sql_get_one: 'select * from d_companies where id = ?', 
     sql_update:  'update d_companies set name=?, inn=?, address=?, agreement=?, email=?, info=?, logo=?, phone=? where id=?',
     sql_insert:  'insert into d_companies (name, inn, address, agreement, email, info, logo, phone, id) values (?,?,?,?,?,?,?,?,?)',
     sql_delete:  'delete from d_companies where id = ?',
     table:'d_companies',
     cached: false, 
     expire: null,
     prepare: prepareCompany
    },

    {url: '/invertors', 
     redis_prefix: 'invertor', 
     sql_get_all: invertorSQL,
     sql_get_one: invertorSQL + ' and id = ?',
     sql_update: '',
     sql_insert: '',
     sql_delete: '',
     table: 'd_invertors',
     cached: true,  
     expire: 60*24*7,
     prepare: () => {}
    },
]


