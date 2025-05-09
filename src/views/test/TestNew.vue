<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-03-22 11:18:22
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-08 10:03:22
-->
<template>
    <div class="home">
        <!-- 显示的值{{ flag }}
        <button @click="changeHander">改变值</button> -->
        <!-- <HeaderMenu /> -->

        <!-- <el-icon style="font-size:52px;"> -->
            <!-- <IconBaseline5g /> -->
        <!-- </el-icon> -->
        <br>

        <!-- <el-icon style="font-size:52px;">
            <share />
        </el-icon>

        <el-icon :size="52">
            <share />
        </el-icon> -->
    </div>
</template>
<!-- 只需要在script上添加setup -->
<script setup>
    // import IconBaseline5g from '~icons/ic/baseline-5g'
    // import DemoIcon from '@iconify-icons/dashicons/info-outline';
    // import IconBaseline5g from '@iconify-icons/ic/baseline-5g'
    // import HeaderMenu from "@/layout/components/HeaderMenu.vue";

    import {
        ref
    } from 'vue';

    let count = 1
    let flag = ref(`开端-第${count}次循环`)
    let changeHander = () => {
        flag.value = `开端-第${++count}次循环`
    }
</script>

<style scoped>

</style>