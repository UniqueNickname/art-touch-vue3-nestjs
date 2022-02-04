<template>
  <auth-layout role="unauthorized">
    <auth-form
      :next-label="t('auth.sign-in')"
      :title="t('auth.sign-up')"
      :subtitle="t('auth.sign-up-subtitle')"
      @click:submit="submit"
    >
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <n-form-item
            :show-feedback="
              (isTouched.email && !!errors.email) ||
              (isTouched.fullName && !!errors.fullName)
            "
            :feedback="isTouched.email ? errors.email : ''"
            :validation-status="
              isTouched.email && errors.email ? 'error' : 'success'
            "
          >
            <n-input
              v-model:value="form.email"
              autofocus
              :placeholder="t('auth.email')"
              @blur="isTouched.email = true"
            />
          </n-form-item>
          <n-form-item
            :show-feedback="
              (isTouched.phone && !!errors.phone) ||
              (isTouched.cityId && !!errors.cityId)
            "
            :feedback="isTouched.phone ? errors.phone : ''"
            :validation-status="
              isTouched.phone && errors.phone ? 'error' : 'success'
            "
          >
            <n-input
              v-model:value="form.phone"
              autofocus
              :placeholder="t('auth.phone')"
              @blur="isTouched.phone = true"
            />
          </n-form-item>
          <n-form-item
            :show-feedback="
              (isTouched.password && !!errors.password) ||
              (isTouched.universityId && !!errors.universityId)
            "
            :feedback="isTouched.password ? errors.password : ''"
            :validation-status="
              isTouched.password && errors.password ? 'error' : 'success'
            "
          >
            <n-input
              v-model:value="form.password"
              autofocus
              type="password"
              :placeholder="t('auth.password')"
              :feedback="errors.password"
              @focus="isTouched.password = true"
            />
          </n-form-item>
          <n-form-item
            :show-feedback="
              (isTouched.confirmPassword && !!errors.confirmPassword) ||
              (isTouched.teacherId && !!errors.teacherId)
            "
            :feedback="errors.confirmPassword"
            :validation-status="
              isTouched.confirmPassword && errors.confirmPassword
                ? 'error'
                : 'success'
            "
          >
            <n-input
              v-model:value="form.confirmPassword"
              autofocus
              type="password"
              :placeholder="t('auth.repeat-password')"
              :feedback="errors.confirmPassword"
              @focus="isTouched.confirmPassword = true"
            />
          </n-form-item>
        </div>
        <div class="col-span-1">
          <n-form-item
            :show-feedback="
              (isTouched.fullName && !!errors.fullName) ||
              (isTouched.email && !!errors.email)
            "
            :feedback="isTouched.fullName ? errors.fullName : ''"
            :validation-status="
              isTouched.fullName && errors.fullName ? 'error' : 'success'
            "
          >
            <n-input
              v-model:value="form.fullName"
              autofocus
              :placeholder="t('auth.user-name')"
              @blur="isTouched.fullName = true"
            />
          </n-form-item>
          <n-form-item
            :show-feedback="
              (isTouched.cityId && !!errors.cityId) ||
              (isTouched.phone && !!errors.phone)
            "
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
              :options="cities"
              @blur="isTouched.cityId = true"
            />
          </n-form-item>
          <n-form-item
            :show-feedback="
              (isTouched.universityId && !!errors.universityId) ||
              (isTouched.password && !!errors.password)
            "
            :feedback="errors.universityId"
            :validation-status="
              isTouched.universityId && errors.universityId
                ? 'error'
                : 'success'
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
            :show-feedback="
              (isTouched.teacherId && !!errors.teacherId) ||
              (isTouched.confirmPassword && !!errors.confirmPassword)
            "
            :feedback="errors.teacherId"
            :validation-status="
              isTouched.teacherId && errors.teacherId ? 'error' : 'success'
            "
          >
            <n-select
              v-if="!isSSR"
              v-model:value="form.teacherId"
              name="isTouched"
              filterable
              :disabled="!teachers.length"
              :options="teachers"
              @blur="isTouched.teacherId = true"
            />
          </n-form-item>
        </div>
      </div>
      <template #left>
        <p class="text-black text-opacity-50">
          {{ t('auth.have-account') }}
        </p>
        <n-button
          text
          tag="a"
          size="small"
          class="ml-1 text-purple-900 cursor-pointer"
          href="/auth/login"
          @click.prevent="router.push('/auth/login')"
        >
          {{ t('auth.sign-in') }}
        </n-button>
      </template>
    </auth-form>
  </auth-layout>
</template>

<script setup lang="ts">
import AuthLayout from 'src/layouts/auth-layout.vue'
import AuthForm from 'src/components/auth-form.vue'
import { useI18n } from 'vue-i18n'
import { NInput, NFormItem, NButton, NSelect } from 'naive-ui'
import { useErrors } from 'src/composables/useErrors'
import { useRouter } from 'vue-router'
import { useCities } from 'src/composables/useCities'
import { useTeachers } from 'src/composables/useTeachers'
import { useUniversities } from 'src/composables/useUniversities'
import { isSSR } from 'src/constants'
import { watch } from 'vue'
import { useUsersStore } from 'src/composables/useUsersStore'

const router = useRouter()
const { t } = useI18n()
const { requireCities, cities } = useCities()
const { universities, requireUniversitiesByCity, clearUniversities } =
  useUniversities()
const { teachers, requireTeachersByUniversity, clearTeachers } = useTeachers()
const { registerParticipant } = useUsersStore()

const { form, errors, isTouched, touchAll } = useErrors<{
  email: string
  password: string
  phone: string
  confirmPassword: string
  fullName: string
  cityId: number | ''
  universityId: number | ''
  teacherId: number | ''
}>({
  email: {
    defaultValue: '',
    validatorDescriptions: [
      'required',
      'email',
      { name: 'minLength', param: 4 },
    ],
  },
  phone: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
  password: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 8 }],
  },
  confirmPassword: {
    defaultValue: '',
    validatorDescriptions: [
      'required',
      { name: 'minLength', param: 8 },
      { name: 'sameAs', param: 'password' },
    ],
  },
  fullName: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 8 }],
  },
  cityId: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
  universityId: {
    defaultValue: '',
    validatorDescriptions: ['required'],
  },
  teacherId: {
    defaultValue: '',
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
  form.teacherId = teachers.value[0]?.value || ''
})

watch(
  () => form.cityId,
  async cityId => {
    clearUniversities()
    clearTeachers()
    form.teacherId = ''
    isTouched.universityId = true
    isTouched.teacherId = true

    if (typeof cityId !== 'number') return

    await requireUniversitiesByCity(cityId)

    form.universityId = universities.value[0]?.value || ''
  },
)

watch(
  () => form.universityId,
  async universityId => {
    clearTeachers()

    if (typeof universityId !== 'number') return

    await requireTeachersByUniversity(universityId)
    form.teacherId = teachers.value[0]?.value || ''
  },
)

const submit = async () => {
  touchAll()
  if (!!Object.values(errors.value).filter(Boolean).length) return

  if (typeof form.teacherId !== 'number') return

  registerParticipant({
    email: form.email,
    fullName: form.fullName,
    password: form.password,
    phone: form.phone,
    teacherId: form.teacherId,
  })
}
</script>
