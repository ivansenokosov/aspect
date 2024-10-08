export const invertorSQL = `with prices as (
    select p.price,
           c.name "currency",
           i.quantity,
           w.name "waiting_period",
           i.id
    from d_prices p,
         d_items i,
         d_invertors inv,
         s_currency c,
         s_waiting_time w
    where p.item_id = i.id 
      and i.id = inv.item_id 
      and p.currency_id = c.id 
      and i.waiting_period_id = w.id
  )
  
  select inv.id,
         inv.item_id "item",
         inv.serie_id "serie",
         inv_s.name "serie_str", 
         man.name "manufactory_str",
         man.id "manufactory",
         dc.id "type_of_dc_drossel", 
         dc.name "type_of_dc_drossel_str",
         emc.id "type_of_emc_drossel",
         inv.name "name",
         inv.p_heavy_g "p_heavy_g",
         inv.p_pumps_p "p_pumps_p",
         inv.current_g "current_g",
         inv.current_p "current_p",
         emc.name "type_of_emc_drossel_str",
         iv.id "input_voltage",
         iv.name "input_voltage_str",
         bm.id "type_of_break_module",
         bm.name "type_of_break_module_str", 
         size.id "size",
         size.name "size_str",
         ov.name "output_voltage_str",
         inv_s.min_power,
         inv_s.max_power,
         toc.id "type_of_control",
         toc.name "type_of_control_str",
         top.id "type_of_panel",
         top.name "type_of_panel_str",
         too.g_mode "overload_g_mode",
         too.p_mode "overload_p_mode",
         af.name "type_of_accuracy_freq_str",
         lip.name "level_IP_str",
         lip.id "level_IP",
         inv_s.description,
         p.price "price",
         p.currency,
         p.quantity,
         p.waiting_period
  
         
  from d_invertors inv,
       s_inv_series inv_s,
       s_manufactory man,
       s_level_ip lip,
       s_inv_DC_drossel dc,
       s_inv_EMC_drossel emc,
       s_inv_input_voltage iv,
       s_inv_breake_module bm,
       s_size_of_invertors size,
       s_inv_output_voltage ov,
       s_type_of_control toc,
       s_inv_type_of_panel top,
       s_inv_type_of_overload too,
       s_inv_accurancy_frenq af,
       prices p
       
  where inv.serie_id = inv_s.id
    and inv_s.manufactory_id = man.id
    and inv_s.level_IP_id = lip.id
    and inv.type_of_dc_drossel_id = dc.id
    and inv.type_of_emc_drossel_id = emc.id
    and inv.input_voltage_id = iv.id
    and inv.type_of_break_module_id = bm.id
    and inv.size_id = size.id
    and inv_s.output_voltage_id = ov.id
    and inv_s.type_of_control_id = toc.id
    and inv_s.type_of_panel_id = top.id
    and inv_s.type_of_overload_id = too.id
    and inv_s.type_of_accuracy_freq_id = af.id
    and p.id = inv.item_id`