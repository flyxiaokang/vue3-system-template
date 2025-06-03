/*
 * @Description:  entity style
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-02-02 16:53:26
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-21 14:50:34
 */
import VcUtils from '@/VMap/public/utils/base/index'
// [255, 0, 0, 1],[255, 0, 0],#ff0000
export function getColor(color) {
  if (color instanceof Cesium.Color) {
    return color
  } else if (color instanceof Array) {
    if (color.length === 4) {
      return Cesium.Color.fromBytes(...color).withAlpha(color.at(-1))
    } else if (color.length === 3) {
      return Cesium.Color.fromBytes(...[...color, 255])
    } else console.error(`无法识别的color <<${color}】>>`)
  } else if (VcUtils.isString(color)) {
    return Cesium.Color.fromCssColorString(color)
  } else if(color === undefined){
    return Cesium.Color.ALICEBLUE.withAlpha(0)
  } else  console.error(`无法识别的color <<${color}】>>`)
  return Cesium.Color.ALICEBLUE
}

/**
 * 颜色 支持 #000000 或 red、blue等格式
 */
export function getPointStyle(styleOptions) {
  const {
    color = 'red',
    pixelSize = 10,
    outlineColor = 'white',
    outlineWidth = 3,
    // 显示在距相机的距离处的属性，多少区间内是可以显示的
    minDisplay = 0,
    maxDisplay = 100000000,
    // disableDepthTestDistance = Number.POSITIVE_INFINITY,
    // heightReference = Cesium.HeightReference.CLAMP_TO_GROUND,
  } = styleOptions
  return {
    ...styleOptions,
    color: getColor(color),
    pixelSize,
    outlineColor: getColor(outlineColor),
    outlineWidth,
    // 显示在距相机的距离处的属性，多少区间内是可以显示的
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      minDisplay,
      maxDisplay
    ),
    // disableDepthTestDistance, //地形深度测试
    // heightReference,
  }
}

export function getLineStyle(styleOptions) {
  const {
    width = 6,
    material = 'blue',
    minDisplay = 0,
    maxDisplay = 100000000,
  } = styleOptions
  return {
    ...styleOptions,
    width,
    // 线的颜色
    material: getColor(material),
    // 显示在距相机的距离处的属性，多少区间内是可以显示的
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      minDisplay,
      maxDisplay
    ),
    // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
    // zIndex: 100,
  }
}

export function getPolygonStyle(styleOptions) {
  const {
    material = '#00ff00',
    outline = true,
    outlineColor = 'white',
    outlineWidth = 2,
    minDisplay = 0,
    maxDisplay = 100000000,
    // height = 5000,
  } = styleOptions
  return {
    ...styleOptions,
    // 是否被提供的材质填充
    // fill,
    // 填充的颜色，withAlpha透明度
    material: getColor(material), //.withAlpha(opacity),
    // 边框
    outline,
    // 边框颜色
    outlineColor: getColor(outlineColor),
    // 边框尺寸
    outlineWidth,
    // 显示在距相机的距离处的属性，多少区间内是可以显示的
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      minDisplay,
      maxDisplay
    ),
    // 恒定高度
    // height,
    // 是否显示
    // 顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
    // zIndex: 10,
  }
}

export function getLabelStyle(styleOptions) {
  const {
    font = '24px Helvetica',
    fillColor = Cesium.Color.SKYBLUE,
    outlineColor = Cesium.Color.BLACK,
    outlineWidth = 2,
    style = Cesium.LabelStyle.FILL_AND_OUTLINE,
    pixelOffset = [0, 0],
    backgroundColor = new Cesium.Color(0.165, 0.165, 0.165, 0.8),
  } = styleOptions
  return {
    ...styleOptions,
    font,
    fillColor: getColor(fillColor),
    outlineColor: getColor(outlineColor),
    outlineWidth,
    style,
    pixelOffset: new Cesium.Cartesian2(...pixelOffset),
    backgroundColor,
  }
}

export function getBillBoardStyle(styleOptions) {
  const {
    image,
    minDisplay = 0,
    maxDisplay = 10000000,
    // scaleByDistance = new Cesium.NearFarScalar(1.5e2, 5.0, 1.5e7, 0.5),
  } = styleOptions
  return {
    ...styleOptions,
    image,
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      minDisplay,
      maxDisplay
    ),
    // scaleByDistance,
  }
}
