/*
 * @Description: 登录
 * @Version:
 * @Author: kangjinrui
 * @Date: 2025-01-09 15:14:50
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-09 15:28:57
 */

import request from '@/utils/request'

export const doLogin = (data) => {
  return request({
    url: `${API_URL_PRJ}/loginByUser`,
    method: 'post',
    params: data,
  })
}
