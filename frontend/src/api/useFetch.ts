import { ref } from 'vue';
import AxiosInstance from './axiosInstance';

interface IFetch {
  data : any[]
  error: any
  loading: boolean
}

export async function useFetch<T extends IFetch>(url:string): Promise<T> {
  const res = ref<IFetch>({data:[], error: null, loading: true})

  try {
    const result = await AxiosInstance.get(url)

    if (!Array.isArray(result.data) && Array.isArray(res.value.data)) {   // Если тип принимающего элемента массив, а пришёл не массив
      res.value.data.push(result.data) 
    } else {
      res.value.data = result.data
    }

  } catch (e) {
    res.value.error = e;
  } finally {
    res.value.loading = false;
  }
  return {data: res.value.data, loading: res.value.loading, error: res.value.error} as T;
}