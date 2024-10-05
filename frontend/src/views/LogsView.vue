<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useFetch } from '@/api/useFetch';
    import type { IDocument, ILog, ICompanyUsers, ICompany, IUser, ISimpleDictionary } from '@/interfaces';
    import { getCompanyNameByUserId, getLoginByUserId } from '@/api/getCompanyNameByUserId';
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

    const colors        = ref<string[]>(['--p-blue-500',
                                         '--p-green-500',
                                         '--p-yellow-500',
                                         '--p-cyan-500',
                                         '--p-pink-500',
                                         '--p-indigo-500',
                                         '--p-indigo-500',
                                         '--p-orange-500',
                                         '--p-bluegray-500',
                                         '--p-purple-500',
                                         '--p-red-500',
                                         '--p-gray-500',
                                         '--p-primary-500'])

    const logs          = ref<IDocument<ILog>>({data:[], error: null, loading: true})
    const users         = ref<IDocument<IUser>>({data:[], error: null, loading: true}) 
    const companyUsers  = ref<IDocument<ICompanyUsers>>({data:[], error: null, loading: true}) 
    const companies     = ref<IDocument<ICompany>>({data:[], error: null, loading: true}) 
    const actions       = ref<IDocument<ISimpleDictionary>>({data:[], error: null, loading: true}) 

    const selectedUser  = ref<IUser>()
    const actionLabels  = ref<string[]>([])
    const actionValues  = ref<number[]>([])
    const chartData1    = ref();
    const chartData2    = ref();
    const chartOptions1 = ref();
    const chartOptions2 = ref();
    const loading       = ref<boolean>(true)
    const dates         = ref<string[]>([])
    var   stacked       = create2DArray(30,10) 
    var   dataset       = create2DArray(30,10) 
    const documentStyle = getComputedStyle(document.documentElement);

    function create2DArray(m:number, n:number) {
        return Array(m).fill(Array(n).fill(0));
    }

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

    const setChartData2 = () =>  { return { labels: dates.value, datasets: dataset }; };

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
        logs.value          = await useFetch('logs/Logs')
        users.value         = await useFetch('Users')
        companyUsers.value  = await useFetch('CompanyUsers')
        companies.value     = await useFetch('Companies')
        actions.value       = await useFetch('logs/Actions')

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

        loading.value       = false
    }

    watch(selectedUser, () => {

        dataset = []
        
        actions.value.data.map((action, index) => { 
            let date = Date.now() - 1000 * 60 * 60 * 24 * 29; // 30 дней назад
            stacked[index]=[]
            for (let i=0; i<30; i++) {
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
                stacked[index][i]=count

            }
            dataset[index] = {type: 'bar', label: actions.value.data[index].name, backgroundColor: documentStyle.getPropertyValue(colors.value[index]), data: stacked[index]}
        })

        chartOptions2.value = setChartOptions2();
        chartData2.value    = setChartData2();



    })

    loadData()
</script>

<template>
    <h1>Журналирование</h1>
    <div v-if="loading">
        loading...
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
                        <Column header="id" sortable field="id"></Column>
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
