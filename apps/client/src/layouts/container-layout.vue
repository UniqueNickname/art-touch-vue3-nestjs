<template>
  <default-layout :role="role">
    <div class="w-full max-w-5xl mx-auto sm:px-10">
      <div
        class="w-full max-w-5xl px-10 pt-4 pb-8 mx-auto my-6 bg-white rounded-xl"
      >
        <h1 class="mb-4 text-2xl font-bold text-center">
          {{ title }}
        </h1>
        <slot />
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import type { AccessType } from 'src/types'
import DefaultLayout from 'src/layouts/default-layout.vue'

interface Props {
  title: string
  role?: AccessType
}

withDefaults(defineProps<Props>(), {
  role: 'all',
})
</script>
