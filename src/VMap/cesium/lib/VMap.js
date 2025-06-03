/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-05-10 16:37:44
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-23 16:21:01
 */

// import * as Cesium from 'cesium';
// Cesium.Ion.defaultAccessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGE5ZWRlNy05ODlmLTQ1ZDQtOTNhMi04NTdmMTg2MGI3ZjciLCJpZCI6MzMyMTEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTgyNTMxMTF9.RE0D2QWqhu6tQftdxaFtKiTQ1u7AcB1kgncx7Tdxa78'

// import x2js from 'x2js'
// import axios from 'axios'
// import { default as proj4 } from 'proj4'

// // kjr
// import MvtImageryProvider from '../third/mvt/MvtImageryProvider'
// import CustomMvtStyle from '../third/mvt/CustomMvtStyle.js'
// //

// import DLTBMvtStyle from "@/third/mvt/DLTBMvtStyle.js";
// import {
//     getSingleLayerFromWMTS,
//     getSingleLayerFromWMS
// } from '@/utils/utils-ogc'

// import { getToken } from '@/utils/auth'
// import {
//     getEnvelop
// } from '../../utils/map/utils-map'

import { getConfig } from '../config'
import { V_MAP_PROVIDER, getTdtUrlForCesium } from '../../global'

import * as LayerHandler from './plugins/LayerHandler'
import * as CustomDataSource from './plugins/CustomData'
// import jsonObject from '../v3/assets/json/features.json'

// import {
//   getBoundsByRegionCode
// } from '@/api/map'

class VMap {
  constructor(contaninerId = 'cesium-view-id') {
    // 容器id
    this.contaninerId = contaninerId
    this.viewer = null
    // 初始地图范围
    this.viewExtent = {
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-89.74026687972041),
        roll: Cesium.Math.toRadians(0),
      },
      complete: function callback() {},
    }

    // 地图事件
    // 单击事件
    this.event_mouse_click = null
    // 移动事件
    this.event_mouse_move = null

    // 集合
    this.imageryLayerCollection = {} // 图层集
    this.imageryLayerCollectionBase = {} // 底图集
    this.cesium3DTilesetCollection = {} // 模型集合
    this.entitiesCollection = {} //实体集合
    this.dataSourceCollection = {} //数据源集合

    this.imageryLayerInfoCollection = {}

    // this.init()
  }

  init() {
    // 新增坐标系
    this.addCrs()
    // $.ajaxSetup({
    //   headers: {
    //     Authorization: getToken(),
    //   },
    // })
  }

  /**
   * 设置地图视野
   * @param {*} extentObj
   */
  setViewExtent(extentObj) {
    const { lon, lat, height, heading, pitch, roll } = extentObj
    this.viewExtent = {
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: Cesium.Math.toRadians(roll),
      },
      complete: function callback() {},
    }
  }

  /**
   * 获取地图范围
   * @returns 范围
   */
  getViewExtent() {
    return this.viewExtent
  }

  setSkyBox() {}

  /**** map start */
  /**
   * 初始化地图
   * @returns viewer
   */
  initMap(target) {
    const viewer = new Cesium.Viewer(target, {
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fulllscreenButtond: false,
      vrButton: false,
      infoBox: false,
      // imageryProvider: new Cesium.WebMapTileServiceImageryProvider(
      //   getConfig()[baseLayerId]
      // ),
      // terrainProvider: Cesium.createWorldTerrain(),
      selectionIndicator: false,
      shadows: false,
      shouldAnimate: true,
    })
    this.viewer = viewer
    // 将三维球定位到中国
    viewer.camera.flyTo(this.viewExtent)
    this.initEvent()
    return new Promise((resolve, reject) => {
      resolve({ viewer })
    })
    // var helper = new Cesium.EventHelper();
    // helper.add(this.viewer.scene.globe.tileLoadProgressEvent, function (e) {
    //     console.log('每次加载地图服务矢量切片都会进入这个回调', e);
    //     if (e == 0) {
    //         console.log("矢量切片加载完成时的回调");
    //         callback(Cesium, viewer)
    //     }
    // });
  }

  initMapById(domid, callback) {
    const viewer = new Cesium.Viewer(domid, {
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      navigationHelpButton: false,
      animation: false,
      timeline: true,
      fulllscreenButtond: false,
      vrButton: false,
      infoBox: false,
      // imageryProvider: new Cesium.WebMapTileServiceImageryProvider(
      //   getConfig().img_w
      // ),
      // terrainProvider: Cesium.createWorldTerrain(),
      selectionIndicator: false,
      shadows: false,
      shouldAnimate: true,
    })
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider(getConfig().cia_w)
    // )
    // 将三维球定位到中国
    viewer.camera.flyTo(this.viewExtent)
    callback(viewer)
  }
  /**** map end */

  /**** event start */
  /**
   * 初始化事件
   */
  initEvent() {
    const eventHandle = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    eventHandle.setInputAction((event) => {
      this.event_mouse_click && this.event_mouse_click(event)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    eventHandle.setInputAction((event) => {
      this.event_mouse_move && this.event_mouse_move(event)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  registerMouseClick(callBack) {
    this.event_mouse_click = callBack
  }

  releaseMouseClick() {
    this.event_mouse_click = null
  }

  registerMouseMove(callBack) {
    this.event_mouse_move = callBack
  }

  releaseMouseMove() {
    this.event_mouse_move = null
  }
  /**** event start */

  /**** layer start */

  loadLayer(layerInfo) {
    const layer = this.addLayerByType(layerInfo)
    if (layer) {
      this.imageryLayerCollection[layerInfo.id] = layer
      this.imageryLayerInfoCollection[layerInfo.id] = layerInfo
      this.updateLayerOrder()
    }
    return layer
  }

  /**
   * 加载底图 数组
   * @param {*} group
   */
  loadBaseLayer(group) {
    let imageLayer = null
    this.resetBaseLayer()
    group.forEach((l) => {
      const { id, zIndex } = l
      imageLayer = this.addLayerByType(l)
      if (imageLayer) {
        this.imageryLayerCollectionBase[id] = imageLayer
      }
    })
  }

  resetBaseLayer() {
    for (const key in this.imageryLayerCollectionBase) {
      if (Object.hasOwnProperty.call(this.imageryLayerCollectionBase, key)) {
        const element = this.imageryLayerCollectionBase[key]
        this.removeLayer(element)
        delete this.imageryLayerCollectionBase[key]
      }
    }
  }

  checkLayer(l) {
    const { id, visible = true } = l
    if (!id) {
      console.error('缺少唯一id')
      return null
    } else if (this.imageryLayerCollection[id]) {
      this.imageryLayerCollection[id].show = visible
      return this.imageryLayerCollection[id]
    } else if (this.imageryLayerCollectionBase[id]) {
      this.imageryLayerCollectionBase[id].show = visible
      return this.imageryLayerCollectionBase[id]
    } else if (!visible) {
      return true
    } else {
      return true
    }
  }

  getTdtParams(l) {
    const { prj } = getConfig()
    const { id, visible, opacity, type } = l
    return {
      type,
      url: getTdtUrlForCesium({ mapStyle: id, prj }),
      prj,
      layer: id.split('_')[1].toLowerCase(),
      visible,
      opacity,
    }
  }

  addLayerByType(layerInfo, viewer = this.viewer) {
    console.log(
      'layerinfo...',
      layerInfo
      // this.imageryLayerCollection,
      // this.imageryLayerCollectionBase
    )
    // 计算图层个数
    const layerCount =
      Object.keys(this.imageryLayerCollectionBase).length +
      Object.keys(this.imageryLayerCollection).length
    const c = this.checkLayer(layerInfo)
    if (c !== true) {
      return c
    }
    let p = null
    switch (layerInfo.type) {
      case V_MAP_PROVIDER.wmsimagetile:
        p = LayerHandler.getWmsProvider(layerInfo)
        break
      case V_MAP_PROVIDER.geoserverwmts:
        p = LayerHandler.getGeoserverWmtsProvider(layerInfo)
        break
      case V_MAP_PROVIDER.wmts:
        p = LayerHandler.getGeoserverWmtsProvider(layerInfo)
        // p = LayerHandler.getWmtsProvider(layerInfo)
        break
      case V_MAP_PROVIDER.wfs:
        // p = this.handleGeojsonLayer(layerInfo)
        p = this.handleWfs(layerInfo)
        return
        break
      case V_MAP_PROVIDER.arcgisimage:
      case V_MAP_PROVIDER.arcgisimagetile:
        p = LayerHandler.getArcgisProvider(layerInfo)
        break
      case V_MAP_PROVIDER.arcgistile:
        layerInfo['style'] = 'default'
        p = LayerHandler.getGeoserverWmtsProvider(layerInfo)
        // p = LayerHandler.getArcgisTileProvider(layerInfo)
        break
      case V_MAP_PROVIDER.supermap:
        p = LayerHandler.getSupermapProvider(layerInfo)
        break
      case V_MAP_PROVIDER['3d-tileset']:
        p = this.handleAdd3DTileset(layerInfo)
        return
        break
      case V_MAP_PROVIDER.mvt:
        p = this.handleVectorTilesLayer(layerInfo)
        return
        break
      case V_MAP_PROVIDER.tdt:
        const _info = this.getTdtParams(layerInfo)
        p = LayerHandler.getTdtProvider(_info)
      default:
        break
    }
    if (p) {
      let { id, visible = true, opacity = 1, zIndex = layerCount } = layerInfo
      // if (zIndex > layerCount) {
      //   zIndex = layerCount
      // }
      // console.log('zindex...........', zIndex)
      const layer = viewer.imageryLayers.addImageryProvider(p, zIndex)
      layer.show = visible
      layer.alpha = opacity
      return layer
    } else {
      console.warn('创建图层失败', layerInfo)
      return null
    }
  }

  updateLayerOrder() {
    const layers = Object.values(this.imageryLayerInfoCollection).sort(
      (a, b) => a.zIndex - b.zIndex
    )
    layers.forEach((l) => {
      this.viewer.imageryLayers.raiseToTop(this.imageryLayerCollection[l.id])
    })
    // return
    // for (const key in this.imageryLayerCollection) {
    //   if (Object.hasOwnProperty.call(this.imageryLayerCollection, key)) {
    //     const layer = this.imageryLayerCollection[key]
    //     const orderNum = this.viewer.imageryLayers.indexOf(layer)
    //   }
    // }
    // this.inittree.forEach((res) => {
    //   //inittree为所有图层列表
    //   if (res.ordernum) {
    //     //判断是否存在ordernum
    //     let startid = res.ordernum //遍历图层的ordernum
    //     let strid = data.ordernum //当前选中图层的ordernum
    //     if (imageryLayers.contains(window[res.id])) {
    //       //判断地图是否加载了当前遍历图层
    //       if (startid < strid) {
    //         //判断选中图层与遍历图层的ordernum，如果大于遍历图层，则选中图层上移一层
    //         imageryLayers.raise(window[serviceId])
    //       } else {
    //         //遍历完成
    //         return
    //       }
    //     }
    //   }
    // })
  }

  /**
   * 加载图层前
   * @param {*} element 图层信息 {tcid,transparency}
   * @param {*} visible 是否可见
   * @param {*} viewer viewer
   * @returns void
   */
  beforeLoadMap(element) {
    const { url, visible } = element
    const transparency = element.transparency || 100
    const layer = {
      tcid: element.tcid,
      visible: visible,
      transparency: parseFloat(transparency / 100),
    }
    element['serve'] = url
    if (
      element.type === V_MAP_PROVIDER.arcgisimage ||
      element.type === V_MAP_PROVIDER.arcgisimagetile
    ) {
      layer['type'] = V_MAP_PROVIDER.arcgisimage
      const arr = element.serve.split('/')
      const layerIndex = arr[arr.length - 1]
      if (!isNaN(layerIndex)) {
        // map image
        arr.pop()
        layer['url'] = arr.join('/')
        layer['layers'] = layerIndex
      } else {
        // map tile
        layer['url'] = element.serve
        layer['layers'] = element.layers || ''
      }
    } else if (element.type === V_MAP_PROVIDER.arcgisfeature) {
      layer['type'] = V_MAP_PROVIDER.arcgisimage
      layer['url'] = element.serve.substring(0, element.serve.lastIndexOf('/'))
      layer['layers'] = element.serve.substring(
        element.serve.lastIndexOf('/') + 1
      )
    } else if (element.type === V_MAP_PROVIDER.wmsimagetile) {
      layer['type'] = V_MAP_PROVIDER.wmsimagetile
      layer['url'] = element.serve
      if (mapTools.ogcLayerNames[element.tcid]) {
        layer['layers'] = mapTools.ogcLayerNames[element.tcid]
      } else if (!visible) {
        console.log('未加载')
        return false
      } else {
        layer['layers'] = mapTools.getNameByWMS(element.serve)
        mapTools.ogcLayerNames[element.tcid] = layer['layers']
      }
    } else if (element.type === V_MAP_PROVIDER.wmts) {
      layer['type'] = V_MAP_PROVIDER.wmts
      layer['url'] = element.serve
      if (mapTools.ogcLayerNames[element.tcid]) {
        layer['layers'] = mapTools.ogcLayerNames[element.tcid]
      } else if (!visible) {
        console.log('未加载')
        return false
      } else {
        layer['layers'] = mapTools.getNameByWMTS(element.serve)
        mapTools.ogcLayerNames[element.tcid] = layer['layers']
      }
    } else if (element.fwlxid === V_MAP_PROVIDER.wfs) {
      layer['type'] = V_MAP_PROVIDER.wfs
      layer['url'] = element.serve
      if (mapTools.ogcLayerNames[element.tcid]) {
        layer['layers'] = mapTools.ogcLayerNames[element.tcid]
      } else if (!visible) {
        console.log('未加载')
        return false
      } else {
        layer['layers'] = mapTools.getNameByWFS(element.serve)
        mapTools.ogcLayerNames[element.tcid] = layer['layers']
      }
    } else if (element.fwlxid === V_MAP_PROVIDER['3d-tileset']) {
      // 3d tiles
      layer['type'] = V_MAP_PROVIDER['3d-tileset']
      layer['url'] = element.serve
    } else if (element.fwlxid === V_MAP_PROVIDER.mvt) {
      // 矢量瓦片
      layer['type'] = V_MAP_PROVIDER.mvt
      layer['url'] = element.serve
      if (element.tilesVO == undefined || element.tilesVO == '') {
        return false
      }
      const { xmin, ymin, xmax, ymax } = element.tilesVO
      layer['extent'] = {
        xmin,
        ymin,
        xmax,
        ymax,
      }
      layer['tileInfo'] = element.tilesVO
    }
    return layer
  }

  async createVectorLayer(options) {
    debugger
    const { id, features } = options
    if (this.dataSourceCollection[id]) {
      return this.dataSourceCollection[id]
    } else {
      let dataSource = null
      if (features instanceof Array) {
        dataSource = CustomDataSource.getDataSourceByFeatures({
          ...options,
          name: id,
        })
      } else {
        dataSource = await CustomDataSource.getDataSourceByGeojson({
          ...options,
          name: id,
        })
      }
      this.dataSourceCollection[id] = dataSource
      this.viewer.dataSources.add(dataSource)
      return dataSource
    }
  }

  /**
   *
   * @param {*} mapInfo
   * tcid
   * url
   * transparency
   * clampToGround
   */
  handleWfs(mapInfo) {
    const { id, visible, opacity } = mapInfo
    LayerHandler.getWfsLayer(mapInfo, (e) => {
      e.alpha = opacity
      e.show = visible
      this.imageryLayerCollection[id] = e
    })
  }

  /**
   * geojson layer
   * @param {*} mapInfo
   * @returns
   */
  handleGeojsonLayer(mapInfo) {
    let { url_, tcid, layers, transparency } = mapInfo
    url_ =
      url_ +
      `?service=WFS&version=1.0.0&request=GetFeature&typeName=${layers}&maxFeatures=50&outputFormat=application%2Fjson&tk=1`
    const requestUrl = new Cesium.Resource({
      url: url_,
      headers: {
        Authorization: getToken(),
      },
    })
    var dataSource = Cesium.GeoJsonDataSource.load(requestUrl, {
      clampToGround: false,
    })
    this.viewer.dataSources.add(dataSource).then((e) => {
      e.alpha = transparency
      this.imageryLayerCollection[tcid] = e
    })
    return
    axios
      .get(url_)
      .then((res) => {
        if (
          res.status == 200 &&
          res.data.type &&
          res.data.type == 'FeatureCollection'
        ) {
          const obj = res.data
          const crs = obj.crs.properties.name
          if (crs.indexOf('3857') >= 0) {
            // obj.crs.properties.name = 'EPSG:3857'
          } else {
            obj.crs.properties.name = 'EPSG:4326'
          }
          // obj.crs = {
          //     "type": "name",
          //     "properties": {
          //         "name": "EPSG:4326"
          //     }
          // }
          var dataSource = Cesium.GeoJsonDataSource.load(obj, {
            clampToGround: false,
          })
          this.viewer.dataSources.add(dataSource).then((e) => {
            // var entities = e.entities.values
            // console.log(entities)
            // for (var i = 0; i < entities.length; i++) {
            //     var entity = entities[i];
            //     // var name = entity.name;
            //     // var color = colorHash[name];
            //     // if (!color) {
            //     //   color = Cesium.Color.fromRandom({
            //     //     alpha: 1.0
            //     //   });
            //     //   colorHash[name] = color;
            //     // }
            //     // entity.polygon.material = Cesium.Color.fromRandom({
            //     //     alpha: 1.0
            //     // });

            //     entity.polygon.fill = false; //设置无填充后，必须点击到polygon边界才显示提示框
            //     entity.polygon.outline = true;
            //     entity.polygon.outlineColor = Cesium.Color.RED;
            //     entity.polygon.width = 10; //无效，polygon.width不能超过1

            //     // entity.polygon.outline = true;
            //     // entity.polygon.outlineColor = Cesium.Color.BLUE
            //     // entity.polygon.outlineWidth = 10
            //     // entity.polygon.extrudedHeight = 5000.0;
            // }
            e.alpha = transparency
            this.imageryLayerCollection[tcid] = e
            // this.viewer.flyTo(e);
          })
        }
      })
      .catch((error) => {
        Message({
          type: 'error',
          message: '网络异常',
        })
      })
    return
    var dataSource = Cesium.GeoJsonDataSource.load(jsonObject, {
      fill: Cesium.Color.BLUE,
      markerSymbol: '1',
    })
    this.viewer.dataSources.add(dataSource).then((e) => {
      this.imageryLayerCollection[tcid] = e
      this.viewer.flyTo(e)
    })
    // var dataSource = Cesium.GeoJsonDataSource.load('http://localhost:9529/basePlatform/json/simplestyles.geojson');
    // this.viewer.dataSources.add(dataSource);
    return
    var redPolygon = this.viewer.entities.add({
      name: 'Red polygon on surface',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          -115.0, 37.0, -115.0, 32.0, -107.0, 33.0, -102.0, 31.0, -102.0, 35.0,
        ]),
        material: Cesium.Color.RED,
      },
    })
  }

  /**
   * 矢量瓦片
   * @param {*} mapInfo
   */
  handleVectorTilesLayer(mapInfo) {
    const { url_, tcid, extent, tileInfo, transparency } = mapInfo
    console.log('vector tile???', JSON.parse(tileInfo.symbol))
    // 'http://192.168.0.169:8080/api/v1/tilesets/aolutong/dt_sxdltb/{z}/{x}/{y}.pbf'//'http://192.168.0.165:9998/base/map/preview/vector/tiles/shp20214118084119/{z}/{x}/{y}' //"http://192.168.0.165:9998/vector/tiles/fc21bcbc410144e7b4c6d8a16494de4f/{z}/{x}/{y}";
    var mvtImg = new MvtImageryProvider({
      url: url_,
      style: new CustomMvtStyle({
        layerStyle: JSON.parse(tileInfo.symbol),
      }),
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 9,
      maximumLevel: 18,
      rectangle: Cesium.Rectangle.fromDegrees(
        extent.xmin,
        extent.ymin,
        extent.xmax,
        extent.ymax
      ),
    })

    const viewer = this.viewer
    // var layers = viewer.scene.imageryLayers;
    var layer = viewer.scene.imageryLayers.addImageryProvider(mvtImg)
    layer.alpha = transparency
    this.imageryLayerCollection[tcid] = layer
    // viewer.flyTo(layer);
  }
  /**
   * 3d tiles model
   * @param {*} mapInfo
   */
  handleAdd3DTileset(mapInfo) {
    const { url, tcid } = mapInfo

    const tilesetLayer = new Cesium.Cesium3DTileset({
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
    var tileset = this.viewer.scene.primitives.add(tilesetLayer)
    this.cesium3DTilesetCollection[tcid] = tilesetLayer
    this.viewer.flyTo(tileset)
  }

  handleAddModel(modelInfo) {
    const { url, position } = modelInfo
    const viewer = this.viewer
    // viewer.entities.removeAll();
    var position_ = Cesium.Cartesian3.fromDegrees(
      position.lon,
      position.lat,
      position.height
    )
    var heading = Cesium.Math.toRadians(135)
    var pitch = 0
    var roll = 0
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position_,
      hpr
    )

    let heightReference = Cesium.HeightReference.NONE
    if (position.height === undefined || position.height === 0) {
      heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
    } else {
    }
    var entity = viewer.entities.add({
      name: '',
      position: position_,
      orientation: orientation,
      label: '',
      model: {
        uri: url,
        heightReference: heightReference,
        minimumPixelSize: 128,
        maximumScale: 20000,
      },
    })

    viewer.flyTo(entity)
    // viewer.trackedEntity = entity;
  }

  // handleAddTerrain(){
  //     let url = 'http://114.250.29.198:8038/SXDEM_Tile'
  //     this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  //         url: url, // 地址记得换成自己的地形数据地址
  //         requestWaterMask: true, // 开启法向量
  //         requestVertexNormals: false // 开启水面特效
  //     })

  //     // const {
  //     //     xmin,
  //     //     ymin,
  //     //     xmax,
  //     //     ymax
  //     // } = {
  //     //     "xmax": 114.999990463257,
  //     //     "ymax": 41.0002040863037,
  //     //     "ymin": 33.9998531341553,
  //     //     "xmin": 109.999666213989
  //     // }

  //     // let viewExtent = {
  //     //     destination: Cesium.Cartesian3.fromDegrees(111.84, 36.15, 5000),
  //     //     orientation: {
  //     //         heading: Cesium.Math.toRadians(0),
  //     //         pitch: Cesium.Math.toRadians(-45.74026687972041),
  //     //         roll: Cesium.Math.toRadians(0)
  //     //     },
  //     //     complete: function callback() {}
  //     // }

  //     // viewer.camera.flyTo(viewExtent)
  // }

  /**
   * 实体 gltf
   * @param {object} entity
   */
  handleAddGltf(entity) {
    const url = 'http://data.marsgis.cn/gltf/mars/fengche.gltf'
    const height = 1000.0
    const viewer = this.viewer
    // viewer.entities.removeAll();
    var position = Cesium.Cartesian3.fromDegrees(
      -123.0744619,
      44.0503706,
      height
    )
    var heading = Cesium.Math.toRadians(135)
    var pitch = 0
    var roll = 0
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    )

    var entity = viewer.entities.add({
      name: '',
      position: position,
      orientation: orientation,
      label: '',
      model: {
        uri: url,
        // minimumPixelSize: 128,
        // maximumScale: 20000,
      },
    })

    viewer.camera.flyTo(entity)
    viewer.trackedEntity = entity
  }

  /**
   * 实体 glb
   * @param {object} entity
   */
  handleAddGlb(entity) {}

  /**
   * 添加地形
   * @param {object} terrian 地形
   */
  handleAddTerrian(terrian) {
    let {
      url,
      // extent
    } = terrian
    // const {
    //     xmin,
    //     ymin,
    //     xmax,
    //     ymax
    // } = extent
    url = 'http://114.250.29.198:8038/SXDEM_Tile'

    this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: url, // 地址记得换成自己的地形数据地址
      requestWaterMask: true, // 开启法向量
      requestVertexNormals: true, // 开启水面特效
    })
    const viewExtent = {
      destination: Cesium.Cartesian3.fromDegrees(111.84, 36.15, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45.74026687972041),
        roll: Cesium.Math.toRadians(0),
      },
      complete: function callback() {},
    }

    this.viewer.camera.flyTo(viewExtent)
  }

  /**
   * 支持 EPSG:3857
   */
  addCrs() {
    Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::3857'] =
      Cesium.GeoJsonDataSource.crsNames['EPSG:3857'] = function (coordinates) {
        const firstProjection =
          'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]'
        const secondProjection =
          'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]'
        const xa = coordinates[0]
        const ya = coordinates[1]
        const newCoordinates = proj4(firstProjection, secondProjection, [
          xa,
          ya,
        ])
        return Cesium.Cartesian3.fromDegrees(
          newCoordinates[0],
          newCoordinates[1],
          0
        )
      }

    Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::4490'] =
      Cesium.GeoJsonDataSource.crsNames['EPSG::4490'] = function (coordinates) {
        const firstProjection =
          'GEOGCS["China Geodetic Coordinate System 2000",DATUM["China_2000",SPHEROID["CGCS2000",6378137,298.257222101,AUTHORITY["EPSG","1024"]],AUTHORITY["EPSG","1043"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4490"]]'
        const secondProjection =
          'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]'
        const xa = coordinates[0]
        const ya = coordinates[1]
        const newCoordinates = proj4(firstProjection, secondProjection, [
          xa,
          ya,
        ])
        return Cesium.Cartesian3.fromDegrees(
          newCoordinates[0],
          newCoordinates[1],
          0
        )
      }
  }

  /**
   * 设置图层透明度
   * @param {*} tcid 图层id
   * @param {*} value 透明度
   */
  setLayerOpacityById(tcid, value) {
    if (this.imageryLayerCollection[tcid]) {
      const object = this.imageryLayerCollection[tcid]
      if (object.hasOwnProperty('alpha')) {
        this.imageryLayerCollection[tcid].alpha = value
      } else {
        // var entities = object.entities.values
        // for (var i = 0; i < entities.length; i++) {
        //     var entity = entities[i];
        //     // entity.polygon.material = new Cesium.Color(255, 0, 0, value)
        // }
      }
    }
    if (this.cesium3DTilesetCollection[tcid]) {
      const object = this.cesium3DTilesetCollection[tcid]
      object.style = new Cesium.Cesium3DTileStyle({
        color: `color('rgba(255,255,255,${value})')`,
      })
    }
  }

  setLayerVisibleById(tcid, value) {
    if (this.imageryLayerCollection[tcid]) {
      this.imageryLayerCollection[tcid].show = value
    }
  }

  removeLayer(layer) {
    this.viewer.imageryLayers.remove(layer)
  }

  getLayerById(id) {
    return this.imageryLayerCollection[id]
  }

  /**
   * 获取dataSource
   * @param {*} id
   * @returns dateSource
   */
  getDataSourceById(id) {
    const datasource = this.viewer.dataSources.getByName(id)
    if (datasource.length > 0) {
      return datasource[0]
    } else {
      return null
    }
    // return this.viewer.dataSources.getByName(id) // this.dataSourceCollection[id]
  }

  getEntityById(id) {
    return this.entitiesCollection[id]
  }

  removeLayerById(id) {
    const layer = this.imageryLayerCollection[id]
    if (layer) {
      this.removeLayer(layer)
    }
  }

  /**
   * 删除已加载图层
   */
  removeAllLayers() {
    // for (const key in this.imageryLayerCollection) {
    //   if (Object.hasOwnProperty.call(this.imageryLayerCollection, key)) {
    //     const element = this.imageryLayerCollection[key]
    //     this.viewer.imageryLayers.remove(element)
    //   }
    // }
    this.viewer.imageryLayers.removeAll()
    this.imageryLayerCollection = {}
    this.imageryLayerCollectionBase = {}
  }

  /**** layer end */
  /** *********   methods    */
  /**
   * position转经纬度坐标
   * @param {x,y} position
   * @returns {lon,lat}
   */
  getLonLatByPosition(position) {
    const { x, y } = position
    var lon = '',
      lat = ''
    var result = this.viewer.camera.pickEllipsoid(new Cesium.Cartesian2(x, y))
    if (result) {
      var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
      lon = (curPosition.longitude * 180) / Math.PI
      lat = (curPosition.latitude * 180) / Math.PI
    }
    return {
      lon,
      lat,
    }
  }

  /**
   * 视图中心点位置
   * @returns
   */
  getCenterPosition() {
    const viewer = this.viewer

    function getHeight() {
      if (viewer) {
        var scene = viewer.scene
        var ellipsoid = scene.globe.ellipsoid
        var height = ellipsoid.cartesianToCartographic(
          viewer.camera.position
        ).height
        return height
      }
    }

    var result = this.viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        viewer.canvas.clientWidth / 2,
        viewer.canvas.clientHeight / 2
      )
    )
    var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
    var lon = (curPosition.longitude * 180) / Math.PI
    var lat = (curPosition.latitude * 180) / Math.PI
    var height = getHeight()
    return {
      lon,
      lat,
      height,
    }
  }

  /**
   * 视图范围
   * @returns
   */
  getViewExtent() {
    const viewer = this.viewer
    // 范围对象
    var extent = {}

    // 得到当前三维场景
    var scene = viewer.scene

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid
    var canvas = scene.canvas

    // canvas左上角
    var car3_lt = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(0, 0),
      ellipsoid
    )

    // canvas右下角
    var car3_rb = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(canvas.width, canvas.height),
      ellipsoid
    )

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude)
    }

    // 当canvas左上角不在但右下角在椭球体上
    else if (!car3_lt && car3_rb) {
      var car3_lt2 = null
      var yIndex = 0
      do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? (yIndex += 10) : canvas.height
        car3_lt2 = viewer.camera.pickEllipsoid(
          new Cesium.Cartesian2(0, yIndex),
          ellipsoid
        )
      } while (!car3_lt2)
      var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2)
      var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude)
    }

    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height)

    // 方向   围绕Z轴旋转
    const heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
    // 倾斜角度   围绕Y轴旋转
    const pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
    // 围绕X轴旋转
    const roll = Cesium.Math.toDegrees(viewer.camera.roll).toFixed(2)

    extent['hpr'] = {
      heading,
      pitch,
      roll,
    }
    return extent
  }

  getExtent() {
    let viewer = this.viewer
    // 范围对象
    var extent = {}

    // 得到当前三维场景
    var scene = viewer.scene

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid
    var canvas = scene.canvas

    // canvas左上角
    var car3_lt = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(0, 0),
      ellipsoid
    )

    // canvas右下角
    var car3_rb = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(canvas.width, canvas.height),
      ellipsoid
    )

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude)
    }

    // 当canvas左上角不在但右下角在椭球体上
    else if (!car3_lt && car3_rb) {
      var car3_lt2 = null
      var yIndex = 0
      do {
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        yIndex <= canvas.height ? (yIndex += 10) : canvas.height
        car3_lt2 = viewer.camera.pickEllipsoid(
          new Cesium.Cartesian2(0, yIndex),
          ellipsoid
        )
      } while (!car3_lt2)
      var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2)
      var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude)
      extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude)
      extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude)
      extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude)
    }

    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height)
    return extent
  }

  getCamera(position) {
    // 跟随鼠标获取经纬度和视角高度
    // var longitude_show = document.getElementById('longitude_show')
    // var latitude_show = document.getElementById('latitude_show')
    // var altitude_show = document.getElementById('altitude_show')
    // var elevation_show = document.getElementById('elevation_show')
    // var canvas = viewer.scene.canvas //具体事件的实现
    // var ellipsoid=viewer.scene.globe.ellipsoid;
    // var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    // handler.setInputAction(function(movement){//捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);if(cartesian){//将笛卡尔三维坐标转为地图坐标（弧度）var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);//将地图坐标（弧度）转为十进制的度数var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);var alti_String=(viewer.camera.positionCartographic.height/1000).toFixed(2);console.log(log_String,'经度');console.log(lat_String,'纬度');console.log(alti_String,'视角高度')// console.log(height,'height');// console.log(zoom,'zoom');}},Cesium.ScreenSpaceEventType.MOUSE_MOVE);// 获取当前层级function heightToZoom(height){var A = 40487.57;var B = 0.00007096758;var C = 91610.74;var D = -40467.74;return Math.round(D+(A-D)/(1+Math.pow(height/C, B)));}var height = Math.ceil(viewer.camera.positionCartographic.height);var zoom = heightToZoom(height);console.log(zoom,'zoom');// 定位到某个位置var camera = viewer.scene.camera;camera.flyTo({//镜头的经纬度、高度。镜头默认情况下，在指定经纬高度俯视（pitch=-90）地球  destination: Cesium.Cartesian3.fromDegrees(113.664761,34.754152 , 10000),orientation: {heading: Cesium.Math.toRadians(0),//方向pitch: Cesium.Math.toRadians(-15),//倾斜角度roll: Cesium.Math.toRadians(0)},duration: 1.5, //动画持续时间  // complete: function(){ //飞行完毕后执行的动作  // }});

    //查看当前视角的 x,y,z,heading,pitch,roll值
    // var _position = this.viewer.scene.pickPosition(position)
    // //将笛卡尔坐标转化为经纬度坐标
    // var cartographic = Cesium.Cartographic.fromCartesian(_position)

    var result = this.viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(position.x, position.y)
    )
    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)

    var x = Cesium.Math.toDegrees(cartographic.longitude)
    var y = Cesium.Math.toDegrees(cartographic.latitude)
    var z = cartographic.height
    var h = this.viewer.scene.camera.heading
    var p = this.viewer.scene.camera.pitch
    var r = this.viewer.scene.camera.roll
    console.log(h, p, r)
  }

  /**
   * 定位到范围
   * @param {*} extent
   */
  flyToExtent(extent) {
    if (this.viewer) {
      const { xmin, ymin, xmax, ymax } = extent
      const geometry = this.viewer.entities.add({
        name: 'Red translucent rectangle',
        show: false,
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax),
          material: Cesium.Color.RED.withAlpha(0.5),
        },
      })

      this.viewer
        .flyTo(geometry, {
          // offset: new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0.0), Cesium.Math.toRadians(-90.0), 0)
        })
        .then((e) => {
          this.viewer.entities.remove(geometry)
        })
    }
  }

  flyToView(view) {
    const { lon, lat, height, heading, pitch, roll } = view
    const cameraView = {
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: Cesium.Math.toRadians(roll),
      },
      complete: function callback() {},
    }
    this.viewer.camera.flyTo(cameraView)
  }

  /**
   * 定位到范围
   * @param {*} extent
   */
  zoomToExtent(extent, orientation = null) {
    if (orientation == null) {
      orientation = {
        heading: Cesium.Math.toRadians(0.0), // 方向
        pitch: Cesium.Math.toRadians(-90.0), // 亲斜角度
        roll: 0,
      }
    } else {
      orientation = {
        heading: Cesium.Math.toRadians(orientation.heading), // 方向
        pitch: Cesium.Math.toRadians(orientation.pitch), // 亲斜角度
        roll: 0,
      }
    }
    if (this.viewer) {
      const { xmin, ymin, xmax, ymax } = extent
      //  rectangle方法
      this.viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax), // west,south,east,north
        orientation: orientation,
      })
    }
  }

  flyTo3dModel(id) {
    if (this.cesium3DTilesetCollection[id]) {
      this.viewer.flyTo(this.cesium3DTilesetCollection[id])
    } else {
      Message('请先加载模型')
    }
  }

  // zoomToView(destination, orientation = null) {
  //     orientation = {
  //         heading: Cesium.Math.toRadians(orientation.heading), //方向
  //         pitch: Cesium.Math.toRadians(orientation.pitch), // 亲斜角度
  //         roll: 0
  //     }
  //     //  rectangle方法
  //     this.viewer.camera.setView({
  //         destination: destination, //west,south,east,north
  //         orientation: orientation
  //     })
  // }

  zoomToLayer(layerInfo) {
    let { url, servertype, tilesVO, tcid } = layerInfo
    if (servertype == '17') {
      this.flyToByExtent(tilesVO)
    } else if (servertype == '1') {
      this.getNameByWMS(url, true)
    } else if (servertype == '3') {
      this.getNameByWMTS(url, true)
    } else if (servertype == '2') {
      this.getNameByWFS(url, true)
    } else if (servertype == '6') {
      this.flyTo3dModel(tcid)
    } else if (servertype != '6') {
      url = url + '?f=json'
      $.get(url, (res) => {
        res = JSON.parse(res)
        console.log(res)
        this.fullExtent = res.extent || res.fullExtent
        var wkid =
          this.fullExtent.spatialReference.wkid ||
          this.fullExtent.spatialReference.wkt ||
          ''
        var wkt = this.fullExtent.spatialReference.wkt
        if (wkt) {
          this.$message({
            type: 'warning',
            message: '该图层为自定义坐标系，无法定位',
          })
        }

        if (wkid === 4490 || wkid === 4326) {
          this.flyToByExtent(this.fullExtent)
        } else {
          this.transformCoords(this.fullExtent, wkid, 4326)
        }
      })
    }
  }

  destoryMap() {
    this.imageryLayerCollection = {}
    this.cesium3DTilesetCollection = {}
  }
}

export default VMap
