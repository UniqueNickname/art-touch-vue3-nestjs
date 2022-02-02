import type { ISO } from 'src/types'
import { createI18n } from 'vue-i18n'
import ru from './ru-RU.json'
import en from './en-US.json'

export function createI18N(defaultLanguage: ISO = 'en-US') {
  const messages = { 'ru-RU': ru, 'en-US': en }

  return createI18n({
    legacy: false,
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    messages,
  })
}
