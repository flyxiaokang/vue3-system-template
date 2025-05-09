<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-08 10:23:21
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-11 14:46:57
-->

<template>
  <div>
    <icon-ic-baseline-arrow-circle-right size="64" color="red" />

    <icon-ic-baseline-5g size="64" color="red" />

    <el-icon size="32" color="red">
      <IconIcBaseline5g />
    </el-icon>

    <IconVcSttp />

    <el-icon size="64" color="red">
      <IconVcSttp />
    </el-icon>

    <el-icon style="color: red" size="120">
      <IconVcBug />
    </el-icon>

    <!-- <el-icon
            size="120"
            color="orange"
        >
            <IconBaseline5g />
        </el-icon>
        <el-icon size="120">
        <icon-test-404></icon-test-404>
        </el-icon> -->

    <el-input v-model="text"></el-input>
  </div>
</template>
<script setup>
// import IconBaseline5g from "~icons/ic/baseline-5g";
// import IconIcArrow from '~icons/ic/baseline-arrow-circle-right'
// import IconTestSttp from "~icons/test/sttp";
import { ref } from 'vue'

const text = ref('123')
</script>

<script>
export default {
  name: 'icon-json2',
}
</script>
<style></style>
