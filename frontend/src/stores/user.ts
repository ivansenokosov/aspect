import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
import type { ILog } from '@/interfaces';
import { useBaseUrl } from './baseUrl';
import { useLoginStore } from '@/stores/login';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import moment from 'moment';

const router = useRouter()

export const useUserStore = defineStore('user', () => {
  const userId           = ref<number>(0)
  const userName         = ref<string>('')
  const userIsStaff      = ref<boolean>(false)
  const userIsSuperadmin = ref<boolean>(false)
  const token            = ref<string>('')
  const refreshToken     = ref<string>('')
  const errorMsg         = ref<string>('')

  const baseUrl          = useBaseUrl()
  const login            = useLoginStore()
  const { cookies }      = useCookies()

// -----------------------------------------------------------------  загружает пользователя по установленному userId  ----------------------------------------------
  async function loadUser() {
    userId.value &&
    await axios
    .get(`${baseUrl.baseUrl}/data/users/${String(userId.value)}`, {}) // django `${baseUrl.baseUrl}/Users/${String(userId.value)}`
    .then((response) => {
      userId.value = response.data.id
      userName.value = response.data.first_name
      userIsStaff.value = response.data.is_staff
      userIsSuperadmin.value = response.data.is_superuser
    })
  }
// -----------------------------------------------------------------  проверяет был ли пользователь авторизован  ----------------------------------------------
  async function checkIsAuth():Promise<number> {
    const token_exists: boolean = cookies.isKey('token')
    return new Promise((resolve, reject) => {
      if (!getToken()) { // Если в приложении нет Access Token
        // console.log('Access token нет в приложении')
        if (token_exists) { // Если в куки есть Refresh token, то обновляем Access Token, 
          // console.log('Refresh token есть в куки')
          setRefreshToken(cookies.get('token'))
          refreshTokens().then(() => {
            setUserIdByToken()    // Определяем пользователя
            loadUser()            // Загружаем данные по пользователю
            resolve(userId.value)
          }) // Обновляем Access Token

        } else {
          reject(0)
        }
      } else {
        console.log('Пользователь не авторизован')
        reject(0)
      }
    })
  }
// ----------------------------------------------------------------- устанавливает userId по токену авторизации  ----------------------------------------------
  function setUserIdByToken() { 
    const decoded:any = jwtDecode(refreshToken.value)
    userId.value = decoded.user_id 
    loadUser()
  }

// -----------------------------------------------------------------  аутентификация ----------------------------------------------
  async function auth(username:string, password:string) { 
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken"; 

    const payload = {
      username: username, 
      password: password,
    }
    
    // const url = `${baseUrl.baseUrl}/users/api/token/`
    const url = `${baseUrl.baseUrl}/user/auth`

    await axios
      .post(url, payload)
      .then((response) => {
          setToken(response.data.access)
          setRefreshToken(response.data.refresh)
          setUserIdByToken() // Устанавливаем userId по токену
          login.visible = false // закрываем модал
          loadUser() // загружаем пользователя по установленному userId
          saveLog(1,'') // записываем, что авторизовались
      })
      .catch((error) => {
          errorMsg.value='Неверный логин или пароль'
          console.log(error);
          // console.debug(error);
          // console.dir(error);
      });
  }
// ----------------------------------------------------------------- Запись в журнал действия пользователя ----------------------------------------------
  async function saveLog(action: number, params: string) {
    if (isUser()) {    
        const date = moment().format('YYYY-MM-DD HH:mm:ss')

        const logData : ILog = {date: date,
                                action_id: action, 
                                user_id: userId.value, 
                                params: params}
        const config = { headers: { 'content-type': 'application/json', }, };
        const url = `${baseUrl.baseUrl}/data/log` // `${baseUrl.baseUrl}/logs/Logs/` 
        axios.post(url, logData, config)
              .then(function(response) { /*console.log(response);*/ })
              .catch(function(error) { console.log(error); })
    }
  }
// ----------------------------------------------------------------- Выход ----------------------------------------------
  async function logout() {
    saveLog(2,'')
    const response = await axios.post(`${baseUrl.baseUrl}/user/logout/${userId.value}`, {})
    userId.value = 0
    userName.value = ''
    userIsStaff.value = false
    userIsSuperadmin.value = false
    token.value = ''
    refreshToken.value = ''
    cookies.remove('token')
  }

  function getUser() { return {userId, userName, userIsStaff, userIsSuperadmin } }
  function isUser() { return userId.value ? true : false }
  function isStaff() { return userIsStaff.value }
  function isSuperadmin() { return userIsSuperadmin.value }
  function getName () { return userName.value }

  function getToken():string { return token.value }
  function setToken(newToken:string) { token.value = newToken }

  function getRefreshToken():string { return refreshToken.value }
  function setRefreshToken(newRefreshToken:string) { 
    refreshToken.value = newRefreshToken 
    cookies.set('token', newRefreshToken) // сохраняем в куки значение токена
  }
  function getAccessTokenExpDate():number { return Number(jwtDecode(token.value).exp)! }
  function hasRefreshToken () { return Boolean(getRefreshToken()) }
  function isAccessTokenExpired () {
    const accessTokenExpDate = getAccessTokenExpDate() - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)
    return accessTokenExpDate <= nowTime
  }

  async function refreshTokens () {
    const header = {
      baseURL: baseUrl.baseUrl,
      timeout: 100000,
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    }

    try {
      // const response = await axios.post(`${baseUrl.baseUrl}/users/api/token/refresh/`, {refresh: getRefreshToken()}, header) // django
      const response = await axios.post(`${baseUrl.baseUrl}/user/refresh`, {refresh: getRefreshToken()}, header)
      setToken(response.data.access)
      setRefreshToken(response.data.refresh)
      return response 
    } catch (error:any) {
      console.log('error', error.response.data.code)
      const response = await axios.post(`${baseUrl.baseUrl}/user/logout/${userId.value}`, header)
      await logout()
      router.push('/')
      throw new Error(error)
    }
  }

  
  return { errorMsg, userId, 
           auth, logout, getUser, isUser, isStaff, isSuperadmin, loadUser, getName, checkIsAuth, 
           getToken, getRefreshToken, setToken, setRefreshToken, getAccessTokenExpDate, hasRefreshToken, isAccessTokenExpired, refreshTokens }
})
