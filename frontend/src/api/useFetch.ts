import {toRefs, ref, reactive} from 'vue';
import { useBaseUrl } from '@/stores/baseUrl'

const baseUrl = useBaseUrl()

export async function useFetch(url:string, options:any) {
  const data = ref(null);
  const state = reactive({
    error: null,
    loading: false
  });

  state.loading = true;

  try {
    const res = await fetch(baseUrl.baseUrl + url, options);
    data.value = await res.json();
  } catch (e) {
    state.error = e;
  } finally {
    state.loading = false;
  }
  return {data, ...toRefs(state)};
}