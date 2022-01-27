<template>
  <div>
    <n-button
      circle
      type="primary"
      class="text-purple-800 xl:hidden p-1 text-2xl"
      @click="openSidebar"
    >
      <template #icon>
        <menu-outline />
      </template>
    </n-button>
    <div
      :class="{
        'pointer-events-none': !sidebarIsOpen,
      }"
      class="absolute top-0 bottom-0 left-0 right-0 z-40"
    >
      <div
        v-if="sidebarIsOpen"
        :class="{
          'pointer-events-none': !sidebarIsOpen,
        }"
        class="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-30"
        @click="closeSidebar"
      />
      <div
        :class="{
          '-translate-x-full': !sidebarIsOpen,
          'translate-x-0': sidebarIsOpen,
        }"
        class="absolute top-0 bottom-0 left-0 w-full transform duration-200 ease-in-out transition-transform overflow-hidden bg-gradient-to-t from-red-300 to-violet-500 xs:w-64 xs:rounded-r-md"
      >
        <div class="px-6 pt-8">
          <div class="flex items-center justify-between">
            <app-logo class="text-white" @click="closeSidebar" />
            <n-button
              circle
              type="primary"
              class="text-purple-800 xl:hidden p-1 text-2xl text-white"
              @click="closeSidebar"
            >
              <template #icon>
                <arrow-back-outline />
              </template>
            </n-button>
          </div>
        </div>
        <ul class="mx-2 mt-6 space-y-6">
          <li
            v-for="link of links"
            :key="link.label"
            class="flex items-center justify-center"
          >
            <n-button
              strong
              ghost
              tag="a"
              size="large"
              class="text-white"
              type="primary"
              :href="link.to"
              @click.prevent="redirect(link.to)"
            >
              {{ t(link.label) }}
            </n-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuOutline, ArrowBackOutline } from '@vicons/ionicons5'
import AppLogo from 'src/components/app-logo.vue'
import { NButton } from 'naive-ui/lib'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  links: {
    label: string
    to: string
  }[]
}

defineProps<Props>()

const { t } = useI18n()
const router = useRouter()

const sidebarIsOpen = ref(false)

const closeSidebar = () => {
  sidebarIsOpen.value = false
}

const openSidebar = () => {
  sidebarIsOpen.value = true
}

const redirect = (path: string) => {
  router.push(path)
}
</script>
