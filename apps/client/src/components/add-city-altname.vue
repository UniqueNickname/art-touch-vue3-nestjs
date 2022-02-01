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

const { requireCitiesFromServer, cities, addCityAltname } = useCities()

const { t, locale, availableLocales } = useI18n()

if (!cities.value.length) {
  requireCitiesFromServer()
}

const langs = computed(() => {
  return availableLocales.map(iso => ({
    label: iso,
    value: iso,
  }))
})

const { form, errors, isTouched } = useErrors<{
  value: string
  entityId: number
  iso: string
}>({
  value: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 3 }],
  },
  entityId: {
    defaultValue: cities.value[0]?.value || '',
    validatorDescriptions: ['required'],
  },
  iso: {
    defaultValue: locale.value,
    validatorDescriptions: ['required'],
  },
})

const createAltname = async () => {
  try {
    await addCityAltname({
      entityId: form.entityId,
      value: form.value,
      iso: form.iso,
    })

    form.value = ''
    isTouched.value = false
    isTouched.entityId = false
    isTouched.iso = false
  } catch (error) {
    isTouched.entityId = true
    isTouched.iso = true
    isTouched.value = true
  }
}
</script>
