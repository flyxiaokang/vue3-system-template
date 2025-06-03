<!--
 * @Description: Cesium map
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-06-22 17:56:14
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-23 17:54:36
-->
<template>
  <div
    class="vmap-container cesium-map-div"
    style="width: 100%; height: 100%; position: relative"
    element-loading-text="加载中，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <VueCesium v-if="usePlugin" @ready="handleViewReady">
      <slot name="vue-cesium"></slot>
    </VueCesium>
    <VCesium v-else @ready="handleViewReady">
      <MapStatus :theme="theme" :position="curPosition" :zoom="curZoom" />
    </VCesium>
    <slot></slot>
  </div>
</template>
<script setup>
import { reactive, ref, provide, toRefs, onBeforeMount } from 'vue'
import { getConfig, setConfig } from '@/VMap/cesium/config'
import { V_THEME } from '@/VMap/global'
import { getCesiumInstance } from '@/VMap/cesium/init'
import { useEmits } from '@/VMap/public/use/useEvent'
import VueCesium from './components/map/VueCesium.vue'
import VCesium from './components/map/VCesium.vue'
import MapStatus from '@/VMap/components/Map/MapStatus.vue'

let cesiumInstance = getCesiumInstance()
provide('mapDimension', 2)
provide('cesiumHandler', cesiumInstance)

const emits = defineEmits(useEmits)
const props = defineProps({
  usePlugin: {
    type: Boolean,
    default: true,
  },
  mapConfig: {
    type: Object,
    default() {
      return getConfig()
    },
  },
  theme: {
    type: String,
    default: V_THEME.dark,
  },
})
setConfig(props.mapConfig)
const { usePlugin, mapConfig } = toRefs(props)

const handleViewReady = ({ Cesium, viewer }) => {
  cesiumInstance.viewer = viewer
  cesiumInstance.removeAllLayers()
  const baseLayer = mapConfig.value.baseLayers.filter(
    (e) => e.id === mapConfig.value.defaultBaseLayerId
  )
  if (baseLayer.length > 0) {
    cesiumInstance.loadBaseLayer(baseLayer[0].children)
  } else {
    console.warn('没有设置底图')
  }
  bindEvent()
  emits('ready', cesiumInstance)
  console.info('欢迎使用v-cesiumjs.<1092014304@qq.com>')
}

// 实时坐标
const curPosition = ref([0, 0])
const curZoom = ref(0)

const bindEvent = () => {
  cesiumInstance.registerMouseClick((e) => {
    const p = cesiumInstance.getLonLatByPosition(e.position)
    console.log(e, p)
    emits('mouse-click', e, p)
  })
  cesiumInstance.registerMouseMove((e) => {
    if (e.endPosition) {
      // console.log('e...', e)
      const p = cesiumInstance.getLonLatByPosition(e.endPosition)
      // cesiumInstance.getCamera(e.endPosition)
      curPosition.value = [p.lon, p.lat]
    }
    let extent = cesiumInstance.getExtent()
    if (extent.xmin) {
    }
    emits('mouse-move', extent)
  })
}

// 鹰眼
const handleEagleEyeReady = (map, view, eagleEyeId, eyeId) => {
  view.on('drag', function (event) {
    event.stopPropagation()
  })
  view.on('mouse-wheel', function (event) {
    event.stopPropagation()
  })
  view.on('double-click', function (event) {
    event.stopPropagation()
  })

  var eye_id = document.getElementById(eyeId)
  var extentDiv = document.getElementById(eyeId)

  // 3d
  setTimeout(() => {
    let p = cesiumInstance.getCenterPosition()
    updateOverview3d([p.lon, p.lat])
    updateExtentDiv3d(p.height)
  }, 200)

  cesiumInstance.viewer.camera.moveEnd.addEventListener(function () {
    let position = cesiumInstance.getCenterPosition()
    console.log('???', position)
    let center = [position.lon, position.lat]
    updateOverview3d(center)
    updateExtentDiv3d(position.height)
  })

  function updateOverview3d(center) {
    view.goTo({
      center: center,
    })
  }

  function updateExtentDiv3d(height) {
    if (height > 500000) {
      view.zoom = 1
    } else if (height > 400000) {
      view.zoom = 2
    } else if (height > 300000) {
      view.zoom = 3
    } else if (height > 200000) {
      view.zoom = 4
    } else if (height > 100000) {
      view.zoom = 5
    } else if (height > 10000) {
      view.zoom = 6
    } else if (height > 5000) {
      view.zoom = 7
    } else {
      view.zoom = 8
    }
    let divWidth = 70
    let divHeight = 40
    let top = ($('#' + eagleEyeId).height() - divHeight) / 2
    let left = ($('#' + eagleEyeId).width() - divWidth) / 2
    eye_id.style.top = top + 'px'
    eye_id.style.left = left + 'px'
    eye_id.style.height = divHeight + 'px'
    eye_id.style.width = divWidth + 'px'
  }
}

const handleEagleEyeChange = (point) => {
  const { longitude, latitude } = point
  const curView = {
    lon: longitude,
    lat: latitude,
    height: 100000,
    heading: 0,
    pitch: -89.74026687972041,
    roll: 0,
  }
  cesiumInstance.flyToView(curView)
}
</script>

<script>
export default {
  name: 'CesiumMap',
}
</script>

<style>
@import url('./assets/css/cesium.css');
</style>

<style scoped>
.cesium-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map_toolbar_cesium {
  position: absolute;
  top: 15px;
  right: 15px;
}

.vc-measures-custom-class {
  top: 50px !important;
}

.cesium-basemap-container {
  position: absolute;
  right: 10px;
  bottom: 20px;
}

:deep(.cesium-viewer) {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  border-radius: 5px;
}

:deep(.draggableTitleClass) {
  background-color: #414853 !important;
  color: white !important;
}

:deep(.draggableClose) {
  color: white !important;
}

:deep(.map_toolbar_cesium .el-radio-button .el-radio-button__inner) {
  padding: 5px 11px;
  font-size: 12px;
  border-radius: 5;
  background-color: #414853 !important;
  color: white !important;
  border: 0px solid #dddddd;
}

:deep(
    .map_toolbar_cesium
      .el-radio-button__original-radio:checked
      + .el-radio-button__inner
  ) {
  box-shadow: 0px 0 0 0 !important;
  /* color: black !important; */
}
</style>
