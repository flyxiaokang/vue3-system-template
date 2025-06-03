<!--
 * @Description: ol-map
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-12 19:55:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-03-25 10:34:19
-->
<template>
  <div class="vmap-container">
    <!-- map -->
    <div :id="target" class="vmap-view" />
    <slot name="popup"></slot>
    <slot v-if="mapReady"></slot>
    <!-- 地图状态条 -->
    <MapStatus
      v-if="showStatusbar"
      :theme="theme"
      :position="curPosition"
      :zoom="curZoom"
    />
    <!-- identify -->
    <OlIdentify
      v-if="useElementPlus"
      :title="identifyConfig.title || '属性'"
      :theme="theme"
      :position="identifyPosition"
      :features="identifyList"
      :identify-config="identifyConfig"
    >
    </OlIdentify>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch, reactive, provide } from 'vue'
import { getOlHandler } from '@/VMap/ol/init'
import { setConfig, getConfig } from '@/VMap/ol/config'
import VUtils from '@/VMap/public/utils/base/index'
import { V_MOUSE_STATUS, V_THEME } from '@/VMap/global'
import { useEmits } from '@/VMap/public/use/useEvent'

import OlIdentify from '@/VMap/ol/v3/components/layer/popup/identify/index.vue'
import MapStatus from '@/VMap/components/Map/MapStatus.vue'

const olInstance = getOlHandler()
const curMapCenter = ref([])

provide('olHandler', olInstance)
provide('mapCenter', curMapCenter)

const props = defineProps({
  mapConfig: {
    type: Object,
    default() {
      return getConfig()
    },
  },
  theme: {
    type: String,
    default: V_THEME.light,
  },
  identify: {
    type: Boolean,
    default: false,
  },
  identifyConfig: {
    type: Object,
    default() {
      return {
        title: '属性',
        height: 220,
        header: [
          {
            label: '属性',
            value: 'label',
          },
          {
            label: '值',
            value: 'value',
          },
        ],
        showHeader: false,
        theme: 'light',
      }
    },
  },
  showStatusbar: {
    type: Boolean,
    default: true,
  },
  showBasemap: {
    type: Boolean,
    default: true,
  },
  dragPan: {
    type: Boolean,
    default: true,
  },
  controls: {
    type: Object,
    default() {
      return {
        scaleLine: true,
      }
    },
  },
  useElementPlus: {
    type: Boolean,
    default: false,
  },
})

const { mapConfig, controls, showBasemap, identify, dragPan, useElementPlus } =
  toRefs(props)

const emits = defineEmits(useEmits)

provide('mapConfig', mapConfig.value)

const target = ref(`${VUtils.uuidOnlyStr()}-vmap-id`)
let mapReady = ref(false)
// 实时坐标
const curPosition = ref([0, 0])
const curZoom = ref(0)
onMounted(() => {
  olInstance.target = target.value
  olInstance
    .initMap(mapConfig.value, {
      controls: controls.value,
      showBasemap: showBasemap.value,
      dragPan: dragPan.value,
    })
    .then(({ map }) => {
      mapReady.value = true
      map.set('mouseStatus', V_MOUSE_STATUS.none)
      emits('ready', olInstance)
      curZoom.value = map.getView().getZoom() - 1
      bindEvent()
    })
})

// 事件
const bindEvent = () => {
  olInstance.registerMouseMove((e) => {
    curPosition.value = [e.coordinate[0].toFixed(4), e.coordinate[1].toFixed(4)]
    emits('mouse-move', e)
  })

  olInstance.registerMouseClick((e) => {
    // console.log('click===', e, e.map.get('mouseStatus'))
    const mouseStatus = e.map.get('mouseStatus')
    if (mouseStatus === V_MOUSE_STATUS.draw) return
    if (mouseStatus === V_MOUSE_STATUS.mesure) return
    if (e.map.get('mouseStatus') === 'none' && identify.value) {
      handleIdentify(e)
    }
    emits('mouse-click', e)
  })

  olInstance.registerMouseDbClick((e) => {
    emits('mouse-dbclick', e)
  })

  olInstance.registerMouseMoveEnd((e) => {
    emits('mouse-moveend', e)
    curZoom.value = olInstance.map.getView().getZoom()
    curMapCenter.value = olInstance.map.getView().getCenter()
  })
}

// identify 弹窗
let showIdentify = ref(false)
let activeIdentify = ref('')
let identifyList = ref([])
// identify 位置
const identifyPosition = ref([])
// identify 查询
const handleIdentify = (e) => {
  let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
  const coordinate = e.coordinate
  // console.log('fs...', features)
  if (features.length === 0) {
    return
  }
  // openIdentifyPopup(coordinate)
  identifyPosition.value = coordinate
  identifyList.value = []
  features.forEach((feature, index) => {
    activeIdentify.value = '要素_' + 1
    identifyList.value.push({
      name: '要素_' + (index + 1),
      location: coordinate,
      attributes: VUtils.object2Array(feature.getProperties()),
    })
  })
}

// 打开identify弹窗
let overlay = null
const popupId = 'ol-custom-popup-id'
const openIdentifyPopup = (location) => {
  overlay = olInstance.createOverlay({
    popupId: popupId + '_identify_',
    center: location,
    offset: [0, 0],
    collection: false,
  })
  showIdentify.value = true
}

const object2Array = (properties) => {
  const attributes = []
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key]
      // console.log('key...', key, element)
      if (typeof element !== 'object') {
        attributes.push({
          label: key,
          value: element,
        })
      }
    }
  }
  return attributes
}
</script>

<script>
export default {
  name: 'OlMap',
}
</script>

<style lang="scss" scoped>
.vmap-container {
  width: 100%;
  // height: 100%;
  position: relative;
}
.custom-icon-container {
  position: absolute;
  top: 100px;
  left: 50px;
  z-index: 3999;
}
.vmap-view {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
}

.map-status {
  position: absolute;
  bottom: 0px;
  right: 20px;
}

.ol-map-layer-manager {
  position: absolute;
  top: 20px;
  right: 50px;
}

.ol-popup {
  background-color: rgba(0, 0, 0, 0) !important;
}

.popup-content {
  background-color: white;
  padding: 5px 5px;
  border-radius: 5px;
  font-family: serif;
  font-size: 12px;
  color: black;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  user-select: none;
}

.triangle {
  display: inline-block;
  width: 0;
  height: 0;
  line-height: 0;
  border: 10px solid transparent;
  border-top-color: #46a6ff;
  border-bottom-width: 0;
}

.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 80px;
}

.vmap-overlay-top {
  z-index: 9999;
}

:deep(.ol-tooltip) {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}

:deep(.ol-tooltip-measure) {
  opacity: 1;
  font-weight: bold;
}

:deep(.ol-tooltip-static) {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

:deep(.ol-tooltip-measure:before),
:deep(.ol-tooltip-static:before) {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

:deep(.ol-tooltip-static:before) {
  border-top-color: #ffcc33;
}

:deep(.ol-dragzoom) {
  border: 2px dashed red;
}

:deep(.ol-scale-line) {
  border-radius: 2px;
}

:deep(.ol-scale-line.ol-unselectable) {
  // left: calc(100% - 120px);
  left: 10px;
  padding: 1px 3px;
  bottom: 0px;
  background-color: rgb(255 255 255 / 61%);
  // width: 100px;
}

:deep(.ol-scale-line-inner) {
  font-weight: bold;
  font-size: 12px;
}

:deep(.vmap-ol-popup.dark .el-tabs__item.is-active) {
  color: #dddddd;
}
</style>

<style>
@import url(../../../public/static/css/theme.css);
</style>
