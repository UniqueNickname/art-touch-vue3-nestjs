import { ISO } from '../../../packages/common/src/enums/iso.enum'
import { createApp } from './create-app'

const language = document.documentElement.getAttribute('lang') as ISO

createApp(language).then(({ app, router }) => {
  router.isReady().then(() => {
    app.mount('#app', true)
  })
})
