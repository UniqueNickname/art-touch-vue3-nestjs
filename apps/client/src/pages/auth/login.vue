<template>
  <auth-layout role="unauthorized">
    <auth-form
      :next-label="t('auth.sign-in')"
      :title="t('auth.sign-up')"
      :subtitle="t('auth.sign-up-subtitle')"
      @click:submit="submit"
    >
      <n-form-item
        :show-feedback="isTouched.email && !!errors.email"
        :feedback="errors.email"
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
        :show-feedback="isTouched.password && !!errors.password"
        :feedback="errors.password"
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
      <template #left>
        <p class="text-black text-opacity-50">
          {{ t('auth.no-account') }}
        </p>
        <n-button
          text
          tag="a"
          size="small"
          class="ml-1 text-purple-900 cursor-pointer"
          href="/auth/login"
          @click.prevent="router.push('/auth/registration')"
        >
          {{ t('auth.sign-up') }}
        </n-button>
      </template>
      <template #right>
        <n-button
          text
          tag="a"
          size="small"
          class="ml-1 text-purple-900 cursor-pointer"
          href="/auth/reset_password"
          @click.prevent="router.push('/auth/reset_password')"
        >
          {{ t('auth.forgot-password') }}
        </n-button>
      </template>
    </auth-form>
  </auth-layout>
</template>

<script setup lang="ts">
import type { Tokens } from 'src/types'
import AuthLayout from 'src/layouts/auth-layout.vue'
import AuthForm from 'src/components/auth-form.vue'
import { useI18n } from 'vue-i18n'
import { NInput, NFormItem, NButton } from 'naive-ui'
import { useErrors } from 'src/composables/useErrors'
import { useUsersStore } from 'src/composables/useUsersStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const { t } = useI18n()
const { saveTokens, currentUser, getUserByToken } = useUsersStore()
const router = useRouter()

const { form, errors, isTouched, touchAll } = useErrors<{
  email: string
  password: string
}>({
  email: {
    defaultValue: '',
    validatorDescriptions: ['required', 'email'],
  },
  password: {
    defaultValue: '',
    validatorDescriptions: ['required', { name: 'minLength', param: 4 }],
  },
})

const submit = async () => {
  touchAll()

  try {
    const { data: tokens } = (await axios.post(`/api/v1/auth/login`, form)) as {
      data: Tokens
    }

    saveTokens(tokens)
    getUserByToken(tokens.access)

    if (!currentUser.value) {
      return
    }

    switch (currentUser.value?.role) {
      case 'admin':
        router.push('/admin')
        break

      default:
        router.push('/')
        break
    }
  } catch (error) {}
}
</script>
