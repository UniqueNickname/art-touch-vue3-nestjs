import { getValidISO } from 'src/runtime-type-checkers/iso'
import { createApp } from './create-app'

const language = getValidISO(
  document.documentElement.getAttribute('lang') || '',
)

createApp(language).then(({ app, router }) => {
  router.isReady().then(() => {
    app.mount('#app', true)
  })
})
