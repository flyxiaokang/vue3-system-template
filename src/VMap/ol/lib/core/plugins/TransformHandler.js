/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-26 17:59:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-07 16:50:11
 */

import { transform } from "ol/proj";
import { getDistance } from "ol/sphere";
import WKT from 'ol/format/WKT.js'
import GeoJSON from 'ol/format/GeoJSON.js'

export function tranMeters2Radius(map, metersValue) {
  let metersPerUnit = map.getView().getProjection().getMetersPerUnit()
  let circleRadius = metersValue / metersPerUnit
  return circleRadius
}

export function tranRadius2Meters(map, radius) {
  let metersPerUnit = map.getView().getProjection().getMetersPerUnit()
  return radius * metersPerUnit
}

export function tranRadius2Meters2(map, circle) {
  let radius
  let center = circle.getCenter()
  let pointOnPerimeter = [center[0], center[1] + circle.getRadius()]
  let sourceProj = map.getView().getProjection()
  let c1 = transform(center, sourceProj, 'EPSG:4326')
  let c2 = transform(pointOnPerimeter, sourceProj, 'EPSG:4326')
  radius = getDistance(c1, c2)
  return radius
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
