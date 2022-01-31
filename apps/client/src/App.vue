<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'
import colors from 'tailwindcss/colors'
import { useUsersStore } from './store/users.store'
import { isSSR } from './utils/isSSR'

if (!isSSR()) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const initialState = window.__INITIAL_STATE__ as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: any
  }
  useUsersStore().$state = initialState.users
}

const themeOverrides: GlobalThemeOverrides = {
  Button: {
    // base
    colorPrimary: colors.purple[800],
    borderPrimary: colors.purple[800],
    textColorPrimary: colors.white,
    // hover
    colorHoverPrimary: colors.purple[700],
    borderHoverPrimary: colors.purple[700],
    textColorHoverPrimary: colors.white,
    //pressed
    colorPressedPrimary: colors.purple[500],
    borderPressedPrimary: colors.purple[500],
    textColorPressedPrimary: colors.white,
    // focus
    colorFocusPrimary: colors.purple[700],
    borderFocusPrimary: colors.purple[700],
    textColorFocusPrimary: colors.white,
    // text
    textColorTextPrimary: colors.purple[800],
    textColorTextHoverPrimary: colors.purple[700],
    // ghost
    textColorGhostPrimary: colors.purple[800],
    textColorGhostHoverPrimary: colors.purple[700],
  },
}
</script>
