import axios from 'axios'
import { useBaseUrl } from '@/stores/baseUrl'
import { useUserStore } from '@/stores/user'
import type { AxiosRequestConfig } from 'axios'

const baseUrl = useBaseUrl()
const user    = useUserStore()

export const getHeader = () => {
    var header: AxiosRequestConfig = {
        baseURL: baseUrl.baseUrl,
        timeout: 100000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    if (user.isUser()) {
        header.headers!['Authorization'] = "Token " + user.getRefreshToken()
    } 
    return header
}

const getAuthHeader = () => { return `Bearer ${user.getToken()}` }
const AxiosInstance = axios.create(getHeader()) 
const debounceRefreshTokens = _debounce(() => { return user.refreshTokens() }, 100)

/**
 * https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises
 * @param inner
 * @param ms
 * @returns {function(...[*]): Promise<unknown>}
 * @private
 */
function _debounce (inner:any, ms = 0) {
    let timer:any = null
    let resolves:any = []

    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
        const result = inner()
        resolves.forEach((r:any) => r(result))
        resolves = []
        }, ms)

        return new Promise(resolve => resolves.push(resolve))
    }
}
    
/**
 * Перехватичк запроса axios
 * Если пользователь не авторизован, запрос отпарвляется без изменений
 * Если пользователь авторизован с неистёкшим Access Token, то запрос отправляется как есть
 * Если пользователь авторизован, но с истёкшим Access Token, то обновляем Access Token, тобавляем его в запрос
 */
AxiosInstance.interceptors.request.use((request:any) => {
    if (user.isUser()) {
        request.headers.authorization = getAuthHeader()

        // if access token expired and refreshToken is exist >> go to API and get new access token
        if (user.isAccessTokenExpired() && user.hasRefreshToken()) {
            return debounceRefreshTokens()
                    .then((response:any) => {
                            request.headers.authorization = getAuthHeader()
                            return request
                        })
                    .catch(error => Promise.reject(error))
        } else {
            // console.log('Пользователь авторизован', request)
            return request // Если токен не истёк
        }
    } else {
        // console.log('Пользователь не авторизован', request)
        return request // Если пользователь не авторизован
        }
    }, (error:any) => {
    return Promise.reject(error)
})



export default AxiosInstance

