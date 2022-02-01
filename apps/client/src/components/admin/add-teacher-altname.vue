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
          v-if="!isSSR()"
          v-model:value="form.universityId"
          name="cities"
          filterable
          :disabled="!universities.length"
          :options="universities"
          @blur="isTouched.universityId = true"
        />
      </n-form-item>
      <n-form-item
        :label="t('admin.tabs.teachers.label')"
        :show-feedback="isTouched.entityId && !!errors.entityId"
        :feedback="errors.entityId"
        :validation-status="
          isTouched.entityId && errors.entityId ? 'error' : 'success'
        "
      >
        <n-select
          v-if="!isSSR()"
          v-model:value="form.entityId"
          name="cities"
          filterable
          :disabled="!teachers.length"
          :options="teachers"
          @blur="isTouched.entityId = true"
        />
      </n-form-item>
      <n-form-item
        label="ISO"
        :show-feedback="isTouched.iso && !!errors.iso"
        :feedback="errors.iso"
        :validation-status="isTouched.iso && errors.iso ? 'error' : 'success'"
      >
        <n-select
          v-if="!isSSR()"
          v-model:value="form.iso"
          name="langs"
          filterable
          :options="langs"
        />
      </n-form-item>
      <n-form-item
        :label="t('admin.tabs.teachers.add-altname')"
        :show-feedback="isTouched.value && !!errors.value"
        :feedback="errors.value"
        :validation-status="
          isTouched.value && errors.value ? 'error' : 'success'
        "
      >
        <n-input
          v-model:value="form.value"
          :placeholder="t('admin.tabs.teachers.add-altname-placeholder')"
          @blur="isTouched.value = true"
        />
        <n-button
          class="ml-4 bg-green-600"
          type="success"
          :disabled="!!errors.value"
          @click.prevent="createAltname"
        >
          {{ t('common.add') }}
        </n-button>
      </n-form-item>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NSelect, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useCities } from 'src/composables/useCities'
import { useErrors } from 'src/composables/useErrors'
import { computed, watch } from 'vue'
import { isSSR } from 'src/utils/isSSR'
import { useUniversities } from 'src/composables/useUniversities'
import { useTeachers } from 'src/composables/useTeachers'

const { requireCities, cities } = useCities()
const { universities, requireUniversitiesByCity } = useUniversities()

const { teachers, addTeacherAltname, requireTeachersByUniversity } =
  useTeachers()

const { t, locale, availableLocales } = useI18n()

const langs = computed(() => {
  return availableLocales.map(iso => ({
    label: iso,
    value: iso,
  }))
})

const { form, errors, isTouched, touchAll, resetTouch } = useErrors<{
  value: string
  entityId: number | ''
  cityId: number | ''
  universityId: number | ''
  iso: string
}>({
  value: {
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
  entityId: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
  iso: {
    defaultValue: locale.value,
    validatorDescriptions: ['required'],
  },
})

requireCities().then(async () => {
  form.cityId = cities.value[0]?.value || ''
  if (!form.cityId) return

  await requireUniversitiesByCity(form.cityId)
  form.universityId = universities.value[0]?.value || ''

  if (typeof form.universityId !== 'number') return

  await requireTeachersByUniversity(form.universityId)
  form.entityId = teachers.value[0]?.value || ''
})

watch(
  () => form.cityId,
  async cityId => {
    if (typeof cityId !== 'number') return

    await requireUniversitiesByCity(cityId)

    form.entityId = universities.value[0]?.value || ''
  },
)

const createAltname = async () => {
  touchAll()

  if (typeof form.entityId !== 'number') return
  if (typeof form.universityId !== 'number') return
  if (typeof form.cityId !== 'number') return

  await addTeacherAltname({
    entityId: form.entityId,
    value: form.value,
    iso: form.iso,
  })

  resetTouch()
  form.value = ''

  requireTeachersByUniversity(form.universityId)
}
</script>
