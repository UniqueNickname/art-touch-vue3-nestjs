import { useI18n } from 'vue-i18n'
import * as validators from '@vuelidate/validators'

export const useI18nValidators = () => {
  const { t } = useI18n()
  const withI18nMessage = validators.createI18nMessage({ t })

  const required = withI18nMessage(validators.required)
  const email = withI18nMessage(validators.email)
  const minLength = (min: number) => withI18nMessage(validators.minLength(min))

  return {
    required,
    email,
    minLength,
  }
}
