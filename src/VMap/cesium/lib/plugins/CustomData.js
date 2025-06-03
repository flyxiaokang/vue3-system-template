/*
 * @Description: entity
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-02-01 15:43:16
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-23 17:31:17
 */

import { V_GEO_TYPE } from '@/VMap/global'
import { WGS84_to_Cartesian3 } from '@/VMap/public/utils/map/cesium'
import {
  getPointStyle,
  getLineStyle,
  getPolygonStyle,
  getLabelStyle,
  getBillBoardStyle,
  getColor,
} from './StyleHandler'
import VcUtils from '@/VMap/public/utils/base/index'

export function getCustomDataSource(name) {
  return new Cesium.CustomDataSource(name)
}

const style = {
  point: {},
  icon: {},
  polyline: {},
  polygon: {},
  text: {},
  billboard: {},
}

export function getPoint({
  id = VcUtils.UUIDGenerator(),
  name = '点对象',
  geometry,
  style = {},
}) {
  // const [lon, lat, alt = 0] = geometry
  return {
    id,
    name,
    position: Cesium.Cartesian3.fromDegrees(...geometry), // WGS84_to_Cartesian3({ lon, lat, alt }),
    point: getPointStyle(style.point || {}),
  }
}

// id = id + '-label'
export function getLabel(entity) {
  const { id, name = 'label', geometry, style = {} } = entity
  const _style = style.label || {}
  const { renderField = '', text } = _style
  const _text =
    text !== undefined ? text : renderField ? entity[renderField] : ''
  return {
    // id: id + '-label',
    // name,
    position: Cesium.Cartesian3.fromDegrees(...geometry),
    label: {
      ...getLabelStyle(_style),
      text: _text,
    },
  }
}

export function getBillBoard({ id, name, geometry, style }) {
  return {
    // id,
    // name,
    position: Cesium.Cartesian3.fromDegrees(...geometry),
    billboard: {
      position: Cesium.Cartesian3.fromDegrees(...geometry),
      ...getBillBoardStyle(style.billboard),
    },
  }
}

export function getPolyline({
  id = VcUtils.UUIDGenerator(),
  name = '线对象',
  geometry,
  style = {},
}) {
  return {
    id,
    name,
    polyline: {
      ...getLineStyle(style.polyline || {}),
      // fromDegrees返回给定的经度和纬度值数组（以度为单位），该数组由Cartesian3位置组成。
      // Cesium.Cartesian3.fromDegreesArray([经度1, 纬度1, 经度2, 纬度2,])
      // Cesium.Cartesian3.fromDegreesArrayHeights([经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2])
      positions: Cesium.Cartesian3.fromDegreesArray(
        Array.prototype.concat.apply([], geometry)
      ),
    },
  }
}

export function getPolygon({
  id = VcUtils.UUIDGenerator(),
  name = '面对象',
  geometry,
  innerGeometry = [],
  style = {},
}) {
  const holes = []
  if (innerGeometry.length > 0) {
    const a = [[], []]
    innerGeometry.forEach((e) => {
      holes.push({
        positions: Cesium.Cartesian3.fromDegreesArray(
          Array.prototype.concat.apply([], e)
        ),
      })
    })
  }
  if (
    geometry instanceof Array &&
    geometry.length > 0 &&
    geometry[0] instanceof Array &&
    geometry[0].length > 0 &&
    geometry[0][0] instanceof Array
  ) {
    const entities = []
    for (let index = 0; index < geometry.length; index++) {
      const ring = geometry[index]
      entities.push({
        id: `${id}-${index}`,
        name,
        polygon: {
          ...getPolygonStyle(style.polygon || {}),
          // 获取指定属性（positions，holes（图形内需要挖空的区域））
          hierarchy: {
            positions: Cesium.Cartesian3.fromDegreesArray(
              Array.prototype.concat.apply([], ring)
            ),
            holes,
          },
        },
      })
    }
    return entities
  } else if (
    geometry instanceof Array &&
    geometry.length > 0 &&
    geometry[0] instanceof Array &&
    geometry[0].length === 2 &&
    !isNaN(geometry[0][0])
  ) {
    return {
      id,
      name,
      polygon: {
        ...getPolygonStyle(style.polygon || {}),
        // 获取指定属性（positions，holes（图形内需要挖空的区域））
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(
            Array.prototype.concat.apply([], geometry)
          ),
          holes,
        },
      },
    }
  } else {
    return null
  }
}

export function getPolygons() {}

export async function getDataSourceByGeojson({
  name,
  features,
  style = {},
  geomField,
}) {
  let dataSource = getCustomDataSource(name)
  const dataPromise = Cesium.GeoJsonDataSource.load(features, {
    fill: style.polygon
      ? getColor(style.polygon.material)
      : Cesium.Color.YELLOW.withAlpha(0.3),
    stroke:
      style.polyline && style.polyline.material
        ? getColor(style.polyline.material)
        : Cesium.Color.YELLOW,
    strokeWidth:
      style.polyline && style.polyline.width ? style.polyline.width : 1,
    // markerSymbol: '1',
  })

  await dataPromise.then((source) => {
    debugger
    dataSource = source
    var entities = source.entities.values
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i]
      console.log(
        entity,
        entity.properties.fill?._value,
        entity.properties.stroke?._value
      )
      if (entity.billboard && style.label) {
        entity.label = {
          text: entity.properties.name._value,
        }
      }
      // const { stroke, strokeWidth } = entity.properties
      // if (entity.polygon && style.polyline) {
      //   var positions = entity.polygon.hierarchy._value.positions
      //   entity.polyline = {
      //     positions: positions,
      //     ...getLineStyle(style.polyline),
      //   }
      // }
      // let polyPositions = entity.polygon.hierarchy.getValue(
      //   Cesium.JulianDate.now()
      // ).positions
      // //单独设置线条样式
      // if (style.polyline) {
      //   var positions = entity.polygon.hierarchy._value.positions
      //   entity.polyline = {
      //     positions: positions,
      //     ...getLineStyle(style.polyline),
      //   }
      // }
      // if (style.point) {
      //   entity.point = new Cesium.PointGraphics({
      //     color: Cesium.Color.RED,
      //     pixelSize: 10,
      //   })
      // }
    }
  })
  return dataSource
}

export function getDataSourceByFeatures({
  name,
  features,
  style = {},
  geomField,
}) {
  let dataSource = getCustomDataSource(name)
  features.forEach((feature) => {
    let entity = {}
    const { type } = feature
    const _feature = { ...feature }
    // 判断feature是否有style，没有则使用全局style
    if (!feature.style) {
      _feature['style'] = style
    }
    // 判断是否配置geomField
    if (geomField && geomField !== 'geometry') {
      _feature['geometry'] = feature[geomField]
    }
    if (type === V_GEO_TYPE.point) {
      entity = getPoint(_feature)
    } else if (type === V_GEO_TYPE.polyline) {
      entity = getPolyline(_feature)
    } else if (type === V_GEO_TYPE.polygon) {
      entity = getPolygon(_feature)
    }
    if (entity instanceof Array) {
      entity.forEach((e) => {
        add(e)
      })
    } else if (entity) {
      add(entity)
    }

    function add(entity) {
      if (entity !== null) {
        if (_feature.style && _feature.style.label) {
          entity = {
            ...entity,
            ...getLabel(_feature),
          }
        }
        if (_feature.style && _feature.style.billboard) {
          entity = {
            ...entity,
            ...getBillBoard(_feature),
          }
          delete entity.point
        }
        console.log('entity...', entity)
        dataSource.entities.add(entity)
      }
    }
  })
  return dataSource
}

function getEntity() {}
