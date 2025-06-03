<template>
  <div id="app-container">
    <div class="tools-view">
      <el-button size="small" type="primary" @click="handleLoadMapboxStyle">mapbox style</el-button>
      <el-button size="small" type="primary" @click="handleLoadGeoserver">geoserver vt</el-button>
      <el-button size="small" type="primary" @click="handleLoadPG3">PG vt</el-button>
      <el-button size="small" type="primary" @click="handleLoadEsri">esri</el-button>
      <el-button size="small" type="primary" @click="handleLoadEsri2">矢量瓦片测试</el-button>
      <el-button size="small" type="primary" @click="handleLoadEsri3">矢量瓦片+注记</el-button>
      <el-button size="small" type="primary" @click="handleChangeStyle">修改（注记）样式</el-button>
      <el-button size="small" type="primary" @click="handleGeoserverVt">geoServer 矢量瓦片</el-button>
      <el-button size="small" type="primary" @click="handleWms">wms</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </div>
    <div id="map-view">
    </div>
  </div>
</template>

<script>
  import * as esriLoader from 'esri-loader'
  import EsriUtils from '../../assets/js/esriUtils'
  import styleJSON from '../../json/style.json'
  export default {
    data() {
      return {
        esriUtils: null
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        let esriUtils = new EsriUtils()
        this.esriUtils = esriUtils
        window.esriUtils = esriUtils

        this.esriUtils.setMapExtent({
          xmax: 15313621.169072356,
          xmin: 7457117.6538108885,
          ymax: 8372107.100905355,
          ymin: 603659.0422283877
        })

        this.esriUtils.setMapExtent({
          xmax: 12517571.805503532,
          xmin: 12515911.68879546,
          ymax: 4538865.487657018,
          ymin: 4537035.865837763
        })


        esriUtils.initMap('TDT_IMG_3857', 'map-view', (map, view) => {
          view.zoom = 3
        })
      },
      handleLoadMapboxStyle() {
        let style = {
          "version": 8,
          "name": "China3",
          // "sprite": "mapbox://sprites/mapbox/streets-v8",
          // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sprite": "http://localhost:9530/static/style/sprites/sprite/",
          "glyphs": "http://localhost:9530/arcgis_js_api_v418/library/4.18/fonts/{fontstack}/{range}.pbf",
          "sources": {
            "base_test": {
              "type": "vector",
              "tiles": ["http://localhost:8080/vector_tile/China/{z}/{x}/{y}.pbf"],
              "maxzoom": 3,
              "minzoom": 0
            }
          },
          "layers": [{
            "id": "China",
            "source": "base_test",
            "source-layer": "China_polygon",
            "type": "fill",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.5
            }
          }, {
            "layout": {
              "text-font": ["arial-unicode-ms-regular"],
              "text-anchor": "center",
              "text-field": "{name}",
              "icon-image": "aquarium-15"
            },
            "paint": {
              "text-halo-blur": 1,
              "text-color": "#AF420A",
              "text-halo-width": 1,
              "text-halo-color": "#f0efec"
            },
            "source": "base_test",
            "source-layer": "China_polygon",
            "type": "symbol",
            "id": "Continent"
          }]
        }
        this.esriUtils.loadVectorTileLayer(style)
      },
      handleLoadGeoserver() {
        let style = {
          "version": 8,
          "name": "China",
          // "sprite": "mapbox://sprites/mapbox/streets-v8",
          // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sources": {
            "China": {
              "type": "vector",
              "scheme": "tms",
              "tiles": [
                "/geoserverApi/geoserver/gwc/service/tms/1.0.0/kjr%3Acountries@EPSG%3A4326@pbf/{z}/{x}/{y}.pbf"
              ]
            }
          },
          "layers": [{
            "id": "China",
            "type": "fill",
            "source": "China",
            "source-layer": "countries",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.6
            }
          }]
        }
        this.esriUtils.loadVectorTileLayer(style)
      },
      handleLoadPG() {
        let style = {
          "version": 8,
          "name": "test",
          "sprite": "http://localhost:8080/style/sprites/sprite/",
          "glyphs": "http://localhost:8080/style/fonts/{fontstack}/{range}.pbf",
          "sources": {
            "DLTB": {
              "type": "vector",
              "tiles": [
                "http://localhost:8081/tiles/{z}/{x}/{y}",
                // "http://192.168.0.165:9998/vector/tiles/64d6ec69586f4192b319d6c0cb0e9b26/{z}/{x}/{y}"
              ],
              "maxzoom": 20,
              "minzoom": 0
            }
          },
          "layers": [{
            "id": "DLTB",
            "type": "fill",
            "source": "DLTB",
            "source-layer": "china",
            'paint': {
              "fill-color": [
                "match",
                ["get", "adcode"],
                ["110000"], "red",
                ["410000"], "green",
                "#088"
              ],
              "fill-outline-color": "red",
              "fill-opacity": 0.5
            },
            "interactive": true
          }, {
            "layout": {
              "text-font": ["arial-unicode-ms-regular"],
              "text-anchor": "center",
              "text-field": "{adcode}",
              "icon-image": "aquarium-15"
            },
            "paint": {
              "text-halo-blur": 1,
              "text-color": "#AF420A",
              "text-halo-width": 1,
              "text-halo-color": "#f0efec"
            },
            "source": "DLTB",
            "source-layer": "china",
            "type": "symbol",
            "id": "Continent"
          }]
        }
        // style = styleJSON
        console.log("style???", style)
        this.esriUtils.loadVectorTileLayer(style)
      },

      handleLoadPG3() {
        let style = {
          "version": 8,
          "name": "test",
          "sprite": "http://localhost:8080/style/sprites/sprite/",
          "glyphs": "http://localhost:8080/style/fonts/{fontstack}/{range}.pbf",
          "sources": {
            "DLTB": {
              "type": "vector",
              "tiles": [
                "http://192.168.0.165:9998/base/proxy/service/xyz/8799cf01728145d781ca155e3f1e7139/{z}/{x}/{y}",
                // "http://192.168.0.165:9998/vector/tiles/64d6ec69586f4192b319d6c0cb0e9b26/{z}/{x}/{y}"
              ],
              "maxzoom": 20,
              "minzoom": 0
            }
          },
          "layers": [{
            "id": "DLTB",
            "type": "fill",
            "source": "DLTB",
            "source-layer": "dltb_jx",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.5
            },
            "interactive": true
          }, {
            "layout": {
              "text-font": ["arial-unicode-ms-regular"],
              "text-anchor": "center",
              "text-field": "{dlbm}",
              "icon-image": "aquarium-15"
            },
            "paint": {
              "text-halo-blur": 1,
              "text-color": "#AF420A",
              "text-halo-width": 1,
              "text-halo-color": "#f0efec"
            },
            "source": "DLTB",
            "source-layer": "dltb_jx",
            "type": "symbol",
            "id": "Continent"
          }]
        }
        // style = styleJSON
        console.log("style???", style)
        this.esriUtils.loadVectorTileLayer(style)
      },

      handleLoadPG2() {
        let style = {
          "version": 8,
          "name": "test",
          // "sprite": "mapbox://sprites/mapbox/streets-v8",
          // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sources": {
            "DLTB": {
              "type": "vector",
              "tiles": [
                "http://192.168.0.165:9998/base/proxy/service/xyz/7bf9ffb963224de3a5f33ecba35653e7/{z}/{x}/{y}",
                // "http://192.168.0.165:9998/vector/tiles/64d6ec69586f4192b319d6c0cb0e9b26/{z}/{x}/{y}"
              ],
              "maxzoom": 20,
              "minzoom": 0
            }
          },
          "layers": [{
            "id": "DLTB",
            "type": "fill",
            "source": "DLTB",
            "source-layer": "dltb",
            "paint": {
              "fill-color": [
                "match",
                ["get", "dlbm"],
                ["0701", "0702"], "rgb(240,110,125)",
                ["08H1", "08H2", "0809", "0810A"], "rgb(255,170,200)",
                ["05H1", "0508"], "rgb(235,150,160)",
                "0401", "rgb(170,190,30)",
                "0403", "rgb(150,210,50)",
                "0404", "rgb(200,220,100)",
                "0601", "rgb(210,145,135)",
                "1006", "rgb(127,63,0)",
                "1201", "rgb(225,200,225)",
                "1202", "rgb(165,0,0)",
                "0102", "rgb(255,255,0)",
                ["0301", "0302", "0305", "0307"], "rgb(40,140,0)",
                ["0201", "0202", "0203", "0204"], "rgb(245,210,40)",
                ["1003", "1004"], "rgb(170,85,80)",
                ["1107", "1107A"], "rgb(160,205,240)",
                ["1101", "1104"], "rgb(150,240,255)",
                "1109", "rgb(230,130,100)",
                "#15d649"
              ],
              "fill-opacity": 0.8,
              "fill-antialias": true,
              "fill-outline-color": "#192fd1"
            },
            "interactive": true
          }]
        }
        // style = styleJSON
        console.log("style???", style)
        this.esriUtils.loadVectorTileLayer(style)
      },

      handleLoadEsri() {
        let style = {
          layers: [
            // 陆地
            // {
            //   layout: {},
            //   paint: {
            //     "fill-color": "#F0ECDB"
            //   },
            //   source: "esri",
            //   minzoom: 0,
            //   "source-layer": "Land",
            //   type: "fill",
            //   id: "Land/0"
            // },
            // {
            //   layout: {},
            //   paint: {
            //     "fill-pattern": "Landpattern",
            //     "fill-opacity": 0.25
            //   },
            //   source: "esri",
            //   minzoom: 0,
            //   "source-layer": "Land",
            //   type: "fill",
            //   id: "Land/1"
            // },
            // 海洋
            // {
            //   layout: {},
            //   paint: {
            //     "fill-color": "#93CFC7"
            //   },
            //   source: "esri",
            //   minzoom: 0,
            //   "source-layer": "Marine area",
            //   type: "fill",
            //   id: "Marine area/1"
            // },
            {
              layout: {},
              paint: {
                "fill-pattern": "Marine area",
                "fill-opacity": 0.08
              },
              source: "esri",
              "source-layer": "Marine area",
              type: "fill",
              id: "Marine area/2"
            },
            {
              layout: {
                "line-cap": "round",
                "line-join": "round"
              },
              paint: {
                "line-color": "#cccccc",
                "line-dasharray": [7, 5.33333],
                "line-width": 1
              },
              source: "esri",
              minzoom: 1,
              "source-layer": "Boundary line",
              type: "line",
              id: "Boundary line/Admin0/0"
            },
            {
              layout: {
                "text-font": ["Risque Regular"],
                "text-anchor": "center",
                "text-field": "{_name_global}"
              },
              paint: {
                "text-halo-blur": 1,
                "text-color": "#AF420A",
                "text-halo-width": 1,
                "text-halo-color": "#f0efec"
              },
              source: "esri",
              "source-layer": "Continent",
              type: "symbol",
              id: "Continent"
            },
            // 标注字体
            {
              layout: {
                "text-font": ["arial-unicode-ms-regular"],
                "text-field": "{_name}",
                "text-transform": "none",
                "icon-image": "Landpattern"
              },
              paint: {
                "text-halo-blur": 1,
                "text-color": "#AF420A",
                "text-halo-width": 1,
                "text-halo-color": "#f0efec"
              },
              source: "esri",
              minzoom: 2,
              "source-layer": "Admin0 point",
              maxzoom: 10,
              type: "symbol",
              id: "Admin0 point/large"
            }
          ],
          glyphs: "http://localhost:9530/arcgis_js_api_v418/library/4.18/fonts/{fontstack}/{range}.pbf",
          version: 8,
          sprite: "http://localhost:9530/arcgis_js_api_v418/library/4.18/sprites/sprite1/sprite/",
          sources: {
            esri: {
              url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
              type: "vector"
            }
          }
        }
        this.esriUtils.loadVectorTileLayer(style)
      },
      handleLoadEsri2() {
        let style = {
          "version": 8,
          "name": "kjr",
          "sprite": "http://localhost:9530/static/style/sprites/sprite/",
          "glyphs": "http://localhost:9530/arcgis_js_api_v418/library/4.18/fonts/{fontstack}/{range}.pbf",
          "sources": {
            "guizhou": {
              "type": "vector",
              "tiles": ["/geoserverApi/vector_tile/guizhou/guizhou_polygon/{z}/{x}/{y}.pbf"],
              // "maxzoom": 3,
              // "minzoom": 0
            },
            "guizhou_hospital": {
              "type": "vector",
              "tiles": ["/geoserverApi/vector_tile/guizhou/guizhou_point/{z}/{x}/{y}.pbf"],
            }
          },
          "layers": [{
            "id": "guizhou",
            "source": "guizhou",
            "source-layer": "guizhou_polygon",
            "type": "fill",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.6
            }
          }, {
            "id": "guizhou_hospital",
            "source": "guizhou_hospital",
            "source-layer": "guizhou_hospital",
            "type": "symbol",
            "layout": {
              "icon-image": "monument-15",
              "text-field": "{NAME}",
              "text-font": ["arial-unicode-ms-regular"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
            }
          }]
        }
        this.esriUtils.loadVectorTileLayer(style)

      },
      handleLoadEsri3() {
        let style = {
          "version": 8,
          "name": "kjr",
          "sprite": "http://localhost:9530/static/style/sprites/sprite/",
          "glyphs": "http://localhost:9530/arcgis_js_api_v418/library/4.18/fonts/{fontstack}/{range}.pbf",
          "sources": {
            "China": {
              "type": "vector",
              "tiles": ["/geoserverApi/vector_tile/China/{z}/{x}/{y}.pbf"],
              // "maxzoom": 3,
              // "minzoom": 0
            }
          },
          "layers": [{
            "id": "China_1",
            "source": "China",
            "source-layer": "China_polygon",
            "type": "fill",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.6
            }
          }, {
            "id": "China_2",
            "source": "China",
            "source-layer": "China_point",
            "type": "symbol",
            "layout": {
              "icon-image": "monument-15",
              "text-field": "{name}",
              "text-font": ["arial-unicode-ms-regular"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
            }
          }]
        }
        this.esriUtils.loadVectorTileLayer(style, 'testId')
      },
      handleChangeStyle() {
        let layer = this.esriUtils.map.findLayerById('testId')
        let styleLayer = layer.getStyleLayer('China_2')
        if (styleLayer.layout['icon-image'] === 'car-11') {
          styleLayer.layout['icon-image'] = "monument-15"
        } else {
          styleLayer.layout['icon-image'] = "car-11"
        }

        let styleLayer2 = layer.getStyleLayer('China_1')
        if (styleLayer2.paint['fill-color'] === '#088') {
          styleLayer2.paint['fill-color'] = "orange"
        } else {
          styleLayer2.paint['fill-color'] = "#088"
        }

        layer.setStyleLayer(styleLayer)
        layer.setStyleLayer(styleLayer2)
      },

      handleGeoserverVt() {
        let style = {
          "version": 8,
          "name": "China",
          // "sprite": "mapbox://sprites/mapbox/streets-v8",
          // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sources": {
            "China": {
              "type": "vector",
              "scheme": "tms",
              "tiles": [
                "http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3AChina_20210201@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf"
              ]
            }
          },
          "layers": [{
            "id": "China",
            "type": "fill",
            "source": "China",
            "source-layer": "China_20210201",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.6
            }
          }]
        }
        this.esriUtils.loadVectorTileLayer(style)
      },
      handleWms() {
        esriLoader
          .loadModules(
            ["esri/layers/WMSLayer"], ESRI_JS_API
          )
          .then(([WMSLayer]) => {
            let layer = new WMSLayer({
              url: 'http://59.49.55.155:15698/geowebcache/service/wms?', //"http://localhost:8080/geoserver/kjr/wms",
              sublayers: [{
                name: 'jincilvyouqu_img'
              }],
              customParameters: {
                // width: 968,
                // height: 794,
                // bbox: '-169.96576907908374,-139.4140645474697,169.96576207926327,139.41407154729018',
                // bbox: `${_this.view.extent.xmin},${_this.view.extent.ymin},${_this.view.extent.xmax},${_this.view.extent.ymax}`,
                // format: 'image/png',
                // request: 'GetMap',
                // service: 'WMS',
                // styles: '',
                // transparent: true,
                // version: '1.1.1',
                // srs: 'EPSG:4490',
                // layers: 'kjr:China',
              },
              // version: "1.3.0"
              // version: "1.1.1"
            });
            this.esriUtils.map.add(layer);
          })
      },
      handleReset() {
        this.esriUtils.map.removeAll()
      }
    }
  }

</script>

<style scoped>
  #app-container {
    width: 100%;
    height: calc(100vh - 50px);
    padding: 10px;
  }

  #map-view {
    width: 100%;
    height: calc(100vh - 120px);
  }

  .tools-view {
    width: 100%;
    height: 50px;
  }

</style>
