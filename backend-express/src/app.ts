import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import { Database } from 'sqlite3';
import { getAllData, getData, updateData, deleteData, insertData, getCountUnread } from './appController'
import { auth, refreshAccessToken } from './users';

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


app.get   ('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { getData   (req, res, next) });
app.get   ('/data/*',      (req:express.Request, res:express.Response, next: express.NextFunction) => { getAllData(req, res, next) });
app.delete('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { deleteData(req, res, next) });
app.put   ('/data/*/:key', (req:express.Request, res:express.Response, next: express.NextFunction) => { updateData(req, res, next) });
app.post  ('/data/*',      (req:express.Request, res:express.Response, next: express.NextFunction) => { insertData(req, res, next) });

app.get   ('/interface/countUnread', (req:express.Request, res:express.Response) => { getCountUnread(req, res) });  // Сколько конфигураций ещё не просмотрено

app.post   ('/user/auth',    (req:express.Request, res:express.Response) => { auth(req, res) });                // Аутентификация, возвращает токены
app.post   ('/user/refresh', (req:express.Request, res:express.Response) => { refreshAccessToken(req, res) });  // обновляет AccessToken


app.get   ('*', (req:express.Request, res:express.Response) => { res.send('wrong path') });  // Сообщение для неверного пути


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});