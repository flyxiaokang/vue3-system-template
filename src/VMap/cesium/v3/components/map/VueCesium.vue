<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-01-30 16:51:29
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-30 16:59:07
-->
<template>
  <vc-config-provider
    :cesium-path="vcConfig.cesiumPath"
    :access-token="vcConfig.accessToken"
  >
    <vc-viewer
      sceneModePicker
      scene3DOnly
      :removeCesiumScript="false"
      @ready="handleReady"
    >
      <!-- 导航部件 -->
      <vc-navigation
        ref="navigation"
        position="top-right"
        :offset="[0, 105]"
        :outerOptions="outerOptions"
      >
      </vc-navigation>
      <!-- <vc-navigation-sm
          position="right"
          :compass-opts="{ autoHidden: false }"
          :zoom-opts="{ autoHidden: false }"
        ></vc-navigation-sm> -->

      <!-- 量算 -->
      <vc-measurements
        v-if="curToolName === '量测'"
        ref="measurementsRef"
        position="top-right"
        :offset="[50, 50]"
        :main-fab-opts="measurementFabOptions"
        :editable="true"
        :measurements="measurements"
        active-color="yellow"
      >
      </vc-measurements>
      <!-- 底图 -->
      <!-- <vc-layer-imagery
          v-for="(item, index) in baseMaps"
          :sort-order="item.order"
          :key="index"
        >
          <vc-imagery-provider-tianditu
            :map-style="item.id"
            :token="vcConfig.tdtToken"
          ></vc-imagery-provider-tianditu>
        </vc-layer-imagery> -->
      <slot></slot>
    </vc-viewer>
  </vc-config-provider>
</template>
<script setup>
import { reactive } from 'vue'
import { VcConfigProvider, VcViewer } from 'vue-cesium'
import { getConfig, setConfig } from '@/VMap/cesium/config'

const emits = defineEmits(['ready'])
const { cesiumPath, accessToken, tdtToken } = getConfig().vcConfig
const vcConfig = reactive({
  cesiumPath,
  accessToken,
  tdtToken,
})

const handleReady = (e) => {
  emits('ready', e)
  // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  //   url: 'http://localhost/terrian/bj', // 地址记得换成自己的地形数据地址
  //   requestWaterMask: true, // 开启法向量
  //   requestVertexNormals: false, // 开启水面特效
  // })
}

// 测量部件
const measurementFabOptions = {
  direction: 'left',
  color: 'accent',
}
const measurements = [
  'component-distance',
  'polyline',
  'vertical',
  'area',
  'point',
]
</script>
<style lang="scss" scoped></style>
