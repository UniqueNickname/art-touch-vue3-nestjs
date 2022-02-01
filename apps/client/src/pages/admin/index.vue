<template>
  <container-layout role="admin" :title="t('admin.title')">
    <n-tabs v-model:value="tab" :type="tabsType" size="small">
      <n-tab-pane
        name="cities"
        display-directive="show:lazy"
        :tab="t('admin.tabs.cities.title')"
      >
        <cities-admin-panel class="mt-4" />
      </n-tab-pane>
      <n-tab-pane
        name="universities"
        display-directive="show:lazy"
        :tab="t('admin.tabs.universities.title')"
      >
        <universities-admin-panel class="mt-4" />
      </n-tab-pane>
      <n-tab-pane
        name="teachers"
        display-directive="show:lazy"
        :tab="t('admin.tabs.teachers.title')"
      >
        <teachers-admin-panel class="mt-4" />
      </n-tab-pane>
    </n-tabs>
  </container-layout>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import ContainerLayout from 'src/layouts/container-layout.vue'
import { useI18n } from 'vue-i18n'
import CitiesAdminPanel from 'src/components/admin/cities-admin-panel.vue'
import UniversitiesAdminPanel from 'src/components/admin/universities-admin-panel.vue'
import TeachersAdminPanel from 'src/components/admin/teachers-admin-panel.vue'
import { isSSR } from 'src/utils/isSSR'
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScreenSize } from 'src/composables/useScreenSize'

const tab = ref('cities')

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { screenWidth } = useScreenSize()

const tabsType = computed(() => {
  if (isSSR()) {
    return 'segment'
  }

  return screenWidth.value > 640 ? 'segment' : 'line'
})

const availableTabs = ['cities', 'universities', 'teachers']

if (route.hash) {
  const hash = route.hash.slice(1)
  if (availableTabs.includes(hash)) {
    tab.value = hash
  }
}

watch(
  () => tab.value,
  currentTab => {
    router.replace({
      hash: `#${currentTab}`,
    })
  },
)
</script>
