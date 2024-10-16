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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.verifyJWT = exports.HashPassword = void 0;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const sql_1 = require("./sql");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = 'secret';
const REFRESH_TOKEN_SECRET = 'secret';
const HashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt();
    const hash = yield bcrypt.hash(password, salt);
    return hash;
});
exports.HashPassword = HashPassword;
function generateAccessToken(id) {
    return jsonwebtoken_1.default.sign({ user_id: id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
function generateRefreshToken(id) {
    return jsonwebtoken_1.default.sign({ user_id: id }, REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
}
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    return new Promise((resolve, reject) => {
        // If there's no token, deny access with a 401 Unauthorized status
        if (!token) { // Если не нашли токена
            resolve('no token found');
            //return res.status(401).json({ message: "Token not found" });
        }
        else { // Если токен передан, осущетсвляем прверку
            const decodedToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
            // Get the user linked to the token
            (0, sql_1.sql_get)('select id from auth_user where access = ?', [token]) // ищем пользователя по токену
                .then((result) => {
                var user = 0;
                result ? user = result.id : {};
                if (!user) { // токен проверку не прошёл
                    reject('User not found');
                    // return res.status(404).json({ message: "User not found" }); 
                }
                else {
                    resolve('токен правильный');
                }
            });
        }
    });
});
exports.verifyJWT = verifyJWT;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Получаем Refresh token из тела запроса
    const incomingRefreshToken = req.body.refresh;
    // Если не нашли, возвращаем ошибку
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }
    try {
        // Проверяем полученный токен с помощью ключа
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
        const user_id = decodedToken.user_id;
        var sqlToken = '';
        // Ищем пользователя с таким токеном
        (0, sql_1.sql_get)('select refresh from auth_user where id = ?', [user_id])
            .then((result) => {
            sqlToken = result.refresh;
            if (!sqlToken) {
                return res.status(404).json({ message: "User not found" });
            }
            // Если токен в базе данных и присланный не совадают, возвращаем ошибку
            if (sqlToken !== incomingRefreshToken) {
                return res.status(401).json({ message: "Refresh token is incorrect" });
            }
            // Создаём новые токены
            const accessToken = generateAccessToken(user_id);
            const refreshToken = generateRefreshToken(user_id);
            (0, sql_1.sql_run)('update auth_user set access = ?, refresh = ? where id = ?', [accessToken, refreshToken, user_id])
                .then(() => {
                res.status(200)
                    .json({ access: accessToken,
                    refresh: refreshToken,
                    message: "Access token refreshed" });
            })
                .catch((error) => {
                return res.status(401).json({ message: "Не смог обновить токен в базе данных" });
            });
        })
            .catch((err) => {
            return res.status(404).json({ message: "User not found" });
        });
    }
    catch (error) {
        // Handle any errors during token refresh with a 500 Internal Server Error status
        return res.status(500).json({ message: error.message });
    }
});
exports.refreshAccessToken = refreshAccessToken;
