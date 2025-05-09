<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-17 18:11:28
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-31 15:28:19
-->
<template>
    <div>
        <el-input v-model="input"></el-input>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const input = ref('123456')
</script>


<script>
export default {
    name:'permission'
}
</script>
<style>
    
</style>