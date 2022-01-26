import { createI18n } from 'vue-i18n'
import { ISO } from '../../../../packages/common/src/enums/iso.enum'
import ru from './ru-RU.json'
import en from './en-US.json'

export function createI18N(defaultLanguage: ISO = ISO.en) {
  const messages = { ru, en }

  return createI18n({
    legacy: false,
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    messages,
  })
}
