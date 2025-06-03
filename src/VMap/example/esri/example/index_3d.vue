<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-13 15:21:22
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-04-13 15:21:23
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <!-- <el-button type="primary" @click="handleLoadWmts" size="small">wmts</el-button>
      <el-button type="primary" @click="handleLoadWms" size="small">wms</el-button>
      <el-button type="primary" @click="handleLoadArcgisFeature" size="small">arcgis feature layer</el-button>
      <el-button type="primary" @click="handleLoadArcgisTile" size="small">arcgis tile</el-button> -->

      <el-button type="primary" @click="cardIndex = 0" size=small>cameraCard</el-button>
      <el-button type="primary" @click="cardIndex = 1" size=small>gotoCard</el-button>

      <el-button type="primary" @click="handlePoint" size=small>3d point</el-button>


      <el-button type="primary" @click="gotoPoint" size=small>gotoPoint</el-button>
      <el-button type="primary" @click="handleReset" size=small>重置</el-button>
    </div>
    <div id="viewDiv">
    </div>

    <el-card class="box-card" v-show="cardIndex == 0">
      <div slot="header" class="clearfix">
        <span>camera</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="cardIndex = -1">X</el-button>
      </div>
      <div class="text item">
        <el-switch v-model="bUpdateView" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
        heading<el-slider v-model="heading" :min="0" :max="360"></el-slider>
        tilt<el-slider v-model="tilt" :min="0" :max="180"></el-slider>
        fov<el-slider v-model="fov" :min="0" :max="90"></el-slider>
        <br>
        <!-- <el-button type="primary" @click="handleGoto" size=small>定位</el-button> -->

      </div>
    </el-card>

    <el-card class="box-card" v-show="cardIndex == 1">
      <div slot="header" class="clearfix">
        <span>goto</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="cardIndex = -1">X</el-button>
      </div>
      <div class="text item">
        <el-button type="primary" @click="handleGoto(0)" size=small>default</el-button>
        <el-button type="primary" @click="handleGoto(1)" size=small>slow</el-button>
        <el-button type="primary" @click="handleGoto(2)" size=small>fast</el-button>
        <el-button type="primary" @click="handleGoto(3)" size=small>10s</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as esriLoader from 'esri-loader'
  import EsriUtils from '../../assets/js/esriUtils'

  import {
    V_BASE_MAP,
    V_MAP_PROVIDER
  } from '@/assets/js/esriUtilsConfig'

  export default {
    data() {
      return {
        esriUtils: null,
        bShowCamera: false,
        bUpdateView: false,

        cardIndex: -1,

        heading: 0,
        tilt: 0,
        fov: 90,

        curCamera: null
      }
    },
    watch: {
      heading() {
        this.updateCamera()
      },
      tilt() {
        this.updateCamera()
      },
      fov() {
        this.updateCamera()
      }
    },
    mounted() {
      this.esriUtils = new EsriUtils()
      this.initMap()
    },
    methods: {
      initMap() {
        esriLoader
          .loadModules(
            ["esri/Map", "esri/Basemap", "esri/views/SceneView", "esri/layers/WebTileLayer"], ESRI_JS_API
          )
          .then(([Map, Basemap, SceneView, WebTileLayer]) => {
            // const map = new Map({
            //   basemap: "topo-vector",
            //   ground: "world-elevation"
            // });

            let baseMap = 'TDT_IMG_3857'

            let image_layer = new WebTileLayer({
              urlTemplate: V_BASE_MAP[baseMap],
              opacity: 1,
              visible: true
            })
            let image_layer_label = new WebTileLayer({
              urlTemplate: V_BASE_MAP[baseMap + '_LABEL'],
              opacity: 1,
              visible: true
            })
            let customBasemap = new Basemap({
              baseLayers: [image_layer, image_layer_label],
              id: "myBasemap"
            })

            var map = new Map({
              basemap: customBasemap,
              ground: "world-elevation"
            });

            const view = new SceneView({
              container: "viewDiv",
              map: map,
              scale: 50000000,
              center: [110, 31.78]
            });

            this.esriUtils.map = map
            this.esriUtils.view = view

            this.isWebmocat = true

            view.watch('camera', e => {
              if (!this.bUpdateView) {
                this.heading = view.camera.heading
                this.tilt = view.camera.tilt
                this.fov = view.camera.fov
              }
            })
          })
      },
      handleLoadWmts() {
        this.esriUtils.loadWMTSLayer()
      },
      handleLoadWms() {
        this.esriUtils.loadWMSLayer()
        const newCam = this.esriUtils.view.camera.clone();
        newCam.heading = 0;
        newCam.tilt = 0;
        this.esriUtils.view.camera = newCam;
        // this.esriUtils.view.goTo({
        //   target: [121, 31, 1000],
        //   // heading: 180,
        //   tilt: 0
        // });
      },
      handleLoadArcgisFeature() {
        let mapInfo = {
          id: '121',
          url: 'http://114.250.29.198:8091/arcgis/rest/services/44current/44sxs/MapServer/0',
          type: 'arcgisfeature'
        }
        mapInfo = {
          id: '121',
          url: 'http://114.250.29.198:8091/arcgis/rest/services/44current/44sxs/MapServer',
          type: 'arcgis_mapServer'
        }

        this.esriUtils.loadMap(mapInfo, true)

      },
      handleLoadArcgisTile() {

      },

      handleTest() {
        this.bShowCamera = !this.bShowCamera
      },
      updateCamera() {
        this.curCamera = this.esriUtils.view.camera.clone()
        const newCam = this.esriUtils.view.camera.clone();
        console.log(newCam)
        newCam.heading = this.heading
        newCam.tilt = this.tilt
        newCam.fov = this.fov

        if (this.bUpdateView)
          this.esriUtils.view.camera = newCam;
      },
      handleGoto(index) {
        let view = this.esriUtils.view

        function shiftCamera(deg) {
          var camera = view.camera.clone();
          camera.position.longitude += deg;
          return camera;
        }

        function catchAbortError(error) {
          if (error.name != "AbortError") {
            console.error(error);
          }
        }
        // this.esriUtils.view.goTo(this.curCamera)
        if (index === 0) {
          view.goTo(shiftCamera(60)).catch(catchAbortError);
        } else if (index === 1) {
          view.goTo(
            shiftCamera(60),
            // Animation options for a slow linear camera flight
            {
              speedFactor: 0.1,
              easing: "linear"
            }
          ).catch(catchAbortError);
        } else if (index === 2) {

        } else if (index === 3) {
          view.goTo(shiftCamera(30), {
            duration: 10000,
            maxDuration: 10000 // Make sure to set maxDuration if the duration is bigger than 8000 ms
          }).catch(catchAbortError);
        }
      },
      gotoPoint() {
        let view = this.esriUtils.view
        esriLoader
          .loadModules(
            ["esri/Camera", "esri/geometry/Point"], ESRI_JS_API
          )
          .then(([Camera, Point]) => {

            let points = [{
              xyz: {
                x: 116.6023125743745, // lon
                y: 28.71405818617602, // lat
                z: 5299.641727423295, // elevation in meters
              },
              heading: 356.6751186709658,
              tilt: 82.8803140567452,
              fov: 55
            }, {
              xyz: {
                x: 108.21089472954584, // lon
                y: 32.14460043296877, // lat
                z: 9007405.771977887, // elevation in meters
              },
              heading: 0.043278341163464906,
              tilt: 0.9238303515950826,
              fov: 55
            }, {
              xyz: {
                x: 106.37495861316137, // lon
                y: 29.774680617689544, // lat
                z: 1767.4837813423946, // elevation in meters
              },
              heading: 267.8424855762954,
              tilt: 72.19887013939581,
              fov: 55
            }]

            let cam = new Camera({
              position: new Point(points[0].xyz),
              heading: points[0].heading, // facing due south
              tilt: points[0].tilt, // bird's eye view
              fov: points[0].fov
            });

            let cam2 = new Camera({
              position: new Point(points[1].xyz),
              heading: points[1].heading, // facing due south
              tilt: points[1].tilt, // bird's eye view
              fov: points[1].fov
            });

            let cam3 = new Camera({
              position: new Point(points[2].xyz),
              heading: points[2].heading, // facing due south
              tilt: points[2].tilt, // bird's eye view
              fov: points[2].fov
            });
            // view.goTo(cam);
            view.goTo(cam)
              .then(function () {
                setTimeout(() => {
                  return view.goTo(cam2);
                }, 2000);
              })
              .then(function () {
                setTimeout(() => {
                  return view.goTo(cam3);
                }, 4000);
              });

          })
      },

      handlePoint() {
        this.esriUtils.map.destroy()

        esriLoader
          .loadModules(
            ["esri/Map", "esri/Basemap", "esri/views/SceneView", "esri/layers/SceneLayer", "esri/layers/FeatureLayer"],
            ESRI_JS_API
          )
          .then(([Map, Basemap, SceneView, SceneLayer, FeatureLayer]) => {
            // setup the renderer with color visual variable
            const renderer = {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "point-3d", // autocasts as new PointSymbol3D()
                symbolLayers: [{
                  type: "icon", // autocasts as new IconSymbol3DLayer()
                  size: 1.7
                }]
              },
              visualVariables: [{
                // shade each airport a different color based on its type
                type: "color",
                field: "type_airport",
                stops: [{
                    value: 1,
                    color: [252, 12, 245]
                  },
                  {
                    value: 3,
                    color: [83, 0, 244]
                  },
                  {
                    value: 7,
                    color: [4, 245, 248]
                  }
                ]
              }]
            };

            // Create SceneLayer from a Scene Service URL
            const sceneLayer = new SceneLayer({
              url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Airports_PointSceneLayer/SceneServer/layers/0",
              renderer: renderer // Set the renderer to sceneLayer
            });

            const countries = new FeatureLayer({
              url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer",
              renderer: {
                type: "simple",
                symbol: {
                  type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                  symbolLayers: [{
                    type: "fill", // autocasts as new FillSymbol3DLayer()
                    material: {
                      color: [0, 0, 0, 0]
                    },
                    outline: {
                      color: [4, 245, 248]
                    }
                  }]
                }
              }
            });

            // Create Map
            const map = new Map({
              layers: [countries, sceneLayer],
              ground: {
                opacity: 0.6,
                surfaceColor: "black"
              }
            });

            // Create the SceneView
            const view = new SceneView({
              container: "viewDiv",
              map: map,
              environment: {
                starsEnabled: false,
                atmosphereEnabled: false,
                background: {
                  type: "color",
                  color: "black"
                }
              }
            });

            this.esriUtils.map = map
            this.esriUtils.view = view
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

  #viewDiv {
    width: 100%;
    height: calc(100vh - 120px);
  }

  .tools-view {
    width: 100%;
    height: 50px;
  }


  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 380px;
    position: absolute;
    right: 10px;
    top: 10px;
  }

</style>
