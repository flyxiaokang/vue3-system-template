/*
 * @Description: 通用配置
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-12-24 14:11:40
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-29 19:14:04
 */
// const API_URL_BASE = `http://10.1.102.189:8700/dyapi`
// const API_URL_BASE = `http://localhost/mpapi/`
// const API_URL_BASE = ``
// const API_URL_BASE = "http://10.243.45.113:8080/dyapi"
const API_URL_BASE = "https://10.243.45.113/dyapi"
const API_URL_GIS = '/gis'
const API_URL_PLAN = '/gw-cloud-plan'
const API_URL_PRJ = '/gw-dypri-service'
const API_URL_WARNFORE = '/gw-cloud-warnfore'
const API_URL_ENGINE = '/gw-cloud-engine'
const API_URL_MODEL = '/gw-cloud-model'
const API_URL_CALIB = '/gw-cloud-calib'
const API_URL_SYS = '/gw-cloud-sys'

/**
 * @typedef GLOBAL_DIC_DB_TYPE
 * @property {Object} GLOBAL_DIC_DB.list  字典列表
 * @property {Object} GLOBAL_DIC_DB.map   字典映射
 * @property {Object} GLOBAL_DIC_DB.SYS_MODEL_DIC  模型字典
 * @property {Object} GLOBAL_DIC_DB.SYS_MODEL_TREE  模型分类树
 * @property {Object} GLOBAL_DIC_DB.SYS_HADOOP_MODEL_TREE  分布式模型字典
 *
 */
/**
 * @type GLOBAL_DIC_DB_TYPE
 */
const GLOBAL_DIC_DB = {}

const dy_config = {
  ext: {},
}

// 单点登录
const SINGLE_SIGN_CONFIG = {
  duration: 2000,
  newLine: `http://10.1.58.38:8080/GCXServiceWeb/static/html/station.jsp?t=${new Date().getTime()}&`,
  // 多源
  cas: {
    cas: false,
    serverUrl: 'https://10.243.45.113/hbsw',
    loginUrl:
      'http://10.243.45.222:8085/sso/auth?redirect=https://10.243.45.113/dy-baseinfo',
    // "http://10.243.45.222:8085/sso/auth?redirect=http://localhost/dy-baseinfo",
    client_id: '110107',
    client_secret: '110107',
    accessToken: 'https://id.mwr.cn/cas/oauth2.0/accessToken',
    myAccessToken: API_URL_PRJ + '/idportal/cas/oauth2.0/accessTokenHB', //本地转换验证token，调用门户accessToken
    appId: 'b517cf671c0d4458bfb34df50c84e2f1',
    tokenUrl: 'https://10.243.45.222/ysjc/user/getToken',
    infoTokenUrl: 'https://10.243.45.222:8083/ysjc/user/getToken',
    cardUrl: 'https://10.243.45.222/ysjc/zhzs/getuserclient',
    userInfoUrl: 'https://10.243.45.222:8083/userInfo',
  },
}
