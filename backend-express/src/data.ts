import { invertorSQL } from "./sqls"
import type { IData } from "./interfaces"
import { prepareCompany, 
         prepareInvAvalControl,
         prepareCompanyUsers,
         prepareInvInputOuptput,
         prepareInvOption,
         prepareInvOptionDisount,
         prepareInvOverload,
         prepareInvSerieDisount,
         prepareInvSignalInputOutput,
         prepareInvertor,
         prepareItem,
         prepareLog,
         preparePower,
         prepareSerie,
         prepareSimpleDictionary,
         prepareUser,
         prepareUserInvConfig,
         prepareUserDisount
     } from "./prepare"

export const data:IData[] = [
    
    {
        url: '/CompanyUsers', // Работает
        redis_prefix: 'companyuser',  
        sql_get_all: 'select id, company_id "company", user_id "user" from d_companyusers', 
        sql_get_one: 'select id, company_id "company", user_id "user" from d_companyusers where id = ?', 
        sql_update:  'update d_companyusers set company_id=?, user_id=? where id=?',
        sql_insert:  'insert into d_companyusers (company_id, user_id, id) values (?,?,?)',
        sql_delete:  'delete from d_companyusers where id = ?',
        table:'d_companyusers',
        cached: false, 
        expire: null,
        prepare: prepareCompanyUsers
    },

    {
        url: '/manufactoty', // Протестировано
        redis_prefix: 'manufactoty',  
        sql_get_all: 'select * from s_manufactory', 
        sql_get_one: 'select * from s_manufactory where id = ?', 
        sql_update:  'update s_manufactory set name=? where id=?',
        sql_insert:  'insert into s_manufactory (name, id) values (?,?)',
        sql_delete:  'delete from s_manufactory where id = ?',
        table:'s_manufactory',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/inv_input_voltage', // Протестировано
        redis_prefix: 'invInputVoltage',  
        sql_get_all: 'select * from s_inv_input_voltage', 
        sql_get_one: 'select * from s_inv_input_voltage where id = ?', 
        sql_update:  'update s_inv_input_voltage set name=? where id=?',
        sql_insert:  'insert into s_inv_input_voltage (name, id) values (?,?)',
        sql_delete:  'delete from s_inv_input_voltage where id = ?',
        table:'s_inv_input_voltage',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/inv_output_voltage', 
        redis_prefix: 'invOutputVoltage',  
        sql_get_all: 'select * from s_inv_output_voltage', 
        sql_get_one: 'select * from s_inv_output_voltage where id = ?', 
        sql_update:  'update s_inv_output_voltage set name=? where id=?',
        sql_insert:  'insert into s_inv_output_voltage (name, id) values (?,?)',
        sql_delete:  'delete from s_inv_output_voltage where id = ?',
        table:'s_inv_output_voltage',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/level_ip', // Протестировано
        redis_prefix: 'levelIP',  
        sql_get_all: 'select * from s_level_ip', 
        sql_get_one: 'select * from s_level_ip where id = ?', 
        sql_update:         'update s_level_ip set name=? where id=?',
        sql_insert:    'insert into s_level_ip (name, id) values (?,?)',
        sql_delete:    'delete from s_level_ip where id = ?',
        table:'s_level_ip',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/Inv_type_of_overload', // Протестировано
        redis_prefix: 'invTypeOfOverload',  
        sql_get_all: 'select * from s_inv_type_of_overload', 
        sql_get_one: 'select * from s_inv_type_of_overload where id = ?', 
        sql_update:         'update s_inv_type_of_overload set p_mode=?, g_mode=? where id=?',
        sql_insert:    'insert into s_inv_type_of_overload (p_mode, g_mode, id) values (?,?,?)',
        sql_delete:    'delete from s_inv_type_of_overload where id = ?',
        table:                     's_inv_type_of_overload',
        cached: false, 
        expire: null,
        prepare: prepareInvOverload
    },


    {
        url: '/Inv_type_of_signals', // Протестировано
        redis_prefix: 'invTypeOfSignals',  
        sql_get_all: 'select * from s_inv_type_of_signals', 
        sql_get_one: 'select * from s_inv_type_of_signals where id = ?', 
        sql_update:         'update s_inv_type_of_signals set name=? where id=?',
        sql_insert:    'insert into s_inv_type_of_signals (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_type_of_signals where id = ?',
        table:                     's_inv_type_of_signals',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/Inv_type_of_panels', // Протестировано
        redis_prefix: 'invTypeOfPanel',  
        sql_get_all: 'select * from s_inv_type_of_panel', 
        sql_get_one: 'select * from s_inv_type_of_panel where id = ?', 
        sql_update:         'update s_inv_type_of_panel set name=? where id=?',
        sql_insert:    'insert into s_inv_type_of_panel (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_type_of_panel where id = ?',
        table:                     's_inv_type_of_panel',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },

    {
        url: '/Ambient_temperatures',  // протестировано
        redis_prefix: 'ambientTemperatures',  
        sql_get_all: 'select * from s_ambient_temperatures', 
        sql_get_one: 'select * from s_ambient_temperatures where id = ?', 
        sql_update:         'update s_ambient_temperatures set name=? where id=?',
        sql_insert:    'insert into s_ambient_temperatures (name, id) values (?,?)',
        sql_delete:    'delete from s_ambient_temperatures where id = ?',
        table:                     's_ambient_temperatures',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_accurancy_frenq', // Протестировано
        redis_prefix: 'invAccurancyFrenq',  
        sql_get_all: 'select * from s_inv_accurancy_frenq', 
        sql_get_one: 'select * from s_inv_accurancy_frenq where id = ?', 
        sql_update:         'update s_inv_accurancy_frenq set name=? where id=?',
        sql_insert:    'insert into s_inv_accurancy_frenq (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_accurancy_frenq where id = ?',
        table:                     's_inv_accurancy_frenq',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Type_of_control', // Протестировано
        redis_prefix: 'TypeOfControl',  
        sql_get_all: 'select * from s_type_of_control', 
        sql_get_one: 'select * from s_type_of_control where id = ?', 
        sql_update:         'update s_type_of_control set name=? where id=?',
        sql_insert:    'insert into s_type_of_control (name, id) values (?,?)',
        sql_delete:    'delete from s_type_of_control where id = ?',
        table:                     's_type_of_control',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Variants_of_control', // Протестировано
        redis_prefix: 'variantsOfControl',  
        sql_get_all: 'select * from s_variant_of_control', 
        sql_get_one: 'select * from s_variant_of_control where id = ?', 
        sql_update:         'update s_variant_of_control set name=? where id=?',
        sql_insert:    'insert into s_variant_of_control (name, id) values (?,?)',
        sql_delete:    'delete from s_variant_of_control where id = ?',
        table:                     's_variant_of_control',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_breake_module', // Протестировано
        redis_prefix: 'invBreakeModule',  
        sql_get_all: 'select * from s_inv_breake_module', 
        sql_get_one: 'select * from s_inv_breake_module where id = ?', 
        sql_update:         'update s_inv_breake_module set name=? where id=?',
        sql_insert:    'insert into s_inv_breake_module (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_breake_module where id = ?',
        table:                     's_inv_breake_module',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_DC_drossel', // Протестировано
        redis_prefix: 'invDCDrossel',  
        sql_get_all: 'select * from s_inv_dc_drossel', 
        sql_get_one: 'select * from s_inv_dc_drossel where id = ?', 
        sql_update:         'update s_inv_dc_drossel set name=? where id=?',
        sql_insert:    'insert into s_inv_dc_drossel (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_dc_drossel where id = ?',
        table:                     's_inv_dc_drossel',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_EMC_drossel', // Протестировано
        redis_prefix: 'invEMCDrossel',  
        sql_get_all: 'select * from s_inv_emc_drossel', 
        sql_get_one: 'select * from s_inv_emc_drossel where id = ?', 
        sql_update:         'update s_inv_emc_drossel set name=? where id=?',
        sql_insert:    'insert into s_inv_emc_drossel (name, id) values (?,?)',
        sql_delete:    'delete from s_inv_emc_drossel where id = ?',
        table:                     's_inv_emc_drossel',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_sizes', 
        redis_prefix: 'invSize',  
        sql_get_all: 'select * from s_size_of_invertors', 
        sql_get_one: 'select * from s_size_of_invertors where id = ?', 
        sql_update:         'update s_size_of_invertors set name=?, size=? where id=?',
        sql_insert:    'insert into s_size_of_invertors (name, size, id) values (?,?)',
        sql_delete:    'delete from s_size_of_invertors where id = ?',
        table:                     's_size_of_invertors',
        cached: false, 
        expire: null,
        prepare: () => {}  /// Не сделано -------------------------------------------------------
    },
    {
        url: '/Type_of_options', // Протестировано
        redis_prefix: 'typeOfOption',  
        sql_get_all: 'select * from s_type_of_options', 
        sql_get_one: 'select * from s_type_of_options where id = ?', 
        sql_update:         'update s_type_of_options set name=? where id=?',
        sql_insert:    'insert into s_type_of_options (name, id) values (?,?)',
        sql_delete:    'delete from s_type_of_options where id = ?',
        table:                     's_type_of_options',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Type_of_items', // Протестировано
        redis_prefix: 'typeOfItem',  
        sql_get_all: 'select * from s_type_of_items', 
        sql_get_one: 'select * from s_type_of_items where id = ?', 
        sql_update:         'update s_type_of_items set name=? where id=?',
        sql_insert:    'insert into s_type_of_items (name, id) values (?,?)',
        sql_delete:    'delete from s_type_of_items where id = ?',
        table:                     's_type_of_items',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Waiting_period', // Протестировано
        redis_prefix: 'waitingPeriod',  
        sql_get_all: 'select * from s_waiting_time', 
        sql_get_one: 'select * from s_waiting_time where id = ?', 
        sql_update:         'update s_waiting_time set name=? where id=?',
        sql_insert:    'insert into s_waiting_time (name, id) values (?,?)',
        sql_delete:    'delete from s_waiting_time where id = ?',
        table:                     's_waiting_time',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },    
    {
        url: '/Inv_series',                     // Протестириовано
        redis_prefix: 'invSerie',  
        sql_get_all: `select id, 
                             min_power, 
                             max_power, 
                             name, 
                             description, 
                             photo, 
                             ambient_temperature_id "ambient_temperature", 
                             output_voltage_id "output_voltage", 
                             type_of_accuracy_freq_id "type_of_accuracy_freq",
                             type_of_overload_id "type_of_overload",
                             type_of_panel_id "type_of_panel",
                             level_IP_id "level_IP",
                             manufactory_id "manufactory",
                             type_of_control_id "type_of_control",
                             schema
                        from s_inv_series`, 
        sql_get_one: `select id, 
                             min_power, 
                             max_power, 
                             name, 
                             description, 
                             photo, 
                             ambient_temperature_id "ambient_temperature", 
                             output_voltage_id "output_voltage", 
                             type_of_accuracy_freq_id "type_of_accuracy_freq",
                             type_of_overload_id "type_of_overload",
                             type_of_panel_id "type_of_panel",
                             level_IP_id "level_IP",
                             manufactory_id "manufactory",
                             type_of_control_id "type_of_control",
                             schema
                        from s_inv_series
                        where id = ?`, 
        sql_update:         `update s_inv_series set name=?, 
                                                     description=?, 
                                                     manufactory_id=?, 
                                                     output_voltage_id=?, 
                                                     type_of_control_id=?, 
                                                     type_of_panel_id=?, 
                                                     type_of_overload_id=?, 
                                                     type_of_accuracy_freq_id=?, 
                                                     ambient_temperature_id=?,
                                                     level_IP_id=?,
                                                     min_power=?,
                                                     max_power=?,
                                                     photo=?,
                                                     schema=?
                                               where id=?`,
        sql_insert:    `insert into s_inv_series (name, 
                                                  description, 
                                                  manufactory_id, 
                                                  output_voltage_id, 
                                                  type_of_control_id, 
                                                  type_of_panel_id, 
                                                  type_of_overload_id, 
                                                  type_of_accuracy_freq_id, 
                                                  ambient_temperature_id,
                                                  level_IP_id,
                                                  min_power,
                                                  max_power,
                                                  photo,
                                                  schema,
                                                  id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        sql_delete:    'delete from s_inv_series where id = ?',
        table:                     's_inv_series',
        cached: false, 
        expire: null,
        prepare: prepareSerie
    },
    {
        url: '/Inv_type_of_control', 
        redis_prefix: 'invTypeOfControl',  
        sql_get_all: 'select tosc.id, tosc.control_id "control", voc.name "control_str", tosc.serie_id "serie"  from s_type_of_serie_controls tosc, s_variant_of_control voc where tosc.control_id = voc.id', 
        sql_get_one: 'select tosc.id, tosc.control_id "control", voc.name "control_str", tosc.serie_id "serie"  from s_type_of_serie_controls tosc, s_variant_of_control voc where tosc.control_id = voc.id where id = ?', 
        sql_update:         'update s_type_of_serie_controls set control_id=?, serie_id=? where id=?',
        sql_insert:    'insert into s_type_of_serie_controls (control_id, serie_id, id) values (?,?,?)',
        sql_delete:    'delete from s_type_of_serie_controls where id = ?',
        table:                     's_type_of_serie_controls',
        cached: false, 
        expire: null,
        prepare: prepareInvAvalControl
    },
    {
        url: '/Inv_spec_of_in_out',  // Протестировано
        redis_prefix: 'invSignalInputOutput',  
        sql_get_all: 'select s.id, s.quantity, s.serie_id "serie", s.signal_id "signal", s.info, t.name "signal_str" from s_inv_spec_of_in_out s, s_inv_type_of_signals t where s.signal_id=t.id', 
        sql_get_one: 'select s.id, quantity, serie_id "serie", signal_id "signal", info from s_inv_spec_of_in_out s, s_inv_type_of_signals t where s.signal_id=t.id and s.id = ?', 
        sql_update:         'update s_inv_spec_of_in_out set serie_id=?, signal_id=?, quantity=? where id=?',
        sql_insert:    'insert into s_inv_spec_of_in_out (serie_id, signal_id, quantity, id) values (?,?,?,?)',
        sql_delete:    'delete from s_inv_spec_of_in_out where id = ?',
        table:                     's_inv_spec_of_in_out',
        cached: false, 
        expire: null,
        prepare: prepareInvSignalInputOutput
    },
    {
        url: '/Items', 
        redis_prefix: 'item',  
        sql_get_all: 'select id, name, quantity, type_id "type", waiting_period_id "waiting_period" from d_items', 
        sql_get_one: 'select id, name, quantity, type_id "type", waiting_period_id "waiting_period" from d_items where id = ?', 
        sql_update:         `update d_items set type_id=?,
                                                name=?,
                                                quantity=?, 
                                                waiting_period_id=?
                                          where id=?`,
        sql_insert:    `insert into d_items (type_id, name, quantity, waiting_period_id, id) values (?,?,?,?,?)`,
        sql_delete:    'delete from d_items where id = ?',
        table:                     'd_items',
        cached: false, 
        expire: null,
        prepare: prepareInvSignalInputOutput
    },

    {
        url: '/companies', // Протетировано
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
    {
        url: '/actions', // Протетировано
        redis_prefix: 'action',  
        sql_get_all: 'select * from s_actions', 
        sql_get_one: 'select * from s_actions where id = ?', 
        sql_update:         'update s_actions set name=? where id=?',
        sql_insert:    'insert into s_actions (name, id) values (?,?)',
        sql_delete:    'delete from s_actions where id = ?',
        table:                     's_actions',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },
    {
        url: '/Inv_options', // протестировано
        redis_prefix: 'invOption',  
        sql_get_all: `select io.id, 
                             p.price, 
                             i.quantity, 
                             t.name "waiting_period", 
                             too.name "option_type", 
                             io.name, 
                             io.short_title, 
                             io.full_title, 
                             io.series, 
                             io.item_id "item", 
                             option_id "option" 
                        from d_inv_options io,
                             d_items i,
                             d_prices p,
                             s_waiting_time t,
                             s_type_of_options too
                       where io.item_id = i.id
                         and i.id = p.item_id
                         and i.waiting_period_id = t.id
                         and too.id = io.option_id`, 
        sql_get_one: `select io.id, 
                             p.price, 
                             i.quantity, 
                             t.name "waiting_period", 
                             too.name "option_type", 
                             io.name, 
                             io.short_title, 
                             io.full_title, 
                             io.series, 
                             io.item_id "item", 
                             option_id "option" 
                        from d_inv_options io,
                             d_items i,
                             d_prices p,
                             s_waiting_time t,
                             s_type_of_options too
                       where io.item_id = i.id
                         and i.id = p.item_id
                         and i.waiting_period_id = t.id
                         and too.id = io.option_id 
                         and io.id = ?`, 
        sql_update:         'update d_inv_options set item_id=?, name=?, short_title=?, full_title=?, series=?, option_id=? where id=?',
        sql_insert:    'insert into d_inv_options (item_id, name, short_title, full_title, series, option_id, id) values (?,?,?,?,?,?,?)',
        sql_delete:    'delete from d_inv_options where id = ?',
        table:                     'd_inv_options',
        cached: false, 
        expire: null,
        prepare: prepareInvOption
    },
    {
        url: '/Inv_powers', 
        redis_prefix: 'invPower',  
        sql_get_all: 'select distinct p_heavy_g, p_pumps_p from d_invertors', 
        sql_get_one: 'select distinct p_heavy_g, p_pumps_p from d_invertors where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       'd_invertors',
        cached: false, 
        expire: null,
        prepare: () => {}
    },
    {
        url: '/Inv_sizes_dict', // протестировано
        redis_prefix: 'invSize',  
        sql_get_all: 'select name,id from s_size_of_invertors', 
        sql_get_one: 'select name,id from s_size_of_invertors where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       's_size_of_invertors',
        cached: false, 
        expire: null,
        prepare: () => {}
    },    
    {
        url: '/Inv_series_dict', //---
        redis_prefix: 'invSize',  
        sql_get_all: 'select name,id from s_inv_series', 
        sql_get_one: 'select name,id from s_inv_series where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       's_inv_series',
        cached: false, 
        expire: null,
        prepare: () => {}
    },        
    {
        url: '/Inv_overload_dict', //---
        redis_prefix: 'invInvOverload',  
        sql_get_all: 'select "Режим G: " || coalesce(g_mode,"") || ". Режим P: " || coalesce(p_mode,"") "name", id from s_inv_type_of_overload', 
        sql_get_one: 'select "Режим G: " || coalesce(g_mode,"") || ". Режим P: " || coalesce(p_mode,"") "name", id from s_inv_type_of_overload where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       's_inv_type_of_overload',
        cached: false, 
        expire: null,
        prepare: () => {}
    },        
    {
        url: '/Invertor_dict', //---
        redis_prefix: '',  
        sql_get_all: 'select name, id from d_invertors', 
        sql_get_one: 'select name, id from d_invertors where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       'd_invertors',
        cached: false, 
        expire: null,
        prepare: () => {}
    },        
    {
        url: '/UsersDict', //---
        redis_prefix: '',  
        sql_get_all: 'select fisrt_name, last_name, id from auth_user', 
        sql_get_one: 'select fisrt_name, last_name, id from auth_user where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  '',
        table:       'auth_user',
        cached: false, 
        expire: null,
        prepare: () => {}
    },        
    {
        url: '/Users', // Работает
        redis_prefix: '',  
        sql_get_all: 'select first_name, last_name, username, password, is_superuser, is_staff, is_active, email, date_joined, id from auth_user', 
        sql_get_one: 'select first_name, last_name, username, password, is_superuser, is_staff, is_active, email, date_joined, id from auth_user where id = ?', 
        sql_update:  'update auth_user set username=?, password=?, first_name=?, last_name=?, email=?, is_staff=?, is_active=?, is_superuser=?, date_joined=?  where id = ?',
        sql_insert:  'insert into auth_user (username, password, first_name, last_name, email, is_staff, is_active,  is_superuser, date_joined, id) values (?,?,?,?,?,?,?,?,?,?)',
        sql_delete:  'delete from auth_user where id = ?',
        table:       'auth_user',
        cached: false, 
        expire: null,
        prepare: prepareUser
    },        
    {
        url: '/Prices', //---
        redis_prefix: '',  
        sql_get_all: 'select * from d_prices', 
        sql_get_one: 'select * from d_prices where id = ?', 
        sql_update:  '',
        sql_insert:  '',
        sql_delete:  'delete from d_prices where id = ?',
        table:       'd_prices',
        cached: false, 
        expire: null,
        prepare: () => {}
    },      
    {
        url: '/InvDisountGroup', 
        redis_prefix: '',  
        sql_get_all: 'select * from discounts_invdisountgroup', 
        sql_get_one: 'select * from discounts_invdisountgroup where id = ?', 
        sql_update:         'update discounts_invdisountgroup set name=? where id=?',
        sql_insert:    'insert into discounts_invdisountgroup (name, id) values (?,?)',        
        sql_delete:    'delete from discounts_invdisountgroup where id = ?',
        table:                     'discounts_invdisountgroup',
        cached: false, 
        expire: null,
        prepare: prepareSimpleDictionary
    },      
    {
        url: '/UserInvDisount', 
        redis_prefix: '',  
        sql_get_all: 'select id, group_id "group", user_id "user" from discounts_userinvdisount', 
        sql_get_one: 'select id, group_id "group", user_id "user" from discounts_userinvdisount where id = ?', 
        sql_update:  'update discounts_userinvdisount set group_id = ?, user_id=? where id = ?',
        sql_insert:  'insert into discounts_userinvdisount (group_id, user_id, id) values (?,?,?)',
        sql_delete:  'delete from discounts_userinvdisount where id = ?',
        table:       'discounts_userinvdisount',
        cached: false, 
        expire: null,
        prepare: prepareUserDisount
    },      

    
    {
        url: '/invertors', // 
        redis_prefix: 'invertor', 
        sql_get_all: invertorSQL,
        sql_get_one: invertorSQL + ' and id = ?',

        sql_update: `update d_invertors set   item_id=?, 
                                              serie_id=?, 
                                              input_voltage_id=?, 
                                              size_id=?, 
                                              type_of_break_module_id=?, 
                                              type_of_dc_drossel_id=?, 
                                              type_of_emc_drossel_id=?,
                                              name=?,
                                              p_heavy_g=?,
                                              p_pumps_p=?,
                                              current_g=?,
                                              current_p=?
                                        where id=?`,
        sql_insert: `insert into d_invertors (item_id, 
                                              serie_id, 
                                              input_voltage_id, 
                                              size_id, 
                                              type_of_break_module_id, 
                                              type_of_dc_drossel_id, 
                                              type_of_emc_drossel_id,
                                              name,
                                              p_heavy_g,
                                              p_pumps_p,
                                              current_g,
                                              current_p,
                                              id) 
                                      values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        sql_delete: 'delete from d_invertors where id = ?',
        table: 'd_invertors',
        cached: true,  
        expire: 60*24*7,  // Храним в кэше неделю
        prepare: prepareInvertor
    },
    {
        url: '/log', 
        redis_prefix: '',  
        sql_get_all: 'select id, action_id "action", user_id "user", date, params from d_logs', 
        sql_get_one: 'select id, action_id "action", user_id "user", date, params from d_logs where id = ?', 
        sql_update:  'update d_logs set date = ?, action_id = ?, user_id = ?, params =? where id = ?',
        sql_insert:  'insert into d_logs (date, action_id, user_id, params, id) values (?,?,?,?,?)',
        sql_delete:  'delete from d_logs where id = ?',
        table:       'd_logs',
        cached: false, 
        expire: null,
        prepare: prepareLog
    },      
    {
        url: '/InvSerieDisount', 
        redis_prefix: '',  
        sql_get_all: 'select id, discount, group_id "group", serie_id "serie" from discounts_invseriedisount', 
        sql_get_one: 'select id, discount, group_id "group", serie_id "serie" from discounts_invseriedisount where id = ?', 
        sql_update:         'update discounts_invseriedisount set group_id = ?, serie_id = ?, discount = ? where id = ?',
        sql_insert:    'insert into discounts_invseriedisount (group_id, serie_id, discount, id) values (?,?,?,?)',
        sql_delete:  '  delete from discounts_invseriedisount where id = ?',
        table:                     'discounts_invseriedisount',
        cached: false, 
        expire: null,
        prepare: prepareInvSerieDisount
    },      
    {
        url: '/InvOptionDisount', 
        redis_prefix: '',  
        sql_get_all: 'select id, discount, group_id "group", option_id "option" from discounts_invoptiondisount', 
        sql_get_one: 'select id, discount, group_id "group", option_id "option" from discounts_invoptiondisount where id = ?', 
        sql_update:         'update discounts_invoptiondisount set group_id = ?, option_id = ?, discount = ? where id = ?',
        sql_insert:    'insert into discounts_invoptiondisount (group_id, option_id, discount, id) values (?,?,?,?)',
        sql_delete:  '  delete from discounts_invoptiondisount where id = ?',
        table:                     'discounts_invoptiondisount',
        cached: false, 
        expire: null,
        prepare: prepareInvOptionDisount
    },      
    
    {
        url: '/UserInvConfg', // протестировано
        redis_prefix: '',  
        sql_get_all: 'select id, date, options, invertor_id "invertor", user_id "user", staff_opened, invertor_discount, invertor_price, options_disccounts, options_prices, info from d_user_inv_config', 
        sql_get_one: 'select id, date, options, invertor_id "invertor", user_id "user", staff_opened, invertor_discount, invertor_price, options_disccounts, options_prices, info from d_user_inv_config where id = ?', 
        sql_update:         'update d_user_inv_config set date=?, user_id=?, invertor_id=?, invertor_price=?, invertor_discount=?, options=?, options_prices=?, options_disccounts=?, info=?, staff_opened=? where id = ?',
        sql_insert:    'insert into d_user_inv_config (date, user_id, invertor_id, invertor_price, invertor_discount, options, options_prices, options_disccounts, info, staff_opened, id) values (?,?,?,?,?,?,?,?,?,?,?)',
        sql_delete:  '  delete from d_user_inv_config where id = ?',
        table:                     'd_user_inv_config',
        cached: false, 
        expire: null,
        prepare: prepareUserInvConfig
    },      
    
]


