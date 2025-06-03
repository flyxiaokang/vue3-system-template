<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-06-22 17:21:51
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-23 16:26:24
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="图层" name="first">
          <!-- <span>切換底图 （{{ epsg }}）</span>
          <el-select
            v-model="value"
            size="small"
            placeholder="请选择"
            style="width: 100px"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span></span>
          <el-select
            v-model="value2"
            size="small"
            placeholder="请选择"
            style="width: 100px"
            @change="handleChange2"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->

          <el-button size="small" @click="createPopup">charts</el-button>
          <el-button size="small" @click="loadGaode">高德</el-button>
          <el-button size="small" @click="loadBaidu">百度</el-button>

          <el-checkbox v-model="tdtVisible">tdt</el-checkbox>
          <el-checkbox v-model="wmsVisible">wms</el-checkbox>
          <el-checkbox v-model="arcgisImageVisible">arcgis</el-checkbox>
          <el-checkbox v-model="wmtsVisible">wmts</el-checkbox>
          <el-checkbox v-model="arcgisVisible">arcgis tile</el-checkbox>
          <el-checkbox v-model="supermapVisible">supermap</el-checkbox>
          <el-checkbox v-model="pointsVisible">points</el-checkbox>
          <el-checkbox v-model="polygonVisible">polygons</el-checkbox>

          <el-button @click="handleDelete">删除</el-button>
          <el-button @click="handleUpdate">更新</el-button>

          <br />
          <el-slider
            style="width: 150px"
            v-model="opacity"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="map_contaniner">
      <CesiumMap :use-plugin="false" @ready="handleMapReady">
        <CesiumTool
          theme="dark"
          @change="handleToolChange"
          :active-name="activeToolName"
        ></CesiumTool>
        <MapBasemap></MapBasemap>
        <!-- <MapLocation></MapLocation> -->
        <MapRoll
          v-if="activeToolName === 'rool'"
          @close="activeToolName = ''"
        ></MapRoll>

        <!-- <MapDraw></MapDraw> -->

        <!-- <LayerWidget
          map-provider="tdt"
          map-style="vec_label"
          :z-index="11"
        ></LayerWidget>
        <LayerWidget
          map-provider="tdt"
          map-style="vec"
          :z-index="10"
        ></LayerWidget> -->

        <!-- <CesiumTdt
          map-style="ter"
          :z-index="10"
          :visible="tdtVisible"
        ></CesiumTdt> -->

        <!-- <CesiumWms
          :url="wmsUrl"
          :visible="wmsVisible"
          :request-params="wmsRequest"
          :opacity="opacity"
        /> -->

        <!-- <CesiumTile
          map-provider="wmts"
          :url="wmtsUrl"
          :request-params="requestParamsWmts"
          :visible="wmtsVisible"
          :opacity="opacity"
        /> -->

        <!-- <CesiumArcgis
          :url="arcgisImageUrl"
          :visible="arcgisImageVisible"
          :opacity="opacity"
          :request-params="arcgisParams"
        /> -->

        <!-- <CesiumArcgis
          map-provider="tile"
          :url="xyzUrl"
          :visible="arcgisVisible"
          :opacity="opacity"
          :request-params="requestParamsArcgisTile"
        /> -->

        <!-- <CesiumTile
          map-provider="arcgistile"
          :url="xyzUrl"
          :visible="arcgisVisible"
          :opacity="opacity"
          :request-params="requestParamsArcgisTile"
        /> -->

        <CesiumSupermap
          map-provider="supermap"
          :url="superMapWmtsUrl"
          :request-params="requestParams"
          :custom-params="customParams"
          :visible="supermapVisible"
          :opacity="opacity"
          :min-zoom="4"
          :max-zoom="10"
        />

        <!-- <CesiumVector
          :source-id="pointLayerId"
          :visible="pointsVisible"
          :features="points"
          :style="pointStyle"
        ></CesiumVector> -->

        <!-- <CesiumVector
          :visible="pointsVisible"
          :features="polylines"
          :style="polylineStyle"
        ></CesiumVector> -->

        <!-- <CesiumVector
          :source-id="polygonLayerId"
          :visible="polygonVisible"
          :features="polygons"
        ></CesiumVector> -->

        <CesiumVector
          :visible="pointsVisible"
          :features="PointsChina"
          :style="pointGeojsonStyle"
        ></CesiumVector>

        <!-- <CesiumVector
          :visible="polygonVisible"
          :features="PolylineGeojson"
          :style="polylineGeojsonStyle"
        ></CesiumVector> -->

        <!-- <CesiumVector
          :source-id="polygonLayerId"
          :visible="polygonVisible"
          :features="polygonsGeojson"
          :style="polygonGeojsonStyle"
        ></CesiumVector> -->
      </CesiumMap>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CesiumMap from '@/VMap/cesium/v3/CesiumMap.vue'
import MapLocation from '@/VMap/cesium/v3/components/toolbar/MapLocation.vue'
import MapBasemap from '@/VMap/cesium/v3/components/toolbar/MapBasemap.vue'
import CesiumTool from '@/VMap/components/Map/MapToolbar.vue'
import MapRoll from '@/VMap/cesium/v3/components/toolbar/MapRoll.vue'
import MapDraw from '@/VMap/cesium/v3/components/toolbar/MapDraw.vue'

import LayerWidget from '@/VMap/cesium/v3/components/layer/layer/index.vue'
import CesiumTdt from '@/VMap/cesium/v3/components/layer/tdt/index.vue'
import CesiumWms from '@/VMap/cesium/v3/components/layer/wms/index.vue'
import CesiumArcgis from '@/VMap/cesium/v3/components/layer/arcgis/index.vue'
import CesiumSupermap from '@/VMap/cesium/v3/components/layer/supermap/index.vue'
import CesiumTile from '@/VMap/cesium/v3/components/layer/tile/index.vue'
import CesiumVector from '@/VMap/cesium/v3/components/layer/vector/index.vue'
import { getCesiumInstance } from '@/VMap/cesium/init'

import polygons from '../data/geojson/gd.json'
import polygonsGeojson from '../data/geojson/guangdong.json'
import PointsChina from '../data/geojson/China_point.json'
// import PointsChina from '../data/geojson/points.json'
import PolylineGeojson from '../data/geojson/line.json'

const activeName = ref('first')
const epsg = ref(4326)
const value = ref('影像')

const opacity = ref(1)

const mapConfig = {
  cesiumPath: '1',
  accessToken: '2',
  tdtToken: '718469ef14a862124f30427a38edaec4',
}

const activeToolName = ref('')
const handleToolChange = (e) => {
  activeToolName.value = e
  console.log(e)
}

let cesiumInstance = getCesiumInstance()
const handleMapReady = (e) => {
  cesiumInstance = e
}

const tdtVisible = ref(false)
watch(tdtVisible, () => {})

const wmsUrl = ref('http://localhost:8080/geoserver/kjr/wms')
const wmsVisible = ref(false)
const wmsRequest = ref({
  layers: 'kjr:China',
})

const arcgisImageUrl = ref(
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer'
)
const arcgisImageVisible = ref(false)
const arcgisParams = ref({
  layers: '0,1',
})

const wmtsVisible = ref(false)
const wmtsUrl = ref('http://localhost:8080/geoserver/gwc/service/wmts')
const requestParamsWmts = ref({
  layer: 'kjr:countries',
  tilematrixset: 'EPSG:3857',
  matrixSetPrefix: 'EPSG:3857:',
})

const xyzUrl = ref(
  // 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
)
const arcgisVisible = ref(false)
const requestParamsArcgisTile = ref({
  layer: 'World_Street_Map',
  tilematrixset: 'GoogleMapsCompatible',
})

const supermapVisible = ref(false)
const superMapWmtsUrl = ref('https://proxy.mwr.cn/usmaps/usmaps')
const requestParams = ref({
  // layer: '4326',
  // tilematrixset: 'l',
  // k: 'MH9dDPhe3quZQTfDhacLpg==',
  // urls: '/mnt/usdata/2022_2m.usrmp',
  // style: 10,
  layer: 'wt',
  tilematrixset: 'wt',
})
const customParams = ref({
  k: 'MH9dDPhe3quZQTfDhacLpg==',
  urls: '/mnt/usdata/2022_2m.usrmp',
})

const pointLayerId = 'point-Layer-id'
const pointsVisible = ref(true)
const pointStyle = {
  point: {
    color: 'green',
    pixelSize: 10,
  },
  billboard: {
    image: new URL('@/VMap/public/static/svg/map/star.svg', import.meta.url)
      .href,
    scale: 0.3,
  },
  label: {
    renderField: 'label',
    fillColor: Cesium.Color.SKYBLUE,
    pixelOffset: [10, -40],
    scale: 1,
    // showBackground:true,
    outlineWidth: 5,
  },
}
const points = [
  {
    id: 'p1',
    name: 1,
    type: 'Point',
    label: '点1',
    geometry: [117.09087506690742, 31.31401725909717],
  },
  {
    id: 'p2',
    name: 2,
    type: 'Point',
    label: '点2',
    geometry: [117.22455426516456, 31.42237754232708],
    // style: {
    //   point: {
    //     color: 'green',
    //     pixelSize: 10,
    //   },
    //   label: {
    //     renderField: 'label',
    //     // text:'test',
    //     fillColor: Cesium.Color.SKYBLUE,
    //   },
    // },
  },
]

const polylineStyle = {
  polyline: {
    material: 'red',
  },
}

const pointGeojsonStyle = {
  point: {
    color: 'green',
    pixelSize: 10,
  },
  label: {
    text: 'test',
  },
}

const polylineGeojsonStyle = {
  polyline: {
    material: 'red',
    width: 5,
  },
}

const polygonGeojsonStyle = {
  // polyline: {
  //   material: 'red',
  //   width: 3,
  // },
  polygon: {
    material: '#00880077',
  },
}

const polylines = [
  {
    id: 'pl1',
    name: 1,
    type: 'Polyline',
    geometry: [
      [115.68135738897077, 31.31401725909717],
      [118.22455426516456, 32.42237754232708],
      [117.68049490236237, 30.625145279354548],
    ],
  },
  {
    id: 'pl2',
    name: 2,
    type: 'Polyline',
    geometry: [
      [111.68135738897077, 30.31401725909717],
      [114.22455426516456, 31.42237754232708],
      [113.68049490236237, 29.625145279354548],
    ],
  },
]

const polygonLayerId = 'polygon-layer-id'
const polygonVisible = ref(true)
// const polygons = [
//   {
//     id: 'py1',
//     type: 'Polygon',
//     geometry: [
//       [114.68135738897077, 30.31401725909717],
//       [116.22455426516456, 31.42237754232708],
//       [115.68049490236237, 29.625145279354548],
//     ],
//     innerGeometry: [
//       [
//         [114.9, 30.3],
//         [116, 31],
//         [115.6, 29.8],
//       ],
//     ],
//     style: {
//       polygon: {
//         material: '#ff000066',
//       },
//     },
//   },
//   {
//     id: 'py2',
//     type: 'Polygon',
//     geometry: [
//       [113.68135738897077, 29.31401725909717],
//       [114.22455426516456, 30.42237754232708],
//       [115.68049490236237, 26.625145279354548],
//     ],
//     style: {
//       polygon: {
//         material: [0, 255, 0, 0.5],
//       },
//     },
//   },
// ]

// const polygons = polygonss

const handleUpdate = () => {
  const point = cesiumInstance.getDataSourceById(pointLayerId)
  console.log(point.entities)
  point.entities.getById('p2').label.showBackground = true
}

const handleDelete = () => {
  const polygon = cesiumInstance.getDataSourceById(polygonLayerId)
  polygon.entities.removeById('py1')
}
</script>

<script>
export default {
  name: 'cesium_service',
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
  height: 150px;
}

.map_contaniner {
  z-index: 199;
  position: relative;
  width: 100%;
  height: calc(100% - 150px);
}

/**
/deep/ .popup_content {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 228, 196, 0);
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
}
 */
</style>
