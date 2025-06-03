<!--
 * @Description: 绘制工具
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-07-07 10:49:43
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-06-03 11:51:11
-->
<template>
  <div class="vmap-drawbar">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="item.tip"
      placement="top-start"
      v-for="(item, index) in tools"
      :key="index"
    >
      <el-button :type="item.btnType" circle @click="handleDraw(item.type)">
        <svg-icon :icon-class="item.icon"></svg-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>
<script setup name="OlDrawer">
import { ref, inject, toRefs } from "vue";
import { getOlHandler } from "@/VMap/ol/init";

const props = defineProps({
  shapes: {
    type: Array,
    default() {
      return ["Point", "LineString", "Polygon", "Circle", "freehand"];
    },
  },
  snapEnable: {
    type: Boolean,
    default: false,
  },
  modifyEnable: {
    type: Boolean,
    default: false,
  },
  selectEnable: {
    type: Boolean,
    default: false,
  },
  onceOnly: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["draw-end", "close"]);

const { snapEnable, selectEnable, modifyEnable, onceOnly } = toRefs(props);

const mytools = [
  {
    icon: "map-point",
    tip: "绘制点",
    type: "Point",
    btnType: "primary",
  },
  {
    icon: "map-polyline",
    tip: "绘制线",
    type: "LineString",
    btnType: "primary",
  },
  {
    icon: "map-polygon",
    tip: "绘制面",
    type: "Polygon",
    btnType: "primary",
  },
  {
    icon: "map-polygon",
    tip: "绘制圆",
    type: "Circle",
    btnType: "primary",
  },
  {
    icon: "map-polygon",
    tip: "freehand",
    type: "freehand",
    btnType: "primary",
  },
];

const b = [
  {
    icon: "map-clear",
    tip: "清除绘制",
    type: "Clear",
    btnType: "primary",
  },
  {
    icon: "map-close",
    tip: "停止绘制",
    type: "Close",
    btnType: "danger",
  },
];

const tools = ref([]);
const c = mytools.filter((e) => props.shapes.includes(e.type));
tools.value = c.concat(b);

let olHandler = getOlHandler();
olHandler = inject("olHandler");

// 绘制
const handleDraw = (type) => {
  if (type === "Close") {
    olHandler.getDrawHandler()?.endDraw();
    emits("close");
  } else if (type === "End") {
    olHandler.getDrawHandler()?.endDraw();
  } else if (type === "Clear") {
    olHandler.getDrawHandler()?.clear();
  } else if (type === "freehand") {
    olHandler.getDrawHandler()?.endDraw();
    olHandler.getDrawHandler().drawByType({
      snapEnable: snapEnable.value,
      modifyEnable: modifyEnable.value,
      selectEnable: selectEnable.value,
      onceOnly: onceOnly.value,
      freehand: true,
      type: "Polygon",
      drawEndHandle: (e) => {
        emits("draw-end", e);
      },
    });
  } else {
    olHandler.getDrawHandler()?.endDraw();
    olHandler.getDrawHandler().drawByType({
      type,
      snapEnable: snapEnable.value,
      modifyEnable: modifyEnable.value,
      onceOnly: onceOnly.value,
      selectEnable: selectEnable.value,
      drawEndHandle: (e) => {
        emits("draw-end", e);
      },
    });
  }
};

const handleClose = () => {
  // olHandler.getDrawHandler()?.clear();
  olHandler.getDrawHandler()?.endDraw();
  emits("close");
};
</script>

<style lang="scss" scoped></style>
