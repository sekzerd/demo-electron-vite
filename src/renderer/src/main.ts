// import './assets/main.css'
import "./assets/tailwind.css"
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate);
const app = createApp(App)
app.use(pinia)
app.mount('#app')
