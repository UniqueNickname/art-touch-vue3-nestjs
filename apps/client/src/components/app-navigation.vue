<template>
  <div class="bg-white">
    <div
      class="items-center justify-center max-w-5xl mx-auto xl:justify-between xl:flex"
    >
      <div class="flex items-center justify-center space-x-4">
        <app-logo
          class="py-1 text-xl px-7 text-purple-800 focus:outline-none"
        />
        <app-sidebar :links="[...links, extraLink]" class="xl:hidden" />
        <div class="xl:hidden">
          <language-selector />
        </div>
      </div>
      <ul class="items-center justify-center hidden w-full space-x-10 xl:flex">
        <li v-for="link of links" :key="link.to">
          <n-button
            text
            strong
            tag="a"
            type="primary"
            :href="link.to"
            @click.prevent="redirect(link.to)"
          >
            {{ t(link.label) }}
          </n-button>
        </li>
      </ul>
      <div class="items-center hidden xl:flex space-x-4">
        <n-button
          v-if="extraLink"
          type="primary"
          strong
          tag="a"
          class="bg-purple-800"
          :href="extraLink.to"
          @click.prevent="redirect(extraLink.to)"
        >
          {{ t(extraLink.label) }}
        </n-button>
        <n-button
          v-if="currentUser"
          type="primary"
          strong
          circle
          class="bg-purple-800"
          :href="extraLink.to"
          @click.prevent="logoutUser"
        >
          <template #icon>
            <exit-outline />
          </template>
        </n-button>
        <language-selector />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppLogo from 'src/components/app-logo.vue'
import { NButton } from 'naive-ui/lib'
import { computed } from 'vue'
import LanguageSelector from 'src/components/language-selector.vue'
import AppSidebar from 'src/components/app-sidebar.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUsersStore } from 'src/composables/useUsersStore'
import { ExitOutline } from '@vicons/ionicons5'

const { currentUser, logout } = useUsersStore()

const { t } = useI18n()
const router = useRouter()

interface Link {
  label: string
  to: string
}

const logoutUser = () => {
  logout()
  router.push('/')
}

const links = computed<Link[]>(() => {
  const defaultLinks = [
    { label: 'navigation.jury', to: '/jury' },
    { label: 'navigation.first', to: '/first' },
    { label: 'navigation.winners', to: '/winners' },
    { label: 'navigation.participants', to: '/participants' },
  ]

  return defaultLinks
})

const extraLink = computed<Link>(() => {
  const defaultLink = {
    label: 'auth.sign-up',
    to: '/auth/registration',
  }

  if (!currentUser.value) {
    return defaultLink
  }

  if (currentUser.value.role === 'admin') {
    return {
      label: 'admin.title',
      to: '/admin',
    }
  }

  return defaultLink
})

const redirect = (path: string) => {
  router.push(path)
}
</script>
