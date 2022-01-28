<template>
  <n-form>
    <n-form-item
      :show-label="false"
      :show-feedback="isTouched.name && !!errors.name"
      :feedback="errors.name"
      :validation-status="isTouched.name && errors.name ? 'error' : 'success'"
    >
      <n-input
        v-model:value="form.name"
        :placeholder="t('admin.tabs.cities.add-placeholder')"
        @blur="isTouched.name = true"
      />
      <n-button
        class="ml-4 bg-green-600"
        type="success"
        :disabled="!!errors.name"
        @click.prevent="createNewCity"
      >
        {{ t('common.add') }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useCities } from 'src/composables/useCities'
import { useErrors } from 'src/composables/useErrors'

const { addCity } = useCities()

const { t } = useI18n()

const { form, errors, isTouched } = useErrors<{
  name: string
}>({
  name: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 3 }],
  },
})

const createNewCity = async () => {
  await addCity({ name: form.name })

  isTouched.name = false
  form.name = ''
}
</script>
