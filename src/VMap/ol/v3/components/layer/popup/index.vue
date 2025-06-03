<!--
 * @Description: 自定义popup
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-09-04 20:56:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-03-07 16:28:04
-->
<template>
  <MapPopup
    v-show="showPopup"
    :theme="theme"
    :title="title"
    :show-title="showTitle"
    :popupId="popupId"
    :contentHtml="popupContentHtml"
    @on-close="close"
    :class="popupClass"
  >
    <slot></slot>
  </MapPopup>
</template>
<script setup>
import { ref, toRefs, watch, inject, onMounted, onUnmounted } from 'vue'
import MapPopup from '@/VMap/ol/v3/components/popup/index.vue'
import { useProps } from './usePopup'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

const olHandler = inject('olHandler')
const props = defineProps({
  ...useProps,
  showTitle: {
    type: Boolean,
    default: true,
  },
  position: {
    type: [Array, undefined],
    default() {
      return undefined
    },
  },
})
const emits = defineEmits(['on-close', 'on-ready'])

const popupId = 'vmap-popup-id-' + uuidOnlyStr()
const popupContentHtml = ref('')
const showPopup = ref(false)
const popupClass = ref('vmap-popup-visible-' + uuidOnlyStr())

const { showTitle, position } = toRefs(props)

watch(
  position,
  (nv) => {
    init(nv)
  },
  {
    deep: true,
  }
)

let overlay = null
const openFeaturePopup = (position, properties = []) => {
  overlay = olHandler.createOverlay({
    popupId,
    center: position,
    offset: [0, 0],
    collection: false,
  })
  showPopup.value = true
  emits('on-ready', overlay)
}

const init = (position) => {
  if (overlay === null) {
    openFeaturePopup(position)
  }
  overlay.setPosition(position)
}

onMounted(() => {
  init(position.value)
})

const close = () => {
  overlay.setPosition(undefined)
  emits('on-close')
  return false
}

const handleReset = () => {
  if (overlay) {
    olHandler.map.removeOverlay(overlay)
    overlay = null
  }
}

defineExpose({
  close,
})

onUnmounted(() => {
  handleReset()
})
</script>

<script>
export default {
  name: 'OlPopup',
}
</script>
<style lang="scss" scoped></style>
