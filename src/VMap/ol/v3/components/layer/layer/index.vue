<!--
 * @Description: layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-16 15:49:29
-->
<template></template>

<script setup>
import { ref, watch, computed } from "vue";
import { uuid } from "@/VMap/public/utils/base/string";
import { useProps, useEmits, useWatch } from "../useLayer";
import { nextTick, onMounted, onUnmounted, inject, toRefs } from "vue";
import { V_MAP_PROVIDER, getTdtUrl } from "@/VMap/global.js";
import { getConfig } from "@/VMap/ol/config";
import { isString } from "@/VMap/public/utils/base/validate";
import { OlHandler } from "@/VMap/ol/init";

let olHandler = new OlHandler();
olHandler = inject("olHandler");

const props = defineProps({
  ...useProps,
  url: {
    type: String,
    default: "",
  },
  mapProvider: {
    type: String,
    default: "",
    validator(value) {
      return (
        isString(value) &&
        [
          "tdt",
          "supermap",
          "supermaprest",
          "supermapstyle",
          "wmts",
          "xyz",
          "wmsimagetile",
          "wmsimage",
          "arcgistile",
          "arcgisimagetile",
          "mapbox",
          "geoserver",
        ].includes(value.toLowerCase())
      );
    },
  },
  mapStyle: {
    type: [String, Array],
    default: "",
  },
  token: {
    type: String,
    default: "",
  },
  requestParams: {
    type: Object,
    default() {
      return {};
    },
  },
  origin: {
    type: [Array, null],
    default() {
      return null;
    },
  },
  resolutions: {
    type: [Array, null],
    default() {
      return null;
    },
  },
  matrixIds: {
    type: [Array, null],
    default() {
      return null;
    },
  },
  styleloaded: {
    type: [Function, null],
    default() {
      return null;
    },
  },
});

const emits = defineEmits(useEmits);
const {
  layerId,
  url,
  mapProvider,
  mapStyle,
  token,
  requestParams,
  layerStyle,
  styleloaded,
} = toRefs(props);

let layerObject = ref(null);
useWatch(toRefs(props), layerObject);

watch(mapStyle, (nv) => {
  createLayer();
});

const getLayerId = computed(() => {
  return layerId.value || uuid();
});

const getMapProvider = computed(() => {
  return mapProvider.value.toLowerCase();
});

const isTdt = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.tdt;
});

const isSupermapwmts = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.supermapwmts;
});

const isSupermaprest = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.supermaprest;
});

const isWmts = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.wmts;
});

const isXYZ = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.xyz;
});

const isArcgistile = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgistile;
});

const isArcgisImageTile = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgisimagetile;
});

const isArcgisImage = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgisimage;
});

const isWmsTile = computed(() => {
  return [V_MAP_PROVIDER.wmsimagetile, V_MAP_PROVIDER.wmsimage].includes(
    getMapProvider.value
  );
});

const isWmsImage = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.wmsimage;
});

const isGeoserverMvt = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.geoservermvt;
});

const isMapbox = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.mapboxmvt;
});

const isGaode = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.gdmap;
});

const isBaidu = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.bdmap;
});

const getUrl = computed(() => {
  if (isTdt.value) {
    return getTdtUrl({
      mapStyle: mapProvider.value + "_" + mapStyle.value,
      prj: olHandler.map.getView().getProjection().getCode().split(":")[1],
      token: token.value,
    });
  } else {
    if (url.value) {
      if (isArcgistile.value) {
        return url.value + "/tile/{z}/{y}/{x}";
      } else {
        return url.value;
      }
    } else {
      return "";
    }
  }
});

const createLayer = () => {
  const type = V_MAP_PROVIDER[getMapProvider.value];
  if (!type) {
    console.error("[v-openlayers] 未知的地图提供者");
    return;
  }
  const id = getLayerId.value;
  if (getUrl.value && checkUrl()) {
    olHandler.removeLayerById(id);
    const _params = {
      ...props,
      id,
      type,
      url: getUrl.value,
      params: {
        ...requestParams.value,
      },
    };
    if (mapProvider.value === V_MAP_PROVIDER["wmts-xml"]) {
      fetch(getUrl.value)
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
          _params.params["xml"] = text;
          layerObject.value = olHandler.getLayerByType(_params);
          if (layerObject.value) {
            olHandler.map.addLayer(layerObject.value);
            emits("ready", layerObject.value);
          }
        })
        .catch((e) => {
          console.error("<v-openlayers>服务异常:" + getUrl.value);
        });
    } else {
      layerObject.value = olHandler.getLayerByType(_params);
      if (layerObject.value) {
        olHandler.map.addLayer(layerObject.value);
        emits("ready", layerObject.value);
      }
    }
  } else {
    console.error(`[v-openlayers] 缺少必要的参数[url]`);
  }
};

const layerReset = () => {};

const checkUrl = () => {
  // if (isArcgistile.value) {
  //   return getUrl.value.split('/').at(-1) === 'MapServer'
  // }
  // return false
  return true;
};

onMounted((e) => {
  nextTick((e) => {
    createLayer();
  });
});

onUnmounted(() => {
  olHandler && olHandler.removeLayerById(getLayerId.value);
});
</script>
<style lang="scss" scoped></style>
