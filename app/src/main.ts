import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import UiPlugin from './plugins/ui'
import { seedDemoData } from './seed'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(UiPlugin)
app.mount('#app')

// Seed demo data if empty
seedDemoData()
