<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-02-27 14:20:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-30 10:58:29
-->
<template>
  <div>
    <!-- 基础用法 -->
    <SvgIcon icon-class="geometry-cube" color="red" />
    <!-- 尺寸颜色控制 -->
    <SvgIcon icon-class="common-cross" size="54" color="black" />
    <!-- 添加动画 -->
    <SvgIcon icon-class="common-max" class="animate-spin" color="blue" />

    <SvgIcon
      v-for="(item, index) in svgList"
      :icon-class="item.name"
      :key="key"
      :size="item.size"
      :color="item.color"
    ></SvgIcon>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import { color } from 'highcharts';
import { ref } from 'vue'
const svgList = ref([
  {
    name: 'geometry-cube',
    size: 20,
    color:'red'
  },
  {
    name: 'common-cross',
    size: 30,
    color:'blue'
  },
])
</script>

<style scoped></style>
