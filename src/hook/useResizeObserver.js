/*
 * @Description: 监听容器变化
 * @Version:
 * @Author: kangjinrui
 * @Date: 2025-04-15 10:14:34
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-15 10:51:18
 */
import { nextTick } from 'vue'
import { onMounted, onUnmounted } from 'vue'

export function useResizeObserver(targetRef, callback) {
  let observer = null

  onMounted(() => {
    observer = new ResizeObserver((entries) => {
      callback(entries)
    })
    nextTick(() => {
      setTimeout(() => {
        if (targetRef.value) {
          observer.observe(targetRef.value)
        }
      }, 200);
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
