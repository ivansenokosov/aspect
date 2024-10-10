import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBaseUrl } from './baseUrl'

export const useUnreadInvConfigs = defineStore('unreadInvConfigs', () => {
  const unreadInvConfigs = ref<number>(1)
  const baseUrl = useBaseUrl()

  async function count() {
    const data = ref<any>(null);
    
    try {
      const res = await fetch(`${baseUrl.baseUrl}/interface/countUnread`, {});
      data.value = await res.json();
    } catch (e) {
      console.log(e);
    } 
    unreadInvConfigs.value = data.value.count
    console.log(unreadInvConfigs.value)
  }  
  return { unreadInvConfigs, count }
})
