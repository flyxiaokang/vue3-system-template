<!--
 * @Description: 定位
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-01-03 09:18:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-03 09:51:59
-->

<template>
  <div style="display: flex">
    <el-button
      :type="bActive ? 'default' : 'primary'"
      :icon="bActive ? Close : Location"
      circle
      @click="bActive = !bActive"
    />
    <el-form
      v-if="bActive"
      :inline="true"
      :model="locationObj"
      class="demo-form-inline"
      style="margin-left: 10px"
    >
      <el-form-item label="">
        <el-input-number
          v-model="locationObj.lon"
          :min="-180"
          :max="180"
          :step="0.1"
          style="width: 120px"
          controls-position="right"
          @change="handleChange"
          placeholder="经度"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input-number
          v-model="locationObj.lat"
          :min="-90"
          :max="90"
          :step="0.1"
          style="width: 120px"
          controls-position="right"
          @change="handleChange"
          placeholder="纬度"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLocation">定位</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { Location, Close } from '@element-plus/icons-vue'
import { toRefs } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  lon: {
    type: [Number, null],
    default: null,
  },
  lat: {
    type: [Number, null],
    default: null,
  },
})
const {lon,lat} = toRefs(props)

const emits = defineEmits(['on-location'])

const bActive = ref(false)
const locationObj = ref({
  lon: null,
  lat: null,
})

const handleChange = () => {}

const handleLocation = () => {
  emits('on-location',[locationObj.value.lon,locationObj.value.lat])
}

defineExpose({
  locationObj
})
</script>

<style scoped></style>
