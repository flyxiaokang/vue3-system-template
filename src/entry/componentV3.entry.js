/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-11-18 11:21:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-03-28 15:17:19
 */

const modulesFiles = import.meta.globEager('@/VMap/components-v3/**/*.vue')

const install = (Vue) => {
  Object.keys(modulesFiles).reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles[modulePath]
    modules[moduleName] = value.default
    if (value.default.name) {
      console.log('========', value.default.name)
      Vue.component(value.default.name, value.default)
    }
    return modules
  }, {})
}

export default {
  install
}
