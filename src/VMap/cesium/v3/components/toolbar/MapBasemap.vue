<!--
 * @Description: 底图切换
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-05-11 18:07:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-01 15:15:02
-->

<template>
  <div class="vmap-basemap-toggle">
    <div v-if="!isOpen" class="layers-btn" @click="handleToggle(true)">
      <el-icon class="layer">
        <CopyDocument />
      </el-icon>
    </div>
    <div v-if="isOpen" class="map-type">
      <el-icon class="arrow-right" @click="handleToggle(false)">
        <ArrowRight />
      </el-icon>
      <div
        v-for="(item, index) in layers"
        :key="index"
        :class="['map-card', { active: curIndex === index }]"
        @click="handleTonggle(item, index)"
      >
        <img
          :src="item.children[0].image"
          style="width: 100%; height: 100%"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getConfig, setConfig } from '@/VMap/cesium/config'
import { ref, onMounted, inject } from 'vue'
import {
  useProps,
} from '@/VMap/public/use/usePosition'

const props = defineProps({
  ...useProps,
})

const cesiumHandler = inject('cesiumHandler')
const emits = defineEmits(['toggle'])

const isOpen = ref(true)
const curIndex = ref(0)
const layers = ref([])

onMounted(() => {
  layers.value = getConfig().baseLayers
  for (let index = 0; index < layers.value.length; index++) {
    const element = layers.value[index]
    if (element.id === getConfig().defaultBaseLayerId) {
      curIndex.value = index
      break
    }
  }
})

const handleTonggle = (item, index) => {
  curIndex.value = index
  cesiumHandler.loadBaseLayer(layers.value[index].children)
}

const handleToggle = (flag) => {
  isOpen.value = flag
}
</script>

<script>
export default {
  name: 'CesiumBasemap',
}
</script>

<style scoped>
.vmap-basemap-toggle {
  position: absolute;
  bottom: 10px;
  right: 10px;
  margin-bottom: 10px;
  transform: scale(0.8);
  border-radius: 8px;
}

.layers-btn {
  width: 36px;
  height: 36px;
  background-color: #60606081;
  border-radius: 5px;
  color: #004dc1;
  line-height: 15px;
  text-align: center;
  border: 1.5px solid #dddddd;
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 52%);
  padding: 4px;
  cursor: pointer;
}

.layers-btn .layer {
  font-size: 26px;
  font-weight: bold;
  color: white;
}

.layers-btn .layer:hover {
  color: #4faaea;
}

.vmap-basemap-toggle .map-type {
  width: 100%;
  background-color: #fff;
  background-color: rgba(255, 255, 255, 0.8);
  background-color: #41485378;
  line-height: 85px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid #dddddd;
}

.arrow-right {
  color: white;
  margin-right: 5px;
}

.vmap-basemap-toggle .map-type .map-card.active {
  border: 1px solid #54b6f8;
}

.vmap-basemap-toggle .map-type .normal {
  right: 119px;
}

.vmap-basemap-toggle .map-type .map-card {
  border: 1px solid rgba(255, 255, 255, 0);
  padding: 3px !important;
  border-radius: 6px;
  /* background-image: url('../assets/images/basemap/maptype_1.png'); */
}

.vmap-basemap-toggle .map-type .satellite,
.vmap-basemap-toggle .map-type .earth {
  right: 16px;
}

.map-type {
  height: 80px;
  cursor: pointer;
  -webkit-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  width: 110px;
  /* background-color: rgba(255, 255, 255, 0); */
  background-color: #414853;
}

.map-type .map-card {
  height: 60px;
  width: 86px;
  border-radius: 2px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border: 1px solid rgba(153, 153, 153, 0.42);
  background-size: 86px 240px;
  -webkit-transition-property: right, background-image;
  transition-property: right, background-image;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.active {
  background-color: #4faaea;
  border: 1px solid #4faaea !important;
}
</style>
