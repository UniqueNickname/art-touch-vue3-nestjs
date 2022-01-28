<template>
  <n-collapse>
    <n-collapse-item :title="t('admin.tabs.cities.add')" name="cities">
      <add-city />
    </n-collapse-item>
    <n-collapse-item
      :title="t('admin.tabs.cities.add-altname')"
      name="cities-altnames"
    >
      <add-city-altname />
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import AddCity from 'src/components/add-city.vue'
import AddCityAltname from 'src/components/add-city-altname.vue'

const { t } = useI18n()
</script>
