import express from 'express';
import Redis from 'ioredis';
import Async from 'async'
import { Database } from 'sqlite3';
import type { IData } from './interfaces';
import { data } from './data';

const db = new Database('./db.sqlite3');
const redis = new Redis();

async function getNextId(table:string):Promise<number> {
  var id:number = 0
  return new Promise((resolve, reject) => {

    db.get('select max(id) maxid from ' + table, [], function(err:any, row:any) {
      if (err) { reject(0) }
      resolve(Number(row.maxid) + 1);
    });
  })
}

const countUnread = async ():Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get('select count(id) "count" from d_user_inv_config where staff_opened=0', [], function(err:any, row:any) {
      if (err) { reject(0) }
      resolve(row.count)
    });
  })
}


const findData = (url:string):IData => {
  return data.find((item:IData) => item.url.toUpperCase() === url.toUpperCase())!
}

/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Получение данных всех записей --------------------------------
------------------------------------------------------------------------------------------------------*/
export const getAllData = (req:express.Request, res:express.Response, next:express.NextFunction) => {
  var path : number = 0
  
  path = req.url.indexOf('/',7)
  if (path<6) { path = req.url.indexOf('?') }
  if (path<6) { path = req.url.length }
  const url = req.url.substring(5, path)


  const d:IData = findData(url)

  if (!d) { return res.json({ status: 400, message: 'getAllData. неверные настройки пути и приложения' }); }

  var sql : string = d.sql_get_all
  var sql_prefix : string = ' where '
  if (d.sql_get_all.includes('where')) sql_prefix = ' and '

  if (req.query) { // Если в запросе есть параметры
    if (req.query.operator === 'equal') 
      sql += sql_prefix + req.query.column + ' = ' + req.query.value
    if (req.query.operator === 'like') 
      sql += sql_prefix + req.query.column + ' like "%' + req.query.value + '%"'
  }

  
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
        db.all(sql, [], function(err, rows:any[]) {
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
  const d:IData = findData(url)

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
            if (err) { 
              res.status(400).send(err)
                // return next(err); 
            }
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
  const d:IData = findData(url)

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

  d.cached && redis.del(d.redis_prefix + ':' + id, (error:any, value:any) => { // Если объект кэшируемый, то удаляем его в кэш
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
  const d:IData = findData(url)

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

  d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body));  // Если объект кэшируемый, то изменяем его в кэше

  const params = d.prepare(req.body, id);  // Преобразовали JSON объекта в параметры для функции вставки

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
  const d:IData = findData(url)

  if (!d) { return res.json({ status: 400, message: 'неверные настройки пути и приложения' }); }

   getNextId(d.table).then((id:number) => {
      d.cached && redis.set(d.redis_prefix + ':' + id, JSON.stringify(req.body));  // Если объект кэшируемый, то добавляем его в кэш
      const params = d.prepare(req.body, id)  // Преобразовали JSON объекта в параметры для функции вставки

      console.log('we are here', d.sql_insert, params)
      d.sql_insert && db.run(d.sql_insert, params, (error:any, result:any) => { 
          if (error) return res.json({ status: 400, message: 'что-то пошло не так', error });
      })
      res.json({ status: 200, message: 'Запись добавлена' })
   })
};


/* ---------------------------------------------------------------------------------------------------
--------------------------------------  Количесвто непрчитанных конфигураций -------------------------
------------------------------------------------------------------------------------------------------*/
export const getCountUnread = async (req:express.Request, res:express.Response) => {
  countUnread().then((n:number) => { res.json({ status: 200, count: n })})  
}