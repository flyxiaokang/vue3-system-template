<!--
 * @Description: 用户选择器
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-04-01 16:02:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-01 16:29:21
-->
<template>
  <el-cascader
    v-model="userId"
    :options="usersOptions"
    placeholder="请选择"
    style="width: 140px"
    clearable
    :show-all-levels="false"
    :props="{ emitPath: false, label: 'createUser', value: 'createUserId' }"
    @change="handleChange"
    filterable
  ></el-cascader>
</template>

<script setup>
import { getUserListApi } from '@/api/user'
import { onMounted } from 'vue'
import { ref } from 'vue'

const emits = defineEmits(['change'])

const userInfo = JSON.parse(localStorage.getItem('mp_sys_userinfo'))
const userId = ref(localStorage.getItem('mp_sys_usercode'))
const usersOptions = ref([])

onMounted(() => {
  getUserListApi().then((res) => {
    if (Array.isArray(res.data)) {
      usersOptions.value = res.data
      usersOptions.value.unshift({
        createUser: userInfo.NAME,
        createUserId: userInfo.USER_CD,
      })
      usersOptions.value.unshift({ createUser: '全部', createUserId: '' })
    }
  })
})

const handleChange = (e) => {
  emits('change', e)
}
</script>

<style scoped></style>
