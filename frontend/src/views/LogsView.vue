<script setup lang="ts">

    import { ref, watch } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { ILogData, IUserData, ICompanyUsersData, ICompanyData, ISimpleData, IUser } from '@/interfaces';
    import { getCompanyNameByUserId, getUserNameByUserId, getLoginByUserId } from '@/api/getCompanyNameByUserId';
    import { getValueFromDictionary } from '@/api/getValueFromDictionary';
    import moment from 'moment';

    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Chart from 'primevue/chart';  
    import Select from 'primevue/select';
    import FloatLabel from 'primevue/floatlabel';
    
    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';

    interface IStack {
        data: number []
    }

    const logs          = ref<ILogData>({data:[], error: null, loading: true})
    const users         = ref<IUserData>({data:[], error: null, loading: true}) 
    const companyUsers  = ref<ICompanyUsersData>({data:[], error: null, loading: true}) 
    const companies     = ref<ICompanyData>({data:[], error: null, loading: true}) 
    const actions       = ref<ISimpleData>({data:[], error: null, loading: true}) 

    const selectedUser  = ref<IUser>()
    const actionLabels  = ref<String[]>([])
    const actionValues  = ref<Number[]>([])
    const chartData1    = ref();
    const chartData2    = ref();
    const chartOptions1 = ref();
    const chartOptions2 = ref();
    const loading       = ref<boolean>(true)
    const dates         = ref<String[]>([])
    const stacked       = ref<IStack[]>([])

    const setChartData1 = () => {
        return {
            labels: actionLabels.value,
            datasets: [
                {
                    label: 'Действия',
                    data: actionValues.value,
                    backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'],
                    borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                    borderWidth: 1
                }
            ]
        };
    };

    const setChartData2 = () =>  {
        const documentStyle = getComputedStyle(document.documentElement);

        return {
            labels: dates.value,
            datasets: [
                {   type: 'bar', label: actions.value.data[0].name, backgroundColor: documentStyle.getPropertyValue('--p-blue-500'), data: stacked.value[0] },
                {   type: 'bar', label: actions.value.data[1].name, backgroundColor: documentStyle.getPropertyValue('--p-green-500'), data: stacked.value[1] },
                {   type: 'bar', label: actions.value.data[2].name, backgroundColor: documentStyle.getPropertyValue('--p-yellow-500'), data: stacked.value[2] },
                {   type: 'bar', label: actions.value.data[3].name, backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'), data: stacked.value[3] },
                {   type: 'bar', label: actions.value.data[4].name, backgroundColor: documentStyle.getPropertyValue('--p-pink-500'), data: stacked.value[4] },
                {   type: 'bar', label: actions.value.data[5].name, backgroundColor: documentStyle.getPropertyValue('--p-indigo-500'), data: stacked.value[5] },
                {   type: 'bar', label: actions.value.data[6].name, backgroundColor: documentStyle.getPropertyValue('--p-teal-500'), data: stacked.value[6] },
                {   type: 'bar', label: actions.value.data[7].name, backgroundColor: documentStyle.getPropertyValue('--p-teal-500'), data: stacked.value[7] },
                {   type: 'bar', label: actions.value.data[8].name, backgroundColor: documentStyle.getPropertyValue('--p-bluegray-500'), data: stacked.value[8] },
                ]
        };
    };


    const setChartOptions1 = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
        return {
            plugins: { legend: {  labels: { color: textColor } } },
            scales: { x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }, y: { beginAtZero: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }}
        };
    }

    const setChartOptions2 = () =>  {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: { tooltips: { mode: 'index', intersect: false }, 
            legend: { labels: { color: textColor } } },
            scales: { x: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }, y: { stacked: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } } }
        };
    }

    async function loadData() {
        logs.value          = await useFetch('logs/Logs', {})
        users.value         = await useFetch('Users', {} );
        companyUsers.value  = await useFetch('CompanyUsers', {} );
        companies.value     = await useFetch('Companies', {} );
        actions.value       = await useFetch('logs/Actions', {} );

        actions.value.data.map(action => {
            actionLabels.value.push(action.name)        // Создаём список действий
            const actionCount = logs.value.data.filter(log => log.action === action.id)
            actionValues.value.push(actionCount.length) // Считаем количесто действий
        }) 

        let date = Date.now() - 1000 * 60 * 60 * 24 * 29; // 30 дней назад
        for (let i=1; i<30; i++) {
            date += 1000 * 60 * 60 * 24
            dates.value.push(String(moment(date).format('DD.MM.YYYY')))
        }

        chartOptions1.value = setChartOptions1();
        chartData1.value    = setChartData1();

        // selectedUser.value = users.value.data[0]  // установка начального выбранного пользователя

        actions.value.data.map((action, index) => { stacked.value.push([]) })  // Создаём пустые стеки


        loading.value       = false
    }

    watch(selectedUser, () => {
        
        actions.value.data.map((action, index) => { 
            let date = Date.now() - 1000 * 60 * 60 * 24 * 29; // 30 дней назад
            stacked.value[index]=[]
            for (let i=1; i<30; i++) {
                date += 1000 * 60 * 60 * 24
                let count : number = 0
                logs.value.data.map( log => {
                    if (((selectedUser.value && log.user == selectedUser.value.id) || !selectedUser.value) && 
                        moment(log.date).format('DD.MM.YYYY') == moment(date).format('DD.MM.YYYY') && 
                        log.action == action.id) 
                    {

                        count++
                    }
                })
                stacked.value[index].push(count)
            }
        })
        chartOptions2.value = setChartOptions2();
        chartData2.value    = setChartData2();



    })

    loadData()
</script>

<template>
    <h1>Журналирование</h1>
    <div v-if="loading">
        loading
    </div>
    <div v-else>
        <Tabs value="0">
            <TabList>
                <Tab value="0">Таблица</Tab>
                <Tab value="1">Сводная</Tab>
                <Tab value="2">По датам</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <DataTable :value="logs.data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                        <Column header="id" field="id"></Column>
                        <Column header="Действие">
                            <template #body="{ data }" >
                                {{ getValueFromDictionary(actions.data, data.action) }}
                            </template>                
                        </Column>
                        <Column header="login" field="user">
                            <template #body="{ data }" >
                                {{ getLoginByUserId(users.data, data.user) }}
                            </template>                
                        </Column>
                        <Column header="Организация" field="user">
                            <template #body="{ data }" >
                                {{ getCompanyNameByUserId(companies.data, companyUsers.data, data.user) }}
                            </template>                
                        </Column>
                        <Column header="Дата" field="date">
                            <template #body="{ data }" >
                                <!-- <span>{{ data.date }}</span>--- -->
                                <span>{{ moment(data.date).format("DD.MM.YYYY") }}</span>
                            </template>                
                        </Column>
                        <Column header="Время" field="date">
                            <template #body="{ data }" >
                                <!-- <span>{{ data.date }}</span>--- -->
                                <span>{{ moment(data.date).format("H:mm:ss") }}</span>
                            </template>                
                        </Column>
                        <Column header="params" field="params"></Column>
                    </DataTable>
                </TabPanel>
                <TabPanel value="1">
                    <Chart type="bar" :data="chartData1" :options="chartOptions1" />
                </TabPanel>
                <TabPanel value="2">
                    <div class="field mt-5">        
                        <FloatLabel>
                            <Select v-model="selectedUser" :options="users.data" showClear optionLabel="username" placeholder="Пользователь..." class="w-full md:w-56" />
                            <label for="username">Пользователь</label>
                        </FloatLabel>
                    </div>
                    <Chart type="bar" :data="chartData2" :options="chartOptions2" class="h-30rem" />
                </TabPanel>
            </TabPanels>
        </Tabs>



    </div>
</template>
