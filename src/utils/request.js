/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-05-09 16:18:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-09 09:50:44
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

const getBaseURL = () => {
  const { origin } = window.location
  return API_URL_BASE ? API_URL_BASE : `${origin}/dyapi`
}

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 1000 * 60 * 10,
  baseURL: getBaseURL(),
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject()
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    } else {
      Promise.reject()
    }
  },
  (error) => {
    console.log(error)
    ElMessage.error(error.message)
    return Promise.reject()
  }
)

export default service
