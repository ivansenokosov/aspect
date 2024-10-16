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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextId = getNextId;
exports.sql_get = sql_get;
exports.sql_all = sql_all;
exports.sql_run = sql_run;
const sqlite3_1 = require("sqlite3");
const db = new sqlite3_1.Database('./db.sqlite3');
function getNextId(table) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = 0;
        return new Promise((resolve, reject) => {
            db.get('select max(id) maxid from ' + table, [], function (err, row) {
                if (err) {
                    reject(0);
                }
                resolve(Number(row.maxid) + 1);
            });
        });
    });
}
function sql_get(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.get(sql, params, function (err, row) {
                if (err) {
                    reject(0);
                }
                resolve(row);
            });
        });
    });
}
function sql_all(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.all(sql, params, function (err, rows) {
                if (err) {
                    reject(0);
                }
                resolve(rows);
            });
        });
    });
}
function sql_run(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err, row) {
                if (err) {
                    reject(0);
                }
                resolve(row);
            });
        });
    });
}
