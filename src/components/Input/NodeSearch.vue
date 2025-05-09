<!--
 * @Description: 节点搜索
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-01-06 15:07:33
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-06 15:40:29
-->
<template>
  <el-autocomplete
    v-model="searchInput"
    class="inline-input"
    style="width: 100%; margin: 0 10px 0 0"
    :fetch-suggestions="querySearch"
    placeholder="请输入名称搜索"
    :trigger-on-focus="false"
    @select="handleSelect"
    clearable
    @input="handleChange"
  ></el-autocomplete>
</template>
<script>
import { getStaionsFromNode } from '@/api/index'
export default {
  props: {
    clearInput: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchInput: '',
    }
  },

  methods: {
    querySearch(queryString, cb) {
      getStaionsFromNode({
        page: 1,
        limit: 10,
        // stcd: queryString,
        stnm: queryString,
        ennmcd: '',
        ennm: '',
        sjlys: [],
        mlTypes: [],
        sttp: '',
        code: '',
        type: '',
        ysgxs: [],
      })
        .then((res) => {
          if (res.code === 200) {
            let data = res.data.list
            data.forEach((element) => {
              element['value'] = `${element.stnm || element.mlName}(${
                element.stcd || element.mlId
              })`

              // element["value"] = `${element.stnm || element.mlName}(${
              // 	element.stcd || element.mlId
              // }) ${
              // 	window.SYS_DIC_OBJ.map.DY_DIC_MAP_POINT_TYPE[element.sttp] || ""
              // }`;
            })
            cb(data)
          }
        })
        .catch((e) => {
          cb([])
        })
    },

    handleSelect(item) {
      this.curStation = item
      this.$emit('on-select', item)
      this.reset()
    },

    handleOk() {
      this.$emit('on-ok', this.curStation)
      this.reset()
    },

    handleCancel() {
      this.$emit('on-close')
      this.reset()
    },
    handleChange(e) {
      this.$emit('on-change', e)
    },

    reset() {
      if (this.clearInput) {
        this.searchInput = ''
      }
    },
  },
}
</script>
<style lang=""></style>
