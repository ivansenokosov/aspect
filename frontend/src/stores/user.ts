import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
import type { ILog } from '@/interfaces';
import { useBaseUrl } from './baseUrl';
import { useLoginStore } from '@/stores/login';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = defineStore('user', () => {
  const userId           = ref<number>(0)
  const userName         = ref<string>('')
  const userIsStaff      = ref<boolean>(false)
  const userIsSuperadmin = ref<boolean>(false)
  const token            = ref<string>('')
  const errorMsg         = ref<string>('')

  const baseUrl          = useBaseUrl()
  const login            = useLoginStore()
  const { cookies }      = useCookies()

// -----------------------------------------------------------------  загружает пользователя по установленному userId  ----------------------------------------------
  async function loadUser() {
    userId.value &&
    await axios
    .get(baseUrl.baseUrl + 'Users/' + String(userId.value), {})
    .then((response) => {
      userId.value = response.data.id
      userName.value = response.data.first_name
      userIsStaff.value = response.data.is_staff
      userIsSuperadmin.value = response.data.is_superuser
    })
  }
// -----------------------------------------------------------------  проверяет был ли пользователь авторизован  ----------------------------------------------
  function checkIsAuth() {
    const token_exists: boolean = cookies.isKey('token')
    if (token_exists) {
      token.value = cookies.get('token')
      setUserIdByToken()
      loadUser()  
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
    
    await axios
      .post(baseUrl.baseUrl + 'users/api/token/', payload)
      .then((response) => {
          token.value = response.data.access
          cookies.set('token',token.value) // сохраняем в куки значение токена
          setUserIdByToken() // Устанавливаем userId по токену
          login.visible = false // закрываем модал
          loadUser() // загружаем пользователя по установленному userId
          saveLog(1,'') // записываем, что авторизовались
      })
      .catch((error) => {
          errorMsg.value='Неверный логин или пароль'
          // console.log(error);
          // console.debug(error);
          // console.dir(error);
      });
  }
// ----------------------------------------------------------------- Запись в журнал действия пользователя ----------------------------------------------
  async function saveLog(action: number, params: string) {
    if (userId.value>0) {    
        const logData : ILog = {user: userId.value, action: action, params: params}
        const config = { headers: { 'content-type': 'application/json', }, };
        const res = await axios.post(baseUrl.baseUrl + 'logs/Logs/', logData, config)
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
    cookies.remove('token')
  }

  function getUser() { return {userId, userName, userIsStaff, userIsSuperadmin } }
  function isUser() { return userId.value ? true : false }
  function isStaff() { return userIsStaff.value }
  function isSuperadmin() { return userIsSuperadmin.value }
  function getName () { return userName.value }
  
  return { errorMsg, userId, auth, logout, getUser, isUser, isStaff, isSuperadmin, loadUser, getName, checkIsAuth }
})
