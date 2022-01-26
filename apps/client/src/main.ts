import { createApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'
import { createI18N } from './locale/create-i18n'

const app = createApp(App)

const router = createRouter()
const i18n = createI18N()

app.use(router)
app.use(i18n)

router.isReady().then(() => {
  app.mount('#app', true)
})
