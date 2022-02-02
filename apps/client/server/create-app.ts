import type { ISO } from 'src/types'
import { createSSRApp, createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createRouter } from '../src/router'
import { createI18N } from '../src/locale/create-i18n'
import { isSSR } from '../src/constants'
import App from '../src/App.vue'
import 'src/assets/tailwind.css'

export async function createApp(language: ISO = 'en-US') {
  const app = isSSR ? createSSRApp(App) : createVueApp(App)

  const head = createHead()
  const router = createRouter()
  const i18n = createI18N(language)

  app.use(head)
  app.use(router)
  app.use(i18n)

  return { app, head, router }
}
