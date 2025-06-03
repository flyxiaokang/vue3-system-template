import path from 'path'

const build_enum = {
  ol: 'v-openlayers',
  esri: 'vue-arcgis-map',
  cesium: 'v-cesiumjs',
  componnets: 'vue3-widgets',
}
const curBuildName = build_enum.ol

export function getBuild(name) {
  if (name === build_enum.ol) {
    return {
      outDir: 'publish/ol/package', //输出文件名称
      lib: {
        entry: path.resolve(__dirname, './src/entry/ol.entry.js'), //指定组件编译入口文件
        name: name,
        fileName: name,
        formats: ['es'],
      }, //库编译模式配置
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: [
          'vue',
          'echarts',
          'jquery',
          'element-plus',
          '@element-plus/icons-vue',
          'ol',
          '@supermapgis/iclient-ol',
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      }, // rollup打包配置
    }
  } else if (name === build_enum.esri) {
    return {
      outDir: 'publish/esri/package', //输出文件名称
      lib: {
        entry: path.resolve(__dirname, './src/entry/esri.entry.js'), //指定组件编译入口文件
        name: name,
        fileName: name,
      }, //库编译模式配置
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', 'jquery', 'esriLoader'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      }, // rollup打包配置
    }
  } else if (name === build_enum.cesium) {
    return {
      outDir: 'publish/cesium/package', //输出文件名称
      lib: {
        entry: path.resolve(__dirname, './src/entry/cesium.entry.js'), //指定组件编译入口文件
        name: name,
        fileName: name,
        formats: ['es'],
      }, //库编译模式配置
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: [
          'vue',
          'echarts',
          'jquery',
          'element-plus',
          'vue-cesium',
          '@element-plus/icons-vue',
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      }, // rollup打包配置
    }
  } else if (name === build_enum.componnets) {
    return {
      outDir: 'publish/components-vue3/package', //输出文件名称
      lib: {
        entry: path.resolve(__dirname, './src/entry/componentV3.entry.js'), //指定组件编译入口文件
        name: name,
        fileName: name,
        formats: ['es'],
      }, //库编译模式配置
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: [
          'vue',
          'echarts',
          'jquery',
          'element-plus',
          '@element-plus/icons-vue',
          'ol',
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      }, // rollup打包配置
    }
  }
}