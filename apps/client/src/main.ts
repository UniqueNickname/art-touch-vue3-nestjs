import { createApp } from 'vue'
import { createRouter } from './router'
import { createI18N } from './locale/create-i18n'
import { createHead } from '@vueuse/head'
import App from './App.vue'

const app = createApp(App)

const router = createRouter()
const i18n = createI18N()
const head = createHead()

app.use(router)
app.use(i18n)
app.use(head)

router.isReady().then(() => {
  app.mount('#app', true)
})
