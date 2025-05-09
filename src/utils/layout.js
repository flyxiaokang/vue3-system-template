/*
 * @Description: 布局自适应
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-14 11:07:05
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-29 10:09:59
 */

import ElementResizeDetectorMaker from 'element-resize-detector'
import { nextTick } from 'vue'

export function layoutUpdate({
  tableHeight,
  container = 'table-container',
  offset = 0,
}) {
  const className = `.${container}`
  nextTick(() => {
    ElementResizeDetectorMaker().listenTo(
      document.querySelector(className),
      (e) => {
        tableHeight.value = e.clientHeight + offset
      }
    )

    tableHeight.value = document.querySelector(className).clientHeight + offset
  })
}
