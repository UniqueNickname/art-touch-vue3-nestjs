<template>
  <n-dropdown
    v-if="!isSSR"
    trigger="hover"
    :options="options"
    @select="changeLanguage"
  >
    <n-button text>{{ locale.split('-')[0].toUpperCase() }}</n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCookies } from 'src/composables/useCookies'
import { NDropdown, NButton } from 'naive-ui'
import { COOKIES_LANG_KEY, isSSR } from 'src/constants'

const { locale, availableLocales } = useI18n()
const cookies = useCookies()

if (!isSSR) {
  const cookiesLanguage = cookies.get(COOKIES_LANG_KEY)
  if (cookiesLanguage) {
    locale.value = cookiesLanguage
  }
}

const options = computed(() => {
  return availableLocales.map(currentLocale => ({
    label: currentLocale.split('-')[0].toUpperCase(),
    key: currentLocale,
  }))
})

const changeLanguage = (event: string) => {
  locale.value = event
  if (isSSR) {
    return
  }
  cookies.set(COOKIES_LANG_KEY, locale.value, { expires: '1y' })
  document.documentElement.setAttribute('lang', locale.value)
}
</script>
