<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-03-23 11:05:47
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-08 10:14:28
-->
<template>
    <div>
        <!-- <Icon icon="ic:baseline-5g" style="color:red;font-size:64px;"/>
			<Icon style="font-size:50px;color:red;" :icon="rotation" /> -->

        <!-- <rotation/> -->

        <IconBaseline5g />
    </div>
</template>

<script>
// import {
// 	Icon
// } from '@iconify/vue';

// import rotation from '@iconify-icons/ic/3d-rotation'

import IconBaseline5g from "~icons/ic/baseline-5g";

export default {
    components: {
        // Icon,
        // rotation,
        IconBaseline5g,
    },
    data() {
        return {};
    },
};
</script>