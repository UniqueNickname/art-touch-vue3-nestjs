<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'
import colors from 'tailwindcss/colors'

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
