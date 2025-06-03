<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 15:55:57
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-02 10:47:14
-->
<template>
  <Layer :map-provider="getMapProvider" />
</template>

<script setup>
import Layer from "../layer/index.vue";

import { ref, toRefs, computed } from "vue";
import { isString } from "@/VMap/public/utils/base/validate";

const props = defineProps({
  mapProvider: {
    type: String,
    default: "wmts",
    validator(value) {
      return isString(value) && ["wmts", "rest", "style"].includes(value);
    },
  },
});

const { mapProvider } = toRefs(props);
const getMapProvider = computed(() => {
  return "supermap" + mapProvider.value.toLowerCase();
});
</script>

<script>
export default {
  name: "OlSupermap",
};
</script>

<style lang="scss" scoped></style>
