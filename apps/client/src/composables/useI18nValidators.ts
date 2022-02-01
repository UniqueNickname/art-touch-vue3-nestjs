import { useI18n } from 'vue-i18n'
import * as validators from '@vuelidate/validators'

interface MinLengthParams {
  min: number
  type: 'minLength'
}

export const useI18nValidators = () => {
  const { t } = useI18n()
  const withI18nMessage = validators.createI18nMessage({
    t,
    messagePath: params => {
      if (params.$validator === 'minLength') {
        if ((params.$params as MinLengthParams).min > 4) {
          return `validations.${params.$validator}Big`
        }
        return `validations.${params.$validator}Small`
      }
      return `validations.${params.$validator}`
    },
  })

  const required = withI18nMessage(validators.required)
  const email = withI18nMessage(validators.email)
  const minLength = (min: number) => withI18nMessage(validators.minLength(min))

  return {
    required,
    email,
    minLength,
  }
}
