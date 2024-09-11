import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
import type { ILog } from '@/interfaces';
import { useBaseUrl } from './baseUrl';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const userId           = ref<number>(0)
  const userName         = ref<string>('')
  const userIsStaff      = ref<boolean>(false)
  const userIsSuperadmin = ref<boolean>(false)
  const baseUrl          = useBaseUrl()
  const { cookies }      = useCookies()

  function setRefValues() {
    if (cookies.isKey("userid")) {
      userId.value      = Number(cookies.get('userid'))
      userName.value    = cookies.get('username')
      switch (cookies.get('isstaff')) {
        case 'false': 
          userIsStaff.value = false
          break;
        case 'true': 
          userIsStaff.value = true
          break;
      }

      switch (cookies.get('issuperadmin')) {
        case 'false': 
          userIsSuperadmin.value = false
          break;
        case 'true': 
          userIsSuperadmin.value = true
          break;
      }
    }
  }

  async function saveLog(action: number, params: string) {

    if (userId.value>0) {    
        const date    = Date.now()
        const logData : ILog = {user: userId.value, action: action, params: params}
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await axios.post(baseUrl.baseUrl + 'logs/Logs/', logData, config)
                                    .then(function(response) { /*console.log(response);*/ })
                                    .catch(function(error) { console.log(error); })
    }
  }

  function setValues(userId:number, userName:string, isStaff:boolean, isSuperadmin: number) {
    cookies.set('userid',        String(userId))
    cookies.set('username',      String(userName))
    cookies.set('isstaff',       String(isStaff))
    cookies.set('issuperadmin',  String(isSuperadmin))
    setRefValues()
    saveLog(1,'')
  }

  function logout() {
    saveLog(2,'')
    userId.value = 0
    userName.value = ''
    userIsStaff.value = false
    userIsSuperadmin.value = false
    cookies.remove('userid')
    cookies.remove('username')
    cookies.remove('isstaff')
    cookies.remove('issuperadmin')
  }
  
  return { userId, userName, userIsStaff, userIsSuperadmin, setValues, logout, setRefValues}
})
