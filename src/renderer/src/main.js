import { createApp } from 'vue'
import App from './App.vue'
import i18n from './lang'
import 'virtual:svg-icons-register'
createApp(App).use(i18n).mount('#app')
