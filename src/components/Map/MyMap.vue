<!--
 * @Description: map
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-02-21 11:09:04
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-02-21 11:09:06
-->

<template>
  <OlMap
    :map-config="mapConfig"
    :controls="myControls"
    @ready="handleMapReady"
    @mouse-move="handleMouseMove"
    @mouse-click="handleMouseClick"
  >
  </OlMap>
</template>

<script setup>
import { OlHandler } from 'v-openlayers';

const mapConfig = MAP_CONFIG
const myControls = ref({
  scaleLine: true,
})

let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
}
</script>

<style scoped></style>
