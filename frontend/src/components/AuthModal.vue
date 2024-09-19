<script setup lang="ts">
    import { ref, computed } from 'vue'
    import Dialog from 'primevue/dialog';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Password from 'primevue/password';
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import Message from 'primevue/message';
    import { useLoginStore } from '@/stores/login';
    import { useUserStore } from '@/stores/user';
    
    const loginModal = useLoginStore()
    const user       = useUserStore()

    const login    = ref<string>('')
    const password = ref<string>('')

    const login_form_enter_completed = computed(() => {
        if (login.value.length > 3 && password.value.length > 3) {
            return true
        } else {
            return false
        }
    })

    const auth = () => { user.auth(login.value, password.value) }
</script>

<template>
    <Dialog v-model:visible="loginModal.visible" modal header="Вход в личный кабинет" :style="{ width: '25rem' }">
        <form @submit.prevent="auth">
            <div v-focustrap>
                <div class="flex items-center gap-4 mb-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText v-model="login" placeholder="Логин" autofocus/>
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
                <Message v-if="user.errorMsg" severity="error">{{ user.errorMsg }}</Message>
                <div class="flex justify-end gap-2 pt-5">
                    <Button type="link" label="Закрыть" severity="secondary" @click="loginModal.visible = false"></Button>
                    <Button type="button" label="Войти" v-if="login_form_enter_completed" @click="auth"></Button>
                </div>
            </div>
       </form>
    </Dialog>
</template>

