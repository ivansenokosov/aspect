import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnreadInvConfigs = defineStore('unreadInvConfigs', () => {
  const unreadInvConfigs = ref<Number>(1)
  
  return { unreadInvConfigs }
})
