import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import { Database } from 'sqlite3';
import { getAllData, getData, updateData, deleteData, insertData } from './appController'

const db = new Database('db.sqlite3');
const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// Create a Redis client
const redis = new Redis();

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

// app.put('/companies', (req:express.Request, res:express.Response) => {
//     res.status(200).send({
//         data: req
//     });
// });
// app.delete('/companies/:key', (req:express.Request, res:express.Response) => {
//   res.status(200).send({
//       data: req
//   });
// });

// app.get('/invertors', (req:express.Request, res:express.Response, next: express.NextFunction) => { getAllData(req, res, next) } );
// app.get('/invertors/:key', (req, res) => {
//   client.get(req.params.key, (err, reply) => {
//       res.status(200).send({
//           data: reply
//       });
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});