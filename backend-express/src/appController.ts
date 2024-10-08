import express from 'express';
import Redis from 'ioredis';
import Async from 'async'
import { Database } from 'sqlite3';
import type { IData  } from './interfaces';
import { data } from './data';

const db = new Database('./db.sqlite3');
const redis = new Redis();

/*
  Function to handle the Index Route
*/
// exports.getIndexPage = (req:express.Request, res:express.Response) => {
//   res.json({ status: 200, message: 'Simple CRUD RESTFUL API using Node JS, Express JS, and Redis.' });
// };

async function getNextId(table:string):Promise<number> {
  var id:number = 0
  return new Promise((resolve, reject) => {

    db.get('select max(id) maxid from ' + table, [], function(err, row:any) {
      if (err) { reject(0) }
      resolve(Number(row.maxid) + 1);
    });
  })
}


/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Получение данных всех записей --------------------------------
------------------------------------------------------------------------------------------------------*/
export const getAllData = (req:express.Request, res:express.Response, next:express.NextFunction) => {
  const url = req.url.substring(5,req.url.length)
  const d:IData = data.find((item:IData) => item.url === url)!

  if (!d) { return res.json({ status: 400, message: 'getAllData. неверные настройки пути и приложения' }); }
  
  redis.keys(d.redis_prefix + ':*', (err:any, keys:any) => {
    if (err) { return res.json({ status: 400, message: 'не могу получить данные', err }); }

    if (keys.length > 0 && d.cached) {  // Ключи в Редис найдены и данные нужно брать из кэша
        Async.map(keys, (key:string, cb:Function) => {
          redis.get(key, (error:any, value:any) => {  // redis.hgetall(key, (error:any, value:any) => {
            if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
            cb(null, JSON.parse(value));
          });
        }, (error, company) => {
          if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
          res.json(company);
        });
    } else {
        db.all(d.sql_get_all, [], function(err, rows:any[]) {
            if (err) { return next(err); }
            d.cached && rows.map((row:any) => { // нужно кэшировать
                d.expire // установлен срок истечения?
                          ? redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row), 'EX', d.expire) 
                          : redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row))
            });
            res.status(200).send(rows)
          });
    }
  });
};

/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Получение данных одной записи  -------------------------------
------------------------------------------------------------------------------------------------------*/
export const getData = (req:express.Request, res:express.Response, next: express.NextFunction) => {
  const id  = req.params.key;
  const url = req.url.substring(5,req.url.indexOf('/',6))
  const d:IData = data.find((item:IData) => item.url === url)!

  if (!d) { return res.json({ status: 400, message: 'getData. неверные настройки пути и приложения' }); }

  redis.keys(d.redis_prefix + ':' + id, (err:any, keys:any) => {
    if (err) { return res.json({ status: 400, message: 'не могу получить данные', err }); }

    if (keys.length > 0 && d.cached) {  // Ключи в Редис найдены и данные нужно брать из кэша
        redis.get(d.redis_prefix + ':' + id, (error:any, value:any) => {  
          if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
          res.status(200).send(JSON.parse(value))
        });
    } else {
        db.get(d.sql_get_one, [id], function(err:any, row:any) {
            if (err) { return next(err); }
              d.cached && d.expire // установлен срок истечения?
                          ? redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row), 'EX', d.expire) 
                          : redis.set(d.redis_prefix + ':' + row.id, JSON.stringify(row))
          res.status(200).send(row)
        });
    }
  });
};

/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Удаление данных одной записи  --------------------------------
------------------------------------------------------------------------------------------------------*/
export const deleteData = (req:express.Request, res:express.Response, next: express.NextFunction) => {
  const id  = req.params.key;
  const url = req.url.substring(5,req.url.indexOf('/',6))
  const d:IData = data.find((item:IData) => item.url === url)!

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

  d.cached && redis.del(d.redis_prefix + ':' + id, (error:any, value:any) => { 
    if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
  });

  db.run(d.sql_delete, [id], function(err:any) {
    if (err) { return next(err); }
    res.json({ status: 200, message: 'Запись удалена' })
  })
};

/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Изменение одной записи  --------------------------------------
------------------------------------------------------------------------------------------------------*/
export const updateData = (req:express.Request, res:express.Response, next: express.NextFunction) => {
  const id  = req.params.key;
  const url = req.url.substring(5,req.url.indexOf('/',6))
  const d:IData = data.find((item:IData) => item.url === url)!

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

  d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body));

  const params = d.prepare(req.body, id);

  db.run(d.sql_update, params, (error:any, result:any) => { 
      if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
  })

  res.json({ status: 200, message: 'Запись изменена' })
};

/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Добавление одной записи  --------------------------------------
------------------------------------------------------------------------------------------------------*/
export const insertData = (req:express.Request, res:express.Response, next: express.NextFunction) => {
  const url = req.url.substring(5,req.url.length)
  const d:IData = data.find((item:IData) => item.url === url)!

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

   getNextId(d.table).then((id:number) => {
      d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body));
      const params = d.prepare(req.body, id)
      console.log(params)
      db.run('insert into d_companies (name, inn, address, agreement, email, info, logo, phone, id) values (?,?,?,?,?,?,?,?,?)', params, (error:any, result:any) => { 
          if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
          console.log(`A row has been inserted with rowid `, result);
      })
      res.json({ status: 200, message: 'Запись добавлена' })

   })
//  req.body. = id
  // console.log('id2',id)
  // console.log(params)


  console.log('we are here')
};
