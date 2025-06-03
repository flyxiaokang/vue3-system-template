<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-01-30 17:12:21
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-01 11:44:14
-->
<template>
  <div :id="targetId" style="position: relative; width: 100%; height: 100%">
    <slot></slot>
    <!-- 地图状态条 -->
   
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { getConfig, setConfig } from '@/VMap/cesium/config'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

const props = defineProps({

})

const cesiumHandler = inject('cesiumHandler')
const emits = defineEmits(['ready'])
const targetId = ref('vcesium-' + uuidOnlyStr())



onMounted(() => {
  cesiumHandler.setViewExtent(getConfig().defaultView.camera)
  cesiumHandler.initMap(targetId.value).then((e) => {
    // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: 'http://localhost/terrian/bj', // 地址记得换成自己的地形数据地址
    //   requestWaterMask: true, // 开启法向量
    //   requestVertexNormals: false, // 开启水面特效
    // })
    emits('ready', cesiumHandler)
  })
})
</script>
<style lang="scss" scoped></style>
