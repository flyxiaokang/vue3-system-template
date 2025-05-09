/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-11-27 20:54:07
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-23 11:33:19
 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 全局注册icon
import * as ELIcons from '@element-plus/icons-vue'

export default (app) => {
  for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
  }
  app.use(ElementPlus, {
    locale: zhCn,
    size:'default'
  })
}
