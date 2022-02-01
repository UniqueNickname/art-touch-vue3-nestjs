<template>
  <n-collapse>
    <n-collapse-item :title="t('admin.tabs.universities.add')" name="cities">
      <add-university />
    </n-collapse-item>
    <n-collapse-item
      :title="t('admin.tabs.cities.add-altname')"
      name="cities-altnames"
    >
      <add-university-altname />
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import AddUniversity from 'src/components/admin/add-university.vue'
import AddUniversityAltname from 'src/components/admin/add-university-altname.vue'

const { t } = useI18n()
</script>
