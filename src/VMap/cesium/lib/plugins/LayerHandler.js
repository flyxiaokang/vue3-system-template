/*
 * @Description: Layer
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-02-15 15:13:55
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-01 15:42:24
 */
import { getConfig } from '../../config'
/**
 * wms
 * @param {*} mapInfo
 * tcid
 * url
 * layers
 * transparency
 *
 */
export function getWmsProvider({ url, layers }) {
  return new Cesium.WebMapServiceImageryProvider({
    url,
    layers,
    parameters: {
      Format: 'image/png',
      version: '1.3.0',
      transparent: true,
    },
  })
}

export function getWmtsProvider(option) {
  return new Cesium.WebMapTileServiceImageryProvider(option)
}

export function getGeoserverWmtsProvider({
  url,
  layer,
  tilematrixset,
  style = '',
  format = 'image/png',
  matrixSetPrefix = '',
}) {
  const tileMatrixLabels = []
  for (let index = 0; index < 19; index++) {
    tileMatrixLabels.push(matrixSetPrefix + index)
  }
  const options = {
    url,
    layer,
    style,
    format,
    tileMatrixSetID: tilematrixset,
    tileMatrixLabels,
    maximumLevel: 19,
    tilingScheme: getTilingScheme(),
  }
  return getWmtsProvider(options)
}

function getTilingScheme() {
  const { prj } = getConfig()
  debugger
  if (prj.includes('3857')) {
    return new Cesium.WebMercatorTilingScheme()
  } else if (prj.includes('4326')) {
    return new Cesium.GeographicTilingScheme()
  } else {
    return new Cesium.GeographicTilingScheme()
  }
}

/**
 *
 * @param {*} mapInfo {tcid,url,type,layers(wms '',wmts '',arcgis []),visible,transparency}
 * @returns
 */
export function getArcgisProvider({ url, layers = '' }) {
  return new Cesium.ArcGisMapServerImageryProvider({
    url,
    layers,
  })
}

export function getArcgisTileProvider() {
  return new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/WMTS',
    layer: 'World_Street_Map',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
    maximumLevel: 19,
  })

  return new Cesium.UrlTemplateImageryProvider({
    url: `https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{mz}/{x}/{y}`,
    tilingScheme: getTilingScheme(),
    customTags: {
      mz: function (imageryProvider, x, y, level) {
        return level + 1
      },
    },
  })
}

export function get3dTilesProvider({ url }) {
  return new Cesium.Cesium3DTileset({
    name: '县城社区',
    url: url, // 'http://data.marsgis.cn/3dtiles/bim-daxue/tileset.json',
    skipLevelOfDetail: true,
    baseScreenSpaceError: 1024,
    skipScreenSpaceErrorFactor: 16,
    skipLevels: 1,
    immediatelyLoadDesiredLevelOfDetail: false,
    loadSiblings: false,
    cullWithChildrenBounds: true,
  })
}

export function getWfsLayer({ url, clampToGround = false }, callback) {
  var dataSource = Cesium.GeoJsonDataSource.load(url, {
    clampToGround: clampToGround,
  })
  this.viewer.dataSources.add(dataSource).then((e) => {
    callback(e)
  })
}

export function getTdtProvider({ url, layer, prj = 'EPSG:3857' }) {
  if (prj === 'EPSG:3857') {
    return new Cesium.WebMapTileServiceImageryProvider({
      url,
      layer,
      style: 'raster', //务必加上style属性，哪怕style属性值为空字符串！！！！
      tileMatrixSetID: 'w', //不能用4326，否则cesium中不显示
      tilingScheme: new Cesium.WebMercatorTilingScheme(), // 当想要加载EPSG:4326瓦片服务时，只需要创建一个GeographicTilingScheme对象即可
      subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
    })
  } else {
    return getTdtProviderGeo({ url, layer })
  }
}

export function getTdtProviderGeo({ url, layer }) {
  return new Cesium.WebMapTileServiceImageryProvider({
    url,
    format: 'tiles',
    tileMatrixSetID: 'c',
    tilingScheme: new Cesium.GeographicTilingScheme(),
    tileMatrixLabels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
    ],
    layer,
    style: 'default',
    subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
  })
}

export function getSupermapProvider({
  url,
  layer,
  tilematrixset,
  style = '',
  format = 'image/png',
  customParams,
}) {
  return new Cesium.WebMapTileServiceImageryProvider({
    url: getResource({ url, customParams }),
    layer,
    style,
    format,
    tilingScheme: getTilingScheme(),
    maximumLevel: 19,
    tileMatrixLabels: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ],
    tileMatrixSetID: tilematrixset,
  })
}

function getResource({ url, customParams }) {
  const resource = new Cesium.Resource({
    url,
    queryParameters: customParams,
  })
  return resource
}

function getCustomDataSource() {
  const dataSource = new Cesium.CustomDataSource('myData')
  const entity = dataSource.entities.add({
    position: Cesium.Cartesian3.fromDegrees(1, 2, 0),
    billboard: {
      image: 'image.png',
    },
  })

  viewer.dataSources.add(dataSource)
}
