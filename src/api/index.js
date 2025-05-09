/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-04-07 14:37:39
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-03-03 16:17:22
 */
import request from '../utils/request'

export const fetchData = (query) => {
  return request({
    url: './table.json',
    method: 'get',
    params: query,
  })
}

// 根据流域代码查询站点
export const getStaionsByBasinCode = (data) => {
  return request({
    url: `${API_URL_PLAN}/app/obj/dygisobjpoint/listWithTypePagingByParam`,
    method: 'post',
    data,
  })
}

// 点线面管理-站点查询
export const getStaionsFromNode = (data) => {
  return request({
    url: `${API_URL_PLAN}/app/obj/dygisobjpoint/listPaging`,
    method: 'post',
    data,
  })
}

// 测站管理-站点查询
export const getStaionsFromStations = (data) => {
  return request({
    url: `${API_URL_PLAN}/app/station/ststbprpb/listPaging`,
    method: 'post',
    data,
  })
}

// 测站管理-站点查询
export const getStaionsByName = (data) => {
  return request({
    url: `${API_URL_PLAN}/app/obj/dygisobjpoint/listWithTypePagingByParam`,
    method: 'post',
    data,
  })
}

// 测站管理-站点查询
export const getStaionsByStInfo = (data) => {
  return request({
    url: `${API_URL_PLAN}/app/station/ststbprpb/listPaging`,
    method: 'post',
    data,
  })
}
