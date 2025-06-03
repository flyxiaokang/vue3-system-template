/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-02-24 15:48:58
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-15 11:06:00
 */

import ArcgisMap from '@/VMap/esri/v3/components/EsriMap.vue'
import ArcgisToolbar from '@/VMap/public/components/Map/MapToolbar.vue'
import ArcgisBasemap from '@/VMap/esri/v3/components/toolbar/MapBasemap.vue'
// 按需引入
const components = [ArcgisMap, ArcgisToolbar, ArcgisBasemap]

const install = (App) => {
  components.forEach((item) => {
    App.component(item.name, item)
  })
}

export { V_MAP_PROVIDER as V_MAP_TYPE } from '@/VMap/global'
export { default as ArcgisHandler } from '@/VMap/esri/lib/business/EsriHandler'
export { default as VUtils } from '@/VMap/public/utils/base/index.js'
export { default as VMapUtils } from '@/VMap/public/utils/map/index.js'

export default {
  install,
}
