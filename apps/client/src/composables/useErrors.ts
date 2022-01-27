import useVuelidate, {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
} from '@vuelidate/core'
import { computed, reactive } from 'vue'
import { useI18nValidators } from './useI18nValidators'

type ValidatorName = keyof ReturnType<typeof useI18nValidators>

type ValidatorObjectDescription =
  | {
      name: 'minLength'
      param: number
    }
  | {
      name: 'maxLength'
      param: number
    }

type ValidatorDescription =
  | Exclude<ValidatorName, ValidatorObjectDescription['name']>
  | ValidatorObjectDescription

interface FormParams {
  defaultValue: string | number
  validatorDescriptions: ValidatorDescription[]
}

/**
 * @example
 * const { form, errors } = useErrors<{
 *   email: string
 *   password: string
 * }>({
 *   email: {
 *     defaultValue: '',
 *     validatorDescriptions: ['required', 'email'],
 *   },
 *   password: {
 *     defaultValue: '',
 *     validatorDescriptions: ['required', { name: 'minLength', param: 4 }],
 *   },
 * })
 */
export const useErrors = <Form extends Record<string, string | number>>(
  description: Record<keyof Form, FormParams>,
) => {
  type Key = keyof Form
  type ValidatorRuleValue = Record<
    ValidatorName,
    ValidationRuleWithoutParams | ValidationRuleWithParams
  >
  type ValidatorRule = Record<Key, Partial<ValidatorRuleValue>>

  const entries = Object.entries(description) as Array<[Key, FormParams]>

  const form = reactive(
    entries.reduce((acc, [key, { defaultValue }]) => {
      acc[key] = defaultValue as Form[Key]
      return acc
    }, {} as Form),
  )

  const validators = useI18nValidators()

  const rules = entries.reduce((acc, [key, { validatorDescriptions }]) => {
    acc[key] = {} as Partial<ValidatorRuleValue>

    validatorDescriptions.forEach(validatorDescription => {
      if (typeof validatorDescription === 'string') {
        acc[key][validatorDescription] = validators[validatorDescription]

        return
      }

      acc[key][validatorDescription.name] = validators[
        validatorDescription.name
      ](validatorDescription.param) as ValidationRuleWithParams
    })

    return acc
  }, {} as ValidatorRule)

  const v$ = useVuelidate<ValidatorRule, any>(rules, form)

  const errors = computed(() => {
    return entries.reduce((acc, [key, { validatorDescriptions }]) => {
      acc[key] = ''

      for (const validatorDescription of validatorDescriptions) {
        const validatorName =
          typeof validatorDescription === 'string'
            ? validatorDescription
            : validatorDescription.name

        if (v$.value[key][validatorName].$invalid) {
          acc[key] = v$.value[key][validatorName].$message
          return acc
        }
      }

      return acc
    }, {} as Record<Key, string>)
  })

  const isTouched = reactive(
    Object.keys(description).reduce((acc, key: Key) => {
      acc[key] = false
      return acc
    }, {} as Record<Key, boolean>),
  )

  return {
    form,
    errors,
    isTouched,
  }
}
