<template>
  <div
    class="box-border w-full max-w-2xl px-6 mx-auto text-center bg-white sm:px-14 sm:py-6 sm:shadow-md rounded-xl"
  >
    <h1 class="mt-1 text-xl font-bold sm:text-2xl sm:mt-0">{{ title }}</h1>
    <small class="block mt-1 sm:text-xl sm:mt-3">{{ subtitle }}</small>
    <form class="mt-4 space-y-6">
      <slot />
    </form>
    <div
      v-if="$slots.left || $slots.right"
      class="mt-3 text-sm xs:flex xs:items-center xs:justify-between"
    >
      <div class="flex items-center justify-center xs:justify-between">
        <slot name="left" />
      </div>
      <div class="flex items-center justify-center xs:justify-between">
        <slot name="right" />
      </div>
    </div>
    <n-button
      class="mx-auto mt-6 bg-purple-900"
      size="large"
      type="primary"
      @click="emit('click:submit')"
    >
      {{ nextLabel }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui/lib'

interface Props {
  title: string
  subtitle: string
  nextLabel: string
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'click:submit'): void
}>()
</script>
