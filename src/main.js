/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-12-11 16:15:00
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-30 10:26:29
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './permission'

import 'v-openlayers/package/style.css'
import VMap from 'v-openlayers'

import installElementPlus from './plugins/element'
import 'virtual:svg-icons-register' // 必须引入的虚拟模块

import VxeUITable from 'vxe-table'
import VxeUiPC from "vxe-pc-ui"
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'

import './assets/css/icon.css'

import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import Draggable from '@/components/Draggable/index.vue'

const app = createApp(App)
const pinia = createPinia()
installElementPlus(app)

app.use(VMap)
app.use(VxeUITable).use(VxeUiPC)
app.component('SvgIcon', SvgIcon)
app.component('Draggable', Draggable)

app.use(router).use(pinia).mount('#app')

// 异常提示
// app.config.errorHandler = (err, vm, info) => {
//     console.log('[全局异常]', err, vm, info)
// }
