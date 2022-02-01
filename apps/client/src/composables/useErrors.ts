import useVuelidate, {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
} from '@vuelidate/core'
import { computed, reactive } from 'vue'
import { useI18nValidators } from './useI18nValidators'

type ValidatorName = keyof ReturnType<typeof useI18nValidators>

type ValidatorObjectDescription<Form> =
  | {
      name: 'minLength'
      param: number
    }
  | {
      name: 'maxLength'
      param: number
    }
  | {
      name: 'sameAs'
      param: keyof Form
    }

type ValidatorDescription<Form> =
  | Exclude<ValidatorName, ValidatorObjectDescription<Form>['name']>
  | ValidatorObjectDescription<Form>

interface FormParams<Form> {
  defaultValue: string | number
  validatorDescriptions: ValidatorDescription<Form>[]
}

/**
 * @example
 * const { form, errors, isTouched, touchAll, resetTouch } = useErrors<{
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
  description: Record<keyof Form, FormParams<Form>>,
) => {
  type Key = keyof Form
  type ValidatorRuleValue = Record<
    ValidatorName,
    ValidationRuleWithoutParams | ValidationRuleWithParams
  >
  type ValidatorRule = Record<Key, Partial<ValidatorRuleValue>>

  const entries = Object.entries(description) as Array<[Key, FormParams<Form>]>

  const form = reactive(
    entries.reduce((acc, [key, { defaultValue }]) => {
      acc[key] = defaultValue as Form[Key]
      return acc
    }, {} as Form),
  ) as Form

  const validators = useI18nValidators()

  const rules = entries.reduce((acc, [key, { validatorDescriptions }]) => {
    acc[key] = {} as Partial<ValidatorRuleValue>

    validatorDescriptions.forEach(validatorDescription => {
      if (typeof validatorDescription === 'string') {
        acc[key][validatorDescription] = validators[validatorDescription]

        return
      }

      if (validatorDescription.name === 'sameAs') {
        const otherName = validatorDescription.param as string
        const equalTo = computed(() => form[otherName])

        acc[key][validatorDescription.name] = validators[
          validatorDescription.name
        ](equalTo, otherName) as ValidationRuleWithParams
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
  ) as Record<Key, boolean>

  const touchAll = () => {
    for (const key in isTouched) {
      isTouched[key] = true
    }
  }

  const resetTouch = () => {
    for (const key in isTouched) {
      isTouched[key] = false
    }
  }

  return {
    form,
    errors,
    isTouched,
    touchAll,
    resetTouch,
  }
}
