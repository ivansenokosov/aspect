import { Database } from 'sqlite3';
const db = new Database('./db.sqlite3');

export async function getNextId(table:string):Promise<number> {
  var id:number = 0
  return new Promise((resolve, reject) => {

    db.get('select max(id) maxid from ' + table, [], function(err:any, row:any) {
      if (err) { reject(0) }
      resolve(Number(row.maxid) + 1);
    });
  })
}

export async function sql_get(sql:string, params:any[]):Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(sql, params, function(err:any, row:any) {
          if (err) { reject(0) }
          resolve(row)
        });
    })
}

export async function sql_all(sql:string, params:any[]):Promise<any> {
    return new Promise((resolve, reject) => {
        db.all(sql, params, function(err:any, rows:any) {
          if (err) { reject(0) }
          resolve(rows)
        });
    })
}

export async function sql_run(sql:string, params:any[]):Promise<any> {
  return new Promise((resolve, reject) => {
      db.run(sql, params, function(err:any, row:any) {
        if (err) { reject(0) }
        resolve(row)
      });
  })
}
