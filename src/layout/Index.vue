<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2021-11-27 20:54:07
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-15 11:15:08
-->
<template>
  <div class="about">
    <Header />
    <!-- <v-sidebar /> -->
    <div class="content-box">
      <v-tags v-if="showTags"></v-tags>
      <div class="content_custom" :style="getContentStyle">
        <router-view v-slot="{ Component, route }">
          <Transition name="fade" mode="out-in" appear>
            <!-- 缓存 -->
            <!-- <keep-alive :include="tagsList"> -->
            <keep-alive :include="tagsList">
              <component :is="Component" :key="route.name" />
            </keep-alive>
          </Transition>
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useTagsStore } from '@/store/tags'
import vHeader from './components/Header.vue'
import vSidebar from './components/Sidebar.vue'
import vTags from './components/Tags.vue'
import Header from './components/Header.vue'

import setting from '@/setting'

const store = useTagsStore()
const tagsList = computed(() =>
  store.list.filter((item) => item.meta.keepAlive).map((item) => item.name)
)
watch(tagsList, (nv) => {
  // console.log('tagsList',nv)
})
const collapse = store.collapse
const showTags = ref(setting.showTags)
const getContentStyle = computed(() => {
  if (showTags.value) {
    return {
      height: 'calc(100% - 37px)',
    }
  } else {
    return {
      height: '100%',
    }
  }
})
</script>

<style scoped>
.content {
  background-color: white;
}
</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
