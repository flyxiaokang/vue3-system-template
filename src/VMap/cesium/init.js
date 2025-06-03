/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-02-24 18:01:14
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-27 23:07:05
 */

import CesiumHandler from './lib/bussiness/CesiumHandler'
/**
 * cesium
 * @returns cesium
 */
export function getCesiumInstance(domId) {
    return new CesiumHandler(domId)
}
