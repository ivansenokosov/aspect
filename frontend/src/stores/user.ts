import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref<Number>(0)
  const userName = ref<string>('')
  const userIsStaff = ref<boolean>(false)
  
  return { userId, userName, userIsStaff }
})
