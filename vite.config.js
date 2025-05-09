import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  return {
    // base: env.VITE_MODE_NAME === 'development' ? '/local' : '/online',
    base: '/platform',
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // symbolId: 'icon-[name]', // 支持目录层级：'icon-[dir]-[name]'
        // inject: 'body-last',    // DOM插入位置
        // customDomId: '__svg_icons' // 自定义容器ID
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      // visualizer(),
    ],
    optimizeDeps: {
      // include: ['schart.js']
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      host: '0.0.0.0',
      port: '8207',
      // proxy: {
      //     // 字符串简写写法
      //     '/foo': 'http://localhost:4567',
      //     // 选项写法
      //     '/api': {
      //         target: 'http://jsonplaceholder.typicode.com',
      //         changeOrigin: true,
      //         rewrite: (path) => path.replace(/^\/api/, '')
      //     },
      //     // 正则表达式写法
      //     '^/fallback/.*': {
      //         target: 'http://jsonplaceholder.typicode.com',
      //         changeOrigin: true,
      //         rewrite: (path) => path.replace(/^\/fallback/, '')
      //     },
      //     // 使用 proxy 实例
      //     '/api': {
      //         target: 'http://jsonplaceholder.typicode.com',
      //         changeOrigin: true,
      //         configure: (proxy, options) => {
      //             // proxy 是 'http-proxy' 的实例
      //         }
      //     },
      //     // Proxying websockets or socket.io
      //     '/socket.io': {
      //         target: 'ws://localhost:3000',
      //         ws: true
      //     }
      // }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  }
})
