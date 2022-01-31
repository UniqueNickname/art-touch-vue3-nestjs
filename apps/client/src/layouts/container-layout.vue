<template>
  <default-layout :role="role">
    <div
      class="w-full max-w-5xl px-10 pt-4 pb-8 mx-auto my-6 bg-white rounded-xl"
    >
      <h1 class="mb-4 text-2xl font-bold text-center">
        {{ title }}
      </h1>
      <slot />
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from 'src/layouts/default-layout.vue'
import { Role } from 'src/types'

interface Props {
  title: string
  role?: Role
}

withDefaults(defineProps<Props>(), {
  role: 'all',
})
</script>
