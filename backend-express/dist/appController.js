"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountUnread = exports.insertData = exports.updateData = exports.deleteData = exports.getData = exports.getAllData = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const async_1 = __importDefault(require("async"));
const sqlite3_1 = require("sqlite3");
const data_1 = require("./data");
const sql_1 = require("./sql");
const db = new sqlite3_1.Database('./db.sqlite3');
const redis = new ioredis_1.default();
const countUnread = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.get('select count(id) "count" from d_user_inv_config where staff_opened=0', [], function (err, row) {
            if (err) {
                reject(0);
            }
            resolve(row.count);
        });
    });
});
const findData = (url) => {
    return data_1.data.find((item) => item.url.toUpperCase() === url.toUpperCase());
};
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Получение данных всех записей --------------------------------
------------------------------------------------------------------------------------------------------*/
const getAllData = (req, res, next) => {
    var path = 0;
    path = req.url.indexOf('/', 7);
    if (path < 6) {
        path = req.url.indexOf('?');
    }
    if (path < 6) {
        path = req.url.length;
    }
    const url = req.url.substring(5, path);
    const d = findData(url);
    if (!d) {
        return res.json({ status: 400, message: 'getAllData. неверные настройки пути и приложения' });
    }
    var sql = d.sql_get_all;
    var sql_prefix = ' where ';
    if (d.sql_get_all.includes('where'))
        sql_prefix = ' and ';
    if (req.query) { // Если в запросе есть параметры
        if (req.query.operator === 'equal')
            sql += sql_prefix + req.query.column + ' = ' + req.query.value;
        if (req.query.operator === 'like')
            sql += sql_prefix + req.query.column + ' like "%' + req.query.value + '%"';
    }
    redis.keys(d.redis_prefix + ':*', (err, keys) => {
        if (err) {
            return res.json({ status: 400, message: 'не могу получить данные', err });
        }
        if (keys.length > 0 && d.cached) { // Ключи в Редис найдены и данные нужно брать из кэша
            async_1.default.map(keys, (key, cb) => {
                redis.get(key, (error, value) => {
                    if (error)
                        return res.json({ status: 400, message: 'что-то пошло не так', error });
                    cb(null, JSON.parse(value));
                });
            }, (error, company) => {
                if (error)
                    return res.json({ status: 400, message: 'что-то пошло не так', error });
                res.json(company);
            });
        }
        else {
            (0, sql_1.sql_all)(sql, [])
                .then((rows) => {
                d.cached && rows.map((row) => {
                    d.expire // установлен срок истечения?
                        ? redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row), 'EX', d.expire)
                        : redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row));
                });
                res.status(200).send(rows);
            })
                .catch((err) => {
                console.log('error', err);
                res.json({ status: 400, message: 'SQL запрос не выполнен', err });
            });
        }
    });
};
exports.getAllData = getAllData;
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Получение данных одной записи  -------------------------------
------------------------------------------------------------------------------------------------------*/
const getData = (req, res, next) => {
    const id = req.params.key;
    const url = req.url.substring(5, req.url.indexOf('/', 6));
    const d = findData(url);
    if (!d) {
        return res.json({ status: 400, message: 'getData. неверные настройки пути и приложения' });
    }
    redis.keys(d.redis_prefix + ':' + id, (err, keys) => {
        if (err) {
            return res.json({ status: 400, message: 'не могу получить данные', err });
        }
        if (keys.length > 0 && d.cached) { // Ключи в Редис найдены и данные нужно брать из кэша
            redis.get(d.redis_prefix + ':' + id, (error, value) => {
                if (error)
                    return res.json({ status: 400, message: 'что-то пошло не так', error });
                res.status(200).send(JSON.parse(value));
            });
        }
        else {
            (0, sql_1.sql_get)(d.sql_get_one, [id])
                .then((row) => {
                d.cached && d.expire // установлен срок истечения?
                    ? redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row), 'EX', d.expire)
                    : redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row));
                console.log('sql выполнен успешно', d.sql_get_one, [id]);
                res.status(200).send(row);
            })
                .catch((err) => {
                console.log('ошибка выполнения sql', err);
                res.status(400).send(err);
            });
        }
    });
};
exports.getData = getData;
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Удаление данных одной записи  --------------------------------
------------------------------------------------------------------------------------------------------*/
const deleteData = (req, res, next) => {
    const id = req.params.key;
    const url = req.url.substring(5, req.url.indexOf('/', 6));
    const d = findData(url);
    if (!d) {
        return res.json({ status: 400, message: 'неверные настройки пути и приложения' });
    }
    d.cached && redis.del(d.redis_prefix + ':' + id, (error, value) => {
        if (error)
            return res.json({ status: 400, message: 'что-то пошло не так', error });
    });
    db.run(d.sql_delete, [id], function (err) {
        if (err) {
            return next(err);
        }
        res.json({ status: 200, message: 'Запись удалена' });
    });
};
exports.deleteData = deleteData;
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Изменение одной записи  --------------------------------------
------------------------------------------------------------------------------------------------------*/
const updateData = (req, res, next) => {
    const id = req.params.key;
    const url = req.url.substring(5, req.url.indexOf('/', 6));
    const d = findData(url);
    if (!d) {
        return res.json({ status: 400, message: 'неверные настройки пути и приложения' });
    }
    d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body)); // Если объект кэшируемый, то изменяем его в кэше
    const params = d.prepare(req.body, id); // Преобразовали JSON объекта в параметры для функции вставки
    console.log(d.sql_update, params);
    (0, sql_1.sql_run)(d.sql_update, params)
        .then((result) => {
        console.log('result', result);
        res.status(200).json({ message: 'Запись изменена', reslult: result });
    })
        .catch((error) => {
        console.log('error', error);
        res.status(400).json({ message: 'что-то пошло не так', error });
    });
};
exports.updateData = updateData;
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Добавление одной записи  --------------------------------------
------------------------------------------------------------------------------------------------------*/
const insertData = (req, res, next) => {
    const url = req.url.substring(5, req.url.length);
    const d = findData(url);
    if (!d) {
        return res.json({ status: 400, message: 'неверные настройки пути и приложения' });
    }
    console.log('Добавление новой записи', url);
    (0, sql_1.getNextId)(d.table)
        .then((id) => {
        d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body)); // Если объект кэшируемый, то добавляем его в кэш
        const params = d.prepare(req.body, id); // Преобразовали JSON объекта в параметры для функции вставки
        console.log('we are here', d.sql_insert, params);
        d.sql_insert && (0, sql_1.sql_run)(d.sql_insert, params)
            .then((reslut) => {
            console.log(d.sql_insert, params);
            console.log('Запись добавлена', reslut);
            res.status(200).json({ message: 'Запись добавлена', id: id });
        })
            .catch((error) => {
            console.log('error', error);
            res.status(400).json({ message: 'что-то пошло не так', error });
        });
    })
        .catch((err) => {
        console.log('ошибка получения id');
        res.status(400).json({ message: 'Ошибка получения id', error: err });
    });
};
exports.insertData = insertData;
/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Количесвто непрчитанных конфигураций -------------------------
------------------------------------------------------------------------------------------------------*/
const getCountUnread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    countUnread().then((n) => { res.json({ status: 200, count: n }); });
});
exports.getCountUnread = getCountUnread;
