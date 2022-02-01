<template>
  <n-form>
    <div class="space-y-4">
      <n-form-item
        :label="t('admin.tabs.cities.label')"
        :show-feedback="isTouched.cityId && !!errors.cityId"
        :feedback="errors.cityId"
        :validation-status="
          isTouched.cityId && errors.cityId ? 'error' : 'success'
        "
      >
        <n-select
          v-if="!isSSR()"
          v-model:value="form.cityId"
          name="cities"
          filterable
          :disabled="!cities.length"
          :options="cities"
          @blur="isTouched.cityId = true"
        />
      </n-form-item>
      <n-form-item
        :label="t('admin.tabs.universities.label')"
        :show-feedback="isTouched.name && !!errors.name"
        :feedback="errors.name"
        :validation-status="isTouched.name && errors.name ? 'error' : 'success'"
      >
        <n-input
          v-model:value="form.name"
          :placeholder="t('admin.tabs.universities.add-placeholder')"
          @blur="isTouched.name = true"
        />
        <n-button
          class="ml-4 bg-green-600"
          type="success"
          :disabled="!!errors.name"
          @click.prevent="createNewUniversity"
        >
          {{ t('common.add') }}
        </n-button>
      </n-form-item>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useCities } from 'src/composables/useCities'
import { useErrors } from 'src/composables/useErrors'
import { isSSR } from 'src/utils/isSSR'
import { useUniversities } from 'src/composables/useUniversities'

const { cities, requireCitiesFromServer } = useCities()
const { createUniversity } = useUniversities()

const { t } = useI18n()

requireCitiesFromServer()

const { form, errors, isTouched } = useErrors<{
  name: string
  cityId: number | ''
}>({
  name: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 3 }],
  },
  cityId: {
    defaultValue: cities.value[0]?.value || '',
    validatorDescriptions: ['required'],
  },
})

const createNewUniversity = async () => {
  if (typeof form.cityId !== 'number') return

  await createUniversity({ name: form.name, cityId: form.cityId })

  isTouched.cityId = false
  isTouched.name = false
  form.name = ''
}
</script>
