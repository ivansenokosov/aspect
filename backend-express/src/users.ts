import express from 'express';
import { sql_get, sql_all, sql_run } from './sql'
import * as bcrypt from 'bcrypt'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET  = 'secret'
const REFRESH_TOKEN_SECRET = 'secret'


export const HashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function register(req:express.Request, res:express.Response) {
  const { username, name, password, gender, location } = req.body;
  sql_get('SELECT * FROM user WHERE username = ', [username])
    .then((result:any) =>{
        if (result === undefined) {
            HashPassword(password).then((hashedPassword:string) => {
                let createNewUser = `INSERT INTO user (username,name,password,gender,location) VALUES ('${username}','${name}','${hashedPassword}','${gender}','${location}')`;
                // let insertInDataBase = await db.run(createNewUser);
                res.status(200);
                res.send(`User created successfully`);
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


export function generateAccessToken(id:number):string {
    return jwt.sign({user_id: id}, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}
export function generateRefreshToken(id:number):string {
    const qqq = jwt.sign({user_id: id}, REFRESH_TOKEN_SECRET, {expiresIn: "15d" });
    return(qqq)
}


export const verifyJWT = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      var user:number = 0
  
      // If there's no token, deny access with a 401 Unauthorized status
      if (!token) {
        return res.status(401).json({ message: "Token not found" });
      }
  
      // Check if the token is valid using a secret key
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  
      // Get the user linked to the token
      sql_get('select id from auth_user where token = ?',[decodedToken])
        .then((result:any) => { user = result.id})
  
      // If the user isn't found, deny access with a 404 Not Found status
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Attach user info to the request for further use
    //   req.user = user; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //   req.user = user; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //   req.user = user; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //   req.user = user; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    next();
    } catch (error:any) {
      // Handle any errors during token verification with a 500 Internal Server Error status
      return res.status(500).json({ message: error.message });
    }
  };

  const logoutUser = async (req:express.Request, res:express.Response) => {
    // Remove the refresh token from the user's information
    sql_run("update auth_user set token='' where id = ?",[req.body.id])
        .then((result:any) => {
            return res
            .status(200)
            .json({ user: {}, message: "Logged out successfully" });
     })
  };  



export async function auth(req:express.Request, res:express.Response) {
    const { username, password } = req.body;

    await sql_get('SELECT * FROM auth_user WHERE username = ?',[username])
            .then((result:any)  => {
                if (result) {

                    bcrypt.compare(password, result.password)
                          .then((isPasswordMatched:any)=> { 
                        if (isPasswordMatched) {

                            const accesToken   = generateAccessToken(result.id) // создаём Access token
                            const refreshToken = generateRefreshToken(result.id) // создаём Refresh token

                            sql_run('update auth_user set token = ? where id = ?',[refreshToken, result.id])  // Записывваем Refresh token в базу данных
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


export const refreshAccessToken = async (req:express.Request, res:express.Response) => {
    // Получаем Refresh token из тела запроса
    const incomingRefreshToken = req.body.refresh;
 
    // Если не нашли, возвращаем ошибку
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }
  
    try {
      // Проверяем полученный токен с помощью ключа
      const decodedToken:any = jwt.verify(
        incomingRefreshToken,
        REFRESH_TOKEN_SECRET
      );

      const user_id:number  = decodedToken.user_id
      var sqlToken:string = ''
  
      // Ищем пользователя с таким токеном
      sql_get('select token from auth_user where id = ?',[user_id])
        .then((result) => {
            sqlToken = result.token
            if (!sqlToken) {
                return res.status(404).json({ message: "User not found" });
            }

            // Если токен в базе данных и присланный не совадают, возвращаем ошибку
            if (sqlToken !== incomingRefreshToken) {
                return res.status(401).json({ message: "Refresh token is incorrect" });
            }

            // Создаём новые токены
            const accessToken  = generateAccessToken(user_id)
            const refreshToken = generateRefreshToken(user_id)

            sql_run('update auth_user set token = ? where id = ?',[refreshToken, user_id])
                .then(() => {
                    res.status(200)
                       .json({ access: accessToken, 
                               refresh: refreshToken, 
                               message: "Access token refreshed" });
                             })
                .catch((error:any) => {
                    return res.status(401).json({ message: "Не смог обновить токен в базе данных" });
                })
        })
        .catch((err:any)=> {return res.status(404).json({ message: "User not found" })})

    } catch (error:any) {
      // Handle any errors during token refresh with a 500 Internal Server Error status
      return res.status(500).json({ message: error.message });
    }
  };