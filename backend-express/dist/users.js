"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.logoutUser = void 0;
exports.auth = auth;
exports.register = register;
exports.change = change;
const sql_1 = require("./sql");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("./jwt");
// Аутентификация, по логину и паролу возрващает токены
function auth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        yield (0, sql_1.sql_get)('SELECT * FROM auth_user WHERE username = ?', [username])
            .then((result) => {
            if (result) {
                bcrypt.compare(password, result.password).then((isPasswordMatched) => {
                    if (isPasswordMatched) {
                        const accesToken = (0, jwt_1.generateAccessToken)(result.id); // создаём Access token
                        const refreshToken = (0, jwt_1.generateRefreshToken)(result.id); // создаём Refresh token
                        (0, sql_1.sql_run)('update auth_user set access = ?, refresh = ? where id = ?', [accesToken, refreshToken, result.id]) // Записывваем Refresh token в базу данных
                            .then(() => {
                            return res.status(200).json({ message: "user logged in", access: accesToken, refresh: refreshToken }); // Возвращаем токены
                        })
                            .catch((error) => {
                            console.log(error);
                            return res.status(400).json({ message: error }); // Возвращаем ошибку
                        });
                    }
                    else {
                        res.status(400).send("Invalid password");
                    }
                });
            }
            else {
                res.status(400).send("Invalid user");
            }
        });
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, first_name, second_name, is_active, is_staff, is_superuser, email } = req.body;
        (0, sql_1.sql_get)('SELECT * FROM user WHERE username = ', [username])
            .then((result) => {
            if (result === undefined) {
                (0, jwt_1.HashPassword)(password).then((hashedPassword) => {
                    let createNewUser = `INSERT INTO auth_user (username, hashedPassword, first_name, second_name, is_active, is_staff, is_superuser, email, id) VALUES (?,?,?,?,?,?,?,?,?)`;
                    (0, sql_1.getNextId)('auth_user').then((id) => {
                        (0, sql_1.sql_run)(createNewUser, [username, hashedPassword, first_name, second_name, is_active, is_staff, is_superuser, email, id]).then(() => {
                            res.status(200);
                            res.send(`User created successfully`);
                        });
                    });
                });
            }
            else {
                res.status(400);
                res.send(`User already exists`);
            }
        });
    });
}
function change(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // let { username, oldPassword, newPassword } = req.body;
        // let getUserDetail = `SELECT * FROM user WHERE username = '${username}'`;
        // let dbResponse = await db.get(getUserDetail);
        // const isPasswordCheck = await bcrypt.compare(
        //   oldPassword,
        //   dbResponse.password
        // );
        // console.log(isPasswordCheck);
        // let oldPasswordHash = await bcrypt.hash(oldPassword, 10);
        // if (!isPasswordCheck) {
        //   res.status(400);
        //   res.send(`Invalid current password`);
        // } else {
        //   if (newPassword.length < 5) {
        //     res.status(400);
        //     res.send(`Password is too short`);
        //   } else {
        //     let newPasswordHash = await bcrypt.hash(newPassword, 10);
        //     let updatePasswordQuery = `UPDATE user SET password = '${newPasswordHash}' WHERE username = '${username}'`;
        //     let dbResponse = await db.run(updatePasswordQuery);
        //     res.status(200);
        //     res.send(`Password updated`);
        //   }
        // }
    });
}
// Удаляет токены из информации о пользователе
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sql_1.sql_run)("update auth_user set access='', refresh='' where id = ?", [req.body.id])
        .then((result) => {
        return res
            .status(200)
            .json({ user: {}, message: "Logged out successfully" });
    });
});
exports.logoutUser = logoutUser;
