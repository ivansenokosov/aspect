import { defineStore } from 'pinia'

export const useBaseUrl = defineStore('baseUrl', () => {
  // const baseUrl = 'http://192.168.1.5:8000'
  const baseUrl = 'http://127.0.0.1:3000'
  
  return { baseUrl }
})
