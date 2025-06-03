/*
 * @Description: v-cesium
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-27 18:04:47
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-16 18:42:03
 */

import CesiumMap from '@/VMap/cesium/v3/CesiumMap.vue'
import CesiumToolbar from '@/VMap/cesium/v3/components/toolbar/MapBar.vue'
import CesiumBasemap from '@/VMap/cesium/v3/components/toolbar/MapBasemap.vue'
import CesiumRoller from '@/VMap/cesium/v3/components/toolbar/MapRoll.vue'

import CesiumTdt from '@/VMap/cesium/v3/components/layer/tdt/index.vue'
import CesiumWms from '@/VMap/cesium/v3/components/layer/wms/index.vue'
import CesiumArcgis from '@/VMap/cesium/v3/components/layer/arcgis/index.vue'
import CesiumSupermap from '@/VMap/cesium/v3/components/layer/supermap/index.vue'
import CesiumTile from '@/VMap/cesium/v3/components/layer/tile/index.vue'
// 按需引入
const components = [
  CesiumMap,
  CesiumToolbar,
  CesiumBasemap,
  CesiumRoller,
  CesiumTdt,
  CesiumWms,
  CesiumArcgis,
  CesiumSupermap,
  CesiumTile,
]

const install = (App) => {
  components.forEach((item) => {
    App.component(item.name, item)
  })
}

export { V_MAP_PROVIDER as V_MAP_TYPE } from '@/VMap/global'
export { default as CesiumHandler } from '@/VMap/cesium/lib/bussiness/CesiumHandler'
export { default as VUtils } from '@/VMap/public/utils/base/index.js'
export { default as VMapUtils } from '@/VMap/public/utils/map/index.js'

export default {
  install,
}
