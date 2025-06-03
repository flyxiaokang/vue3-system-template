<!--
 * @Description: 工具条
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-26 15:28:18
-->

<template>
  <div class="vmap-mapbar" :style="getStyle">
    <el-tooltip content="工具箱" placement="right">
      <el-button type="primary" circle @click="handleToggle">
        <SvgIcon
          icon-class="map-box"
          size="20"
          color="white"
          style="margin-left: 2px"
        />
      </el-button>
    </el-tooltip>
    <div v-if="isCollapse">
      <el-tooltip
        v-for="(item, index) in menus"
        :content="item.label"
        :key="index"
        placement="right"
      >
        <el-button
          circle
          style="margin-left: 0"
          size="default"
          type="primary"
          @click="handleClick(item, index)"
        >
          <SvgIcon
            :icon-class="item.icon"
            size="20"
            color="white"
            style="margin-left: 2px"
          />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup name="OlToolbar">
import { onMounted, ref, toRefs, watch, inject } from "vue";
import { V_MOUSE_STATUS } from "@/VMap/global";
import { useProps, useEmits, usePosition } from "@/VMap/public/use/usePosition";

import { toolbar } from "../mapBar";

const olHandler = inject("olHandler");
const mapConfig = inject("mapConfig");

const props = defineProps({
  ...useProps,
  offset: {
    type: Array,
    default() {
      return [0, 50];
    },
  },
  expand: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits([...useEmits]);

const { expand } = toRefs(props);

const getPosition = usePosition(toRefs(props));
const getStyle = ref({
  ...getPosition.value,
  width: "30px",
  "text-align": "center",
});

let menus = ref(
  toolbar.map((e) => {
    return {
      ...e,
      icon: "map-" + e.icon,
    };
  })
);
onMounted(() => {
  if (mapConfig.toolbar && mapConfig.toolbar instanceof Array) {
    menus.value = menus.value.concat(
      mapConfig.toolbar.filter((e) => e.visible)
    );
  }

  console.log("===", menus.value);
});

let isCollapse = ref(!expand.value);
const handleToggle = () => {
  isCollapse.value = !isCollapse.value;
};

const curToolIndex = ref(-1);
const handleClick = (item, index) => {
  if (index !== 6) {
    curToolIndex.value = index;
  } else {
    curToolIndex.value = -1;
  }
  const { key, handler } = item;
  handleMapTool({ key, handler: handler }, index);
};

const handleMapTool = (item, index) => {
  const { key, handler } = item;
  switch (key) {
    case "fullExtent":
      olHandler.fullExtent();
      break;
    case "zoomIn":
      olHandler.dragZoom(false);
      break;
    case "zoomOut":
      olHandler.dragZoom(true);
      break;
    case "pointer":
      olHandler.endDragZoom();
      olHandler.map.set("mouseStatus", V_MOUSE_STATUS.none);
      break;
    case "LineString": // 测距
      olHandler.getMeasureHandler().measureLength();
      break;
    case "Polygon": // 测面
      olHandler.getMeasureHandler().measureArea();
      break;
    case "clear":
      olHandler.getMeasureHandler().clearResult();
      break;
    case "xzq":
      break;
    case "layer":
      break;
    case "locate":
      break;
    case "draw":
      break;
    default:
      break;
  }
  emits("change", handler || key);
};
</script>

<style scoped></style>
