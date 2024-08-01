import { ref, computed } from "vue";
import type { IMenuItem } from "@/interfaces";
import { useUserStore } from "@/stores/user";

// const userStore = useUserStore()

function isStuff<Boolean>() {
    // if (userStore.userId.value > 0 && userStore.userIsStaff == true) {
    //     return true
    // } else {
    //     return false
    // }
    return true

}

export const menuItems = ref<IMenuItem[]>([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        route: '/',
        show: computed((): boolean => true),
        badge: 0,
        level: 1
    },
    // {
    //     label: 'Конфигуратор',
    //     icon: 'pi pi-star',
    //     route: '/config',
    //     show: computed((): boolean => true),
    //     badge: 0
    // },
    {
        label: 'Справочники',
        icon: 'pi pi-search',
        show: computed(():boolean => isStuff()), //!!userStore.userId),
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
                route: '/'
            },
            {
                label: 'Элементы',
                icon: 'pi pi-objects-column',
                show: computed((): boolean => true),
                route: '/'
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
                icon: '',
                show: computed((): boolean => true),
                route: '/'
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
                    {
                        label: 'Мощности',
                        icon: '',
                        show: computed((): boolean => true),
                        route: '/'
                    },
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
