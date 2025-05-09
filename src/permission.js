/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-12-30 10:24:14
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-09 15:00:50
 */
import router from './router/index'
import setting from './setting'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { accessToken, recordLogin } from '@/api/user'

import {
  getToken,
  setToken,
  removeToken,
  setSingleToken,
  removeSingleToken,
  clearStorage,
} from './utils/auth'

NProgress.configure({
  showSpinner: false,
}) // NProgress Configuration

const getDics = async () => {
 
}

const getSingleSignCode = () => {
  const { loginCode = 'ticket' } = {}
  var reg = new RegExp(`(^|&)${loginCode}=([^&]*)(&|$)`)
  var r = window.location.search.substr(1).match(reg)
  let code = ''
  if (r != null) code = unescape(r[2])
  return code
}

const getAcceseToken = (code, callback) => {
  accessToken({
    grant_type: 'authorization_code',
    client_id: SINGLE_SIGN_CONFIG.cas.client_id,
    client_secret: SINGLE_SIGN_CONFIG.cas.client_secret,
    code: code,
    redirect_uri: SINGLE_SIGN_CONFIG.cas.serverUrl,
  })
    .then((response) => {
      console.log(response)
      if (response.status !== undefined) {
        if (response.status === 2) {
          // const params = {
          //   userName: response.data.NAME,
          //   userCode: response.data.INFO.USER_INFO.USER_CD,
          //   unitName: response.data.INFO.USER_INFO.UNIT_NAME,
          //   unitCode: response.data.INFO.USER_INFO.UNIT_CD,
          // }
          // if (params.userCode && params.unitCode && params.userName) {
          //   recordLogin(params).catch((err) => {})
          // }
          localStorage.setItem('mp_sys_username', response.data.NAME)
          setToken(response.data.token)
          setSingleToken()
          // localStorage.setItem('mp_sys_username', response.data.NAME || '')
          // if (response.data.INFO.USER_INFO) {
          //   localStorage.setItem(
          //     'mp_sys_usercode',
          //     response.data.INFO.USER_INFO.USER_CD || ''
          //   )
          // }
          // localStorage.setItem('dy_sys_user_addvcd', response.data.ADDVCD || '')
          callback()
        } else if (response.status === -4) {
          Message.error(response.msg)
        } else {
          Message.error(response.msg)
        }
      }
    })
    .catch((error) => {
      window.open(SINGLE_SIGN_CONFIG.cas.loginUrl, '_self')
      reject(error)
    })
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = `${to.meta.title} | ${setting.title}` || '空白'
  // const role = localStorage.getItem('mp_sys_username')
  const singleSignCode = getSingleSignCode()

  const hasToken = getToken()
  console.log('hasToken======', hasToken)
  console.log('singleSignCode======', singleSignCode)

  if (SINGLE_SIGN_CONFIG.cas.cas && !singleSignCode) {
    // 跳转到登录页面
    try {
      // await store.dispatch('user/logout')
      removeToken()
      removeSingleToken()
      clearStorage()
      window.open(
        SINGLE_SIGN_CONFIG.cas.loginUrl + '&ran=' + Math.random(),
        '_self'
      )
    } catch (e) {
      removeToken()
      // removeTourToken()
      clearStorage()
      window.open(
        SINGLE_SIGN_CONFIG.cas.loginUrl + '&ran=' + Math.random(),
        '_self'
      )
    }

    return
  } else if (hasToken) {
    // await getDics()
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/',
      })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    if (SINGLE_SIGN_CONFIG.cas.cas) {
      // 单点登录
      if (singleSignCode) {
        getAcceseToken(singleSignCode, () => {
          next()
          NProgress.done()
        }).finally((e) => {
          next()
          NProgress.done()
        })
      } else {
        // 跳转到登录页面
        window.open(
          SINGLE_SIGN_CONFIG.cas.SINGLE_SIGN_CONFIG.cas.loginUrl +
            '&ran=' +
            Math.random(),
          '_self'
        )
        NProgress.done()
      }
    }
    // 正常登录
    else if (to.path !== '/login') {
      next('/login')
      NProgress.done()
    }
    // else if (to.meta.permission) {
    //   // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    //   role === 'admin' ? next() : next('/403')
    //   NProgress.done()
    // }
    else {
      next()
      NProgress.done()
    }
  }
})
