<!--
 * @Description: svg-icon
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-04-30 09:17:50
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-30 10:47:19
-->
<template>
  <svg :class="svgClass" :style="svgStyle" aria-hidden="true">
    <use :xlink:href="iconHref"></use>
  </svg>
</template>

<script setup>
import { toRefs } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 20,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})

const { iconClass, className, size, color } = toRefs(props)

const iconHref = computed(() => `#icon-${iconClass.value}`)
const svgClass = computed(() => `svg-icon ${className.value}`)
const svgStyle = computed(() => {
  return { width: size.value, height: size.value, color: color.value }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
