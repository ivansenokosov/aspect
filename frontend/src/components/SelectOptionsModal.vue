<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import type { IDocument, IInvOption, ISimpleDictionary, IInvSerie, IInvOptionDisount, IInvSerieDisount, IUserInvConfig } from '@/interfaces';

    import Dialog from 'primevue/dialog';
    import Button from 'primevue/button';
    import Fieldset from 'primevue/fieldset';
    import Tag from 'primevue/tag';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import OverlayBadge from 'primevue/overlaybadge';
    import Divider from 'primevue/divider';
    import Toast from 'primevue/toast';
    import { useToast } from 'primevue/usetoast';

    import SelectSimpleList from './SelectSimpleList.vue';

    import { useBaseUrl } from '@/stores/baseUrl';
    import { useUserStore } from '@/stores/user';
    import { useLoginStore } from '@/stores/login';
    import { useWebSocketStore } from '@/stores/ws'
    import { useFetch } from '@/api/useFetch';
    import { insertData } from '@/api/dataActions';

    import { getValueFromDictionary } from '@/api/getValueFromDictionary';
    import { priceFormat } from '@/api/priceFormat';
    import { saveLog } from '@/api/log';
    import { getDiscountSerie, getDiscountOption, getInvPrice, getOptionPrice } from '@/api/utils';

    import moment from 'moment'

    const baseUrl       = useBaseUrl()
    const user          = useUserStore()
    const loginModal    = useLoginStore()
    const toast         = useToast()
    const router        = useRouter()
    const ws            = useWebSocketStore()

    const props         = defineProps(['invertor','discontGroupId'])
    const dialogOpened  = defineModel<boolean>('dialogOpened')

    const serie                 = ref<IDocument<IInvSerie>>({data:[], error: null, loading: true}) // Серия
    const options               = ref<IDocument<IInvOption>>({data:[], error: null, loading: true})
    const serieDiscounts        = ref<IDocument<IInvSerieDisount>>({data:[], error: null, loading: true}) // скидка для серий
    const optionDiscounts       = ref<IDocument<IInvOptionDisount>>({data:[], error: null, loading: true}) // скидка для опций

    const saving                = ref<boolean>(false)  // флаг процесса сохранения
    const submitted             = ref(false);
    const optionsDisplay        = ref<IDocument<IInvOption>>({data:[], error: null, loading: true})
    const typeOfOptions         = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true})
    const selectedOptions       = ref<IInvOption[]>([])
    const selectedTypeOFOptions = ref<ISimpleDictionary[]>([])
    const optionsPrice          = ref<number>(0)  // итоговая цена выбранных опций
    const optionsPriceDiscount  = ref<number>(0)  // итоговая цена выбранных опций со скидкой
    const typeOfOptionsStr      = ref<string>('')
    const loading               = ref<boolean>(true)

    async function addUserInvConfig() {
      if (user.isUser()) {
        saving.value = true
        const selectedOptionsStr = ref<string[]>([])
        const selectedOptionsPricesStr = ref<string[]>([])
        const selectedOptionsDiscountStr = ref<string[]>([])

        if (selectedOptions.value) {
          selectedOptions.value.map((item) => { 
            selectedOptionsStr.value.push(item.id.toString())
            item.price && (selectedOptionsPricesStr.value.push(item.price.toString()))
            selectedOptionsDiscountStr.value.push(getDiscountOption(item.option_id, optionDiscounts.value.data))
          })
        }
        const date = moment().format('YYYY-MM-DD')

        const payload:IUserInvConfig =  {   id:0,
                                            date:               date,
                                            user_id:            user.getUser().userId.value,
                                            invertor_id:        props.invertor.id,
                                            invertor_price:     props.invertor.price,
                                            invertor_discount:  getDiscountSerie(props.invertor.serie, serieDiscounts.value.data),
                                            options:            JSON.stringify(selectedOptionsStr.value.map(item => item)),
                                            options_prices:     JSON.stringify(selectedOptionsPricesStr.value.map(item => item)),
                                            options_disccounts: JSON.stringify(selectedOptionsDiscountStr.value.map(item => item)),
                                            info:               '',
                                            staff_opened:       false
                                         }

        insertData('/data/UserInvConfg', payload)
            .then((response:any) => {
                saveLog(4, String(response.data.id))
                toast.add({ severity: 'info', summary: 'Успешно', detail: 'Запись создана', life: 3000 });
                ws.sendMessage({username: user.getUser().userId.value.toString(),
                                message: response.data.id.toString(),
                                timestamp:1}) // отправка сообщения о новой конфигурации
                router.push('inv_config/?id=' + response.data.id)
                })
            .catch(function(error) {
                console.log(error);
            })
        saving.value = false
      } else {
        loginModal.visible = true // если пользлватель не авторизован, открываем модал
      }
    }

    const hideDialog = () => {
        dialogOpened.value = false;
        submitted.value = false;
    };

    async function loadOptionDiscounts() {
        if (user.isUser() && props.invertor.id && props.discontGroupId) {
            optionDiscounts.value = await useFetch('/data/InvOptionDisount/?column=group_id&opeator=equal&value=' + props.discontGroupId)
            serieDiscounts.value  = await useFetch('/data/InvSerieDisount/?column=group_id&opeator=equal&value=' + props.discontGroupId)
        }  
    }

    async function loadData() {
        loading.value = true
        selectedOptions.value = []

        saveLog(3,String(props.invertor.serie))

        if (props.invertor.id) {
            typeOfOptions.value  = await useFetch('/data/Type_of_options');
            serie.value          = await useFetch('/data/Inv_series/' + String(props.invertor.serie_id))
            options.value        = await useFetch('/data/Inv_options/?column=series&operator=like&value=' + String(props.invertor.serie_id))  // django url /Inv_options/?serie=' + String(props.invertor.serie)

            await loadOptionDiscounts()
            optionsDisplay.value = {...options.value}
            loading.value = false
        }
    }

    watch(() => [props.invertor], () => loadData())  // Если загрузили с новым ПЧ, то перегружаем данные для него

    watch(() => [props.discontGroupId], async () => { await loadOptionDiscounts() }) // если выполнена авторизация, загрузить скидки

    watch(selectedOptions, () => {  // Если измелися список выбранных опций
        optionsPrice.value = 0
        optionsPriceDiscount.value = 0
        selectedOptions.value.map(item => optionsPrice.value = optionsPrice.value + Number(item.price))

        if (user.isUser()) {
            selectedOptions.value.map( item => optionsPriceDiscount.value += Number(getOptionPrice(Number(item.price), item.option_id, optionDiscounts.value.data)) )
        }
    })
</script>

<template>
    <Toast/>
    <Dialog v-model:visible="dialogOpened" :style="{ width: '1280px' }" :header="invertor.name" :modal="true">
        <div class="grid" v-if="!loading">
            <div class="col-4">
                <img v-if="serie.data[0].photo" :src="`${baseUrl.baseUrl}/${serie.data[0].photo}`" height="350" class="ml-5  ">
                <img v-else :src="`${baseUrl.baseUrl}/inv_series/no_photo.jpg`" width="350" height="262"/>
            </div>
            <div class="col-8" >
                <div class="formgrid grid">
                    <div class="field col" >
                    <Fieldset legend="Мощность" style="height:170px">
                        <div>
                        <div class="mt-1" style="width: 100%"><Tag value="Pg" severity="primary" /> {{ invertor.p_heavy_g }} кВт</div>
                        <div class="mt-1" style="width: 100%"><Tag value="Pp" severity="info" /> {{ invertor.p_pumps_p }} кВт</div>
                        </div>
                    </Fieldset>
                    </div>
                    <div class="field col">
                    <Fieldset legend="Ток" style="height:170px">
                        <div>
                        <div class="mt-1" style="width: 100%"><Tag value="Ig" severity="warn" /> {{ invertor.current_g }} А</div>
                        <div class="mt-1" style="width: 100%"><Tag value="Ip" severity="danger" /> {{ invertor.current_p }} А</div> 
                        </div>
                    </Fieldset>
                    </div>
                    <div class="field col">
                    <Fieldset legend="Перегрузка" style="height:170px">
                        <div>
                        <div v-if="invertor.overload_p_mode!='None'" class="mt-1" style="width: 100%"><Tag value="Режим P" severity="info" /> {{ invertor.overload_p_mode }}</div>
                        <div class="mt-1" style="width: 100%"><Tag value="Режим G" severity="info" /> {{ invertor.overload_g_mode }}</div> 
                        </div>
                    </Fieldset>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col" >
                    <Fieldset legend="Управление" style="height:200px">
                        {{ invertor.type_of_control_str }}
                    </Fieldset>
                    </div>
                    <div class="field col">
                    <Fieldset legend="Панель" style="height:200px">
                        {{ invertor.type_of_panel_str }}
                    </Fieldset>
                    </div>
                    <div class="field col">
                    <Fieldset legend="Описание" style="height:200px">
                        {{ serie.data[0].description }}
                    </Fieldset>
                    </div>
                </div>          
            </div>
        </div> <!-- loading -->

        <SelectSimpleList url="/data/Type_of_options" title="Тип опции" v-model="selectedTypeOFOptions" v-if="!loading"/>

        <h1 class="mt-5">Опции ({{ optionsDisplay.data.length }})</h1>

        <DataTable v-if="!loading" :value="optionsDisplay.data" v-model:selection="selectedOptions" stripedRows tableStyle="min-width: 50rem">
            <Column selectionMode="multiple" headerStyle="width: 5%"></Column>
            <Column field="name" header="Наименование" headerStyle="width: 10%"></Column>
            <Column field="full_title" header="Описание" headerStyle="width: 10%"></Column>
            <Column field="short_title" header="Доп. описание" headerStyle="width: 10%"></Column>
            <Column header="Тип" headerStyle="width: 10%">
                <template #body="{ data }" v-if="!typeOfOptions.loading">
                    <span>{{ getValueFromDictionary(typeOfOptions.data, data.option) }} </span>
                </template>
            </Column>
        
            <Column header="Количество" headerStyle="width: 10%">
                <template #body="{ data }">
                    <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
                    <div v-if="data.quantity<=0" class="font-bold text-xl w-full"><Tag :value="data.waiting_period_str" severity="warn" /></div>
                </template>
            </Column>
            <Column header="Цена" headerStyle="width: 10%">
                <template #body="{ data }">
                    <span v-if = "data.price == 0" ><Tag value="По запросу" severity="danger" /></span>
                    <span v-else>
                        <div v-if="user.isUser()">
                            <OverlayBadge :value="`- ${getDiscountOption(data.option_id, optionDiscounts.data)} %`" severity="warn" v-if="!loading && !optionDiscounts.loading" class="mr-4">
                            <div class="surface-700 text-white font-bold text-xl line-through border-round m-2 flex align-items-center justify-content-center" style="min-width: 80px; min-height: 40px">
                                {{ priceFormat(data.price) }} &#8381;
                            </div>
                            </OverlayBadge>
                            <div class="bg-primary font-bold text-xl border-round m-2 flex align-items-center justify-content-center mr-5" style="min-width: 80px; min-height: 40px" v-if="!loading && !optionDiscounts.loading">
                            {{ priceFormat(getOptionPrice(data.price, data.option_id, optionDiscounts.data)) }} &#8381;
                            </div>
                        </div>
                        <div v-else>
                            <div class="font-bold text-xl border-round m-2 flex align-items-center justify-content-center">
                                {{ priceFormat(data.price) }} &#8381;
                            </div>
                        </div>  
                    </span>
                </template>
            </Column>
        </DataTable>

        <Divider class="mt-5"/>
        <p class="font-semibold text-lg">Цена частотного преобразователя {{ invertor.name }}: 
            <span class="font-bold text-xl" v-if="!user.isUser()"> {{ priceFormat(invertor.price) }} &#8381;</span>
            <span v-else>
                <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
                {{ priceFormat(invertor.price) }} &#8381;
                </a>
                <a class="bg-primary font-bold text-xl border-round p-2 " style="min-width: 80px; min-height: 40px" v-if="!loading && !serieDiscounts.loading">
                {{ priceFormat(getInvPrice(Number(invertor.price), invertor.serie_id, serieDiscounts.data)) }} &#8381;
                </a>
            </span>
        </p>

        <p class="font-semibold text-lg">Цена выбранных опций: 
            <span class="font-bold text-xl" v-if="!user.isUser()"> {{ priceFormat(optionsPrice) }} &#8381;</span>
            <span  v-else> 
            <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
                {{ priceFormat(optionsPrice) }} &#8381;
                </a>
            <a class="bg-primary font-bold text-xl border-round p-2" style="min-width: 80px; min-height: 40px" v-if="!loading">
                {{ priceFormat(optionsPriceDiscount) }} &#8381;
            </a>

            </span>
        </p>

        <Divider class="mt-5"/>

        <p class="font-bold text-xl">Итого: 
            <span class="font-bold text-xl" v-if="!user.isUser()"> {{ priceFormat(Number(optionsPrice) + Number(invertor.price)) }} &#8381;</span>
            <span  v-else> 
            <a class="font-bold text-xl line-through border-round m-2" style="min-width: 80px; min-height: 40px">
                {{ priceFormat(Number(optionsPrice) + Number(invertor.price)) }} &#8381;
                </a>
            <a class="bg-primary font-bold text-xl border-round p-2" style="min-width: 80px; min-height: 40px" v-if="!loading && !serieDiscounts.loading">
                {{ priceFormat(getInvPrice(Number(invertor.price), invertor.serie_id, serieDiscounts.data) + Number(optionsPriceDiscount)) }} &#8381;
            </a>
            </span>
        </p>

        <template #footer>
            <Button label="Закрыть" severity="secondary" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Сохранить в мои конфигурации" :loading="saving" icon="pi pi-save" @click="addUserInvConfig" v-if="user.isUser()"/>
            <Button label="Для сохранения конфигурации выполните вход" severity="info" icon="pi pi-sign-in" @click="loginModal.visible = true" v-else/>
        </template>  
    </Dialog>
</template> 