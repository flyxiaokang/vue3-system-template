<template>
  <div id="app-container">
    <div class="tools-view">
      <el-button type="primary" @click="handleLoadMapboxStyle">mapbox style</el-button>
      <el-button type="primary" @click="handleLoadGeoserver">geoserver vectorTile</el-button>
      <el-button type="primary" @click="handleReset">重置</el-button>
    </div>
    <div id="map-view">
    </div>
  </div>
</template>

<script>
  import * as esriLoader from 'esri-loader'

  import EsriUtils from '../../assets/js/esriUtils'
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
        esriUtils.initMap('TDT_IMG_3857', 'map-view', (map, view) => {
          view.center = [112.500000, 30.489949]
          view.zoom = 3

        })
      },
      handleLoadMapboxStyle() {
        let style = {
          "version": 8,
          "name": "China3",
          "sprite": "mapbox://sprites/mapbox/streets-v8",
          "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
          "sources": {
            "base_test": {
              "type": "vector",
              "tiles": ["http://localhost:8080/vector_tile/China3/{z}/{x}/{y}.pbf"],
              "maxzoom": 3,
              "minzoom": 0
            }
          },
          "layers": [{
            "id": "China",
            "source": "base_test",
            "source-layer": "China",
            "type": "fill",
            'paint': {
              "fill-color": "#088",
              "fill-outline-color": "red",
              "fill-opacity": 0.5
            }
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
                "/geoserverApi/geoserver/gwc/service/tms/1.0.0/kjr%3Acountries@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf"
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
