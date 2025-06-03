<!--
 * @Description: gaode
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-01-26 15:21:22
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-26 15:34:40
-->

<template>
  <Layer :map-provider="V_MAP_PROVIDER.gdmap" url="gaode"></Layer>
</template>
<script setup>
import { V_MAP_PROVIDER } from '@/VMap/global';
import Layer from '../layer/index.vue'

</script>
<style scoped>
  
</style>
