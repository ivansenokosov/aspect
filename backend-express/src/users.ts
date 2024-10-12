
import express from 'express';
import { sql_get, sql_run, getNextId } from './sql'
import * as bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, HashPassword } from './jwt';


// Аутентификация, по логину и паролу возрващает токены

export async function auth(req:express.Request, res:express.Response) {
    const { username, password } = req.body;

    await sql_get('SELECT * FROM auth_user WHERE username = ?',[username])
            .then((result:any)  => {
                if (result) {

                    bcrypt.compare(password, result.password).then((isPasswordMatched:any)=> { 
                        if (isPasswordMatched) {

                            const accesToken   = generateAccessToken(result.id) // создаём Access token
                            const refreshToken = generateRefreshToken(result.id) // создаём Refresh token

                            sql_run('update auth_user set access = ?, refresh = ? where id = ?',[accesToken, refreshToken, result.id])  // Записывваем Refresh token в базу данных
                              .then(() => { 
                                                return res.status(200).json({ message: "user logged in", access:  accesToken, refresh: refreshToken}) // Возвращаем токены
                                          })
                              .catch((error:any) => {
                                            console.log(error)
                                            return res.status(400).json({ message: error }) // Возвращаем ошибку
                                          })
                        } else {
                            res.status(400).send("Invalid password");
                        }
                    })

                } else {
                    res.status(400).send("Invalid user");
                }
            })
}





export async function register(req:express.Request, res:express.Response) {
    const { username, password, first_name, second_name, is_active, is_staff, is_superuser, email } = req.body;
    sql_get('SELECT * FROM user WHERE username = ', [username])
       .then((result:any) =>{
            if (result === undefined) {
                HashPassword(password).then((hashedPassword:string) => {
                    let createNewUser = `INSERT INTO auth_user (username, hashedPassword, first_name, second_name, is_active, is_staff, is_superuser, email, id) VALUES (?,?,?,?,?,?,?,?,?)`;
                    getNextId('auth_user').then((id:number) => {
                        sql_run(createNewUser,[username, hashedPassword, first_name, second_name, is_active, is_staff, is_superuser, email, id]).then(() => {
                            res.status(200);
                            res.send(`User created successfully`);
                        })
                    })
                })
            } else {
              res.status(400);
              res.send(`User already exists`);
            }
      })
}
  
  export async function change(req:express.Request, res:express.Response) {
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
    
  }

// Удаляет токены из информации о пользователе
export const logoutUser = async (req:express.Request, res:express.Response) => {
    sql_run("update auth_user set access='', refresh='' where id = ?",[req.body.id])
        .then((result:any) => {
            return res
            .status(200)
            .json({ user: {}, message: "Logged out successfully" });
     })
};  