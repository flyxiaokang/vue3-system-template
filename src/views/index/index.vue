<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-03 21:58:35
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-28 10:21:40
-->
<template>
  <div class="dashboard_contanier" v-loading.body="loading">
    <OlMap
      :map-config="mapConfig"
      :controls="myControls"
      @ready="handleMapReady"
    >
    <OlBasemap></OlBasemap>
    <OlToolbar expand @change="handleChange"></OlToolbar>
    </OlMap>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, reactive } from 'vue'
import { OlHandler, WKT, VMapUtils, VUtils } from 'v-openlayers'

import { MAP_CONFIG } from '@/config/mapConfig'

const loading = ref(false)
const mapConfig = MAP_CONFIG
const myControls = ref({
  scaleLine: true,
})

let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
  const style = olHandler.StyleHandler.getStyle({
    circle: {
      radius: 6,
      color: 'blue',
    },
    fill: {
      color: 'red',
    },
    stroke: {
      color: 'red',
      width: 3,
    },
  })
  olHandler.getDrawHandler().defaultStyle = style
  olHandler.getInteraction()
}

const handleChange = (e) => {
  console.log(e)
}

const myElement = ref(null)
const handleTest = () => {
  alert()
}

// onMounted(() => {
//   myElement.value.addEventListener('mousedown', () => {
//     console.log('mousedown')
//   })

//   myElement.value.addEventListener('mouseover', () => {
//     console.log('mouseover')
//   })
// })
</script>

<script>
export default {
  name: 'dashboard',
}
</script>

<style scoped>
.dashboard_contanier {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
