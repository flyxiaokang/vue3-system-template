<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-12-29 15:32:00
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs" style="margin: 0 10px">
        <el-tab-pane label="layer" name="first">
          <el-checkbox v-model="checkStatus">编辑</el-checkbox>
          <el-checkbox v-model="checkVisible">显示</el-checkbox>
          <el-button type="primary" size="small" @click="handleChangePolygon"
            >更新面</el-button
          >
          <el-slider
            style="width: 150px"
            v-model="opacity"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </el-tab-pane>

        <el-tab-pane label="h" name="second">
          <el-input v-model="rowTotal" style="width: 100px"></el-input>
          <el-button @click="handleCalc">计算</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>

    <OlMap
      class="app-content"
      show-basemapbar
      show-toolbar
      :show-feature-popup="false"
      :feature-popup="featurePopup"
      :single-popup-table-height="300"
      :single-popup-table-header="[
        {
          label: '名',
          value: 'label',
          width: 100,
        },
        {
          label: '值',
          value: 'value',
          width: 200,
        },
      ]"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
      @basemap-change="handleBasemapChange"
    >
      <!-- <OlOverlay :title="'test3'" :position="overlayPosition">
        <div
          style="display: flex; flex-direction: row"
          v-for="(value, key) in featureProperties"
        >
          <div style="min-width: 100px; text-align: right">{{ key }}:</div>
          <div style="min-width: 100px; text-align: left; margin-left: 10px">
            {{ value }}
          </div>
        </div>
      </OlOverlay> -->

      <OlToolbar :position="'top-right'" />
      <OlBasemap :position="'top-right'" @change="handleBasemapChange" />

      <OlPopup
        title="1212"
        :position="curPosition"
        :properties="curProperties"
        :table-height="220"
        :table-header="tableHeader"
      ></OlPopup>

      <OlMultiplePopup :popups="popupFeatures" :visible="checkVisible">
        <template #default="{ data }">
          <div class="multi-popup">{{ data.id }}</div>
        </template>
      </OlMultiplePopup>

      <!-- <OlMultiplePopup :popups="popupFeatures2">
        <template #default="{ data }">
          <div class="multi-popup">{{ 'test' }}</div>
        </template>
      </OlMultiplePopup> -->

      <!-- <OlVector
        :features="PointsJson"
        :visible="checkVisible"
        :modifiable="checkStatus"
        :style="pointStyle2"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      /> -->

      <OlVector
        :features="MultLinesJson"
        :modifiable="checkStatus"
        :style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      />

      <!-- <OlVector
        :features="PolygonJson"
        :modifiable="checkStatus"
        :z-index="103"
        :style="polygonStyle"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PointGeojson"
        :modifiable="checkStatus"
        :style="pointStyle"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PolylineGeojson"
        :modifiable="checkStatus"
        :style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PolygonGeojson"
        :modifiable="checkStatus"
        :style="polygonStyle"
        :z-index="103"
        @select-change="handleSelectChange"
      /> -->

      <!-- tdt -->
      <!-- <OlTile
        map-provider="tdt"
        map-style="ter"
        :visible="checkVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

      <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl"
        :visible="checkVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

      <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl2"
        :request-params="requestParams"
        :visible="checkVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

      <!-- <OlTile
        map-provider="arcgistile"
        :url="xyzUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlTile
        map-provider="arcgisimagetile"
        :url="arcgisImageUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlArcgis
        :url="arcgisImageUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlArcgis
        map-provider="tile"
        :url="xyzUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlArcgis
        :url="arcgisImageUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlWms
        map-provider="imageTile"
        :url="wmsUrl"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlWms
        :url="wmsUrl"
        :visible="checkVisible"
        :opacity="opacity"
        @ready="handleLayerReady"
      /> -->

      <!-- <OlTile
        map-provider="wmts"
        :url="wmtsUrl"
        :request-params="requestParamsWmts"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl2"
        :request-params="requestParams"
        :visible="checkVisible"
        :opacity="opacity"
      /> -->
    </OlMap>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import OlMap from '@/VMap/ol/v3/components/OlMap.vue'
import OlOverlay from '@/VMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VMap/ol/v3/components/layer/vector/index.vue'
import OlTile from '@/VMap/ol/v3/components/layer/tile/index.vue'
import OlArcgis from '@/VMap/ol/v3/components/layer/arcgis/index.vue'
import OlWms from '@/VMap/ol/v3/components/layer/wms/index.vue'

import OlToolbar from '@/VMap/ol/v3/components/toolbar/bar/index.vue'
import OlBasemap from '@/VMap/ol/v3/components/toolbar/baseLayer/index.vue'

import OlPopup from '@/VMap/ol/v3/components/layer/popup/index.vue'
import OlMultiplePopup from '@/VMap/ol/v3/components/layer/popup/multiple/index.vue'

const activeName = ref('first')
const checkStatus = ref(false)
const checkVisible = ref(true)
const opacity = ref(1)

watch(checkVisible, () => {
  // console.log(document.getElementsByClassName('vmap-ol-popup'))
  // const a = document.getElementsByClassName('vmap-ol-popup')
  // for (let index = 0; index < a.length; index++) {
  //   const element = a[index]
  //   // element.css('display','none')
  //   element.style.display = 'none'
  // }
})

const tdtUrl = ref('http://t{s}.tianditu.gov.cn/img_w/wmts')

const arcgisTileUrl = ref(
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/WMTS/tile'
)

const superMapWmtsUrl = ref(
  'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=4326&style=10&tilematrixset=l&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fwebpimage%2Fpngimage%2Fjpeg'
)

const superMapWmtsUrl2 = ref('https://proxy.mwr.cn/usmaps/usmaps')

const requestParams = reactive({
  layer: '4326',
  tilematrixset: 'l',
  k: 'MH9dDPhe3quZQTfDhacLpg==',
  urls: '/mnt/usdata/2022_2m.usrmp',
})

const requestParams2 = reactive({
  layer: 'wt',
  tilematrixset: 'wt',
  k: 'MH9dDPhe3quZQTfDhacLpg==',
  urls: '/mnt/usdata/2022_2m.usrmp',
})

const wmtsUrl = 'https://mrdata.usgs.gov/mapcache/wmts'
const requestParamsWmts = reactive({
  layer: 'sgmc2',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
  style: 'default',
})

const xyzUrl = ref(
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
)

const arcgisImageUrl = ref(
  'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer'
)

const wmsUrl = ref(
  'https://ahocevar.com/geoserver/wms?layers=topp:states&TILED=true'
)

const tableHeader = ref([
  {
    label: '属性',
    value: 'label',
    width: 200,
  },
  {
    label: '值',
    value: 'value',
    width: 200,
  },
])

import MultLinesJson from '../data/wkt/multlines'
import PointsJson from '../data/wkt/points'
import MultPolygonsJson from '../data/wkt/multpolygons'
import VcUtils from '../../public/utils/base/index'

import PolygonGeojson from '../data/geojson/polygon.json'
import PolylineGeojson from '../data/geojson/polyline.json'
import PointGeojson from '../data/geojson/point.json'
// import Point2Geojson from '../data/geojson/point-cluster.json'
console.log(PolygonGeojson)

const featurePopup = ref({})

let olHandler = null
const pointList = [
  [VcUtils.getRandomNum(100, 130), VcUtils.getRandomNum(25, 35)],
  [VcUtils.getRandomNum(100, 130), VcUtils.getRandomNum(25, 35)],
]

const pointList2 = [
  [VcUtils.getRandomNum(100, 130), VcUtils.getRandomNum(25, 35)],
  [VcUtils.getRandomNum(100, 130), VcUtils.getRandomNum(25, 35)],
]
const handleMapReady = (e) => {
  olHandler = e
  // aaa()
}

const overlayPosition = ref([])
let featureProperties = reactive({})
const handleMouseClick = (e) => {
  showFeaturePopup(e)
  // showOverlay(e)
}
const handleMouseMove = (e) => {}

const curPosition = ref([])
const curProperties = ref([])
const showFeaturePopup = (e) => {
  const coordinate = e.coordinate
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || []
  if (features.length === 0) {
    overlayPosition.value = undefined
    return
  }
  const properties = features[0].getProperties()
  curPosition.value = coordinate
  curProperties.value = VcUtils.object2Array(properties)
  featurePopup.value = {
    location: coordinate,
    attributes: VcUtils.object2Array(properties),
  }
}

const popupFeatures = ref([])
const popupFeatures2 = ref([])
const aaa = () => {
  const t = setInterval(() => {
    const location = [
      VcUtils.getRandomNum(100, 130),
      VcUtils.getRandomNum(25, 35),
    ]
    popupFeatures.value.push({
      location,
      properties: [
        {
          label: 'bbb',
          value: 222222222222222,
        },
        {
          label: 'bbb',
          value: 222,
        },
      ],
    })

    olHandler.getLayerHandler().createCustomLayer({
      features: [
        {
          wktstr: `POINT(${location[0]} ${location[1]})`,
        },
      ],
      clear: false,
    })

    if (popupFeatures.value.length >= 10) {
      clearInterval(t)
    }
  }, 5000)
  // pointList.forEach((e) => {
  //   popupFeatures.value.push({
  //     location: e,
  //     properties: [
  //       {
  //         label: 'bbb',
  //         value: 222222222222222,
  //       },
  //       {
  //         label: 'bbb',
  //         value: 222,
  //       },
  //     ],
  //   })
  // })

  // pointList2.forEach((e) => {
  //   popupFeatures2.value.push({
  //     location: e,
  //     properties: [
  //       {
  //         label: 'bbb',
  //         value: 222222222222222,
  //       },
  //       {
  //         label: 'bbb',
  //         value: 222,
  //       },
  //     ],
  //   })
  // })

  // olHandler.getLayerHandler().createCustomLayer({
  //   features: pointList.map((e) => {
  //     return {
  //       wktstr: `POINT(${e[0]} ${e[1]})`,
  //     }
  //   }),
  //   clear: true,
  // })
}

const showOverlay = (e) => {
  const coordinate = e.coordinate
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || []
  if (features.length === 0) {
    overlayPosition.value = undefined
    return
  }
  debugger
  featureProperties = reactive({})
  const properties = features[0].getProperties()
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key]
      if (VcUtils.isString(element)) {
        featureProperties[key] = element
      }
    }
  }
  console.log(featureProperties)
  if (Object.keys(featureProperties).length > 0) {
    overlayPosition.value = coordinate
  }
}

const handleSelectChange = () => {}

const PolygonJson = ref(MultPolygonsJson)
const handleChangePolygon = () => {
  PolygonJson.value.forEach((p) => {
    p['style'] = {
      fill: {
        color: VcUtils.getRandomRgb(0.6),
      },
    }
  })
}

const handleLayerReady = () => {
  console.log('ready!')
}

const pointStyle = ref({
  // icon: {
  //   src: new URL('../../public/static/svg/map/location.svg', import.meta.url)
  //     .href,
  //   scale: 1,
  // },
  text: {
    field: 'gateName',
    backgroundColor: 'green',
    padding: [0, 5, 0, 5],
  },
})

const pointStyle2 = ref({
  icon: {
    src: new URL('../../public/static/svg/map/location.svg', import.meta.url)
      .href,
    scale: 1,
  },
  text: {
    backgroundColor: 'green',
    padding: [0, 5, 0, 5],
  },
})

const clusterOptions = reactive({
  showText: true,
})

const lineStyle = ref({
  stroke: {
    color: 'orange',
    width: '5',
  },
})

const polygonStyle = ref({
  fill: {
    color: '#00ff002a',
  },
  stroke: {
    color: 'blue',
    width: 5,
  },
})

const handleBasemapChange = (e) => {
  console.log('>>>', e)
}

const rowTotal = ref('')
const handleCalc = () => {
  // 解的个数
  let count = 0
  // 存储已放置的列号
  let result = new Array()
  let resultList = []
  // 检查位置是否符合规则
  const checkValid = (row, col) => {
    for (let index = 0; index < row; index++) {
      if (
        col == result[index] ||
        Math.abs(col - result[index]) == Math.abs(row - index)
      ) {
        return false
      }
    }
    return true
  }

  // row 行号，从0开始
  const fn = (row) => {
    if (row == rowTotal.value) {
      count++
      console.log('完成......', result)
      result = new Array()
      return
    }
    let flag = false
    // 依次判断该行的列号
    for (let index = 1; index <= rowTotal.value; index++) {
      console.log(`result>>>>>,row = ${row},col = ${index}`, result)

      // 是否合法
      if (checkValid(row, index)) {
        flag = true
        // 记录位置
        result[row] = index
        // 递归
        fn(row + 1)
      }
    }
    // 该行没有找到合适的位置
    if (!flag) {
      console.log('没有合适位置>>>>>>', row, result)
    }
  }
  debugger
  fn(0)
  console.log('解数>>>>>>>>>>>>>>>>>>', count, resultList)
}
</script>

<style scoped>
#app-container {
  width: 100%;
  height: 100%;
}

#map-view {
  width: 100%;
  height: calc(100vh - 120px);
}

.tools-view {
  z-index: 3999;
  width: 100%;
  height: 190px;
  margin-bottom: 10px;
  overflow-y: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  border-radius: 6px;
  background-color: white;
  /* padding: 0 10px; */
}

.tools-view .row {
  padding: 8px;
}

.map_contaniner {
  z-index: 199;
  position: relative;
  width: 100%;
  height: 100%;
}

.app-content {
  width: 100%;
  height: calc(100% - 200px);
}

.popup_content {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 228, 196, 0);
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
}

.status_bar {
  z-index: 1999;
  position: absolute;
  left: 50px;
  bottom: 60px;
  background-color: white;
}

.el-icon-s-flag {
  margin-right: 20px;
}
</style>

<style lang="scss" scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  /* padding: 15px; */
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
}

.popup_title_div {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #409eff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.ol-popup-closer:after {
  content: '✖';
}

.ol-popup-title {
  position: absolute;
  color: white;
  font-weight: bold;
  top: 0px;
  left: 8px;
}

.popup_content {
  padding: 10px;
  background-color: white;
}

.multi-popup {
  width: 88px;
  height: 88px;
  background-color: #409eff;
  // border-radius: 50%;
}
</style>
