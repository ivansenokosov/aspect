// export async function saveLog(action: number, params: string) {}

import { useUserStore } from "@/stores/user"
import { useBaseUrl } from '@/stores/baseUrl'
import AxiosInstance from "./axiosInstance"
import type { ILog } from "@/interfaces"

const user    = useUserStore()
const baseUrl = useBaseUrl()

export async function saveLog(action: number, params: string) {
    if (user.isUser()) {    
        const date    = Date.now()
        const logData : ILog = {user: user.userId, action: action, params: params}
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.post('/data/log/', logData, config)
                                       .then(function(response) { /* console.log(response); */ })
                                       .catch(function(error) { console.log(error); })
    }
}

