import { ISO } from '../../../packages/common/src/enums/iso.enum'
import { createSSRApp, createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createRouter } from '../src/router'
import { createI18N } from '../src/locale/create-i18n'
import { isSSR } from '../src/utils/isSSR'
import App from '../src/App.vue'
import 'src/assets/tailwind.css'

export async function createApp(language: ISO = ISO.en) {
  const app = isSSR() ? createSSRApp(App) : createVueApp(App)

  const head = createHead()
  const router = createRouter()
  const i18n = createI18N(language)
  const pinia = createPinia()

  app.use(head)
  app.use(router)
  app.use(i18n)
  app.use(pinia)

  return { app, head, router, store: pinia }
}
