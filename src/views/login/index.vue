<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{ setting.title }}</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            show-password
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTagsStore } from '@/store/tags'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import _setting from '../../setting'

import { doLogin } from '@/api/login'
import { setToken } from '@/utils/auth'

const router = useRouter()
const param = reactive({
  username: '',
  password: '',
})

const setting = ref(_setting)

const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const login = ref(null)
const submitForm = () => {
  login.value.validate((valid) => {
    if (valid) {
      setToken('test-token')
      localStorage.setItem('mp_sys_username', param.username)
      router.push('/')
      return
      doLogin({
        ...param,
        vercode: '',
        hasCookie: true,
        isVideoUser: 2,
      }).then((res) => {
        if (res.success) {
          const { USER_INFO, UNIT_INFO } = res.data.INFO
          ElMessage.success('登录成功')
          localStorage.setItem('mp_sys_username', param.username)
          localStorage.setItem('mp_sys_usercode', USER_INFO.USER_CD)
          localStorage.setItem('mp_sys_userinfo', JSON.stringify(USER_INFO))
          setToken(param.username)
          router.push('/')
        } else {
          ElMessage.info('账号或密码错误')
        }
      })
    } else {
      ElMessage.error('登录成功')
      return false
    }
  })
}

const store = useTagsStore()
store.clearTags()
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/login/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
