/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-11-18 11:21:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-01 11:43:12
 */

// const modulesFiles = require.context('./components', true, /\.vue$/)
// import MapEsri from './modules-v3/esri/widgets/MapEsri.vue'
// const VcPlugins = {
//     install: (Vue) => {
//         modulesFiles.keys().reduce((modules, modulePath) => {
//             const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//             const value = modulesFiles(modulePath)
//             modules[moduleName] = value.default
//             Vue.component(modules[moduleName].name, modules[moduleName])
//             return modules
//         }, {})
//     },
//     components: modulesFiles.keys().reduce((modules, modulePath) => {
//         const value = modulesFiles(modulePath)
//         const name = value.default.name
//         value.default.install = Vue => {
//             Vue.component(name,value.default)
//         }
//         modules[name] = value.default
//         return modules
//     }, {})
// }

const modulesFiles = import.meta.globEager('@/VMap/components/**/*.vue')

const VcPlugins = {
  install: (Vue) => {
    Object.keys(modulesFiles).reduce((modules, modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
      const value = modulesFiles[modulePath]
      modules[moduleName] = value.default
      if (value.default.name) {
        Vue.component(value.default.name, value.default)
      }
      return modules
    }, {})
  },
  components: Object.keys(modulesFiles).reduce((modules, modulePath) => {
    const value = modulesFiles[modulePath]
    const name = value.default.name
    value.default.install = (Vue) => {
      Vue.component(name, value.default)
    }
    modules[name] = value.default
    return modules
  }, {}),
}


// const VcPlugins = {
//   install: (Vue) => {
//     Object.keys(modulesFiles).reduce((modules, modulePath) => {
//       debugger;
//       const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
//       const value = modulesFiles[modulePath];
//       modules[moduleName] = value.default;
//       if (value.default) {
//         let name = value.default.substring(value.default.lastIndexOf('/') + 1);
//         name = name.split('.')[0];
//         Vue.component('IconVc' + name, import(`~icons/vc/${name}`)['default']);
//       }
//       return modules;
//     }, {});
//   },
//   // components: Object.keys(modulesFiles).reduce((modules, modulePath) => {
//   //   const value = modulesFiles[modulePath]
//   //   const name = value.default.name
//   //   value.default.install = (Vue) => {
//   //     Vue.component(name, value.default)
//   //   }
//   //   modules[name] = value.default
//   //   return modules
//   // }, {}),
// };

export default VcPlugins
