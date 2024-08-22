import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";

export const useUserStore = defineStore('user', () => {
  const userId           = ref<number>(0)
  const userName         = ref<string>('')
  const userIsStaff      = ref<boolean>(false)
  const userIsSuperadmin = ref<boolean>(false)

  const { cookies } = useCookies()

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

  function setValues(userId:number, userName:string, isStaff:boolean, isSuperadmin: number) {
    cookies.set('userid',   String(userId))
    cookies.set('username', String(userName))
    cookies.set('isstaff',  String(isStaff))
    cookies.set('issuperadmin',  String(isSuperadmin))
    setRefValues()
  }

  function logout() {
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
