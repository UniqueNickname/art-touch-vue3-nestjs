<template>
  <n-dropdown
    v-if="!isSSR"
    trigger="hover"
    :options="options"
    @select="changeLanguage"
  >
    <n-button text>{{ locale.split('-')[1] }}</n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCookies } from 'src/composables/useCookies'
import { isSSR } from 'src/constants'

const { locale, availableLocales } = useI18n()
const cookies = useCookies()

const COOKIES_LANG_KEY = 'i18n_redirected'

if (!isSSR) {
  const cookiesLanguage = cookies.get(COOKIES_LANG_KEY)
  if (cookiesLanguage) {
    locale.value = cookiesLanguage
  }
}

const options = computed(() => {
  return availableLocales.map(currentLocale => ({
    label: currentLocale.split('-')[1],
    key: currentLocale,
  }))
})

const changeLanguage = (event: string) => {
  locale.value = event
  if (isSSR) {
    return
  }
  cookies.set(COOKIES_LANG_KEY, locale.value, { expires: '1y' })
  document.documentElement.setAttribute('lang', locale.value.toLowerCase())
}
</script>
