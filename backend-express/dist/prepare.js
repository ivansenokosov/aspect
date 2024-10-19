"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCompany = prepareCompany;
exports.prepareSimpleDictionary = prepareSimpleDictionary;
exports.prepareInvAvalControl = prepareInvAvalControl;
exports.prepareInvOverload = prepareInvOverload;
exports.prepareInvertor = prepareInvertor;
exports.preparePower = preparePower;
exports.prepareSerie = prepareSerie;
exports.prepareInvOption = prepareInvOption;
exports.prepareItem = prepareItem;
exports.preparePrice = preparePrice;
exports.prepareUserInvConfig = prepareUserInvConfig;
exports.prepareUser = prepareUser;
exports.prepareInvInputOuptput = prepareInvInputOuptput;
exports.prepareInvSignalInputOutput = prepareInvSignalInputOutput;
exports.prepareUserDisount = prepareUserDisount;
exports.prepareInvSerieDisount = prepareInvSerieDisount;
exports.prepareInvOptionDisount = prepareInvOptionDisount;
exports.prepareCompanyUsers = prepareCompanyUsers;
exports.prepareLog = prepareLog;
function prepareCompany(data, id = 0) {
    var _a;
    var params = [data.name,
        data.inn,
        data.address,
        data.agreement,
        data.email,
        data.info, (_a = data.logo) !== null && _a !== void 0 ? _a : '', data.phone];
    id && params.push(id);
    return params;
}
function prepareSimpleDictionary(data, id) {
    var params = [data.name];
    id && params.push(id);
    return params;
}
function prepareInvAvalControl(data, id) {
    var params = [data.serie_id, data.control_id];
    id && params.push(id);
    return params;
}
function prepareInvOverload(data, id) {
    var params = [data.p_mode, data.g_mode];
    id && params.push(id);
    return params;
}
function prepareInvertor(data, id) {
    var params = [data.item_id,
        data.serie_id,
        data.input_voltage_id,
        data.size_id,
        data.type_of_break_module_id,
        data.type_of_dc_drossel_id,
        data.type_of_emc_drossel_id,
        data.name,
        data.p_heavy_g,
        data.p_pumps_p,
        data.current_g,
        data.current_p
    ];
    id && params.push(id);
    return params;
}
function preparePower(data, id) {
    var params = [data.power, data.error];
    id && params.push(id);
    return params;
}
function prepareSerie(data, id) {
    var params = [data.name,
        data.description,
        data.manufactory_id,
        data.output_voltage_id,
        data.type_of_control_id,
        data.type_of_panel_id,
        data.type_of_overload_id,
        data.type_of_accuracy_freq_id,
        data.ambient_temperature_id,
        data.level_IP_id,
        data.min_power,
        data.max_power,
        data.photo,
        data.schema];
    id && params.push(id);
    return params;
}
function prepareInvOption(data, id) {
    var params = [data.item_id,
        data.name,
        data.short_title,
        data.full_title,
        data.series,
        data.option_id];
    id && params.push(id);
    return params;
}
function prepareItem(data, id) {
    var params = [data.type_id,
        data.name,
        data.quantity,
        data.waiting_period_id];
    id && params.push(id);
    return params;
}
function preparePrice(data, id) {
    var params = [data.item_id,
        data.price,
        data.currency_id,
        data.date];
    id && params.push(id);
    return params;
}
function prepareUserInvConfig(data, id) {
    var params = [data.date,
        data.user_id,
        data.invertor_id,
        data.invertor_price,
        data.invertor_discount,
        data.options,
        data.options_prices,
        data.options_disccounts,
        data.info,
        data.staff_opened];
    id && params.push(id);
    return params;
}
function prepareUser(data, id) {
    var params = [data.username,
        data.password,
        data.first_name,
        data.last_name,
        data.email,
        data.is_staff,
        data.is_active,
        data.is_superuser,
        data.date_joined];
    id && params.push(id);
    return params;
}
function prepareInvInputOuptput(data, id) {
    var params = [data.serie_id,
        data.signal_id,
        data.info,
        data.quantity];
    id && params.push(id);
    return params;
}
function prepareInvSignalInputOutput(data, id) {
    var params = [data.serie_id,
        data.signal_id,
        data.quantity];
    id && params.push(id);
    return params;
}
// ------------------------------- Скидки ------------------------------- 
function prepareUserDisount(data, id) {
    var params = [data.group_id,
        data.user_id];
    id && params.push(id);
    return params;
}
function prepareInvSerieDisount(data, id) {
    var params = [data.group_id,
        data.serie_id,
        data.discount];
    id && params.push(id);
    return params;
}
function prepareInvOptionDisount(data, id) {
    var params = [data.group_id,
        data.option_id,
        data.discount];
    id && params.push(id);
    return params;
}
function prepareCompanyUsers(data, id) {
    var params = [data.company_id,
        data.user_id];
    id && params.push(id);
    return params;
}
// ------------------------------- Журналироание ------------------------------- 
function prepareLog(data, id) {
    var params = [data.date,
        data.action_id,
        data.user_id,
        data.params];
    id && params.push(id);
    return params;
}
