// export async function saveLog(action: number, params: string) {}

import { useUserStore } from "@/stores/user"
import { useBaseUrl } from '@/stores/baseUrl'
import AxiosInstance from "./axiosInstance"
import type { ILog } from "@/interfaces"
import moment from "moment"

const user    = useUserStore()
const baseUrl = useBaseUrl()

export async function saveLog(action: number, params: string) {
    if (user.isUser()) {    
        const date = moment().format('YYYY-MM-DD HH:mm:ss')
        
        const logData : ILog = {date: date, 
                                user_id: user.userId, 
                                action_id: action, 
                                params: params}
        const config = { headers: { 'content-type': 'application/json', }, };

        const res = await AxiosInstance.post('/data/log', logData, config)
                                       .then(function(response) { /* console.log(response); */ })
                                       .catch(function(error) { console.log(error); })
    }
}

