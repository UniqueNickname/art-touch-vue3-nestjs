<template>
  <div
    class="min-h-screen sm:bg-gradient-to-t from-red-300 to-violet-500 bg-none"
  >
    <app-navigation />
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { AccessType } from 'src/types'
import AppNavigation from 'src/components/app-navigation.vue'
import { useUsersStore } from 'src/composables/useUsersStore'

interface Props {
  role?: AccessType
}

const props = withDefaults(defineProps<Props>(), {
  role: 'all',
})

useUsersStore().checkAccess(props.role)
</script>
