<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-02-17 13:37:39
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-18 11:30:58
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="layer" name="first">
          <span>{{ prj }}</span>
          <el-button size="small" @click="handleGetMap"> 获取prj </el-button>

          <el-button @click="handleExtent" size="small">extent</el-button>
          <br />
          <i class="el-icon-s-flag">WMTS</i>
          <el-checkbox v-model="model_wmts_template"
            >geoserver wmts</el-checkbox
          >
          <el-checkbox v-model="model_supermap_Wmts"
            >superMap wmts(4326)</el-checkbox
          >
          <el-checkbox v-model="model_tdt_img">tdt img(4326)</el-checkbox>
          <el-checkbox v-model="model_Retina_Tiles"
            >XYZ Retina Tiles</el-checkbox
          >
          <el-checkbox v-model="model_arcgisXYZ">arcgis xyz</el-checkbox>
          <el-checkbox v-model="model_arcgisTileLayer"
            >arcgis tilelayer</el-checkbox
          >
          <br />
          <i class="el-icon-s-flag">WMS</i>
          <el-checkbox v-model="model_wms_tiles">wms tiles</el-checkbox>
          <el-checkbox v-model="model_wms_image">wms image</el-checkbox>
          <br />
          <i class="el-icon-s-flag">arcgis image</i>
          <el-checkbox v-model="model_arcgis_image"
            >arcgis image(存在偏移)</el-checkbox
          >
          <el-checkbox v-model="model_arcgis_imageTile"
            >arcgis image tile</el-checkbox
          >
          <i class="el-icon-s-flag"></i>
          <br />
          <!-- <el-button @click="handleWmtsUser">localWmts</el-button>
                    <el-button @click="handleWmtsUser">localWmts</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="draw" name="second">
          draw:
          <el-button size="small" @click="handleDrawPoint"> point </el-button>
          <el-checkbox v-model="model_snap">snap</el-checkbox>
          <el-checkbox v-model="model_modify">modify</el-checkbox>
          <el-select
            v-model="valueType"
            size="small"
            placeholder="请选择"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button size="small" @click="handleDrawEnd"> end </el-button>

          <el-button size="small" @click="handleClear"> clear </el-button>
        </el-tab-pane>
        <el-tab-pane label="spatial analysis" name="third">
          <div style="display: flex; padding: '5px'">
            <el-button @click="handleRadomPoint">Radom Point</el-button>
            <el-button @click="handleInterpolate">interpolate</el-button>
            <el-button @click="handleHeatMap">heatMap</el-button>
            <el-slider v-model="value_blur" style="width: 100px" />
            <el-slider v-model="value_radius" style="width: 100px" />
            <el-button @click="handleTestChazhi">插值</el-button>
            <el-button @click="handleTestCluster">cluster</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="popup" name="fourth">
          <el-button @click="handleAddPopup">add popup</el-button>
          <el-button @click="handleRemovePopup">delete popup</el-button>
        </el-tab-pane>

        <el-tab-pane label="wfs" name="fivth">
          <el-input type="textarea" v-model="wfsUrl" rows="1"></el-input>

          <el-input type="textarea" v-model="wfsUrl2" rows="1"></el-input>

          <el-button type="primary" @click="handleLoadWMS" size="small"
            >加载wms</el-button
          >

          <el-button type="primary" @click="handleLoadWMTS" size="small"
            >加载wmts</el-button
          >

          <el-button type="danger" size="small" @click="handleRemoveLayer('')"
            >删除</el-button
          >

          <el-button type="primary" size="small" @click="handleQuery"
            >query</el-button
          >

          <el-button type="primary" size="small" @click="handleAdd"
            >增</el-button
          >

          <el-button type="danger" size="small" @click="handleDelete"
            >删</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>

    <OlMap
      class="app-content"
      :map-config="mapConfig"
      :controls="controls"
      show-toolbar
      show-basemapbar
      feature-popup-title="标题"
      feature-popup-enable
      :feature-popup="featurePopup"
      multiple-popups-enable
      :multiple-popups="popups"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @tool-change="handleToolChange"
    />
  </div>
</template>

<script>
import OlMap from '@/VMap/ol/v2/components/MapOl.vue'

import {
  createPointsFromBox,
  createPointsFromBoxWithProperty,
  interpolateFromPoints,
} from '@/VMap/public/utils/map/turf.js'

// import { dataChazhi } from "./assets/js/data";
import VUtils from '@/VMap/public/utils/base'
import mapConfig from './mapConfig'
import { intersects } from 'ol/format/filter'

export default {
  name: 'ol_service',
  components: {
    OlMap,
  },
  data() {
    return {
      controls: {
        showBasemap: true,
        zoom: false,
      },
      mapConfig: mapConfig,
      activeName: 'fivth',
      value: '4326',
      esriUtils: null,

      valueType: '',
      optionsType: [
        {
          label: 'Point',
          value: 'Point',
        },
        {
          label: 'LineString',
          value: 'LineString',
        },
        {
          label: 'Polygon',
          value: 'Polygon',
        },
        {
          label: 'Circle',
          value: 'Circle',
        },
        {
          label: 'Box',
          value: 'Box',
        },
      ],

      prj: '',

      model_wmts_template: false,
      model_arcgisXYZ: false,
      model_Retina_Tiles: false,
      model_wms_tiles: false,
      model_wms_image: false,
      model_arcgis_image: false,
      model_arcgis_imageTile: false,
      model_supermap_Wmts: false,
      model_arcgisTileLayer: false,
      model_tdt_img: false,

      model_snap: false,
      model_modify: false,

      value_blur: 10,
      value_radius: 10,

      featurePopup: {},
      popups: [],

      popupIndex: 2,

      // wfsUrl: "http://10.1.102.189:8877/geoserver/wms?layers=DZ:hj_dfsz_dike_geom_spa",
      wfsUrl:
        'http://10.1.102.189:8877/geoserver/wms?layers=PG:dy_gisobj_point_test',
      wfsUrl2: '',
    }
  },
  watch: {
    model_supermap_Wmts() {
      this.olInstance.addLayerByType({
        id: 'layerId_supermap_wmts',
        visible: this.model_supermap_Wmts,
        type: 'superMap',
        url: 'http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m',
      })
    },
    model_wmts_template() {
      this.olInstance.addLayerByType({
        id: 'layerId_wmts',
        visible: this.model_wmts_template,
        type: 'geoserverWmts',
        url: 'http://10.1.102.189:8877/geoserver/gwc/service/wmts?layer=basin:BAS1&style=&matrixSet=EPSG:4326&Service=WMTS&format=image/png',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3AChina&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&matrixSet=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        // 'type': 'wmts',
        // 'url': 'http://10.1.102.189:8877/geoserver/gwc/service/wmts?layer=basin:BAS1&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG:4326:{z}&TileCol={x}&TileRow={y}',
        // 'url': 'http://10.1.102.189:8877/geoserver/gwc/service/wmts',
        // layer: 'basin:BAS1',
        // matrixSet: 'EPSG:4326',
        // format: 'image/png',
        // style: 'default'
      })
    },
    model_Retina_Tiles() {
      this.olInstance.addXYZLayer({
        id: 'model_Retina_Tiles',
        visible: this.model_Retina_Tiles,
        url:
          'https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=' +
          'get_your_own_D6rA4zTHduk6KOKTXzGB',
        tilePixelRatio: 2,
      })
    },
    model_wms_tiles() {
      this.olInstance.addLayerByType({
        id: 'layerId_wms_tile',
        visible: this.model_wms_tiles,
        type: 'wms',
        url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
      })
    },
    model_wms_image() {
      this.olInstance.addLayerByType({
        id: 'layerId_wms_tile2',
        visible: this.model_wms_image,
        type: 'wmsImage',
        url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
      })
    },
    model_arcgisXYZ() {
      // this.olInstance.addXYZLayer({
      //   id: 'model_arcgisXYZ',
      //   visible: this.model_arcgisXYZ,
      //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      // })
      this.olInstance.addLayerByType({
        id: 'model_arcgisXYZ',
        visible: this.model_arcgisXYZ,
        type: 'arcgis_wmts',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      })
    },
    model_arcgisTileLayer() {
      this.olInstance.addLayerByType({
        id: 'model_arcgisTileLayer',
        visible: this.model_arcgisTileLayer,
        type: 'arcgis_wmts',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      })
    },
    model_arcgis_image() {
      // 问题 arcgis_mapImage存在坐标偏移   arcgis_mapTile不存在偏移
      this.olInstance.addLayerByType({
        id: 'layerId_arcgis_image',
        visible: this.model_arcgis_image,
        type: 'arcgis_mapImage',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        // 'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
      })
    },

    model_arcgis_imageTile() {
      this.olInstance.addLayerByType({
        id: 'layerId_arcgis_image_tile',
        visible: this.model_arcgis_imageTile,
        type: 'arcgis_mapTile',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        // 'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
      })
    },

    model_tdt_img() {
      this.olInstance.addLayerByType({
        id: 'tdt_img_w',
        type: 'tdt',
        visible: this.model_tdt_img,
        url: 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
      })
    },

    model_snap() {
      this.handleTypeChange()
    },

    model_modify() {
      this.handleTypeChange()
    },
    value_blur(nv, ov) {
      this.heatLayer.setBlur(nv)
    },
    value_radius(nv, ov) {
      this.heatLayer.setRadius(nv)
    },
  },
  mounted() {},
  methods: {
    handleToolChange(handler) {
      console.log(handler)
    },
    handleMapReady(olInstance) {
      this.olInstance = olInstance
    },
    handleMouseClick(e) {
      let { olInstance } = this
      let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
      const coordinate = e.coordinate
      console.log('from index...', features, coordinate)

      if (features.length === 0) {
        return
      }
      features.forEach((feature) => {
        let properties = feature.getProperties()
        let geometry = feature.getGeometry().getCoordinates()
      })

      this.featurePopup = {
        location: coordinate,
        attributes: VUtils.object2Array(features[0].getProperties()),
      }
    },
    handleChange(value) {},
    handleGetMap() {
      // console.log('map,', this.olInstance.getMap())
      // console.log(this.olInstance.getMap().getView().getProjection())
      this.prj = this.olInstance.getMap().getView().getProjection().getCode()
    },
    handleArcgisXYZ() {
      this.olInstance.addXYZLayer({
        id: '1212',
        visible: true,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      })
    },

    handleTypeChange() {
      let drawInstance = this.olInstance.getDrawHandler()
      if (this.valueType) {
        drawInstance.drawByType({
          type: this.valueType,
          snapEnable: this.model_snap,
          modifyEnable: this.model_modify,
          drawEndHandle: (e) => {
            console.log('drawend...', e)
          },
        })
      }
    },

    handleDrawPoint() {
      this.olInstance.getDrawHandler()?.drawPoint()
    },
    handleDrawEnd() {
      this.valueType = ''
      this.olInstance.getDrawHandler()?.endDraw()
    },
    handleClear() {
      this.olInstance.getDrawHandler()?.clear()
    },
    handleWmtsUser() {
      // this.olInstance.localWmts({
      //     id: "12121",
      //     prj: this.prj,
      //     url: "http://localhost/tiles/{z}/{x}_{y}.png",
      // });
    },
    handleExtent() {
      console.log(this.olInstance.getExtent())
    },
    // 随机点
    handleRadomPoint() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      this.olInstance.zoomToExtent(extent)

      const pointsGeojson = createPointsFromBoxWithProperty(50, extent)
      const pointsWithValue = createPointsFromBoxWithProperty(50, extent)

      this.pointsWithValue = pointsWithValue

      this.olInstance.addLayerByType({
        id: 'test_geojson',
        once: true,
        type: 'geojson',
        geojson: pointsWithValue,
        field: 'solRad',
        // labelField:"solRad"
      })
    },

    // turf插值
    handleInterpolate() {
      // let extent = [117.57071648609964, 29.612017196294367, 118.56681691790034, 30.1558200567]
      // this.olInstance.fitToExtent(extent)
      // const pointsGeojson = createPointsFromBoxWithProperty(50, extent)

      const geojson = interpolateFromPoints(this.pointsWithValue, 1, {
        gridType: 'square',
        property: 'solRad',
        units: 'miles',
      })

      this.olInstance.addLayerByType({
        id: 'test_chazhi',
        visible: true,
        once: true,
        type: 'geojson',
        geojson: geojson,
        field: 'solRad',
      })
    },

    // 热力图
    handleHeatMap() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      this.olInstance.fitToExtent(extent)

      let field = 'hot_weight'

      const pointsGeojson = createPointsFromBoxWithProperty(150, extent, field, {
        start: 0,
        end: 1,
      })

      // let aaa = interpolateFromPoints(pointsGeojson, 10, {
      //     gridType: 'point',
      //     property: field,
      //     units: 'miles'
      // })

      // this.olInstance.addLayerByType({
      //     id: 'test_chazhi',
      //     visible: true,
      //     once: true,
      //     type: 'geojson',
      //     geojson: aaa,
      //     field: field
      // })

      this.heatLayer = this.olInstance.addLayerByType({
        id: 'layerId_heatmap',
        type: 'heatMap',
        once: true,
        geojson: pointsGeojson,
        field: field,
      })
    },
    // 测试插值
    handleTestChazhi() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      let padding = 100
      this.olInstance.fitToExtent(extent, {
        padding: [padding, padding, padding, padding],
      })

      let field = 'testField'
      const pointsWithValue = createPointsFromBoxWithProperty(30, extent, field)

      this.olInstance.interpolation({
        id: 'test_geojson',
        visible: true,
        type: 'geojson',
        geojson: pointsWithValue,
        field,
        labelField: field,
      })
    },
    //测试聚合
    handleTestCluster() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      let padding = 100
      this.olInstance.fitToExtent(extent, {
        padding: [padding, padding, padding, padding],
      })

      let field = 'testField'
      const pointsWithValue = createPointsFromBoxWithProperty(130, extent, field)

      this.olInstance.addLayerByType({
        id: 'test_geojson_cluster',
        once: true,
        visible: true,
        type: 'clusterMap',
        geojson: pointsWithValue,
      })
    },

    handleAddPopup() {
      this.popups.push({
        location: [VUtils.getRandomNum(100, 130), VUtils.getRandomNum(25, 35)],
        attributes: [
          {
            label: 'bbb',
            value: 222222222,
          },
          {
            label: 'bbb',
            value: 222,
          },
        ],
      })
    },

    handleRemovePopup() {
      this.olInstance.removeAllOverlay()
    },

    handleLoadWMTS() {
      //
      this.olInstance.removeLayerById('vectorLayerPoint___test')
      this.olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'geoserverWmts',
        visible: true,
        url: `${this.wfsUrl2}`,
      })
    },

    handleLoadWMS() {
      this.olInstance.removeLayerById('vectorLayerPoint___test')

      this.olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'wms',
        visible: true,
        url: `${this.wfsUrl}&CQL_FILTER=1=1&t=t_${Math.random()}`,
      })

      return
      const coordinate = [
        [86.92686575490978, 43.16448199423321],
        [87.01136370000059, 40.68703343744539],
        [89.78659380309928, 41.28253489952021],
        [89.63750951002642, 43.2375154249803],
        [86.92686575490978, 43.16448199423321],
      ]
      let str = ''
      coordinate.forEach((element) => {
        str += element.join(' ') + ','
      })
      str = str.substring(0, str.length - 1)

      let geo_FILTER = `INTERSECTS(the_geom, POLYGON((${str})))`
      geo_FILTER = `INTERSECTS(geom, POLYGON((86.92686575490978 43.16448199423321, 87.01136370000059 40.68703343744539, 89.78659380309928 41.28253489952021,86.92686575490978 43.16448199423321)))`
      this.olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'wms',
        visible: true,
        url: `${
          this.wfsUrl
        }&CQL_FILTER=1=1 and ${geo_FILTER}&t=t_${Math.random()}`,
      })
    },

    handleRemoveLayer() {
      this.olInstance.removeLayerById('vectorLayerPoint___test')
    },

    handleQuery() {
      let drawInstance = this.olInstance.getDrawHandler()
      const wfsHandler = this.olInstance.getWfsHandler()
      drawInstance.drawByType({
        type: 'Polygon',
        snapEnable: true,
        modifyEnable: false,
        drawEndHandle: ({ e, coordinates, type, feature }) => {
          drawInstance?.endDraw()
          const polygon = wfsHandler.applyTransform(
            feature.getGeometry().clone()
          )
          const geoserverData = {
            uri: 'http://localhost/geoserver',
            wsName: 'pg',
            layer: 'dy_gisobj_point_test',
          }

          const filter = intersects('geom', polygon, 'EPSG:4326')
          wfsHandler
            .queryByCondition('http://localhost/geoserver/PG/wfs', {
              srsName: 'EPSG:4326',
              featureNS: geoserverData.uri,
              featurePrefix: geoserverData.wsName,
              featureTypes: [geoserverData.layer],
              outputFormat: 'application/json',
              filter,
            })
            .then((e) => {
              console.log('result...', e)
            })
        },
      })
    },

    // 增
    handleAdd() {
      let drawInstance = this.olInstance.getDrawHandler()
      drawInstance.drawByType({
        type: 'Point',
        drawEndHandle: ({ type, feature, coordinates }) => {
          drawInstance?.endDraw()
          drawInstance?.clear()
          const id = 'neiliuqu_' + parseInt(Math.random() * 100000)
          feature.setProperties({
            stcd: 'test',
            sttp: 'RR',
            stnm: '站名——' + id,
            visible: 1,
          })
          let geom = feature.getGeometry().clone()

          feature.setGeometryName('geom')
          feature.setGeometry(geom)

          this.handleTransact(feature, 'insert')
        },
      })
    },
    //  改
    handleVisible(value) {
      let feature = this.curFeature.clone()
      feature.setId(this.curFeature.getId())

      WfsUtils.Geometry.applyTransform(feature.getGeometry())
      feature.setGeometryName('geom')

      const properties = feature.getProperties()
      properties['visible'] = value
      delete properties.geometry
      feature.setProperties(properties)
      this.handleTransact(feature, 'update')
    },
    // 删
    handleDelete() {
      if (this.curFeature) {
        let feature = this.curFeature
        this.handleTransact(feature, 'delete')
      }
    },

    handleTransact(feature, type) {
      const wfsHandler = this.olInstance.getWfsHandler()

      const geoserverData = {
        uri: 'http://10.1.102.189:8877/geoserver/pg',
        wsName: 'pg',
        layer: 'dy_gisobj_point_test',
      }

      wfsHandler
        .transact('http://localhost/geoserver/PG/wfs', {
          transactType: type,
          features: [feature],
          srsName: 'EPSG:4326',
          featureNS: geoserverData.wsName,
          featureType: geoserverData.layer,
        })
        .then((res) => {
          console.log(res)
        })
    },
  },
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
  height: 190px;
  margin-bottom: 10px;
  overflow-y: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  border-radius: 6px;
  background-color: white;
  padding: 0 10px;
}

.tools-view .row {
  padding: 8px;
}

.map_contaniner {
  z-index: 199;
  position: relative;
  width: 100%;
  height: 100%;
}

.app-content {
  width: 100%;
  height: calc(100% - 200px);
}

.popup_content {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 228, 196, 0);
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
}

.status_bar {
  z-index: 1999;
  position: absolute;
  left: 50px;
  bottom: 60px;
  background-color: white;
}

.el-icon-s-flag {
  margin-right: 20px;
}
</style>
