/*
 * @Description: map utils
 * @Version:
 * @Author: kangjinrui
 * @Date: 2025-02-21 11:14:09
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-28 11:44:49
 */
import { OlHandler } from 'v-openlayers'
import { toSize } from 'ol/size'
import { useSchemeStore } from '@/store/scheme'
import { getArea } from 'ol/sphere'
import WKT from 'ol/format/WKT.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import Fill from 'ol/style/Fill.js'

const schemeStore = useSchemeStore()

// 流域出口
const exportPointLayerid = 'export-station-layerid'
const otherPointLayerid = 'other-station-layerid'
// 设置出口
export const createExportPoint = (olHandler, point) => {
  olHandler.getLayerHandler().createPoints({
    layerId: exportPointLayerid,
    clear: true,
    zIndex: 1999,
    features: [
      {
        wktstr: `POINT(${point.lgtd} ${point.lttd})`,
        style: {
          icon: {
            size: toSize([50, 100]),
            offset: [0, 0],
            scale: 0.8,
            src: new URL(
              '@/assets/images/station/iconfont-locationon.png',
              import.meta.url
            ).href,
          },
        },
      },
    ],
  })
}

// 更新方案节点
export const updateSchemePoints = (olHandler, points) => {
  const exportPoint = points[0]
  createExportPoint(olHandler, exportPoint)
  const others = points.slice(1)
  others.forEach((element) => {
    element['wktstr'] = `POINT(${element.lgtd} ${element.lttd})`
    element['style'] = {
      circle: {
        radius: 6,
        color: 'blue',
      },
    }
  })
  olHandler.getLayerHandler().createPoints({
    layerId: 'otherPointLayerid',
    features: others,
    clear: true,
    zIndex: 199,
  })
}

// 概化图
let nodeLayer, linkLayer, subcLayer
const linkStyle = {
  stroke: {
    width: 3,
    color: 'blue',
  },
}
const subcStyle = {
  fill: {
    color: 'rgba(182, 215, 168,0.6)',
  },
}
const nodeStyle = {
  circle: {
    radius: 6,
    color: 'blue',
  },
}
let highlightLayer = null
const highlightLayerId = 'highlight-layerid'

const removeLayers = (olHandler) => {
  olHandler.removeLayerById(highlightLayerId)
}

export const resetLayers = (olHandler) => {
  nodeLayer && olHandler.map.removeLayer(nodeLayer)
  linkLayer && olHandler.map.removeLayer(linkLayer)
  subcLayer && olHandler.map.removeLayer(subcLayer)
  console.log('remove layers')
}

// 概化图
export const createSchemeMap = (olHandler = new OlHandler(), mapData) => {
  removeLayers(olHandler)
  const { nodes, links, subcs } = mapData
  const layerHandler = olHandler.getLayerHandler()
  const l = links.some((e) => e.hasOwnProperty('riverJson'))
  linkLayer = layerHandler.createCustomLayer({
    layerId: 'link-layerid',
    features: links.map((e) => e),
    clear: true,
    geomField: 'riverJson',
    style: linkStyle,
    zIndex: 110,
  })
  const s = subcs.some((e) => e.hasOwnProperty('subcatJson'))
  subcLayer = layerHandler.createCustomLayer({
    layerId: 'subc-layerid',
    features: subcs.map((e) => e),
    clear: true,
    geomField: 'subcatJson',
    style: subcStyle,
    zIndex: 100,
  })

  const p = nodes.some((e) => e.hasOwnProperty('lgtd'))
  nodeLayer = layerHandler.createCustomLayer({
    layerId: 'node-layerid',
    features: nodes.map((e) => {
      return {
        wktstr: `POINT(${e.lgtd} ${e.lttd})`,
        ...e,
      }
    }),
    clear: true,
    style: nodeStyle,
    zIndex: 120,
  })

  setTimeout(() => {
    subcLayer &&
      subcLayer.getSource().getFeatures().length > 0 &&
      olHandler.zoomToLayer(subcLayer)
  }, 0)
}

// 定位
export const highlightFeature = (feature, type = 'node', location = true) => {
  const olHandler = schemeStore.olHandler
  const { id, riverJson, subcatJson } = feature
  let layer = null
  let style = null
  let highlightStyle = null
  if (type === 'node') {
    layer = nodeLayer
    style = nodeStyle
    highlightStyle = {
      circle: {
        radius: 6,
        color: 'red',
      },
    }
  } else if (type === 'link') {
    layer = linkLayer
    style = linkStyle
    highlightStyle = {
      stroke: {
        width: 4,
        color: '#73f2e3',
      },
    }
  } else if (type === 'subc') {
    layer = subcLayer
    style = subcStyle
    highlightStyle = {
      fill: {
        color: 'rgba(42, 168, 231, 0.6)',
      },
    }
  }
  layer &&
    layer
      .getSource()
      .getFeatures()
      .forEach((e) => {
        if (e.getProperties().id === id) {
          if (location) {
            olHandler.getLayerHandler().createCustomLayer({
              layerId: highlightLayerId,
              features: [
                {
                  wktstr: riverJson || subcatJson,
                },
              ],
              style: {
                fill: {
                  color: 'rgba(255, 255, 0 , 0.4)',
                },
                stroke: {
                  width: 4,
                  color: 'rgba(255, 255, 0 , 0.4)',
                },
              },
              clear: true,
              zIndex: 130,
            })
            olHandler.map.getView().fit(e.getGeometry(), {
              maxZoom: 11,
              padding: [200, 200, 200, 1000],
            })
          } else {
            e.setStyle(olHandler.StyleHandler.getStyle(highlightStyle))
          }
        }
      })
}

// 测站
export const createStations = (list) => {
  // console.log('=====================', list)
  const layerId = `stations-layerid`
  const features = []
  list.forEach((p) => {
    const f = { ...p }
    f['wktstr'] = `POINT(${p.lgtd} ${p.lttd})`
    const { sttp } = p
    if (sttp !== 'SS') {
      const imageUrl = new URL(
        `../assets/images/station/${sttp}.png`,
        import.meta.url
      ).href
      f['style'] = {
        icon: {
          src: imageUrl,
        },
      }
      f['style']['text'] = {
        field: 'stnm',
        color: 'black',
        // backgroundColor: 'green',
        padding: [0, 2, 0, 2],
      }
      features.push(f)
    }
  })
  // console.log('fs===', features)
  schemeStore.olHandler.getLayerHandler().createPoints({
    layerId,
    features: features,
    clear: true,
    visible: true,
  })
}

/**
 * 计算面积
 * @param {*} wkt | geojson
 * @param {*} projection
 * @returns
 */
export const getAreaByWkt = (wkt, projection = 'EPSG:4326') => {
  const geom =
    typeof wkt === 'string'
      ? new WKT().readGeometry(wkt)
      : new GeoJSON().readGeometry(geojson)
  const area = getArea(geom, { projection })
  return Number((area / 1000000).toFixed(2))
}

// geojson转wkt
export const geojsonToWkt = (geojson) => {
  const wkt = new WKT().writeFeatures(new GeoJSON().readFeatures(geojson))
  return wkt
}
// wkt转geojson
export const wktToGeojson = (wkt) => {
  const geojson = new GeoJSON().writeFeatures(new WKT().readFeatures(wkt))
  return geojson
}

// wkt装feature
export const wktToFeature = (wkt) => {
  const feature = new WKT().readFeature(wkt)
  return feature
}
