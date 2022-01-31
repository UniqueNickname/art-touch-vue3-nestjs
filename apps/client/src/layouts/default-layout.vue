<template>
  <div
    class="min-h-screen sm:bg-gradient-to-t from-red-300 to-violet-500 bg-none"
  >
    <app-navigation />
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppNavigation from 'src/components/app-navigation.vue'
import { useUser } from 'src/composables/useUser'
import { Role } from 'src/types'

interface Props {
  role?: Role
}

const props = withDefaults(defineProps<Props>(), {
  role: 'all',
})

useUser().checkAccess(props.role)
</script>
