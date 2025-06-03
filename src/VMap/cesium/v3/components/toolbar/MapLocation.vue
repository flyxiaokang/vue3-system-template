<!--
 * @Description: 定位
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-02-09 10:38:17
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-15 15:04:04
-->

<template>
  <transition name="el-fade-in-linear">
    <Draggable
      :title="'定位'"
      initWidth="260"
      initHeight="auto"
      initTop="15"
      initLeft="15"
      @closeDraggable="closeModal"
    >
      <div style="width: 100%; height: 100%; margin-top: 20px">
        <el-form
          :label-position="'right'"
          label-width="70px"
          :model="'right'"
          style="max-width: 220px"
        >
          <el-form-item label="经度">
            <el-input v-model="position.lon" />
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="position.lat" />
          </el-form-item>
          <el-form-item label="高度">
            <el-input v-model="position.height" />
          </el-form-item>
          <el-form-item label="heading">
            <el-input v-model="position.heading" />
          </el-form-item>
          <el-form-item label="pitch">
            <el-input v-model="position.pitch" />
          </el-form-item>
          <el-form-item label="roll">
            <el-input v-model="position.roll" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleOk"> 定位 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </Draggable>
  </transition>
</template>

<script setup>
import { reactive, inject } from 'vue'
import Draggable from '@/VMap/components/Draggable/index.vue'

debugger
const cesiumHandler = inject('cesiumHandler')
const emits = defineEmits(['on-close', 'on-location'])

console.log('???',cesiumHandler)

const closeModal = () => {
  emits('on-close')
}

const position = reactive({
  lon: 116.39,
  lat: 39.9,
  height: 100000,
  heading: 0,
  pitch: -89.74026687972041,
  roll: 0,
})

const handleOk = () => {
  debugger
  cesiumHandler.flyToView(position)
}
</script>

<style></style>
