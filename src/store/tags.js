/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-03-31 10:36:57
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-09 16:25:18
 */

import { defineStore } from 'pinia'

// const aaa = []
// for (let index = 0; index < 30; index++) {
//     aaa.push({
//         title:'测试',
//         meta:{
//             keepAlive:false
//         },
//         path:'/404'
//     })
// }
export const useTagsStore = defineStore('tags', {
  state: () => ({
    list: [],
    collapse: false,
  }),

  getters: {
    tagsList: (state) => {
      return state.list.map((item) => item.name)
    },
    // collapse: (state) => {
    //     return state._collapse
    // },
  },

  actions: {
    delTagsItem(index) {
      this.list.splice(index, 1)
    },
    setTagsItem(data) {
      this.list.push(data)
    },
    clearTags() {
      this.list = []
    },
    closeTagsOther(data) {
      this.list = [data]
    },
    closeCurrentTag({ route, router }) {
      debugger
      for (let i = 0, len = this.list.length; i < len; i++) {
        const item = this.list[i]
        if (item.fullPath === route.fullPath) {
          if (i < len - 1) {
            router.push(this.list[i + 1].fullPath)
          } else if (i > 0) {
            router.push(this.list[i - 1].fullPath)
          } else {
            router.push('/')
          }
          this.list.splice(i, 1)

          break
        }
      }
      this.setIndexPage(router)
    },

    setIndexPage(router) {
      if (this.list.length === 0) {
        this.list.push({
          name: 'dashboard',
          title: '首页',
          path: '/dashboard',
          meta: {
            keepAlive: true,
          },
          fullPath: '/dashboard',
        })
        router.push('/dashboard')
      }
    },
  },
})
