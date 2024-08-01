import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/stores/user'

const checkAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  if (!userStore.userId) {
    next({name: 'auth'}) // Если пользователь не авторизован, то отправляеи на страницу авторизации
  } else {
    next() // Пусть идёт, куда хотел
  }
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MainView.vue')
    },

    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue')
    },

    {
      path: '/config',
      name: 'config',
      component: () => import('../views/dictionaries/UserInvConfigs/ListView.vue'),
//      beforeEnter: checkAuth,
    },

    {
      path: '/inv_config',
      name: 'inv_config',
      component: () => import('../views/dictionaries/UserInvConfigs/PlainView.vue'),
//      beforeEnter: checkAuth,
    },

    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },


    // ######################### справочники #########################
    // ------------------------- входные напряижения -----------------
    {
      path: '/dictionaries/InvInputVoltage/List',
      name: 'InvInputVoltageList',
      component: () => import('../views/dictionaries/InvInputVoltage/ListView.vue')
    },
    {
      path: '/dictionaries/InvInputVoltage/Update/:id',
      name: 'InvInputVoltageUpdate',
      component: () => import('../views/dictionaries/InvInputVoltage/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvInputVoltage/Create',
      name: 'InvInputVoltageCreate',
      component: () => import('../views/dictionaries/InvInputVoltage/CreateView.vue')
    },
    {
      path: '/dictionaries/InvInputVoltage/Delete/:id',
      name: 'InvInputVoltageDelete',
      component: () => import('../views/dictionaries/InvInputVoltage/DeleteView.vue'),
      props: true        
    },
    // ------------------------- выходные напряижения -----------------
    {
      path: '/dictionaries/InvOutputVoltage/List',
      name: 'InvOutputVoltageList',
      component: () => import('../views/dictionaries/InvOutputVoltage/ListView.vue')
    },
    {
      path: '/dictionaries/InvOutputVoltage/Update/:id',
      name: 'InvOutputVoltageUpdate',
      component: () => import('../views/dictionaries/InvOutputVoltage/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvOutputVoltage/Create',
      name: 'InvOutputVoltageCreate',
      component: () => import('../views/dictionaries/InvOutputVoltage/CreateView.vue')
    },
    {
      path: '/dictionaries/InvOutputVoltage/Delete/:id',
      name: 'InvOutputVoltageDelete',
      component: () => import('../views/dictionaries/InvOutputVoltage/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Производители -----------------
    {
      path: '/dictionaries/Manufactory/List',
      name: 'ManufactoryList',
      component: () => import('../views/dictionaries/Manufactory/ListView.vue')
    },
    {
      path: '/dictionaries/Manufactory/Update/:id',
      name: 'ManufactoryUpdate',
      component: () => import('../views/dictionaries/Manufactory/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/Manufactory/Create',
      name: 'ManufactoryCreate',
      component: () => import('../views/dictionaries/Manufactory/CreateView.vue')
    },
    {
      path: '/dictionaries/Manufactory/Delete/:id',
      name: 'ManufactoryDelete',
      component: () => import('../views/dictionaries/Manufactory/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Уровни защиты -----------------
    {
      path: '/dictionaries/LevelIP/List',
      name: 'LevelIPList',
      component: () => import('../views/dictionaries/LevelIP/ListView.vue')
    },
    {
      path: '/dictionaries/LevelIP/Update/:id',
      name: 'LevelIPUpdate',
      component: () => import('../views/dictionaries/LevelIP/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/LevelIP/Create',
      name: 'LevelIPCreate',
      component: () => import('../views/dictionaries/LevelIP/CreateView.vue')
    },
    {
      path: '/dictionaries/LevelIP/Delete/:id',
      name: 'LevelIPDelete',
      component: () => import('../views/dictionaries/LevelIP/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Перегрузки ----------------- 
    {
      path: '/dictionaries/InvTypeOfOverload/List',
      name: 'InvTypeOfOverloadList',
      component: () => import('../views/dictionaries/InvTypeOfOverload/ListView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfOverload/Update/:id',
      name: 'InvTypeOfOverloadUpdate',
      component: () => import('../views/dictionaries/InvTypeOfOverload/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvTypeOfOverload/Create',
      name: 'InvTypeOfOverloadCreate',
      component: () => import('../views/dictionaries/InvTypeOfOverload/CreateView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfOverload/Delete/:id',
      name: 'InvTypeOfOverloadDelete',
      component: () => import('../views/dictionaries/InvTypeOfOverload/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Панели -----------------
    {
      path: '/dictionaries/InvTypeOfPanels/List',
      name: 'InvTypeOfPanelsList',
      component: () => import('../views/dictionaries/InvTypeOfPanels/ListView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfPanels/Update/:id',
      name: 'InvTypeOfPanelsUpdate',
      component: () => import('../views/dictionaries/InvTypeOfPanels/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvTypeOfPanels/Create',
      name: 'InvTypeOfPanelsCreate',
      component: () => import('../views/dictionaries/InvTypeOfPanels/CreateView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfPanels/Delete/:id',
      name: 'InvTypeOfPanelsDelete',
      component: () => import('../views/dictionaries/InvTypeOfPanels/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Сигналы -----------------
    {
      path: '/dictionaries/InvTypeOfSignals/List',
      name: 'InvTypeOfSignalsList',
      component: () => import('../views/dictionaries/InvTypeOfSignals/ListView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfSignals/Update/:id',
      name: 'InvTypeOfSignalsUpdate',
      component: () => import('../views/dictionaries/InvTypeOfSignals/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvTypeOfSignals/Create',
      name: 'InvTypeOfSignalsCreate',
      component: () => import('../views/dictionaries/InvTypeOfSignals/CreateView.vue')
    },
    {
      path: '/dictionaries/InvTypeOfSignals/Delete/:id',
      name: 'InvTypeOfSignalsDelete',
      component: () => import('../views/dictionaries/InvTypeOfSignals/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Темпаратура окружающей среды -----------------
    {
      path: '/dictionaries/AmbientTemperatures/List',
      name: 'AmbientTemperaturesList',
      component: () => import('../views/dictionaries/AmbientTemperatures/ListView.vue')
    },
    {
      path: '/dictionaries/AmbientTemperatures/Update/:id',
      name: 'AmbientTemperaturesUpdate',
      component: () => import('../views/dictionaries/AmbientTemperatures/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/AmbientTemperatures/Create',
      name: 'AmbientTemperaturesCreate',
      component: () => import('../views/dictionaries/AmbientTemperatures/CreateView.vue')
    },
    {
      path: '/dictionaries/AmbientTemperatures/Delete/:id',
      name: 'AmbientTemperaturesDelete',
      component: () => import('../views/dictionaries/AmbientTemperatures/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Точность регулирования частоты -----------------
    {
      path: '/dictionaries/InvAccurancyFrenq/List',
      name: 'InvAccurancyFrenqList',
      component: () => import('../views/dictionaries/InvAccurancyFrenq/ListView.vue')
    },
    {
      path: '/dictionaries/InvAccurancyFrenq/Update/:id',
      name: 'InvAccurancyFrenqUpdate',
      component: () => import('../views/dictionaries/InvAccurancyFrenq/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvAccurancyFrenq/Create',
      name: 'InvAccurancyFrenqCreate',
      component: () => import('../views/dictionaries/InvAccurancyFrenq/CreateView.vue')
    },
    {
      path: '/dictionaries/InvAccurancyFrenq/Delete/:id',
      name: 'InvAccurancyFrenqDelete',
      component: () => import('../views/dictionaries/InvAccurancyFrenq/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Тип управления -----------------
    {
      path: '/dictionaries/TypeOfControl/List',
      name: 'TypeOfControlList',
      component: () => import('../views/dictionaries/TypeOfControl/ListView.vue')
    },
    {
      path: '/dictionaries/TypeOfControl/Update/:id',
      name: 'TypeOfControlUpdate',
      component: () => import('../views/dictionaries/TypeOfControl/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/TypeOfControl/Create',
      name: 'TypeOfControlCreate',
      component: () => import('../views/dictionaries/TypeOfControl/CreateView.vue')
    },
    {
      path: '/dictionaries/TypeOfControl/Delete/:id',
      name: 'TypeOfControlDelete',
      component: () => import('../views/dictionaries/TypeOfControl/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Способ управления -----------------
    {
      path: '/dictionaries/VariantsOfControl/List',
      name: 'VariantsOfControlList',
      component: () => import('../views/dictionaries/VariantsOfControl/ListView.vue')
    },
    {
      path: '/dictionaries/VariantsOfControl/Update/:id',
      name: 'VariantsOfControlUpdate',
      component: () => import('../views/dictionaries/VariantsOfControl/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/VariantsOfControl/Create',
      name: 'VariantsOfControlCreate',
      component: () => import('../views/dictionaries/VariantsOfControl/CreateView.vue')
    },
    {
      path: '/dictionaries/VariantsOfControl/Delete/:id',
      name: 'VariantsOfControlDelete',
      component: () => import('../views/dictionaries/VariantsOfControl/DeleteView.vue'),
      props: true        
    },
    // ------------------------- Тормозные модули -----------------
    {
      path: '/dictionaries/InvBreakeModule/List',
      name: 'InvBreakeModuleList',
      component: () => import('../views/dictionaries/InvBreakeModule/ListView.vue')
    },
    {
      path: '/dictionaries/InvBreakeModule/Update/:id',
      name: 'InvBreakeModuleUpdate',
      component: () => import('../views/dictionaries/InvBreakeModule/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvBreakeModule/Create',
      name: 'InvBreakeModuleCreate',
      component: () => import('../views/dictionaries/InvBreakeModule/CreateView.vue')
    },
    {
      path: '/dictionaries/InvBreakeModule/Delete/:id',
      name: 'InvBreakeModuleDelete',
      component: () => import('../views/dictionaries/InvBreakeModule/DeleteView.vue'),
      props: true        
    },
    // ------------------------- DC дроссели -----------------
    {
      path: '/dictionaries/InvDCDrossel/List',
      name: 'InvDCDrosselList',
      component: () => import('../views/dictionaries/InvDCDrossel/ListView.vue')
    },
    {
      path: '/dictionaries/InvDCDrossel/Update/:id',
      name: 'InvDCDrosselUpdate',
      component: () => import('../views/dictionaries/InvDCDrossel/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvDCDrossel/Create',
      name: 'InvDCDrosselCreate',
      component: () => import('../views/dictionaries/InvDCDrossel/CreateView.vue')
    },
    {
      path: '/dictionaries/InvDCDrossel/Delete/:id',
      name: 'InvDCDrosselDelete',
      component: () => import('../views/dictionaries/InvDCDrossel/DeleteView.vue'),
      props: true        
    },
    // ------------------------- EMC дроссели -----------------
    {
      path: '/dictionaries/InvEMCDrossel/List',
      name: 'InvEMCDrosselList',
      component: () => import('../views/dictionaries/InvEMCDrossel/ListView.vue')
    },
    {
      path: '/dictionaries/InvEMCDrossel/Update/:id',
      name: 'InvEMCDrosselUpdate',
      component: () => import('../views/dictionaries/InvEMCDrossel/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvEMCDrossel/Create',
      name: 'InvEMCDrosselCreate',
      component: () => import('../views/dictionaries/InvEMCDrossel/CreateView.vue')
    },
    {
      path: '/dictionaries/InvEMCDrossel/Delete/:id',
      name: 'InvEMCDrosselDelete',
      component: () => import('../views/dictionaries/InvEMCDrossel/DeleteView.vue'),
      props: true        
    },    
    // ------------------------- Размеры инвероторов -----------------
    {
      path: '/dictionaries/InvSizes/List',
      name: 'InvSizesList',
      component: () => import('../views/dictionaries/InvSizes/ListView.vue')
    },
    {
      path: '/dictionaries/InvSizes/Update/:id',
      name: 'InvSizesUpdate',
      component: () => import('../views/dictionaries/InvSizes/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvSizes/Create',
      name: 'InvSizesCreate',
      component: () => import('../views/dictionaries/InvSizes/CreateView.vue')
    },
    {
      path: '/dictionaries/InvSizes/Delete/:id',
      name: 'InvSizesDelete',
      component: () => import('../views/dictionaries/InvSizes/DeleteView.vue'),
      props: true        
    },    
    // ------------------------- Типы элементов -----------------
    {
      path: '/dictionaries/TypeOfItems/List',
      name: 'TypeOfItemsList',
      component: () => import('../views/dictionaries/TypeOfItems/ListView.vue')
    },
    {
      path: '/dictionaries/TypeOfItems/Update/:id',
      name: 'TypeOfItemsUpdate',
      component: () => import('../views/dictionaries/TypeOfItems/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/TypeOfItems/Create',
      name: 'TypeOfItemsCreate',
      component: () => import('../views/dictionaries/TypeOfItems/CreateView.vue')
    },
    {
      path: '/dictionaries/TypeOfItems/Delete/:id',
      name: 'TypeOfItemsDelete',
      component: () => import('../views/dictionaries/TypeOfItems/DeleteView.vue'),
      props: true        
    },    
    // ------------------------- Инверторы -----------------
    {
      path: '/dictionaries/Invertors/List',
      name: 'InvertorsList',
      component: () => import('../views/dictionaries/Invertors/ListView.vue')
    },
    {
      path: '/dictionaries/Invertors/Update/:id',
      name: 'InvertorsUpdate',
      component: () => import('../views/dictionaries/Invertors/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/Invertors/Create',
      name: 'InvertorsCreate',
      component: () => import('../views/dictionaries/Invertors/CreateView.vue')
    },
    {
      path: '/dictionaries/Invertors/Delete/:id',
      name: 'InvertorsDelete',
      component: () => import('../views/dictionaries/Invertors/DeleteView.vue'),
      props: true        
    },    
    // ------------------------- Серии инверторов -----------------
    {
      path: '/dictionaries/InvSeries/List',
      name: 'InvSeriesList',
      component: () => import('../views/dictionaries/InvSeries/ListView.vue')
    },
    {
      path: '/dictionaries/InvSeries/Update/:id',
      name: 'InvSeriesUpdate',
      component: () => import('../views/dictionaries/InvSeries/UpdateView.vue'),
      props: true        
    },
    {
      path: '/dictionaries/InvSeries/Create',
      name: 'InvSeriesCreate',
      component: () => import('../views/dictionaries/InvSeries/CreateView.vue')
    },
    {
      path: '/dictionaries/InvSeries/Delete/:id',
      name: 'InvSeriesDelete',
      component: () => import('../views/dictionaries/InvSeries/DeleteView.vue'),
      props: true        
    },    
  ]
})

export default router
