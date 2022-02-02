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
          v-if="!isSSR"
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
        :show-feedback="isTouched.universityId && !!errors.universityId"
        :feedback="errors.universityId"
        :validation-status="
          isTouched.universityId && errors.universityId ? 'error' : 'success'
        "
      >
        <n-select
          v-if="!isSSR"
          v-model:value="form.universityId"
          name="universities"
          filterable
          :disabled="!universities.length"
          :options="universities"
          @blur="isTouched.universityId = true"
        />
      </n-form-item>
      <n-form-item
        :label="t('admin.tabs.teachers.label')"
        :show-feedback="isTouched.name && !!errors.name"
        :feedback="errors.name"
        :validation-status="isTouched.name && errors.name ? 'error' : 'success'"
      >
        <n-input
          v-model:value="form.name"
          :placeholder="t('admin.tabs.teachers.add-placeholder')"
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
import { isSSR } from 'src/constants'
import { useUniversities } from 'src/composables/useUniversities'
import { useTeachers } from 'src/composables/useTeachers'

const { cities, requireCities } = useCities()
const { universities, requireUniversitiesByCity } = useUniversities()
const { createTeacher } = useTeachers()

const { t } = useI18n()

const { form, errors, isTouched, touchAll, resetTouch } = useErrors<{
  name: string
  cityId: number | ''
  universityId: number | ''
}>({
  name: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 3 }],
  },
  cityId: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
  universityId: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
})

requireCities().then(async () => {
  form.cityId = cities.value[0]?.value || ''

  if (typeof form.cityId !== 'number') return

  await requireUniversitiesByCity(form.cityId)
  form.universityId = universities.value[0]?.value || ''
})

const createNewUniversity = async () => {
  touchAll()

  if (typeof form.cityId !== 'number') return
  if (typeof form.universityId !== 'number') return

  await createTeacher({ name: form.name, universityId: form.universityId })

  resetTouch()
  form.name = ''
}
</script>
