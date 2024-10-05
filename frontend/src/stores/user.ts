import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
import type { ILog } from '@/interfaces';
import { useBaseUrl } from './baseUrl';
import { useLoginStore } from '@/stores/login';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';

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
    .get(`${baseUrl.baseUrl}/Users/${String(userId.value)}`, {})
    .then((response) => {
      userId.value = response.data.id
      userName.value = response.data.first_name
      userIsStaff.value = response.data.is_staff
      userIsSuperadmin.value = response.data.is_superuser
    })
  }
// -----------------------------------------------------------------  проверяет был ли пользователь авторизован  ----------------------------------------------
  async function checkIsAuth() {
    const token_exists: boolean = cookies.isKey('token')
    if (!getToken()) { // Если в приложении нет Access Token
      // console.log('Access token нет в приложении')
      if (token_exists) { // Если в куки есть Refresh token, то обновляем Access Token, 
        console.log('Refresh token есть в куки')
        setRefreshToken(cookies.get('token'))
        await refreshTokens() // Обновляем Access Token
        setUserIdByToken()    // Определяем пользователя
        loadUser()            // Загружаем данные по пользователю
      } 
    }
  }
// ----------------------------------------------------------------- устанавливает userId по токену авторизации  ----------------------------------------------
  function setUserIdByToken() { 
    const decoded:any = jwtDecode(token.value)
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
    
    const url = `${baseUrl.baseUrl}/users/api/token/`

    await axios
      .post(url, payload)
      .then((response) => {
          setToken(response.data.access)
          setRefreshToken(response.data.refresh)
          cookies.set('token',refreshToken.value) // сохраняем в куки значение токена

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
        const logData : ILog = {user: userId.value, 
                                action: action, 
                                params: params}
        const config = { headers: { 'content-type': 'application/json', }, };
        const url = `${baseUrl.baseUrl}/logs/Logs/` 
        axios.post(url, logData, config)
              .then(function(response) { /*console.log(response);*/ })
              .catch(function(error) { console.log(error); })
    }
  }
// ----------------------------------------------------------------- Выход ----------------------------------------------
  function logout() {
    saveLog(2,'')
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
  function setRefreshToken(newRefreshToken:string) { refreshToken.value = newRefreshToken }
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
      const response = await axios.post(`${baseUrl.baseUrl}/users/api/token/refresh/`, {refresh: getRefreshToken()}, header)
      setToken(response.data.access)
      return response 
    } catch (error:any) {
      console.log('error', error.response.data.code)
      logout()
      router.push({ name: 'home' }).catch(() => {})
      throw new Error(error)
    }
  }

  
  return { errorMsg, userId, 
           auth, logout, getUser, isUser, isStaff, isSuperadmin, loadUser, getName, checkIsAuth, 
           getToken, getRefreshToken, setToken, setRefreshToken, getAccessTokenExpDate, hasRefreshToken, isAccessTokenExpired, refreshTokens }
})
