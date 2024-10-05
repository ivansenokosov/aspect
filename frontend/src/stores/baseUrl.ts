import { defineStore } from 'pinia'

export const useBaseUrl = defineStore('baseUrl', () => {
  const baseUrl = 'http://192.168.1.5:8000'
  
  return { baseUrl }
})
