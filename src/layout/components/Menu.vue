<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-03-21 10:34:23
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-09 16:07:51
-->
<template>
  <el-menu
    v-if="showMenus"
    :default-active="activeIndex"
    class="el-menu-demo"
    :router="true"
    mode="horizontal"
    :background-color="theme.background"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <template v-for="(childMenus, index) in sysMenus" >
      <el-sub-menu
        v-if="childMenus.children?.length > 0"
        :index="childMenus.SHOW_PARAM.url || index + '_2'"
        :key="index"
      >
        <template #title>{{ childMenus.MENU_NM }}</template>
        <template
          v-for="(childMenus2, index2) in childMenus.children"
        >
          <el-sub-menu
            v-if="childMenus2.children?.length > 0"
            :index="childMenus2.SHOW_PARAM.url || index2 + '_3'"
            :key="index2 + '__2'"
          >
            <template #title>{{ childMenus2.MENU_NM }}</template>
            <template
              v-for="(childMenus3, index3) in childMenus2.children"
            >
              <el-sub-menu
                v-if="childMenus3.children?.length > 0"
                :index="childMenus3.SHOW_PARAM.url || index3 + '_4'"
                :key="index3 + '__3'"
              >
                <template #title>{{ childMenus3.label }}</template>
                <el-menu-item
                  v-for="(childMenus4, index4) in childMenus3.children"
                  :key="index4 + '__4'"
                  :index="childMenus4.SHOW_PARAM.url || index4 + '_5'"
                  >{{ childMenus4.MENU_NM }}</el-menu-item
                >
              </el-sub-menu>

              <el-menu-item v-else :index="childMenus3.SHOW_PARAM.url" :key="index3 + '__8'">{{
                childMenus3.MENU_NM
              }}</el-menu-item>
            </template>
          </el-sub-menu>

          <el-menu-item v-else :index="childMenus2.SHOW_PARAM.url" :key="index2 + '__12'">{{
            childMenus2.MENU_NM
          }}</el-menu-item>
        </template>
      </el-sub-menu>

      <el-menu-item v-else :index="childMenus.SHOW_PARAM.url" :key="index + '__13'">{{
        childMenus.MENU_NM
      }}</el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import menus from '@/data/json/menu.json'
import setting from '@/setting'

const activeIndex = ref('/dashboard')

const theme = ref(setting.theme)
const showMenus = ref(setting.showMenus)

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

const sysMenus = reactive(menus)

onMounted(() => {
  let router = useRouter()
  // console.log('router', router.currentRoute.value.fullPath)
  activeIndex.value = router.currentRoute.value.fullPath
})

const router = useRouter()
watch(
  () => router.currentRoute.value,
  (nv) => {
    activeIndex.value = nv.fullPath
  },
  { immediate: true }
)
</script>

<style scoped>
.el-menu-demo {
  height: 71px;
  max-width: calc(100% - 300px);
}

:deep(.el-menu-item) {
  font-size: 16px !important;
}

:deep(.el-sub-menu__title){
  font-size: 16px !important;
}

</style>

<style>
.el-menu-item{
  font-size: 16px !important;
}
</style>
