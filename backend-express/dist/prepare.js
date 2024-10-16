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
    var params = [data.serie, data.control];
    id && params.push(id);
    return params;
}
function prepareInvOverload(data, id) {
    var params = [data.p_mode, data.g_mode];
    id && params.push(id);
    return params;
}
function prepareInvertor(data, id) {
    var params = [data.item,
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
        data.schema];
    id && params.push(id);
    return params;
}
function prepareInvOption(data, id) {
    var params = [data.item,
        data.name,
        data.short_title,
        data.full_title,
        data.series,
        data.option];
    id && params.push(id);
    return params;
}
function prepareItem(data, id) {
    var params = [data.type,
        data.name,
        data.quantity,
        data.waiting_period];
    id && params.push(id);
    return params;
}
function prepareUserInvConfig(data, id) {
    var params = [data.date,
        data.user,
        data.invertor,
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
    var params = [data.serie,
        data.signal,
        data.info,
        data.quantity];
    id && params.push(id);
    return params;
}
function prepareInvSignalInputOutput(data, id) {
    var params = [data.serie,
        data.signal,
        data.quantity];
    id && params.push(id);
    return params;
}
// ------------------------------- Скидки ------------------------------- 
function prepareUserDisount(data, id) {
    var params = [data.group,
        data.user];
    id && params.push(id);
    return params;
}
function prepareInvSerieDisount(data, id) {
    var params = [data.group,
        data.serie,
        data.discount];
    id && params.push(id);
    return params;
}
function prepareInvOptionDisount(data, id) {
    var params = [data.group,
        data.option,
        data.discount];
    id && params.push(id);
    return params;
}
function prepareCompanyUsers(data, id) {
    var params = [data.company,
        data.user];
    id && params.push(id);
    return params;
}
// ------------------------------- Журналироание ------------------------------- 
function prepareLog(data, id) {
    var params = [data.date,
        data.action,
        data.user,
        data.params];
    id && params.push(id);
    return params;
}
