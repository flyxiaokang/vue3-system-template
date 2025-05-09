/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2025-02-28 17:29:43
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-14 15:53:34
 */

import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { OlHandler } from 'v-openlayers'

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    loading: false,
    pageLoading: false,
    olHandler: shallowRef(new OlHandler()),
    schemeId: '1900368903109697537',
    topoId: '1900368903109697537',
    tableHeight:500,
    tableNodes: shallowRef([]),
    tableLinks: shallowRef([]),
    tableSubcs: shallowRef([]),
    schemeIdEdit: '', //编辑id
    schemeIdBuild: '', //构建id
    onSchemeChange: false, //更新方案
    onModelChange: false, //更新模型
  }),

  getters: {},

  actions: {
    updateLoading(e) {
      this.loading = e
    },
    updatePageLoading(e) {
      this.pageLoading = e
    },
    updateTableNodes(data) {
      this.tableNodes = data.map((e) => {
        e['code'] = e.stcd || e.nodeId
        return e
      })
    },
    updateTableLinks(data) {
      this.tableLinks = data
    },
    updateTableSubcs(data) {
      this.tableSubcs = data
    },
    setTableHeight(e) {
      this.tableHeight = e
    },
    setOlHandler(e) {
      this.olHandler = e
    },
    setSchemeId(e) {
      this.schemeId = e
    },
    setTopoId(e) {
      this.topoId = e
    },
    setSchemeIdEdit(e) {
      this.schemeIdEdit = e
    },
    setSchemeIdBuild(e) {
      this.schemeIdBuild = e
    },
    emitSchemeChange() {
      this.onSchemeChange = !this.onSchemeChange
    },
    emitModelChange() {
      this.onModelChange = !this.onModelChange
    }
  },
})
