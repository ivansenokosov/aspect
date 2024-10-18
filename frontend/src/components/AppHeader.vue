<script setup lang="ts">
    import { useUserStore } from '@/stores/user';
    import { ref, computed, watch, onUnmounted, onMounted } from 'vue'   
    import Menubar from 'primevue/menubar';
    import Badge from 'primevue/badge';
    import Button from 'primevue/button';
    import type { IMenuItem } from '@/interfaces';
    import { useLoginStore } from '@/stores/login';
    import { useUnreadInvConfigs } from '@/stores/unreadInvConfig';
    import { useWebSocketStore } from '@/stores/ws';
    import AuthModal from './AuthModal.vue';
    
    const user       = useUserStore()
    const invUnread  = useUnreadInvConfigs()
    const loginModal = useLoginStore();
    const ws         = useWebSocketStore()

    onMounted(() => invUnread.count()) // при загрузке определеяем количесвто неоткрытых конфигураций
    onUnmounted(() => ws.closeConnection())
    watch(() => [ws.message], () => invUnread.count()) // при получении сообщения определеяем количесвто неоткрытых конфигураций
    

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
        show: computed((): boolean => user.isUser()),
        badge: computed(() : number => Number(invUnread.unreadInvConfigs)),
        level: 1
    },
    {
        label: 'Справочники',
        icon: 'pi pi-search',
        show: computed(():boolean => user.isStaff()), 
        level: 1,
        items: [
            {
                label: 'Пользователи',
                icon: 'pi pi-user',
                show: computed((): boolean => true),
                route: '/dictionaries/Users/List'
            },
            {
                label: 'Органиазции',
                icon: 'pi pi-building',
                show: computed((): boolean => true),
                route: '/dictionaries/Companies/List'
            },
            {
                label: 'Журнал',
                icon: 'pi pi-book',
                show: computed((): boolean => user.isSuperadmin()),
                route: '/logs'
            },

            {
                label: 'Общие',
                icon: 'pi pi-book',
                show: computed((): boolean => user.isSuperadmin()),
                items: [
                    {
                        label: 'Производители',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/Manufactory/List'
                    },
                    {
                        label: 'Типы элементов',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/TypeOfItems/List'
                    },
                    {
                        label: 'Сроки ожидания',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/WaitingPeriod/List'
                    },
                    {
                        label: 'Действия журналирования',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/Actions/List'
                    },
                       ]
           }, 
            {
                label: 'Преобразователи частоты',
                icon: 'pi pi-bolt',
                show: computed((): boolean => user.isSuperadmin()),
                items: [
                        {
                            label: 'Преобразователи частоты',
                            icon: 'pi pi-bolt',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/Invertors/List'
                        },
                        {
                            label: 'Опции для ПЧ',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/InvOptions/List'
                        },
                        {
                            label: 'Элементы',
                            icon: 'pi pi-objects-column',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/Items/List'
                        },
                        {
                            label: 'Серии ПЧ',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                                route: '/dictionaries/InvSeries/List'
                        },
                        {
                            label: 'Входы/выходы',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/InputOutput/List'
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'Входные напряжения',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/InvInputVoltage/List'
                        },
                        {
                            label: 'Типы управления',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/TypeOfControl/List'
                        },
                        {
                            label: 'Способы управления',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/VariantsOfControl/List'
                        },
                        {
                            label: 'Дроссели ЕМС',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
                            route: '/dictionaries/InvEMCDrossel/List'
                        },
                        {
                            label: 'DC фильтры',
                            icon: 'pi pi-book',
                            show: computed((): boolean => user.isSuperadmin()),
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
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvBreakeModule/List'
                    },                        
                    {
                        label: 'Выходные напряжения',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvOutputVoltage/List'
                    },
                    {
                        label: 'Типы опций',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvTypeOfOptions/list'
                    },
                    {
                        label: 'Способы управления для серии',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvTypeOfControls/List'
                    },
                    {
                        label: 'Уровни защиты',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/LevelIP/List'
                    },
                    {
                        label: 'Перегрузки',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvOverloads/List'
                    },
                    {
                        label: 'Панели',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvTypeOfPanels/List'
                    },
                    {
                        label: 'Допустимые температуры окружающей среды',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/AmbientTemperatures/List'
                    },
                    {
                        label: 'Точность регулирования частоты',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvAccurancyFrenq/List'
                    },
                    {
                        label: 'Размеры',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvSizes/List'
                    },
                    {
                        label: 'Сигналы',
                        icon: 'pi pi-book',
                        show: computed((): boolean => user.isSuperadmin()),
                        route: '/dictionaries/InvTypeOfSignals/List'
                    },                    
                ]
            },



        ]
    },
    {
        label: 'Upload',
        icon: 'pi pi-upload',
        show: computed((): boolean => user.isStaff()),
        badge: 0,
        level: 1,
        items: [
                    {
                        label: 'Инстарт',
                        icon: '',
                        show: computed((): boolean => user.isStaff()),
                        route: '/upload',
                    },
                       ]
    },
    {
        label: 'Скидки',
        icon: 'pi pi-percentage',
        show: computed((): boolean => user.isSuperadmin()),
        badge: 0,
        level: 1,
        items: [
                    {
                        label: 'Преобразователи частоты',
                        icon: '',
                        show: computed((): boolean => true),
                        items: [
                                    {
                                        label: 'Группы',
                                        icon: '',
                                        show: computed((): boolean => user.isSuperadmin()),
                                        route: '/dictionaries/InvDiscountGroups/List',
                                    },
                       ]
                    },
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
                <div class="text-xl font-semibold pr-5">+7 (343) 227-07-27</div>
                <span v-if="user.isUser()" @click="() => { user.logout() }">
                <span class="flex align-items-center menu-exit">
                    <Button severity="contrast" class="flex align-items-center" >
                        <span class="pi pi-sign-in p-menuitem-icon"></span>
                        <span class="ml-2 font-semibold text-lg"> {{ user.getUser().userName }} </span>
                    </Button>
                </span>
            </span>
            <span v-else>
                <span class="flex align-items-center menu-exit">
                    <Button  severity="contrast" class="flex align-items-center" @click="loginModal.visible = true" >
                        <span class="pi pi-sign-in p-menuitem-icon"></span>
                        <span class="ml-2 font-semibold text-lg"> Вход </span>
                    </Button>
                </span>
            </span>
            </div>

        </template>

    </Menubar>

    <AuthModal/>

</template>

<style scoped>
    .menu {
        margin: 30px 0;
    }
    .menu-exit {
        cursor: pointer;
    }
</style>
