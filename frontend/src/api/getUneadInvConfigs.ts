import { ref } from 'vue'
import { useFetch } from "./useFetch";
import { useUnreadInvConfigs } from "@/stores/unreadInvConfig";
import type { IUserInvConfigData } from "@/interfaces";

const unreadInvConfig = useUnreadInvConfigs()

export async function getUnreadInvConfigs() {
    const data = ref<IUserInvConfigData>({data:[], error: null, loading: true}) 

    data.value = await useFetch('userconfigs/UserInvConfg', {})
    let unread:number = 0
    for (let i=0; i<data.value.data.length; i++) {
        if (data.value.data[i].staff_opened === false) {
            unread += 1
        }
    }
    unreadInvConfig.unreadInvConfigs = unread
    console.log(unreadInvConfig.unreadInvConfigs)

}