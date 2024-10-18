import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import { Database } from 'sqlite3';
import { getAllData, getData, updateData, deleteData, insertData, getCountUnread } from './appController'
import { auth, logoutUser  } from './users';
import { refreshAccessToken, verifyJWT } from './jwt';
import inv_photo_storage from './uploadPhoto';
import inv_schema_storage from './uploadSchema';
import logo_storage from './uploadLogo'

const db = new Database('db.sqlite3');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const redis = new Redis(); // Create a Redis client


// CORS 
// const allowedOrigins = ['http://192.168.1.5:5173/','http://127.0.0.1:3000','http://localhost:3000'];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };
// app.use(cors(options));
app.use(cors());
app.use(express.static('assets'));
// app.use(fileUpload());

app.get   ('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { verifyJWT(req, res, next).then(()=> getData(req, res, next)).catch(()=>{res.send('no data')}) } );
app.get   ('/data/*',      (req:express.Request, res:express.Response, next: express.NextFunction) => { verifyJWT(req, res, next).then(()=> getAllData(req, res, next)).catch(()=>{res.send('no data')}) });
app.delete('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { verifyJWT(req, res, next).then(()=> deleteData(req, res, next)).catch(()=>{res.send('no data')}) });
app.put   ('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { verifyJWT(req, res, next).then(()=> updateData(req, res, next)).catch(()=>{res.send('no data')}) });
app.post  ('/data/*',      (req:express.Request, res:express.Response, next: express.NextFunction) => { verifyJWT(req, res, next).then(()=> insertData(req, res, next)).catch(()=>{res.send('no data')}) });

app.get   ('/interface/countUnread', (req:express.Request, res:express.Response) => { getCountUnread(req, res) });  // Сколько конфигураций ещё не просмотрено   

app.post  ('/user/auth',         (req:express.Request, res:express.Response) => { auth(req, res) });                // Аутентификация, возвращает токены
app.post  ('/user/refresh',      (req:express.Request, res:express.Response) => { refreshAccessToken(req, res) });  // обновляет AccessToken
app.post  ('/user/logout/:key',  (req:express.Request, res:express.Response) => { logoutUser(req, res) });          // Удаляет из пользователя информацию о токене

app.post  ("/upload_inv_photo",  inv_photo_storage,  (req, res) => { res.json({ file: req.file }) });  // загрузка изображений фото серий инвертора
app.post  ("/upload_inv_schema", inv_schema_storage, (req, res) => { res.json({ file: req.file }) });  // загрузка изображений схемы серии инвертора
app.post  ("/upload_logo",       logo_storage,       (req, res) => { console.log(req.body.file); res.json({ file: req.file }) });  // загрузка логотипа организации 

app.get   ('*', (req:express.Request, res:express.Response) => { res.send(`${req.url} is wrong path`) });  // Сообщение для неверного пути


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});