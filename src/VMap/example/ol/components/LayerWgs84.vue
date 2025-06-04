<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-06-04 09:48:27
-->
<template>
  <div style="width: 100%; height: 100%">
    <div style="height: 100px; display: flex; flex-direction: column">
      <div>
        <el-checkbox v-model="visibleValue">点线面</el-checkbox>
        <el-checkbox v-model="modifyableValue">编辑</el-checkbox>
        <el-checkbox v-model="tdtVisibleValue">tdt</el-checkbox>
        <el-checkbox v-model="supermapVisibleValue">supermap</el-checkbox>
        <el-checkbox v-model="wmtsVisibleValue">wmts</el-checkbox>
        <el-checkbox v-model="wmtsXmlVisibleValue">wmts-xml</el-checkbox>
        <el-checkbox v-model="vectorTileVisibleValue">vectorTile</el-checkbox>
        <el-checkbox v-model="arcgisImageVisibleValue">arcgis</el-checkbox>
        <el-checkbox v-model="wmsVisibleValue">wms</el-checkbox>
        <el-checkbox v-model="gaodeVisible">gaode</el-checkbox>
        <el-checkbox v-model="baiduVisible">baidu</el-checkbox>
        <el-checkbox v-model="supermapVtVisibleValue">supermap vt</el-checkbox>
        <el-checkbox v-model="popupVisibleValue">popup显隐</el-checkbox>
        <el-button @click="handleAddPopup">增加</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="handleChangePolygon"
          >update polygon</el-button
        >
        <el-button type="primary" size="small" @click="handleGetLayer"
          >update vectorTile</el-button
        >
      </div>
      <el-slider
        style="width: 150px"
        v-model="opacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </div>

    <!-- <VueDraggablePanel
      :init-top="20"
      :init-left="20"
      :init-height="500"
      :init-width="600"
      maximize
    ></VueDraggablePanel>

    <VueDraggablePanel
      :init-top="120"
      :init-left="120"
      :init-height="500"
      :init-width="600"
      theme="dark"
    ></VueDraggablePanel> -->

    <OlMap
      style="height: calc(100% - 100px)"
      theme="light"
      use-element-plus
      :map-config="mapConfig"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
    >
      <OlToolbar></OlToolbar>
      <OlBasemap></OlBasemap>

      <!-- overlay -->
      <OlOverlay :title="'test3'" :position="overlayPosition" :theme="'dark'">
        <!-- <div
          style="display: flex; flex-direction: row"
          v-for="(value, key) in featureProperties"
          :key="key"
        >
          <div style="min-width: 100px; text-align: right">{{ key }}:</div>
          <div style="min-width: 100px; text-align: left; margin-left: 10px">
            {{ value }}
          </div>
        </div> -->
        <!-- <VueCard></VueCard> -->
      </OlOverlay>

      <!-- popup -->
      <OlPopup
        title="属性"
        theme="light"
        :show-title="false"
        :position="curPosition"
      >
        <label>自定义内容</label>
      </OlPopup>

      <OlPopup
        v-if="popupVisibleValue"
        v-for="(item, index) in popups"
        :key="index"
        title="属性"
        :show-title="false"
        :position="item.position"
      >
        <div
          style="
            width: 100%;
            height: 60px;
            background: rgb(236 253 245);
            border-radius: 5px;
          "
        >
          {{ item.label }}
        </div>
      </OlPopup>

      <!-- <OlPopup
        title="属性"
        :position="curPosition"
      >
         <template v-slot="slotProps">
          <div v-for="(item,index) in slotProps.data" :key="index">
            {{ item.value }}
          </div>
         </template>
      </OlPopup> -->

      <!-- vector -->
      <OlVector
        :features="PointsJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :layer-style="pointStyle2"
        :z-index="1000"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PointsJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :layer-style="pointStyle3"
        :z-index="1000"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="MultLinesJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :layer-style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PolygonJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :z-index="103"
        :layer-style="polygonStyle"
        @select-change="handleSelectChange"
      />

      <!-- <OlVector
        :features="PointGeojson"
        :modifiable="modifyableValue"
        :style="pointStyle"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PolylineGeojson"
        :modifiable="modifyableValue"
        :style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PolygonGeojson"
        :modifiable="modifyableValue"
        :layer-style="polygonStyle"
        :z-index="103"
        @select-change="handleSelectChange"
      /> -->

      <!-- tianditu -->
      <OlTdt
        map-style="img"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      />
      <OlTdt
        map-style="img_label"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      />

      <!-- supermap wmts-->
      <!-- <OlSupermap
        :visible="supermapVisibleValue"
        :url="superMapWmtsUrl_hb.url"
        :request-params="superMapWmtsUrl_hb.requestParams"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :origin="origin"
        :resolutions="resolutions"
        :z-index="33"
      /> -->

      <OlSupermap
        :visible="supermapVisibleValue"
        :url="superMapWmtsUrl.url"
        :request-params="superMapWmtsUrl.requestParams"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :z-index="32"
      />

      <!-- style -->
      <OlSupermap
        map-provider="style"
        :visible="supermapVtVisibleValue"
        :url="supermapVtStyleUrl"
        :styleloaded="handleStyleloaded"
        :z-index="1999"
      />

      <OlSupermap
        map-provider="style"
        :visible="supermapVtVisibleValue"
        :url="supermapVtStyleUrl2"
        :styleloaded="handleStyleloaded"
        :z-index="1999"
      />

      <!-- rest -->
      <OlSupermap
        map-provider="rest"
        :visible="supermapVisibleValue"
        :url="superMapWmtsUrlRest"
        :z-index="30"
      >
      </OlSupermap>

      <!-- wmts geoserver -->
      <!-- <OlTile
        :url="wmtsConfig.url"
        :request-params="wmtsConfig.requestParams"
        :visible="wmtsVisibleValue"
        :opacity="opacity"
        :z-index="11"
      /> -->

      <!-- wmts supermap -->
      <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl.url"
        :request-params="superMapWmtsUrl.requestParams"
        :visible="wmtsVisibleValue"
        :opacity="opacity"
        :z-index="11"
      /> -->
      <!-- wmts -->
      <OlTile
        map-provider="wmts"
        :url="superMapWmtsUrl.url"
        :request-params="superMapWmtsUrl.requestParams"
        :visible="wmtsVisibleValue"
        :opacity="opacity"
        :z-index="11"
      />

      <!-- xml -->
      <OlTile
        map-provider="wmts-xml"
        url="https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100"
        :request-params="{
          layer: 'China4326',
          matrixSet: 'Custom_China4326',
          urlTemplate:
            'https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100/China4326/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        }"
        :visible="wmtsXmlVisibleValue"
        :opacity="opacity"
        :z-index="12"
      />

      <OlTile
        map-provider="wmts-xml"
        url="https://gatewayproxy-jcpt.mwr.cn/dem30m/wmts100?k=9nJ9giJNXgOdcxbc52UfHg=="
        :request-params="{
          layer: 'dem30m',
          matrixSet: 'Custom_dem30m',
          // urlTemplate:
          //   'https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100/China4326/default/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
        }"
        :visible="wmtsXmlVisibleValue"
        :opacity="opacity"
        :z-index="13"
      />

      <!-- vector tile -->
      <OlVectortile
        :url="vectorTileUrl"
        :layer-style="vectorTileStyle"
        :request-params="vectorTileParams"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
        :max-zoom="18"
        :z-index="11"
      />

      <!-- <OlVectortile
        :url="vectorTileUrlMapbox"
        :layer-style="vectorTileStyle"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
      /> -->

      <!-- arcgis -->
      <OlArcgis
        :url="arcgisTileUrl"
        :visible="arcgisImageVisibleValue"
        opacity="0.6"
        z-index="99"
      />

      <OlArcgis
        map-provider="imageTile"
        :url="arcgisImageUrl"
        :visible="arcgisImageVisibleValue"
        opacity="0.6"
        z-index="100"
      />
      <!-- <OlTile
        map-provider="arcgistile"
        :url="xyzUrl"
        :visible="arcgisVisible"
        :opacity="opacity"
      /> -->

      <OlWms
        map-provider="imageTile"
        :url="wmsUrl"
        :visible="wmsVisibleValue"
        :request-params="wmsRequest"
        z-index="200"
      />

      <OlGdmap :visible="gaodeVisible"></OlGdmap>
      <OlBdmap :visible="baiduVisible"></OlBdmap>

      <OlDrawer
        v-if="drawerVisible"
        class="vmap-drawer"
        :snap-enable="true"
        :once-only="true"
        @draw-end="handleDrawend"
        @close="drawerVisible = false"
      ></OlDrawer>

      <!-- 鹰眼 -->
      <OlEagle
        class="vmap-eagle"
        :offset="[0, 20]"
        :init-width="200"
        :init-height="200"
      ></OlEagle>
    </OlMap>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from "vue";

// com
import {
  OlMap,
  OlBasemap,
  OlToolbar,
  OlDrawer,
  OlEagle,
  OlPopup,
  OlOverlay,
  OlVector,
  OlTile,
  OlTdt,
  OlSupermap,
  OlArcgis,
  OlWms,
  OlVectortile,
  OlGdmap,
  OlBdmap,
  VueCard,
  VueDraggablePanel,
} from "@/VMap/ol/v3/components/index";

// wkt
import PointsJson from "../../data/wkt/points.json";
import MultLinesJson from "../../data/wkt/multlines.json";
import MultPolygonsJson from "../../data/wkt/multpolygons.json";
// geojson
import PolygonGeojson from "../../data/geojson/polygon.json";
import PolylineGeojson from "../../data/geojson/polyline.json";
import PointGeojson from "../../data/geojson/point.json";

// tool
import VUtils from "@/VMap/public/utils/base/index";
import { OlHandler } from "@/VMap/ol/init";
import mapConfig from "../config/mapConfig-4326";

let supermapVtStyleUrl =
  "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-pdc_wadi_spa_shuiwang/restjsr/v1/vectortile/maps/pdc_wadi_spa_shuiwang/style.json";

let supermapVtStyleUrl2 =
  "https://dtapi1.mwr.cn:8888/iserver8092/services/map-mvt-zyjdgc/restjsr/v1/vectortile/maps/zyjdgc/style.json";

const handleStyleloaded = (e) => {
  console.log("Styleloaded===", e);
};

const opacity = ref(1);
let olHandler = new OlHandler();
const handleMapReady = (e) => {
  olHandler = e;
  // addVectorLayer(styleUrl, olHandler.map);
  // const vectorLayer = olHandler.getLayerByType({
  //   type: "supermapStyle",
  //   styleUrl: supermapVtStyleUrl,
  //   styleloaded: (style) => {
  //     // console.log("styleloaded===", style, style._mbStyle.layers);
  //   },
  // });
  // olHandler.map.addLayer(vectorLayer);
};

// 创建一个高亮样式
const highlightStyle = function (feature, resolution) {
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "rgba(0, 0, 255, 1)",
      width: 3,
    }),
    text: new ol.style.Text({
      font: 'normal 400 11.19px "Microsoft YaHei"',
      placement: "point",
      fill: new ol.style.Fill({
        color: "blue",
      }),
    }),
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: "blue",
      }),
    }),
    zIndex: 999,
  });
};

// 添加矢量图层
const addVectorLayer = (styleUrl, map) => {
  const format = new ol.format.MVT();
  const style = new ol.supermap.MapboxStyles({
    style: styleUrl,
    map,
    selectedStyle: highlightStyle,
  });

  const source = new ol.source.VectorTileSuperMapRest({
    style: styleUrl,
    projection: "EPSG:4326",
    format: format,
  });

  const vectorLayer = new ol.layer.VectorTile({
    zIndex: 100,
    declutter: true,
    layerId: "fsda_spa",
    source: source,
    // style: style.getStyleFunction(),
  });
  map.addLayer(vectorLayer);

  style.on("styleloaded", () => {
    vectorLayer.setStyle(style.getStyleFunction());
    vectorLayer.set("mbStyle", style);
    console.log("style===", style, style._mbStyle.layers);
  });

  // setTimeout(() => {
  //   const targetLayer = style._mbStyle.layers.find(
  //     (layer) => layer.id === "pdc_wadi_spa_shuiwang@shuiwang2025(0_24)"
  //   );
  //   console.log("target===", targetLayer);
  //   if (targetLayer) {
  //     targetLayer.paint = {
  //       "line-width": 2.27,
  //       "line-color": "rgba(0,255,0,1.00)",
  //     };

  //     // targetLayer.changed();
  //     style.setStyle(style._mbStyle);
  //   }
  // }, 2000);
};

const handleMouseMove = (e) => {
  // getVtFeature(e);
};

const overlayPosition = ref([]);
let featureProperties = reactive({});
const showOverlay = (e) => {
  const coordinate = e.coordinate;
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || [];
  if (features.length === 0) {
    overlayPosition.value = undefined;
    return;
  }
  featureProperties = reactive({});
  const properties = features[0].getProperties();
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key];
      if (VUtils.isString(element)) {
        featureProperties[key] = element;
      }
    }
  }
  console.log(featureProperties);
  if (Object.keys(featureProperties).length > 0) {
    overlayPosition.value = coordinate;
  }
};

const handleMouseClick = (e) => {
  console.log("mouse-click===", olHandler.map.get("mouseStatus"));
  // overlay
  // showOverlay(e);
  // popup
  showFeaturePopup(e);
  // vector tile
  getVtFeature(e);
};

const getVtFeature = (e) => {
  const { map } = olHandler;
  map.forEachFeatureAtPixel(
    e.pixel,
    (feature, layer) => {
      debugger;
      if (!feature || !layer) return;
      console.log("features===", feature, layer);

      const style = layer.get("styleHandler");
      if (style) {
        const featureId = feature.getProperties()["SmID"];
        const layerName = feature.get("layer");
        console.log("图层", featureId, layerName);
        // style.setSelectedId(id, layerName);
        const targetLayer = style._mbStyle.layers.find(
          (e) => e["source-layer"] === layerName
        );
        if (targetLayer) {
          // style._mbStyle.updateStyleProperty
          targetLayer.paint = {
            ...targetLayer.paint,
            "line-color": [
              "match",
              ["get", "SmID"], // 匹配要素的id属性
              featureId,
              "#0000FF", // 选中时颜色
              "#00FF00", // 默认颜色
            ],

            // "line-color": [
            //   "case",
            //   ["==", ["feature-state", "selected"], true],
            //   "#0000FF",
            //   "#3BB2D0",
            // ],
          };
          style.setStyle(style._mbStyle);
          // layer.changed()
        }
      }

      // let geoType = feature.getGeometry()?.getType();
      // switch (geoType) {
      //   case "Point":
      //     features.POINT.push({ feature, layer });
      //     break;
      //   case "LineString":
      //   case "MultiLineString":
      //     features.LINESTRING.push({ feature, layer });
      //     break;
      //   case "Polygon": // 修正为大写'Polygon'
      //     features.POLYGON.push({ feature, layer });
      //     break;
      // }
    },
    {
      layerFilter: (layer) => {
        if (layer instanceof ol.layer.VectorTile) {
          return true;
        }
      },
    }
  );
};

const tableHeader = [
  {
    label: "第一列",
    value: "label",
    width: 200,
  },
  {
    label: "第二列",
    value: "value",
    width: 120,
  },
];

const popupVisibleValue = ref(false);
const popups = ref([
  {
    label: "我在新疆",
    position: [88, 36],
  },
  {
    label: "我在湖南",
    position: [110, 27],
  },
  {
    label: "我在北京",
    position: [116, 39],
  },
]);
const handleAddPopup = () => {
  const lonlat = [
    parseInt(20 * Math.random() + 100),
    parseInt(10 * Math.random() + 30),
  ];
  popups.value.push({
    label: "我在" + lonlat.join(","),
    position: lonlat,
  });
};

const featurePopup = ref({});
const curPosition = ref([]);
const curProperties = ref([]);
const showFeaturePopup = (e) => {
  const coordinate = e.coordinate;
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || [];
  if (features.length === 0) {
    // curPosition.value = undefined
    return;
  }
  const properties = features[0].getProperties();
  curPosition.value = coordinate;
  curProperties.value = VUtils.object2Array(properties);
  console.log(curProperties.value);
  // featurePopup.value = {
  //   location: coordinate,
  //   attributes: VUtils.object2Array(properties),
  // }
};

// 样式
const pointStyle = ref({
  icon: {
    src: new URL("../../../public/static/svg/map/location.svg", import.meta.url)
      .href,
    scale: 1,
  },
  text: {
    backgroundColor: "green",
    padding: [0, 5, 0, 5],
  },
});

const pointStyle2 = ref({
  icon: {
    src: new URL(
      "../../../public/static/svg/map/location2.svg",
      import.meta.url
    ).href,
    scale: 0.3,
    displacement: [0, 20],
  },
  text: {
    backgroundColor: "green",
    // padding: [0, 5, 0, 5],
    offsetY: -52,
    field: "gateName",
  },
});

const pointStyle3 = ref({
  circle: {
    radius: 4,
    color: "yellow",
  },
});

const clusterOptions = reactive({
  showLabel: true,
  distance: 50,
  minDistance: 0,
});

const lineStyle = ref({
  stroke: {
    color: "orange",
    width: "6",
  },
});

const polygonStyle = ref({
  fill: {
    color: "#00ff002a",
  },
  stroke: {
    color: "blue",
    width: 5,
  },
});

const visibleValue = ref(true);
const modifyableValue = ref(false);
const handleSelectChange = () => {};
const PolygonJson = ref(VUtils.deepClone(MultPolygonsJson));
const handleChangePolygon = () => {
  PolygonJson.value.forEach((p) => {
    p["style"] = {
      fill: {
        color: VUtils.getRandomRgb(0.6),
      },
      stroke: {
        width: 0,
        color: "#ff000000",
      },
    };
  });
};

const tdtVisibleValue = ref(false);

const supermapVisibleValue = ref(false);
// hebei
const superMapWmtsUrl_hb = ref({
  url: "https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100",
  requestParams: {
    layer: "China4326",
    tilematrixset: "Custom_China4326",
  },
});
const superMapWmtsUrl = ref({
  url: "https://gatewayproxy-jcpt.mwr.cn/dem30m/wmts100",
  requestParams: {
    layer: "dem30m",
    tilematrixset: "Custom_dem30m",
    k: "9nJ9giJNXgOdcxbc52UfHg==",
  },
});

const superMapWmtsUrlRest = ref(
  "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
);

const requestParamsWebmocat2 = {
  layersID: "",
};

const origin = [62.88574218750019, 66.75292968750006];
const resolutions = [
  1.4062500000022087, 0.7031249999891485, 0.35156250000645817,
  0.17578124999134512, 0.08789062499567256, 0.04394531250972024,
  0.02197265625486012, 0.01098632812743006, 0.00549316406371503,
  0.002746582031857515, 0.0013732910159287575, 6.866454960804162e-4,
  3.4332275992417075e-4, 1.7166136807812276e-4, 8.583068403906138e-5,
  4.291534201953069e-5, 2.1457682893727956e-5, 1.0728841446863978e-5,
  5.364420723431989e-6, 2.6822103617159945e-6, 1.3411051808579973e-6,
];

// supermap vt
const supermapVtVisibleValue = ref(true);

// wmts
const wmtsVisibleValue = ref(false);

const wmtsConfig = {
  url: "http://localhost:8080/geoserver/gwc/service/wmts",
  requestParams: {
    layer: "kjr:countries_3857",
    tilematrixset: "EPSG:4326",
    matrixSetPrefix: "EPSG:4326:",
    // format: 'image/png',
  },
};

const vectorTileVisibleValue = ref(false);
const vectorTileUrl = "http://localhost:8080/geoserver/gwc/service/wmts";
const vectorTileParams = ref({
  layer: "kjr:countries_4326_vt",
  // layer: 'kjr:China_3857',
});

const wmtsXmlVisibleValue = ref(false);

// const vectorTileUrl = '/geoserverApi189/gwc/service/wmts'
// const vectorTileParams = ref({
//   layer: 'basin:dy_gisobj_point',

//   // layer: 'kjr:China_3857',
// })

// const vectorTileUrlMapbox = 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3Acountries_4326_vt@EPSG%3A4326@pbf/{z}/{x}/{y}.pbf'

const vectorTileStyle = ref((feature, resolution) => {
  console.log(feature.getProperties());
  const { StyleHandler } = olHandler;
  const code = feature.get("adcode");
  const CONTINENT = feature.get("CONTINENT");
  if (code === "440000" || CONTINENT === "Asia") {
    return StyleHandler.getStyle({
      stroke: {
        color: "blue",
        width: "1",
      },
      fill: {
        color: "rgba(0,255,0,0.6)",
      },
    });
  } else {
    return StyleHandler.getStyle({
      stroke: {
        color: "blue",
        width: "1",
      },
      fill: {
        color: "rgba(0,0,255,0.6)",
      },
    });
  }
});

const handleGetLayer = () => {
  const aaa = VUtils.getRandomRgba();
  console.log(aaa);
  const getStyle = (feature) => {
    const { StyleHandler } = olHandler;
    const code = feature.get("adcode");
    if (code === "440000") {
      return StyleHandler.getStyle({
        stroke: {
          color: "blue",
          width: "1",
        },
        fill: {
          color: "rgba(255,0,255,0.6)",
        },
      });
    } else {
      return StyleHandler.getStyle({
        stroke: {
          color: "blue",
          width: "1",
        },
        fill: {
          color: aaa,
        },
      });
    }
  };

  vectorTileStyle.value = getStyle;
  // const l = olHandler.getLayerById(vectorTileParams.value.id)
  // l.setStyle(getStyle)
};

const arcgisImageVisibleValue = ref(false);
const arcgisImageUrl = ref(
  "https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer"
);

const arcgisTileUrl =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";

const wmsVisibleValue = ref(false);
const wmsUrl = "http://localhost:8080/geoserver/jinshui/wms";
const wmsRequest = {
  layers: "basin:BAS1",
};

// gaode
const gaodeVisible = ref(false);
const baiduVisible = ref(false);

// draw
const drawerVisible = ref(true);
const handleDrawend = (e) => {
  console.log(e);
};
</script>

<style scoped>
.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 70px;
}

.vmap-eagle {
  /* position: absolute;
  bottom: 60px;
  right: 70px;
  width: 230px;
  height: 230px;
  z-index: 1999; */
}
</style>
