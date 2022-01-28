<template>
  <default-layout>
    <div
      class="mx-auto max-w-5xl w-full bg-white my-6 pt-4 pb-8 px-10 rounded-xl"
    >
      <h1 class="text-center font-bold text-2xl mb-4">
        {{ title }}
      </h1>
      <slot />
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from 'src/layouts/default-layout.vue'

interface Props {
  title: string
}

defineProps<Props>()
</script>
