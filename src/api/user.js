/*
 * @Description: 用户相关接口
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-01-20 17:02:25
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-01 16:11:21
 */
import request from '@/utils/request';
// url: '/user/login',
export function login(data) {
    return request({
        url: `${API_URL_PRJ}/loginByUser`,
        method: 'post',
        params: data
    });
}

export function getOnlineUser(data) {
    return request({
        url: '/sys/rbac/online',
        method: 'post',
        data: data
    });
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: { token }
    });
}

export function logout() {
    return request({
        url: `/user/logout`,
        method: 'post'
    });
}
export function hbswLogout() {
    return request({
        url: `${API_URL_PRJ}/user/logout`,
        method: 'post'
    });
}

export function loginBySly(data) {
    return request({
        url: `${API_URL_PRJ}/loginBySly`,
        method: 'post',
        params: data
    });
}
export function accessToken(data) {
    return request({
        url: SINGLE_SIGN_CONFIG.cas.myAccessToken,
        method: 'post',
        params: data
    });
}
/**
 * 记录登录用户
 * @param {*} data 
 * @returns 
 */
export function recordLogin(data) {
    return request({
        url: `${API_URL_WARNFORE}/app/userManager/dyhblogininfo/save`,
        method: 'post',
        data: data
    });
}
/**
 * 登录用户记录统计列表
 * @param {*} data 
 * @returns 
 */
export function recordLoginList(data) {
    return request({
        url: `${API_URL_WARNFORE}/app/userManager/dyhblogininfo/getLoginUserUnitStaticInfo`,
        method: 'post',
        data: data
    });
}
/**
 * 登录用户x信息列表
 * @param {*} data 
 * @returns 
 */
export function loginUserInfoList(data) {
    return request({
        url: `${API_URL_WARNFORE}/app/userManager/dyhblogininfo/listPaging`,
        method: 'post',
        data: data
    });
}
/**
 * 访问量统计
 * @param {*} data 
 * @returns 
 */
export function viewCount(data={}) {
    return request({
        url: `${API_URL_WARNFORE}/app/userManager/dyhblogininfo/countAllEnh`,
        method: 'post',
        data
    });
}
/**
 * 提示更新信息
 * @param {*} data 
 * @returns 
 */
export function tipUpdateInfo(data) {
    return request({
        url: `${API_URL_WARNFORE}/app/updInfo/dyhbupdinfo/list`,
        method: 'post',
        data: data
    });
}

export function getUserListApi(data = {}) {
    return request({
        url: `${API_URL_PLAN}/app/plan/dyplanb/listuser`,
        method: 'post',
        data: data
    });
}
