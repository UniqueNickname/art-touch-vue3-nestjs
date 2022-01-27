<template>
  <div
    class="min-h-screen sm:bg-gradient-to-t from-red-300 to-violet-500 bg-none"
  >
    <div class="min-h-screen">
      <app-navigation />
      <div class="sm:pt-24 sm:pb-6 pb-4 pt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from 'src/components/app-navigation.vue'
</script>
