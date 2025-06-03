<!--
 * @Description: 
 * @Author: kangjinrui
 * @Date: 2025-05-09 11:37:22
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-18 16:15:42
 * @FilePath: \dywebd:\kjr\git\vue3-system-manager\src\VMap\ol\v3\components\layer\overlay\index.vue
-->
<!--
 * @Description: overlay
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:11:12
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-12 15:31:07
-->
<template>
  <div v-show="false" :id="popupId" :class="getClass">
    <div v-if="showTitle" class="vmap-title">
      <span class="popup-title">{{ title }}</span>
      <span class="popup-title-close" @click="handleClose"></span>
    </div>
    <div :id="contentId" class="vmap-popup-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { miniUUID } from "@/VMap/public/utils/base/string";
import {
  ref,
  toRefs,
  onMounted,
  computed,
  watch,
  reactive,
  provide,
  inject,
  nextTick,
  onUnmounted,
} from "vue";

import { V_THEME } from "@/VMap/global";
const olHandler = inject("olHandler");
const props = defineProps({
  theme: {
    type: String,
    default: V_THEME.dark,
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "标题",
  },
  position: {
    type: [Array, String],
    default() {
      return undefined;
    },
  },
  content: {
    type: Object,
    default() {
      return {};
    },
  },
  contentHtml: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["on-close"]);

let overlay = null;
const { position, theme } = toRefs(props);
watch(position, () => {
  if (isValidPostion.value) {
    if (overlay) {
      overlay.setPosition(position.value);
    } else {
      init();
    }
  }
});

const getClass = computed(() => {
  return ["vmap-ol-popup", theme.value];
});

onMounted(() => {
  nextTick((e) => {
    init();
  });
});

// 弹窗id
const popupId = ref("overlayid-" + miniUUID());
// 弹窗内容id
const contentId = ref(popupId.value + "_content");
// console.log("========", popupId.value, contentId.value);
// 初始化
const init = () => {
  if (isValidPostion.value) {
    if (overlay) {
      olHandler.map.removeOverlay(overlay);
    }
    overlay = olHandler.createOverlay({
      popupId: popupId.value,
      center: position.value,
      offset: [0, 0],
      collection: false,
      options: {
        className: "vmap-overlay-top",
      },
    });
  }
};

const isValidPostion = computed(() => {
  if (
    (position.value instanceof Array && position.value.length === 2) ||
    position.value === undefined
  ) {
    return true;
  } else {
    console.warn("[v-openlayers]不合法的postion");
    return false;
  }
});

const handleClose = () => {
  if (overlay) {
    overlay.setPosition(undefined);
  }
  emits("on-close");
};

onUnmounted(() => {
  if (overlay) {
    olHandler.map.removeOverlay(overlay);
  }
});
</script>

<script>
export default {
  name: "OlOverlay",
};
</script>

<style lang="scss" scoped>
.vmap-ol-popup {
  position: absolute;
  background-color: #00000080;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  bottom: 12px;
  left: -47px;
  min-width: 99px !important;
  border-radius: 5px;
  padding: 0;
  min-height: 26px;
}

.vmap-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #409eff;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.vmap-ol-popup:after,
.vmap-ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.vmap-ol-popup.light:after {
  border-top-color: rgb(0, 0, 0, 0.5);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vmap-ol-popup.dark:after {
  border-top-color: rgb(0, 0, 0, 0.5);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vmap-ol-popup:before {
  border-top-color: rgb(0, 0, 0, 0.5);
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.popup-title-close:after {
  content: "✖";
}

.popup-title {
  position: absolute;
  color: white;
  font-weight: bold;
  top: 0px;
  left: 8px;
}

.popup-title-close {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.light .vmap-popup-content {
  background-color: white;
  color: black;
}

.dark .vmap-popup-content {
  color: white;
}

.vmap-popup-content {
  width: 100%;
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
