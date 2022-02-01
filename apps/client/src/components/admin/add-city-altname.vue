<template>
  <n-form>
    <div class="space-y-4">
      <n-form-item
        :label="t('admin.tabs.cities.label')"
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
          :options="cities"
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
        :label="t('admin.tabs.cities.add-altname')"
        :show-feedback="isTouched.value && !!errors.value"
        :feedback="errors.value"
        :validation-status="
          isTouched.value && errors.value ? 'error' : 'success'
        "
      >
        <n-input
          v-model:value="form.value"
          :placeholder="t('admin.tabs.cities.add-altname-placeholder')"
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
import { computed } from 'vue'
import { isSSR } from 'src/utils/isSSR'

const { requireCities, cities, addCityAltname } = useCities()

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
  iso: string
}>({
  value: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 3 }],
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

requireCities().then(() => {
  form.entityId = cities.value[0]?.value || ''
})

const createAltname = async () => {
  touchAll()

  if (typeof form.entityId !== 'number') return

  await addCityAltname({
    entityId: form.entityId,
    value: form.value,
    iso: form.iso,
  })

  form.value = ''
  resetTouch()
}
</script>
