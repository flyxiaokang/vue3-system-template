<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="图层" name="first">
          <span>切換底图 （{{ epsg }}）</span>
          <el-select
            v-model="value"
            size="small"
            placeholder="请选择"
            style="width: 100px"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span></span>
          <el-select
            v-model="value2"
            size="small"
            placeholder="请选择"
            style="width: 100px"
            @change="handleChange2"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-button size="small" @click="createPopup">charts</el-button>
          <el-button size="small" @click="loadGaode">高德</el-button>
          <el-button size="small" @click="loadBaidu">百度</el-button>

          <!-- <el-button
                size="small"
                @click="test2"
            >test2</el-button> -->

          <!-- <el-button
                size="small"
                @click="toPath"
            >toPath</el-button> -->
          <!-- <el-button
                size="small"
                @click="handleTest"
            >test</el-button> -->
        </el-tab-pane>

        <el-tab-pane label="绘制" name="second">
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

          <el-button size="small" @click="handleMaxMin('max')">max</el-button>
          <el-button size="small" @click="handleMaxMin('min')">min</el-button>

          <el-button size="small" @click="handleDrawEndZoom">
            end zoom
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <ArcgisMap
            class="app-content"
            :esri-path="esriConfig.api"
            :init-options="initOptions"
            :update-base-map-id="value2"
            @ready="handleReady"
            @mouse-click="handleMouseClick"
            @on-extentChange="handelExtentChange"
        /> -->

    <ArcgisMap
      class="app-content"
      @ready="handleReady"
      @mouse-click="handleMouseClick"
      @on-extentChange="handelExtentChange"
    >
      <ArcgisBasemap></ArcgisBasemap>
      <ArcgisToolbar></ArcgisToolbar>
    </ArcgisMap>
  </div>
</template>

<script>
import geoJsonPoints from '@/VMap/esri/v3/assets/json/China/China_point.json'
import ArcgisMap from '@/VMap/esri/v3/components/EsriMap.vue'
import ArcgisBasemap from '@/VMap/esri/v3/components/toolbar/MapBasemap.vue'
import ArcgisToolbar from '@/VMap/components/Map/MapToolbar.vue'
import mapConfig from './mapConfig'

export default {
  name: 'esri_service',
  components: {
    ArcgisMap,
    ArcgisToolbar,
    ArcgisBasemap
  },
  data() {
    return {
      esriConfig: {
        api: 'http://localhost:8080/arcgis_js_api/arcgis_js_api_v423',
        api: 'http://localhost/arcgis_js_api/arcgis_js_api_v423',
      },
      initOptions: {},
      activeName: 'second',
      epsg: '',
      value: 'TDT_VEC_4326',
      options: [
        {
          value: 'TDT_IMG_4326',
          label: '影像',
        },
        {
          value: 'TDT_VEC_4326',
          label: '矢量',
        },
        {
          value: 'TDT_TER_4326',
          label: '地形',
        },
      ],
      value2: 'TDT_VEC_4326',
      options2: [
        {
          value: 'TDT_VEC_4326',
          label: 'TDT_VEC_4326',
        },
        {
          value: 'TDT_IMG_4326',
          label: 'TDT_IMG_4326',
        },
        {
          value: 'TDT_IMG_4490',
          label: 'TDT_IMG_4490',
        },
        {
          value: 'TDT_IMG_3857',
          label: 'TDT_IMG_3857',
        },
        {
          value: 'GD_VEC',
          label: 'GD_VEC',
        },
        {
          value: 'BD_VEC',
          label: 'BD_VEC',
        },
      ],
      lon: 0,
      lat: 0,

      valueType: '',
      optionsType: [
        {
          label: 'Point',
          value: 'Point',
        },
        {
          label: 'Polygon',
          value: 'Polygon',
        },
        {
          label: 'polyline',
          value: 'polyline',
        },
        {
          label: 'rectangle',
          value: 'rectangle',
        },
        {
          label: 'circle',
          value: 'circle',
        },
      ],
    }
  },
  created() {
    // 4 配置文件
    this.initOptions = mapConfig
  },
  methods: {
    handleMouseClick(e) {
      // const screenPoint = this.esriInstance.view.toScreen(e.mapPoint);
      // console.log("screenPoint", screenPoint);
    },
    handelExtentChange(e) {},
    handleReady(e) {
      this.esriInstance = e
      this.epsg = e.wkid
      this.bindPopup()
    },
    handleChange2(value) {
      // this.esriInstance.initMap({ baseMapId: value }, (e) => {
      //     setTimeout(() => {
      //         emit("ready", esriInstance);
      //         bindEvent();
      //     }, 0);
      // });
    },
    handleChange(value) {
      this.esriInstance.toggleBaseMap(value)
    },
    bindPopup() {
      // this.esriInstance.registerMapClick((e) => {
      //     console.log(e);
      //     const screenPoint = this.esriInstance.view.toScreen(e.mapPoint);
      //     console.log("screenPoint", screenPoint);
      // });
      // this.esriInstance.view.watch("extent", (e) => {
      //     this.esriInstance.updatePopups(geoJsonPoints.features);
      // });
    },
    initMap() {
      // const esriInstance = new EsriUtils()
      const esriInstance = getEsriInstance()
      window.esriInstance = esriInstance
      this.esriInstance = esriInstance
      esriInstance.initMap('TDT_IMG_4326', 'map-view', (e) => {
        // esriInstance.loadWMSLayer()
        // esriInstance.loadWMTSLayer()

        // console.log(geoJsonPoints)
        // esriInstance.createPopups(geoJsonPoints.features)

        // esriInstance.registerMapClick(e => {
        //   console.log(e)

        //   let screenPoint = esriInstance.view.toScreen(e.mapPoint);
        //   console.log('screenPoint', screenPoint);
        // })

        setTimeout(() => {
          this.esriInstance.registerMapMove((evt) => {
            // console.log(evt, )
            const point = esriInstance.view.toMap(evt)
            this.lat = point.latitude
            this.lon = point.longitude
          })
        }, 1000)
      })
    },
    initMap2() {
      const esriInstance = new EsriUtils()
      this.esriInstance = esriInstance
      window.esriInstance = esriInstance

      this.esriInstance.setMapExtent({
        xmax: 140.52900020253037,
        xmin: 63.71079520161258,
        ymax: 69.09057357183289,
        ymin: -0.6164604518570798,
      })

      // this.esriInstance.setMapExtent({
      //   xmax: 15313621.169072356,
      //   xmin: 7457117.6538108885,
      //   ymax: 8372107.100905355,
      //   ymin: 603659.0422283877
      // })

      this.esriInstance.initMap('TDT_IMG_4326', 'map-view', (e) => {
        esriInstance.registerMapClick((e) => {
          // console.log(e)
          const screenPoint = esriInstance.view.toScreen(e.mapPoint)
          console.log('screenPoint', screenPoint)
        })
        esriInstance.view.watch('extent', (e) => {
          esriInstance.updatePopups(geoJsonPoints.features)
        })
      })

      // let esriInstance = new EsriUtils()
      // this.esriInstance = esriInstance
      // window.esriInstance = esriInstance
      // esriInstance.initMapTest((map, view) => {
      //   esriInstance.registerMapClick(e => {
      //     console.log(e)
      //     let screenPoint = esriInstance.view.toScreen(e.mapPoint);
      //     console.log('screenPoint', screenPoint);
      //   })
      //   view.watch("extent", e => {
      //     esriInstance.updatePopups(geoJsonPoints.features)
      //   })
      // }, 'map-view')
    },
    createPopup() {
      this.esriInstance.createPopups(geoJsonPoints.features, {
        style: 'style1',
      })
    },
    loadGaode() {
      // this.esriInstance.loadGaodeMap();
      this.esriInstance.toggleBaseMap('GD_VEC')
    },
    loadBaidu() {
      // this.esriInstance.loadBaiduMap();
      this.esriInstance.toggleBaseMap('BD_VEC')
    },

    // loadGeoserver() {
    //     this.esriInstance.loadWMTSLayerByUrl2("");
    //     // this.esriInstance.loadWMSLayer2()
    // },

    test2() {
      this.esriInstance.mapDestroy()
      this.esriInstance.setMapExtent({
        xmax: 12517571.805503532,
        xmin: 12515911.68879546,
        ymax: 4538865.487657018,
        ymin: 4537035.865837763,
      })

      this.esriInstance.initMap('TDT_IMG_3857', 'map-view', (e) => {
        const div = document.createElement('div')
        div.id = 'popup_id'
        $('.esri-view-user-storage').append(div)

        // for (let index = 0; index < [1, 2, 3].length; index++) {
        //   const element = [1, 2, 3][index];
        //   popup.props.domIndex = index

        //   console.log(popup)
        //   var Profile = Vue.extend(popup);
        //   // 创建 Profile 实例，并挂载到一个元素上。
        //   new Profile().$mount('#popup_id');
        // }

        this.esriInstance.registerMapMove((evt) => {
          const point = esriInstance.view.toMap(evt)
          this.lat = point.latitude
          this.lon = point.longitude

          this.esriInstance.updatePopup2(point, 0)

          // this.esriInstance.openPopup({
          //   // Set the popup's title to the coordinates of the location
          //   title: 'test',
          //   location: point, // Set the location of the popup to the clicked location
          //   content: 100 // setContentInfo(sceneView.center, sceneView.scale)
          // })
        })
      })
    },

    toPath() {},

    handleTest() {
      this.esriInstance.getCustomMap()
    },

    handleMaxMin(value) {
      this.esriInstance.zoom(value)
    },

    handleTypeChange(value) {
      this.esriInstance.draw({
        type: value.toLowerCase(),
        endHandler: (e) => {
          console.log('end...', e)
        },
      })
    },

    handleDrawEnd() {
      this.esriInstance.drawHandler.drawEnd()
    },

    handleClear() {
      this.esriInstance.drawHandler.clear()
    },

    handleDrawEndZoom() {
      this.esriInstance.drawHandler.drawEnd()
    },
  },
}
</script>

<style scoped>
#app-container {
  width: 100%;
  height: 100%;
  /* padding: 10px; */
}

#map-view {
  width: 100%;
  height: calc(100vh - 120px);
}

.tools-view {
  z-index: 3999;
  width: 100%;
  height: 150px;
}

.app-content {
  position: relative;
  width: 100%;
  height: calc(100% - 150px);
  z-index: 199;
}

/deep/ .popup_content {
}

.status_bar {
  z-index: 1999;
  position: absolute;
  left: 50px;
  bottom: 60px;
  background-color: white;
}
</style>

<style scoped>
/deep/ .popup_content {
  position: absolute;
  width: 60px;
  min-height: 60px;
  /* height: 60px; */
  background-color: rgba(255, 228, 196, 0);
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
  z-index: 199;
}

/deep/ .popup_content .popup_item {
  display: flex;
  font-size: 16px;
  /* background-color: aquamarine; */
}

/deep/ .popup_content .popup_item .img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 1999;
  background: url('./assets/images/popup/circle.png') no-repeat;
  background-size: 105% 105%;
  line-height: 60px;
  text-align: center;
  /* background-color: #e2f1fb; */
  /* <img src=${require('../images/hot.png')}></img> */
}

/deep/ .popup_content .popup_item .name {
  height: 60px;
  line-height: 60px;
}

/deep/ .popup_content .popup_item span {
  padding: 3px 15px;
  background-color: #1c76f2;
  border-radius: 5px;
  color: white;
  margin-left: -10px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: bold;
  text-align: left;
  color: #ffffff;
}

/deep/ .popup_content .popup_point {
  display: flex;
  margin: auto;
  /* position: absolute;
    display: flex;
    width: 150px;
    height: 30px;
    margin-top: 0px; */
}

/deep/ .popup_content .point div {
  background: url('./assets/images/popup/location.png') no-repeat;
}

/deep/ .popup_content .popup_point div {
  /* margin: auto;
    width: 20px;
    height: 25px;
    background: url("./assets/images/location2.png") no-repeat;
    background-size: 100% 100%; */
  /* color: #1C76F2; */
}

/deep/ .popup_content .popup_point_1 div {
  margin: auto;
  width: 20px;
  height: 25px;
  background: url('./assets/images/popup/1.png') no-repeat;
  background-size: 100% 100%;
  /* color: #1C76F2; */
}

/deep/ .popup_content .popup_point_2 div {
  margin: auto;
  width: 20px;
  height: 25px;
  background: url('./assets/images/popup/2.png') no-repeat;
  background-size: 100% 100%;
  /* color: #1C76F2; */
}

/deep/ .popup_content .popup_point_3 div {
  margin: auto;
  width: 20px;
  height: 25px;
  background: url('./assets/images/popup/3.png') no-repeat;
  background-size: 100% 100%;
  /* color: #1C76F2; */
}

/deep/ .popup_content .popup_point_4 div {
  margin: auto;
  width: 20px;
  height: 25px;
  background: url('./assets/images/popup/4.png') no-repeat;
  background-size: 100% 100%;
  /* color: #1C76F2; */
}

/deep/ .popup_content .popup_point_5 div {
  margin: auto;
  width: 20px;
  height: 25px;
  background: url('./assets/images/popup/5.png') no-repeat;
  background-size: 100% 100%;
  /* color: #1C76F2; */
}

/deep/ .popup_content3 {
  position: absolute;
  /* width: 150px; */
  /* height: 60px; */
  /* background-color: rgba(255, 228, 196, 0); */
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
  height: auto;
  width: auto !important;
  background-color: white;
  padding: 10px;
  /* box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 80%); */
}

/deep/ .popup_content3 .popup_item {
  width: 100%;
  display: inline-block;
  font-size: 14px;
  padding: 5px;
  /* height: 40px; */
}

/deep/ .popup_content3 .popup_item span {
}

/deep/ .popup_content3 .title {
  padding: 5px 10px;
}

/deep/ .popup_content3 .title span {
  padding: 2px 10px;
  background-color: #1c76f2;
  color: white;
  /* border-radius: 3px; */
}

/deep/ .popup_content3 .popup_point {
  position: absolute;
  bottom: -35px;
}
</style>
