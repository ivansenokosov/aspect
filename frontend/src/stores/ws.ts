import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ChatMessage {
    username: string;
    message: string;
    timestamp: number;
}

export const useWebSocketStore = defineStore('websocket', () => {
    const port:number = 4000
    const ws          = ref<any>();
    const message     = ref<ChatMessage>({username:'', message:'', timestamp:0})

    // Установка соединения
    try {
      ws.value = new WebSocket(`ws://localhost:${port}`);
      ws.value.onopen = () => {
        // console.log('Соединение Websocket установлено');
      }  
    } catch (error) {
      console.error('Не удалось установить соединение Websocket :', error);
    }

    // ожидание сообщений
    ws.value.onmessage = (event:any) => {
      try {
        message.value =  JSON.parse(event.data);
      } catch (parseError) {
        console.error('Ошибка парсинга сообщения для Websocket:', parseError);
      }
    };

    const closeConnection = () => {
      if (ws.value) {
        ws.value.close();
        console.log('Соеднинение Websocket закрыто');
      }
    }

    const sendMessage = (message:ChatMessage) => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const messageAsString = JSON.stringify(message)
        ws.value.send(messageAsString); // переводим JSON в строку
      } else {
        console.error('Соединение WebSocket не открыто.');
      }
    };

    return { message, sendMessage, closeConnection }
})
