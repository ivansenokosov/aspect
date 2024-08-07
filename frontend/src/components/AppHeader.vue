<script setup lang="ts">
    import { useUserStore } from '@/stores/user';
    import { useBaseUrl } from '@/stores/baseUrl';
    import { ref, computed } from 'vue'   
    import Menubar from 'primevue/menubar';
    import Badge from 'primevue/badge';
    import Dialog from 'primevue/dialog';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Password from 'primevue/password';
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import axios from 'axios';
    import Message from 'primevue/message';
    import type { IMenuItem } from '@/interfaces';

    const userStore = useUserStore()
    const baseUrl = useBaseUrl()

    const visible = ref(false);
    const login = ref<String>('')
    const password = ref<String>('')
    const errormsg = ref<String>('')

    const login_form_enter_completed = computed(() => {
        if (login.value.length > 3 && password.value.length > 3) {
            return true
        } else {
            return false
        }
    })

    const auth = async () => {
        const url:string =  baseUrl.baseUrl + 'users/login' 
        const config = { headers: { 'content-type': 'application/json', }, };
        const formData = new FormData();       

        formData.append("login", login.value)
        formData.append("password", password.value)
        errormsg.value = ''

        const res = await axios.post(url, formData, config)
        .then(function(response) {
            if (response.data.status === 1) {
                userStore.userId = response.data.id
                userStore.userName = response.data.first_name
                userStore.userIsStaff = response.data.is_staff
                visible.value = false
            } else {
                errormsg.value = response.data.info
            }


        }).catch(function(error) {
            console.log(error);
        })

    }

    function isStuff<Boolean>() {
        if (userStore.userId > 0 && userStore.userIsStaff == true) {
            return true
        } else {
            return false
        }
    }

    function isUser<Boolean>() {
        if (userStore.userId) {
            return true
        } else {
            return false
        }
    }



const menuItems = ref<IMenuItem[]>([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        route: '/',
        show: computed((): boolean => true),
        badge: 0,
        level: 1
    },
    {
        label: 'Конфигурации',
        icon: 'pi pi-cog',
        route: '/config',
        show: computed((): boolean => isUser()),
        badge: 0,
        level: 1
    },
    {
        label: 'Справочники',
        icon: 'pi pi-search',
        show: computed(():boolean => isStuff()), 
        level: 1,
        items: [
            {
                label: 'Преобразователи частоты',
                icon: 'pi pi-arrow-right-arrow-left',
                show: computed((): boolean => true),
                route: '/dictionaries/Invertors/List'
            },
            {
                label: 'Опции для ПЧ',
                icon: 'pi pi-bolt',
                show: computed((): boolean => true),
                route: '/dictionaries/InvOptions/List'
            },
            {
                label: 'Элементы',
                icon: 'pi pi-objects-column',
                show: computed((): boolean => true),
                route: '/dictionaries/Items/List'
           },
            {
                separator: true
            },
            {
                label: 'Серии ПЧ',
                icon: 'pi pi-pencil',
                show: computed((): boolean => true),
                route: '/dictionaries/InvSeries/List'
           },
           {
                label: 'Входы/выходы',
                icon: 'pi pi-book',
                show: computed((): boolean => true),
                route: '/dictionaries/InputOutput/List'
           },
           {
                label: 'Общие',
                icon: 'pi pi-book',
                show: computed((): boolean => true),
                items: [
                    {
                        label: 'Производители',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/Manufactory/List'
                    },
                    {
                        label: 'Типы элементов',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/TypeOfItems/List'
                    },
                    {
                        label: 'Сроки ожидания',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/WaitingPeriod/List'
                    },
                       ]
           }, 

            {
                label: 'Конфигуратор',
                icon: 'pi pi-cog',
                show: computed((): boolean => true),
                items: [
                    {
                        label: 'Входные напряжения',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvInputVoltage/List'
                    },
                    {
                        label: 'Типы управления',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/TypeOfControl/List'
                    },
                    {
                        label: 'Способы управления',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/VariantsOfControl/List'
                    },
                    {
                        label: 'Дроссели ЕМС',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvEMCDrossel/List'
                    },
                    {
                        label: 'DC фильтры',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvDCDrossel/List'
                    },
                    // {
                    //     label: 'Мощности',
                    //     icon: '',
                    //     show: computed((): boolean => true),
                    //     route: '/'
                    // },
                    {
                        label: 'Тормозные модули',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvBreakeModule/List'
                    },
                    
                ]
            },
            {
                label: 'Справочники серий ПЧ',
                icon: 'pi pi-book',
                items: [
                    {
                        label: 'Входные напряжения',
                        icon: '',
                        show: computed((): boolean => true),
                        route: '/'
                    },
                    {
                        label: 'Выходные напряжения',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvOutputVoltage/List'
                    },
                    {
                        label: 'Вид опции',
                        icon: '',
                        show: computed((): boolean => true),
                        route: '/'
                    },
                    {
                        label: 'Способы управления для серии',
                        icon: '',
                        show: computed((): boolean => true),
                        route: '/'
                    },
                    {
                        label: 'Уровни защиты',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/LevelIP/List'
                    },
                    {
                        label: 'Перегрузки (переделать)',
                        icon: '',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvTypeOfOverload/List'
                    },
                    {
                        label: 'Панели',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvTypeOfPanels/List'
                    },
                    {
                        label: 'Допустимые температуры окружающей среды',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/AmbientTemperatures/List'
                    },
                    {
                        label: 'Точность регулирования частоты',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvAccurancyFrenq/List'
                    },
                    {
                        label: 'Размеры (переделать)',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvSizes/List'
                    },
                    {
                        label: 'Сигналы',
                        icon: 'pi pi-book',
                        show: computed((): boolean => true),
                        route: '/dictionaries/InvTypeOfSignals/List'
                    },

                ]
            }
        ]
    },
    {
        label: 'Контакты',
        icon: 'pi pi-envelope',
        route: '/contacts',
        show: computed((): boolean => true),
        badge: 0,
        level: 1
    }
]);


</script>

<template>
    <Menubar :model="menuItems" class="menu" style="width: 100%; border: 0">
        <template #start>
            <RouterLink to="/">
                <img src="../assets/aspect_logo.jpg" height="48">
            </RouterLink>    
        </template>

        <template #item="{ item, props, hasSubmenu, root }">
            <template v-if="item.route">
                <router-link v-slot="{ href, navigate }" :to="item.route" custom v-if="item.show">
                        <a v-ripple :href="href" class="flex items-center" v-bind="props.action" @click="navigate">
                            <span :class="item.icon" />
                            <span v-if="item.level==1" class="cursor-pointer overflow-hidden font-semibold text-lg">{{ item.label }} </span>
                            <span v-else class="ml-2">{{ item.label }} </span>
                            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                            <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                            <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i> 
                        </a>
                </router-link>
            </template>
            <template v-else>
                <a v-ripple class="flex items-center" v-bind="props.action" custom v-if="item.show">
                        <span :class="item.icon" />
                        <span v-if="item.level==1" class="cursor-pointer overflow-hidden font-semibold text-lg">{{ item.label }} </span>
                        <span v-else class="ml-2">{{ item.label }} </span>
                        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                        <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                        <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i> 
                    </a>
            </template>
        </template> 
        
        <template #end>
            <div class="flex items-center align-items-center gap-2">
                <div class="text-xl font-semibold pr-5">8 (800) 350-79-07</div>
                <span v-if="userStore.userId > 0" @click="() => { userStore.userId=0; userStore.userName = ''; userStore.userIsStaff = false}">
                <span class="flex align-items-center menu-exit">
                    <Button severity="contrast" class="flex align-items-center" >
                        <span class="pi pi-sign-in p-menuitem-icon"></span>
                        <span class="ml-2 font-semibold text-lg"> {{ userStore.userName }} </span>
                    </Button>
                </span>
            </span>
            <span v-else>
                <span class="flex align-items-center menu-exit">
                    <Button  severity="contrast" class="flex align-items-center" @click="visible = true" >
                        <span class="pi pi-sign-in p-menuitem-icon"></span>
                        <span class="ml-2 font-semibold text-lg"> Вход </span>
                    </Button>
                </span>
            </span>
            </div>

        </template>

    </Menubar>


    <Dialog v-model:visible="visible" modal header="Вход в личный кабинет" :style="{ width: '25rem' }">
            <div class="flex items-center gap-4 mb-4">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-user"></i>
                    </InputGroupAddon>
                    <InputText v-model="login" placeholder="Логин" />
                </InputGroup>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-asterisk"></i>
                    </InputGroupAddon>
                    <Password v-model="password" :feedback="false" placeholder="Пароль"/>
                </InputGroup>            
            </div>
            <Message v-if="errormsg" severity="error">{{ errormsg }}</Message>
            <div class="flex justify-end gap-2 pt-5">
                <Button type="link" label="Закрыть" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Войти" v-if="login_form_enter_completed" @click="auth"></Button>
            </div>
        </Dialog>
</template>

<style scoped>
    .menu {
        margin: 30px 0;
    }
    .menu-exit {
        cursor: pointer;
    }
</style>
