<template>
  <default-layout :role="role">
    <div class="pt-4 pb-4 sm:pt-24 sm:pb-6">
      <slot />
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import type { AccessType } from 'src/types'
import DefaultLayout from 'src/layouts/default-layout.vue'

interface Props {
  role?: AccessType
}
withDefaults(defineProps<Props>(), {
  role: 'all',
})
</script>
