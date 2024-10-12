import express from 'express';
import { sql_get, sql_run } from './sql'
import * as bcrypt from 'bcrypt'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET  = 'secret'
const REFRESH_TOKEN_SECRET = 'secret'


export const HashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export function generateAccessToken(id:number):string {
    return jwt.sign({user_id: id}, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}
export function generateRefreshToken(id:number):string {
    return jwt.sign({user_id: id}, REFRESH_TOKEN_SECRET, {expiresIn: "15d" });
}

export const verifyJWT = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const token:string|undefined = req.header("Authorization")?.replace("Bearer ", "");
    return new Promise((resolve, reject) => {
    // If there's no token, deny access with a 401 Unauthorized status
        if (!token) { // Если не нашли токена
            resolve('no token found') 
            //return res.status(401).json({ message: "Token not found" });
        } else {  // Если токен передан, осущетсвляем прверку

            const decodedToken:any = jwt.verify(token, ACCESS_TOKEN_SECRET);

            // Get the user linked to the token
            sql_get('select id from auth_user where access = ?',[token]) // ищем пользователя по токену
            .then((result:any) => { 
                var user:number = 0

                result ? user = result.id : {}

                if (!user) { // токен проверку не прошёл
                    reject('User not found')
                    // return res.status(404).json({ message: "User not found" }); 
                } else {
                    resolve('токен правильный')
                }
            })
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
      sql_get('select refresh from auth_user where id = ?',[user_id])
        .then((result) => {
            sqlToken = result.refresh

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

            sql_run('update auth_user set access = ?, refresh = ? where id = ?',[accessToken, refreshToken, user_id])
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
        .catch((err:any)=> { 
            return res.status(404).json({ message: "User not found" })
        })

    } catch (error:any) {
      // Handle any errors during token refresh with a 500 Internal Server Error status
      return res.status(500).json({ message: error.message });
    }
  };