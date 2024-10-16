"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const cors_1 = __importDefault(require("cors"));
// import fileUpload from 'express-fileupload';
const sqlite3_1 = require("sqlite3");
const appController_1 = require("./appController");
const users_1 = require("./users");
const jwt_1 = require("./jwt");
const uploadPhoto_1 = __importDefault(require("./uploadPhoto"));
const uploadSchema_1 = __importDefault(require("./uploadSchema"));
const uploadLogo_1 = __importDefault(require("./uploadLogo"));
const db = new sqlite3_1.Database('db.sqlite3');
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
const redis = new ioredis_1.default(); // Create a Redis client
// CORS 
// const allowedOrigins = ['http://192.168.1.5:5173/','http://127.0.0.1:3000','http://localhost:3000'];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };
// app.use(cors(options));
app.use((0, cors_1.default)());
app.use(express_1.default.static('assets'));
// app.use(fileUpload());
app.get('/data/*/:key', (req, res, next) => { (0, jwt_1.verifyJWT)(req, res, next).then(() => (0, appController_1.getData)(req, res, next)).catch(() => { res.send('no data'); }); });
app.get('/data/*', (req, res, next) => { (0, jwt_1.verifyJWT)(req, res, next).then(() => (0, appController_1.getAllData)(req, res, next)).catch(() => { res.send('no data'); }); });
app.delete('/data/*/:key', (req, res, next) => { (0, jwt_1.verifyJWT)(req, res, next).then(() => (0, appController_1.deleteData)(req, res, next)).catch(() => { res.send('no data'); }); });
app.put('/data/*/:key', (req, res, next) => { (0, jwt_1.verifyJWT)(req, res, next).then(() => (0, appController_1.updateData)(req, res, next)).catch(() => { res.send('no data'); }); });
app.post('/data/*', (req, res, next) => { (0, jwt_1.verifyJWT)(req, res, next).then(() => (0, appController_1.insertData)(req, res, next)).catch(() => { res.send('no data'); }); });
app.get('/interface/countUnread', (req, res) => { (0, appController_1.getCountUnread)(req, res); }); // Сколько конфигураций ещё не просмотрено   
app.post('/user/auth', (req, res) => { (0, users_1.auth)(req, res); }); // Аутентификация, возвращает токены
app.post('/user/refresh', (req, res) => { (0, jwt_1.refreshAccessToken)(req, res); }); // обновляет AccessToken
app.post('/user/logout/:key', (req, res) => { (0, users_1.logoutUser)(req, res); }); // Удаляет из пользователя информацию о токене
app.post("/upload_inv_photo", uploadPhoto_1.default, (req, res) => { res.json({ file: req.file }); }); // загрузка изображений фото серий инвертора
app.post("/upload_inv_schema", uploadSchema_1.default, (req, res) => { res.json({ file: req.file }); }); // загрузка изображений схемы серии инвертора
app.post("/upload_logo", uploadLogo_1.default, (req, res) => { console.log(req.body.file); res.json({ file: req.file }); }); // загрузка логотипа организации 
app.get('*', (req, res) => { res.send(`${req.url} is wrong path`); }); // Сообщение для неверного пути
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
