<template>
  <n-collapse>
    <n-collapse-item :title="t('admin.tabs.teachers.add')" name="cities">
      <add-teacher />
    </n-collapse-item>
    <n-collapse-item
      :title="t('admin.tabs.teachers.add-altname')"
      name="cities-altnames"
    >
      <add-teacher-altname />
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import AddTeacher from 'src/components/admin/add-teacher.vue'
import AddTeacherAltname from 'src/components/admin/add-teacher-altname.vue'

const { t } = useI18n()
</script>
