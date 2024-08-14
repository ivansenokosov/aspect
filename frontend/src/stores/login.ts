import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', () => {
  const visible = ref<boolean>(false)
  
  return { visible }
})
