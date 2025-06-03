/*
 * @Description: 图层操作类
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:23:02
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-17 16:54:36
 */

// import 'ol/ol.css'
// import Map from 'ol/Map'
// import OSM from 'ol/source/OSM'
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";

import TileWMS from "ol/source/TileWMS";
import ImageWMS from "ol/source/ImageWMS";

import TileImage from "ol/source/TileImage";

import MVT from "ol/format/MVT.js";
import VectorTileLayer from "ol/layer/VectorTile.js";
import VectorTileSource from "ol/source/VectorTile.js";
// import { applyStyle } from "ol-mapbox-style";

import { Heatmap as HeatmapLayer } from "ol/layer";

import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";

import { Cluster } from "ol/source";

import { Image as ImageLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { ImageArcGISRest, TileArcGISRest } from "ol/source";

import TileGrid from "ol/tilegrid/TileGrid";

import { createXYZ } from "ol/tilegrid";

import Overlay from "ol/Overlay";
import Feature from "ol/Feature";

import { WKT } from "ol/format";

import {
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  Text,
  Icon,
} from "ol/style";
import { Circle } from "ol/geom";

import { get as getProjection, transform } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";

import Projection from "ol/proj/Projection";

import GeoJSON from "ol/format/GeoJSON";

import V_MAP_GLOBAL from "@/VMap/global";

import CustomUtils from "@/VMap/public/utils/base";

import { uuid, uuidOnlyStr } from "@/VMap/public/utils/base/string";

import * as KFeatureLoader from "./FeatureHandler";
import { createRing } from "./GeometryHandler";

import { getBaiduLayer } from "./baidu/BaiduMap";

import VcUtils from "@/VMap/public/utils/base";
import { getStyle, getIconStyle } from "./StyleHandler";
import { createMapboxStreetsV6Style } from "./mapbox-streets-v6-style";

import { getConfig, isWgs84 } from "@/VMap/ol/config";
import { isFunction } from "@/VMap/public/utils/base/type";

// import {
//   TileSuperMapRest,
//   // VectorTileSuperMapRest,
//   // MapboxStyles,
// } from "@supermapgis/iclient-ol";
// import olms from "ol-mapbox-style";
// window.olms = olms;

// import { parse } from '@terraformer/wkt'
import { wktToGeoJSON } from "@terraformer/wkt";

const projection = getProjection("EPSG:3857");
const projectionExtent = projection.getExtent();
const size = getWidth(projectionExtent) / 256;
const resolutions = new Array(19);
const matrixIds = new Array(19);

for (let z = 0; z < 19; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}

// const url = new URL(
//   '../../../../public/static/images/dike3.png',
//   import.meta.url
// ).href

export default class LayerHandler {
  prj = getConfig().prj;
  isWgs84 = false;
  isWebmocat = false;
  defaultStyle = new Style({
    fill: new Fill({
      color: "rgba(255, 208, 75, 0.5)",
    }),
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
    // image: new Icon({
    //   src: url,
    //   scale: 1,
    // }),
  });
  defaultVectorLayerId = "vector_layer_temp_id_";

  constructor(map, prj) {
    this.map = map;
    this.prj = prj;
  }

  setMap(map, prj) {
    this.map = map;
  }

  // getWmts(options) {
  //   return new TileLayer({
  //     id: options.id === undefined ? 'id_' + Math.random() : options.id,
  //     opacity: options.opacity === undefined ? 1 : options.opacity,
  //     visible: options.visible === undefined ? true : options.visible,
  //     source: new WMTS({
  //       url: options.url,
  //       // url: "https://gatewayproxy-jcpt.mwr.cn/m_onemap_v/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_onemap_v&tilematrixset=GoogleMapsCompatible_m_onemap_v",
  //       format: 'image/png',
  //       tileGrid: new WMTSTileGrid({
  //         origin: getTopLeft(projectionExtent),
  //         resolutions: resolutions,
  //         matrixIds: matrixIds,
  //       }),
  //     }),
  //   })
  // }

  // getWmtsWgs84(options) {
  //   const projection = getProjection(V_MAP_GLOBAL['EPSG:4326'].prj)
  //   const projectionExtent = projection.getExtent()
  //   const { resolutions, matrixIds } = V_MAP_GLOBAL['EPSG:4326']
  //   return new TileLayer({
  //     id: options.id === undefined ? 'id_' + Math.random() : options.id,
  //     opacity: options.opacity === undefined ? 1 : options.opacity,
  //     visible: options.visible === undefined ? true : options.visible,
  //     source: new WMTS({
  //       ...options,
  //       wrapX: true,
  //       projection: projection,
  //       tileGrid: new WMTSTileGrid({
  //         origin: getTopLeft(projectionExtent),
  //         resolutions,
  //         matrixIds,
  //       }),
  //     }),
  //   })
  // }
  /**
   * params 传入
   * localParams 本地
   */
  getCustomTileGrid(params, localParams) {
    return {
      resolutions: params.resolutions || localParams.resolutions,
      origin: params.origin || localParams.origin,
      matrixIds: params.matrixIds || localParams.matrixIds,
    };
  }

  // GoogleMaps Compatible
  // params {layer,matrixSet,?matrixSetPrefix}
  getWmtsByPrj({ prj, options }) {
    console.log("wmts===", options);
    const projection = getProjection(V_MAP_GLOBAL[prj].prj);
    const projectionExtent = projection.getExtent();
    const { resolutions, matrixIds } = V_MAP_GLOBAL[prj];
    const { url, params = {} } = options;
    const matrixIdsWMTS = [];
    matrixIds.forEach((element) => {
      if (params.matrixSetPrefix) {
        matrixIdsWMTS.push(`${params.matrixSetPrefix}${element}`);
      } else {
        matrixIdsWMTS.push(`${element}`);
      }
    });
    if (!params.hasOwnProperty("matrixSet")) {
      params["matrixSet"] = params.tilematrixset;
    }
    return new TileLayer({
      source: new WMTS({
        url,
        format: "image/png",
        style: "",
        ...params,
        wrapX: true,
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: options.origin || getTopLeft(projectionExtent),
          resolutions : options.resolutions || resolutions,
          matrixIds: matrixIdsWMTS,
        }),
      }),
    });
  }

  /**
   * xml
   * @param {*} param0
   * @returns
   */
  getWmtsByCapabilities(options) {
    const { params } = options;
    const parser = new WMTSCapabilities();
    const result = parser.read(params.xml);
    const _options = optionsFromCapabilities(result, {
      // 参数无效？？
      // requestEncoding:
      //   'https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100/China4326/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
      layer: params.layer,
      matrixSet: params.matrixSet,
      // ...params
    });
    if (params.urlTemplate) {
      _options.urls = [params.urlTemplate];
    }
    return new TileLayer({
      source: new WMTS(_options),
    });
  }

  getWmtsGeoserver({ prj = "EPSG:4326", options }) {
    const projection = getProjection(V_MAP_GLOBAL[prj].prj);
    const projectionExtent = projection.getExtent();
    const { resolutions, matrixIds } = V_MAP_GLOBAL[prj];
    const matrixIdsWMTS = this.getMatrixIds(matrixIds, prj);
    // 切片策略
    const tilegrid = new WMTSTileGrid({
      extent: [-180.0, -90.0, 180.0, 90.0], // 范围
      tileSize: [256, 256],
      origin: [-180.0, 90.0], // 切片原点
      resolutions: resolutions, // 分辨率
      matrixIds: matrixIdsWMTS, // 层级标识列表，与地图级数保持一致
    });

    const { params } = options;
    if (!params.hasOwnProperty("matrixSet")) {
      params["matrixSet"] = params.tilematrixset;
    }
    const tileSource = new WMTS({
      url: options.url.split("?")[0],
      projection: projection,
      tileGrid: tilegrid,
      format: "image/png",
      ...CustomUtils.parasUrlParams2Obj(options.url),
      ...params,
    });
    return new TileLayer({
      id: options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: tileSource,
      wrapX: false,
    });
  }

  getXYZ(options) {
    const { url } = options;
    return new TileLayer({
      source: new XYZ({
        url,
      }),
    });
  }

  getXYZByPrj({ prj, options = {} }) {
    const { url } = options;
    return new TileLayer({
      source: new XYZ({
        url,
        projection: prj,
      }),
    });
  }

  getTdtByPrj({ prj, options }) {
    return this.getXYZByPrj({
      prj,
      options,
    });
  }

  getTmsLayer(options) {
    return new TileLayer({
      id: options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        tileUrlFunction: function (tileCoord) {
          let z = tileCoord[0];
          let x = tileCoord[1];
          let y = -tileCoord[2] - 1;
          return `${options.url}/${z}/${y}/${x}.png`;
        },
      }),
    });
  }

  getWmsImage(options) {
    return new ImageLayer({
      source: new ImageWMS({
        url: options.url,
        params: { ...options.params },
      }),
      // source:new ImageWMS({
      //   url: 'https://ahocevar.com/geoserver/wms',
      //   params: {'LAYERS': 'topp:states'},
      //   ratio: 1,
      //   serverType: 'geoserver',
      // })
    });
  }

  getWmsImageTile(options) {
    return new TileLayer({
      source: new TileWMS({
        url: options.url,
        params: { ...options.params },
      }),
    });
  }

  getArcgisImage(options) {
    return new ImageLayer({
      source: new ImageArcGISRest({
        url: options.url,
        ratio: 1,
        params: { ...options.param },
      }),
    });
  }

  getArcgisImageTile(options) {
    return new TileLayer({
      source: new TileArcGISRest({
        url: options.url,
        params: { ...options.param },
      }),
    });
  }

  getUserDefinedXYZ(options) {
    const lyr = new TileLayer({
      id: options.id || uuidOnlyStr(),
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        url: options.url,
        projection: options.prj === undefined ? "EPSG:3857" : options.prj,
        // tileGrid: new WMTSTileGrid({
        //     origin: getTopLeft(projectionExtent),
        //     resolutions: resolutions,
        //     matrixIds: matrixIds
        // }),
        // maxZoom: options.maxZoom,
        // projection: 'EPSG:3857',
        // tileUrlFunction: function(tileCoord) {
        //     const z = tileCoord[0]
        //     const x = tileCoord[1]
        //     const y = -tileCoord[2] - 1
        //     return `${options.urlTemplate}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
        // }
      }),
    });
    return lyr;
  }

  getGeojsonLayer({ id, visible = true, geojson }) {
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    });

    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
    });

    return vectorLayer;
  }

  getWktLayer({ id, visible = true, wkt }) {
    const source = new VectorSource({
      features: new WKT().readFeatures(wkt),
    });

    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
    });

    return vectorLayer;
  }

  getGaodeLayer(options) {
    return this.getXYZ({
      ...options,
      url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    });
  }

  // type 0 行政图 1 影像图 2 标注图
  getUrl(type = 0, x, y, z) {
    let url = "";
    switch (type) {
      case 0:
        url =
          "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
          x +
          "&y=" +
          y +
          "&z=" +
          z +
          "&styles=pl&udt=20200519&scaler=1&p=1";
        break;
      case 1:
        url =
          "http://shangetu" +
          parseInt(Math.random() * 10) +
          ".http://map.bdimg.com/it/u=x=" +
          x +
          ";y=" +
          y +
          ";z=" +
          z +
          ";v=009;type=sate&fm=46&udt=20170606";
        url =
          "https://maponline2.bdimg.com/starpic/?qt=satepc&u=x=" +
          x +
          ";y=" +
          y +
          ";z=" +
          z +
          ";v=009;type=sate&fm=46&app=webearth2&v=009&udt=20200519";
        break;
      case 2:
        url =
          "http://online" +
          parseInt(Math.random() * 10) +
          ".http://map.bdimg.com/onlinelabel/?qt=tile&x=" +
          x +
          "&y=" +
          y +
          "&z=" +
          z +
          "&styles=sl&udt=20200519&scaler=1&p=1";
        break;
      default:
        break;
    }
    return url;
  }

  getBaiduLayer(options) {
    // console.log('baidu', options)
    return getBaiduLayer();
  }

  getGeojsonLayerWithRender(options) {
    let { id, visible, geojson, field, labelField } = options;
    //
    const source = new VectorSource({
      features: KFeatureLoader.getFeaturesFromGeojson(geojson, {
        field,
        labelField,
      }),
    });

    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
      style: function (feature) {
        // console.log(feature)
      },
    });

    return vectorLayer;
  }

  getHeatMapLayer(geojson, options) {
    let { field, blur, radius } = options;
    let source = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    });
    const vector = new HeatmapLayer({
      source,
      blur: blur || 10,
      radius: radius || 10,
      weight: function (feature) {
        //
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        const value = feature.get(field);
        return value;
      },
    });
    return vector;
  }

  // getClusterLayerFromWktArray(list, options = {}) {
  //   let {
  //     id,
  //     visible,
  //     distance,
  //     minDistance,
  //     style = {
  //       circle: { radius: 10, color: '#3399CC' },
  //       text: { color: '#fff' },
  //     },
  //   } = options

  //   const features = []
  //   list.forEach((element) => {
  //     const feature = new WKT().readFeature(element.geom)
  //     if (element.id) {
  //       feature.setId(element.id)
  //     }
  //     features.push(feature)
  //   })

  //   const source = new VectorSource({
  //     features,
  //   })

  //   const clusterSource = new Cluster({
  //     distance: distance || 20,
  //     minDistance: minDistance || 0,
  //     source: source,
  //   })

  //   const styleCache = {}
  //   const clusters = new VectorLayer({
  //     id,
  //     visible,
  //     source: clusterSource,
  //     style: function (feature) {
  //       const size = feature.get('features').length
  //       let _style = styleCache[size]
  //       if (!_style) {
  //         _style = new Style({
  //           image: new CircleStyle({
  //             radius: 10,
  //             stroke: new Stroke({
  //               color: '#fff',
  //             }),
  //             fill: new Fill({
  //               color: '#3399CC',
  //             }),
  //           }),
  //           text: new Text({
  //             text: size.toString(),
  //             fill: new Fill({
  //               color: '#fff',
  //             }),
  //           }),
  //         })
  //         styleCache[size] = _style
  //       }
  //       return _style
  //     },
  //   })
  //   return clusters
  // }

  getClusterLayer(
    data,
    {
      id = uuid(),
      visible = true,
      distance = 20,
      minDistance = 0,
      style = {},
      zIndex,
      geomField = "wktstr",
      showLabel = true,
    } = {}
  ) {
    let isGeojson = false;
    if (data instanceof Array) {
      isGeojson = false;
    } else {
      isGeojson = true;
    }
    if (Object.keys(style).length === 0) {
      style = {
        circle: { radius: 16, color: "#3399CC" },
        text: { color: "#fff", offsetX: 0, offsetY: 0 },
      };
    }
    if (showLabel) {
      if (!style.text) {
        style["text"] = {};
      }
      style.text["textFormatter"] = (feature, resolution) => {
        if (feature.get("features").length === 1) {
          // console.log(feature.get('features')[0].getProperties())
          return (
            feature.get("features")[0].getProperties()[style.text.field] || ""
          );
        }
        return feature.get("features").length.toString();
      };
    }
    let source = null;
    if (isGeojson) {
      source = new VectorSource({
        features: KFeatureLoader.getFeaturesFromGeojson(data),
      });
    } else {
      const features = [];
      data.forEach((element) => {
        const feature = new WKT().readFeature(element[geomField]);
        const cloneElement = VcUtils.deepClone(element);
        delete cloneElement[geomField];
        if (element.id) {
          feature.setId(element.id);
        }
        feature.setProperties(cloneElement);
        features.push(feature);
      });
      source = new VectorSource({
        features,
      });
    }

    this.trasnformPrj(source.getFeatures());

    const clusterSource = new Cluster({
      distance,
      minDistance,
      source,
    });

    const clusters = new VectorLayer({
      id,
      visible,
      source: clusterSource,
      style: getStyle(style),
      zIndex,
    });
    return clusters;
  }

  getOverlayLayer(
    container,
    {
      autoPan = true,
      className = "vmap-overlay-" + uuidOnlyStr(),
      positioning = "center-right",
    } = {}
  ) {
    const overlay = new Overlay({
      element: container,
      // autoPan: {
      //   animation: {
      //     duration: 250,
      //   },
      // },
      autoPan,
      className,
      positioning,
    });

    return overlay;
  }

  getVectorLayer(
    {
      id = this.defaultVectorLayerId + uuidOnlyStr(),
      style = this.defaultStyle,
    } = {
      id: this.defaultVectorLayerId + uuidOnlyStr(),
      style: this.defaultStyle,
    }
  ) {
    const source = new VectorSource({
      wrapX: false,
    });
    return new VectorLayer({
      id,
      source,
      style,
    });
  }

  /**
   * ring
   * @param {*} param0
   * @returns ring layer
   */
  createRingLayer({ map, center, outerR, innerR }) {
    const feature = new Feature({
      geometry: createRing(map, center, outerR, innerR),
    });
    const layer = this.getVectorLayer();
    layer.getSource().addFeature(feature);
    return layer;
  }

  /**
   * 创建点
   * @param {*} param0 layerId,features,zIndex,style,map,clear
   * @returns layer
   */
  createPoints(options) {
    return this.createCustomLayer({ ...options, multiple: false });
  }

  /**
   * 创建线
   * @param {*} param0 layerId,features,zIndex,style,map,clear
   * @returns layer
   */
  createLines(options) {
    return this.createCustomLayer({ ...options, multiple: false });
  }

  /**
   * 创建多线
   * @param {*} param0 layerId,lines,zIndex,style,map,clear
   * @returns layer
   */
  createMultiLines(options) {
    return this.createCustomLayer({ ...options, multiple: true });
  }

  createPolygons(options) {
    return this.createCustomLayer({ ...options, multiple: false });
  }

  createMultiPolygons(options) {
    return this.createCustomLayer({ ...options, multiple: true });
  }

  isObjectOrArray(data) {
    if (typeof data === "object") {
      return true;
    }
    return false;
  }
  /**
   * 创建自定义图层
   * @param {Object} param0 {}
   * @returns layer
   */
  createCustomLayer({
    layerId = VcUtils.UUIDGenerator(),
    features,
    style = {
      circle: {},
      icon: {},
      stroke: {},
      fill: {},
      text: {},
    },
    visible = true,
    opacity = 1,
    zIndex = 100,
    map = this.map,
    clear = false,
    multiple = true,
    cluster = false,
    geomField = "wktstr",
    zoomToLayer = false,
  } = {}) {
    function isValidWKT(wkt) {
      try {
        const geoJSON = wktToGeoJSON(wkt);
        return !!geoJSON; // 如果解析成功则合法
      } catch (e) {
        console.warn("<v-openlayers>unvalid wkt=", wkt);
        return false;
      }
    }
    // debugger
    const isText =
      style.hasOwnProperty("text") && style.text.hasOwnProperty("field");
    const styleClone = getStyle(style);
    let _style = null;
    const _features = [];
    if (Array.isArray(features)) {
      // if (!features[0].hasOwnProperty(geomField)) {
      //   console.warn(`缺少${geomField}字段`)
      //   return
      // }
      features.forEach((feature, index) => {
        if (feature[geomField] && isValidWKT(feature[geomField])) {
          const { id = VcUtils.UUIDGenerator() } = feature;
          const wktstr = feature[geomField];
          if (feature.style) {
            _style = getStyle(feature.style);
          } else {
            _style = styleClone;
          }
          if (multiple) {
            const fs = new WKT().readFeatures(wktstr);
            const copyFeature = VcUtils.deepClone(feature);
            // object不能setProperties
            Object.keys(copyFeature).forEach((key) => {
              if (typeof copyFeature[key] === "object") {
                delete copyFeature[key];
              }
            });
            delete copyFeature[geomField];
            fs.forEach((f) => {
              f.setProperties(copyFeature);
              f.setStyle(_style);
              _features.push(f);
            });
          } else {
            const f = new WKT().readFeature(wktstr);
            const copyFeature = VcUtils.deepClone(feature);
            // object不能setProperties
            Object.keys(copyFeature).forEach((key) => {
              if (typeof copyFeature[key] === "object") {
                delete copyFeature[key];
              }
            });
            delete copyFeature[geomField];
            if (id) {
              f.setId(id);
            }
            f.setProperties(copyFeature);
            if (!isText) {
              f.setStyle(_style);
            }
            _features.push(f);
          }
        }
      });
    } else {
      _style = styleClone;
      if (multiple) {
        const fs = new GeoJSON().readFeatures(features);
        fs.forEach((f) => {
          f.setStyle(_style);
          _features.push(f);
        });
      } else {
        const f = new GeoJSON().readFeature(features);
        if (!isText) {
          f.setStyle(_style);
        }
        _features.push(f);
      }
    }

    let layer = this.getLayerById(layerId, map);
    if (layer && clear) {
      layer.getSource().clear();
    }
    this.trasnformPrj(_features);
    if (layer == null) {
      const params = {
        id: layerId,
      };
      if (isText) {
        params["style"] = _style;
      }
      layer = this.getVectorLayer(params);
      layer.getSource().addFeatures(_features);
      layer.setVisible(visible);
      layer.setZIndex(zIndex);
      layer.setOpacity(opacity);
      map.addLayer(layer);
    } else {
      layer.getSource().addFeatures(_features);
    }
    // layer &&
    //   zoomToLayer &&
    //   map.getView().fit(layer.getSource().getExtent(), { duration: 1000 })
    return layer;
  }

  removeLayerById(id, map = this.map, strict = true) {
    if (map && id) {
      let layers = map.getLayers().getArray();
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index];
        const layerId = layer.getProperties().id;
        if (!strict && layerId && layerId.indexOf(id) !== -1) {
          map.removeLayer(layer);
        } else if (layerId === id) {
          map.removeLayer(layer);
        }
      }
    }
  }

  getLayerById(id, map) {
    if (map) {
      let layers = map.getLayers().getArray();
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index];
        if (layer) {
          const layerId = layer.getProperties().id;
          if (layerId && layerId === id) {
            return layer;
          }
        }
      }
    }
    return null;
  }

  setLayerVisibleById(id, visible, map = this.map) {
    if (map && id) {
      let layers = map.getLayers().getArray();
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        const layerId = layer.getProperties().id;
        if (layerId && layerId === id) {
          layer.setVisible(visible);
          // layer.setOpacity(opacity)
        }
      }
    }
  }

  checkLayerIsExist(map, id) {
    if (map && id) {
      const layers = map.getLayers().getArray();
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        const layerId = layer.getProperties().id;
        if (layerId && layerId === id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  removeAllLayer(map) {
    if (map) {
      let layers = map.getLayers().getArray();
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index];
        if (layer) {
          const layerId = layer.getProperties().id;
          if (layerId) {
            map.removeLayer(layer);
          }
        }
      }
    }
  }

  /**
   * 坐标系转换
   * @param {*} features
   */
  trasnformPrj(features) {
    if (!this.prj.includes("4326")) {
      features.forEach((f) => {
        f.getGeometry().transform("EPSG:4326", this.prj);
      });
    }
  }

  getMvtOfficial(options) {
    const key =
      "pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2t0cGdwMHVnMGdlbzMxbDhwazBic2xrNSJ9.WbcTL9uj8JPAsnT9mgb7oQ";
    const resolutions = [];
    for (let i = 0; i <= 8; ++i) {
      resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
    }

    function tileUrlFunction(tileCoord) {
      return (
        // 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
        (
          "http://localhost/mapbox/map/{a-d}/v4/mapbox.mapbox-streets-v6/" +
          "{z}/{x}/{y}.vector.pbf?access_token=" +
          key
        )
          .replace("{z}", String(tileCoord[0] * 2 - 1))
          .replace("{x}", String(tileCoord[1]))
          .replace("{y}", String(tileCoord[2]))
          .replace(
            "{a-d}",
            "abcd".substr(
              ((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4,
              1
            )
          )
      );
    }

    return new VectorTileLayer({
      source: new VectorTileSource({
        attributions: "",
        format: new MVT(),
        tileGrid: new TileGrid({
          extent: getProjection("EPSG:3857").getExtent(),
          resolutions: resolutions,
          tileSize: 512,
        }),
        tileUrlFunction: tileUrlFunction,
      }),
      style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),
    });
  }

  // getMvt() {
  //   function tileUrlFunction(tileCoord) {
  //     return (
  //       // 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3AChina_3857_vt@EPSG%3A3857@pbf/' +
  //       'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3AChina_vt@EPSG%3A4326@pbf/' +
  //       (tileCoord[0] - 1) +
  //       '/' +
  //       tileCoord[1] +
  //       '/' +
  //       (Math.pow(2, tileCoord[0] - 1) + tileCoord[2]) +
  //       '.pbf'
  //     )
  //   }
  //   return new VectorTileLayer({
  //     // source: new VectorTileSource({
  //     //   format: new MVT(),
  //     //   tileGrid: createXYZ({
  //     //     extent: getProjection('EPSG:3857').getExtent(),
  //     //     maxZoom: 22,
  //     //     minZoom: 0,
  //     //   }),
  //     //   tilePixelRatio: 1,
  //     source: new VectorTileSource({
  //       format: new MVT(),
  //       tileGrid: createXYZ({
  //         extent: getProjection('EPSG:4326').getExtent(),
  //         maxZoom: 22,
  //       }),
  //       tilePixelRatio: 1,
  //       // 矢量切片服务地址
  //       tileUrlFunction: tileUrlFunction,
  //     }),
  //     //对矢量切片数据应用的样式
  //     style: new Style({
  //       stroke: new Stroke({
  //         color: 'rgb(255,165,0)',
  //         width: 3,
  //       }),
  //     }),
  //   })
  // }

  // getMvt(options) {
  //   // let projection4326 = new Projection({
  //   //   code: 'EPSG:4326',
  //   //   units: 'degrees',
  //   //   axisOrientation: 'neu',
  //   // })

  //   const projection4326 = getProjection('EPSG:4326')

  //   return new VectorTileLayer({
  //     style: new Style({
  //       stroke: new Stroke({
  //         color: 'rgb(255,165,0)',
  //         width: 3,
  //       }),
  //     }),
  //     projection: projection4326,
  //     source: new VectorTileSource({
  //       projection: projection4326,
  //       tilePixelRatio: 1,
  //       format: new MVT(),
  //       tileGrid: createXYZ({
  //         extent: projection4326.getExtent(),
  //         maxZoom: 21,
  //       }),
  //       tileUrlFunction: function (tileCoord) {
  //         return (
  //           'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3AChina_vt@EPSG%3A4326@pbf/' +
  //           // layerName +
  //           // '@EPSG%3A4326@pbf/' +
  //           (tileCoord[0] - 1) +
  //           '/' +
  //           tileCoord[1] +
  //           '/' +
  //           (Math.pow(2, tileCoord[0] - 1) + tileCoord[2]) +
  //           '.pbf'
  //         )
  //       },
  //     }),
  //   })
  // }

  // getMvt({ prj = 'EPSG:3857', options }) {
  //   if (prj.includes(3857)) {
  //     return this.getMvtMercator(options)
  //   } else if (prj.includes('4326')) {
  //     return this.getMvtGeography(options)
  //   } else {
  //     return null
  //   }
  // }

  getMatrixIds(matrixIds, prj) {
    const m = [];
    matrixIds.forEach((element) => {
      m.push(`${prj}:${element}`);
    });
    return m;
  }

  getMvt({ prj = "EPSG:3857", options }) {
    let gridsetName = prj;
    const projection = getProjection(gridsetName);
    const { resolutions, matrixIds, tileGrid } = V_MAP_GLOBAL[gridsetName];
    const matrixIdsWMTS = this.getMatrixIds(matrixIds, gridsetName);
    const {
      id,
      url: baseUrl,
      visible,
      opacity,
      zIndex,
      maxZoom,
      minZoom,
      layerStyle: style = {},
    } = options;
    // const { layerStyle: style = {} } = options
    let format = "application/vnd.mapbox-vector-tile";
    const params = {
      REQUEST: "GetTile",
      SERVICE: "WMTS",
      VERSION: "1.0.0",
      LAYER: options.params.layer,
      STYLE: "",
      TILEMATRIX: gridsetName + ":{z}",
      TILEMATRIXSET: gridsetName,
      FORMAT: format,
      TILECOL: "{x}",
      TILEROW: "{y}",
    };
    function constructSource() {
      let url = baseUrl + "?";
      for (let param in params) {
        url = url + param + "=" + params[param] + "&";
      }
      url = url.slice(0, -1);

      let source = new VectorTileSource({
        url: url,
        format: new MVT({}),
        projection: projection,
        tileGrid: new WMTSTileGrid({
          tileSize: [256, 256],
          origin: options.params.origin || tileGrid.origin,
          resolutions: options.params.resolutions || resolutions,
          matrixIds: matrixIdsWMTS,
        }),
        wrapX: true,
      });
      return source;
    }
    let layer = new VectorTileLayer({
      id,
      visible,
      opacity,
      source: constructSource(),
      zIndex,
      maxZoom,
      minZoom,
      style: isFunction(style)
        ? style
        : JSON.stringify(style) === "{}"
        ? undefined
        : getStyle(style),
    });
    return layer;
  }

  getMvtGeography(options) {
    var gridsetName = "EPSG:4326";
    const projection = getProjection(gridsetName);
    const { resolutions, matrixIds } = V_MAP_GLOBAL[gridsetName];
    const matrixIdsWMTS = this.getMatrixIds(matrixIds, gridsetName);
    const { id, url: baseUrl, visible, opacity } = options;
    const { layer: layerName, style = {} } = options.params;
    var format = "application/vnd.mapbox-vector-tile";
    const params = {
      REQUEST: "GetTile",
      SERVICE: "WMTS",
      VERSION: "1.0.0",
      LAYER: layerName,
      STYLE: "",
      TILEMATRIX: gridsetName + ":{z}",
      TILEMATRIXSET: gridsetName,
      FORMAT: format,
      TILECOL: "{x}",
      TILEROW: "{y}",
    };

    const randomColor = () => {
      let r, g, b;
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
      return `rgba(${r},${g},${b},1)`;
    };

    const getStyle = (feature, resolution) => {
      const value = feature.get("FID");
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: randomColor(),
          width: 2,
        }),
      });
    };

    function constructSource() {
      var url = baseUrl + "?";
      for (var param in params) {
        url = url + param + "=" + params[param] + "&";
      }
      url = url.slice(0, -1);

      var source = new VectorTileSource({
        url: url,
        format: new MVT({}),
        projection: projection,
        tileGrid: new WMTSTileGrid({
          tileSize: [256, 256],
          origin: [-180.0, 90.0],
          resolutions: resolutions,
          matrixIds: matrixIdsWMTS,
        }),
        wrapX: true,
      });
      return source;
    }

    return new VectorTileLayer({
      id,
      visible,
      opacity,
      source: constructSource(),
      // style: getStyle,
    });
  }

  getMapboxVt(options = {}) {
    const {
      id,
      url,
      visible = true,
      opacity = 1,
      zIndex = undefined,
      layerStyle: style,
    } = options;
    return new VectorTileLayer({
      id,
      visible,
      opacity,
      zIndex,
      // declutter: true,
      source: new VectorTileSource({
        format: new MVT(),
        url,
        // url:"http://localhost/geoserverLocal/gwc/service/tms/1.0.0/kjr%3Acountries@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf"
      }),
      style: isFunction(style)
        ? style
        : JSON.stringify(style) === "{}"
        ? undefined
        : getStyle(style),
    });
  }

  // getMapboxStyle(options = {}, map) {
  //   // debugger;
  //   // const {
  //   //   url = "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-pdc_wadi_spa_shuiwang/restjsr/v1/vectortile/maps/pdc_wadi_spa_shuiwang/tiles/{z}/{x}/{y}.mvt?returnAttributes=true",
  //   //   style = "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-pdc_wadi_spa_shuiwang/restjsr/v1/vectortile/maps/pdc_wadi_spa_shuiwang/style.json",
  //   // } = options;
  //   // // 创建矢量瓦片图层
  //   // const vectorTileLayer = new VectorTileLayer({
  //   //   source: new VectorTileSource({
  //   //     format: "MVT", // 格式为Mapbox Vector Tile
  //   //     url, // 替换为超图服务URL
  //   //     projection: "EPSG:4490",
  //   //   }),
  //   //   renderMode: "vector", // 确保矢量渲染
  //   // });

  //   // // 动态坐标转换（关键）
  //   // // vectorTileLayer.setRenderBuffer((extent, resolution, pixelRatio) => {
  //   // //   const transformedExtent = transform(extent, 'EPSG:4490', 'EPSG:4326');
  //   // //   return [transformedExtent, resolution * 2];
  //   // // });

  //   // // 动态坐标转换
  //   // vectorTileLayer.on("postrender", (e) => {
  //   //   const ctx = e.context;
  //   //   ctx.transform(
  //   //     ctx.matrix[0],
  //   //     ctx.matrix[1],
  //   //     ctx.matrix[2],
  //   //     ctx.matrix[3],
  //   //     ctx.matrix[4],
  //   //     ctx.matrix[5]
  //   //   );
  //   // });

  //   // // 应用style.json样式
  //   // applyStyle(vectorTileLayer, style, "")
  //   //   .then(() => {
  //   //     map.addLayer(vectorTileLayer);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error applying style:", error);
  //   //   });
  // }

  // getSuperMapVt(map) {
  // //   // const format = new ol.format.MVT();
  // //   debugger;
  // //   // const a = olms.applyBackground()
  // //   const url =
  // //     "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-pdc_wadi_spa_shuiwang/restjsr/v1/vectortile/maps/pdc_wadi_spa_shuiwang/tiles/{z}/{x}/{y}.mvt?returnAttributes=true";
  // //   const styleUrl =
  // //     "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-pdc_wadi_spa_shuiwang/restjsr/v1/vectortile/maps/pdc_wadi_spa_shuiwang/style.json";
  // //   const style = new MapboxStyles({
  // //     style: styleUrl,
  // //     map: map,
  // //   });

  // //   // olms.applyBackground()

  // //   console.log("style===", style);

  // //   const source = new VectorTileSuperMapRest({
  // //     style: styleUrl,
  // //     projection: "EPSG:4326",
  // //     format: new MVT(),
  // //   });

  // //   style.on("styleloaded", () => {
  // //     const vectorLayer = new VectorTileLayer({
  // //       zIndex: index,
  // //       declutter: true,
  // //       layerId: "fsda_spa",
  // //       source: source,
  // //       style: style.getStyleFunction(),
  // //     });
  // //     map.addLayer(vectorLayer);
  // //     vectorLayer.setStyle(style.getStyleFunction());
  // //   });
  // }

  getSupermapUrl({ url, requestParams }) {
    const _requestParams = {
      request: "gettile",
      version: "1.0.0",
      service: "wmts",
      format: "image/png",
      style: "default",
      ...requestParams,
    };
    if (Object.keys(requestParams).length === 0) {
      return url;
    } else {
      let p = [];
      for (const key in _requestParams) {
        if (Object.hasOwnProperty.call(_requestParams, key)) {
          const element = _requestParams[key];
          p.push(`${key}=${element}`);
        }
      }
      return url.split("?")[0] + "?" + p.join("&");
    }
  }

  // supermap wmts
  getSuperMapWmts({ prj, options }) {
    const projection = getProjection(V_MAP_GLOBAL[prj].prj);
    const projectionExtent = projection.getExtent();
    const { resolutions, matrixIds, origin } = V_MAP_GLOBAL[prj];
    const url = this.getSupermapUrl(options);

    const tileGrid = new WMTSTileGrid({
      origin: options.origin || origin || getTopLeft(projectionExtent),
      resolutions: options.resolutions || resolutions,
      matrixIds: options.matrixIds || matrixIds,
    });

    const layer = new TileLayer({
      source: new XYZ({
        tileGrid,
        projection: prj,
        tileUrlFunction: function (tileCoord) {
          const z = tileCoord[0];
          const x = tileCoord[1];
          const y = tileCoord[2];
          // let z = tileCoord[0]
          // let x = tileCoord[1]
          // let y = -tileCoord[2] - 1

          // return options.url + `&layer=w&request=gettile&tilesize=512&tilematrixset=w&tilematrix=${z}&tilerow=${y}&tilecol=${x}`
          // if (false && options.url.includes('?')) {
          //   console.log(
          //     `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
          //   )
          //   return `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
          // } else {
          //   let url___ = `${
          //     options.url
          //   }/${z}/${-y}/${x}.png?k=HzxwyaaeOc7z1KRENNqH0A==`
          //   console.log(url___)
          //   return url___
          // }
          return `${url}&request=gettile&tilecol=${x}&tilerow=${y}&tilematrix=${z}`;
        },
      }),
    });
    return layer;
  }

  // supermap rest
  getSuperMapRest({ prj, options }) {
    // layersID
    var layer = new TileLayer({
      source: new ol.source.TileSuperMapRest({
        url: options.url,
        wrapX: false,
        crossOrigin: "anonymous",
        ...options.requestParams,
      }),
      projection: prj,
    });
    return layer;
  }

  getSuperMapXYZ({ prj, options }) {
    const projection = getProjection(V_MAP_GLOBAL[prj].prj);
    const projectionExtent = projection.getExtent();
    const { resolutions, matrixIds } = V_MAP_GLOBAL[prj];

    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions,
      matrixIds,
    });

    const { url } = options;
    const layer = new TileLayer({
      id: options.id === undefined ? "id_" + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        tileGrid,
        projection: prj,
        tileUrlFunction: function (tileCoord) {
          let z = tileCoord[0];
          let x = tileCoord[1];
          let y = -tileCoord[2] - 1;
          return `${url}/${z}/${y}/${x}.png?k=HzxwyaaeOc7z1KRENNqH0A==`;
        },
      }),
    });
    return layer;
  }
  // supermap style
  getSuperMapStyle({ prj = "EPSG:4326", options = {} }) {
    const { map } = this;
    const { url: styleUrl, styleloaded } = options;
    const format = new ol.format.MVT();
    const style = new ol.supermap.MapboxStyles({
      style: styleUrl,
      map,
      // selectedStyle: highlightStyle,
    });
    const source = new ol.source.VectorTileSuperMapRest({
      style: styleUrl,
      projection: prj,
      format: format,
    });
    const vectorLayer = new ol.layer.VectorTile({
      declutter: true,
      source: source,
      // style: style.getStyleFunction(),
    });
    vectorLayer.set("styleHandler", style);
    style.on("styleloaded", () => {
      vectorLayer.setStyle(style.getStyleFunction());
      styleloaded && styleloaded(style);
    });
    return vectorLayer;
    // map.addLayer(vectorLayer);
    // style.on("styleloaded", () => {
    //   vectorLayer.setStyle(style.getStyleFunction());
    //   vectorLayer.set("mbStyle", style);
    //   console.log("style===", style, style._mbStyle.layers);
    // });
  }
}
