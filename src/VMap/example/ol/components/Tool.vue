<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-03-31 09:21:19
-->
<template>
  <div style="width: 100%; height: 100%">
    <div style="height: 100px; display: flex; flex-direction: column">
      <div>
        <el-checkbox v-model="visibleValue">点线面</el-checkbox>
      </div>
      <div style="display: flex; height: 200px">
        <el-button @click="handleDraw('Point')">绘制点</el-button>
        <el-button @click="handleDraw('LineString')">绘制线</el-button>
        <el-button @click="handleDraw('Polygon')">绘制面</el-button>
        <el-button @click="handleDraw('Circle')">绘制圆</el-button>
        <el-button @click="handleDraw('Ring')">绘制环</el-button>
        <el-button @click="handleDrawEnd">结束绘制</el-button>

        <VueUpload :onSuccess="handleSuccess"></VueUpload>
      </div>
    </div>
    <OlMap
      style="height: calc(100% - 100px)"
      theme="light"
      use-element-plus
      :map-config="mapConfig"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
    >
      <OlToolbar></OlToolbar>
      <OlBasemap></OlBasemap>
    </OlMap>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'

// com
import { OlMap, OlBasemap, OlToolbar } from '@/VMap/ol/v3/components/index'

// tool
import VUtils from '@/VMap/public/utils/base/index'
import { OlHandler } from '@/VMap/ol/init'
import mapConfig from '../config/mapConfig-4326'

const opacity = ref(1)
let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
  drawHandler = olHandler.newDrawHandler()
}
const handleMouseMove = (e) => {}

const handleMouseClick = (e) => {}

const handleDrawPoint = () => {
  olHandler.getDrawHandler().drawPoint()
}

let drawHandler = null
const handleDraw = (type) => {
  const p = { type, onceOnly: true ,clear:true}
  if (type === 'Ring') {
    p['style'] = {
      innerR: 10,
      outerR: 20,
    }
  }
  drawHandler.drawByType(p)
}

const handleDrawEnd = () => {
  drawHandler.endDraw()
}

const handleSuccess = (e) => {
  console.log('succuss===', e)
}
</script>

<style scoped>
.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 70px;
}

.vmap-eagle {
  /* position: absolute;
  bottom: 60px;
  right: 70px;
  width: 230px;
  height: 230px;
  z-index: 1999; */
}
</style>
