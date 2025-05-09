<!--
 * @Description: draggablePanel 组件
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-02-20 15:18:48
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-30 14:43:45
-->
<template>
  <div id="draggableContainer" ref="draggableRef" :style="getStyle">
    <div class="draggableTitleClass" @mousedown="handleMousedownTitle">
      <p style="width: 100%; margin: 0px; font-size: 16px">
        {{ title }}
      </p>
      <el-icon
        :size="20"
        class="draggableIcon"
        @click="handleMin"
        v-if="![ENUM_SIZE.min].includes(defaultPanelSize) && minimize"
      >
        <svg-icon icon-class="common-min"></svg-icon>
        <!-- <icon-vc-min></icon-vc-min> -->
      </el-icon>
      <el-icon
        :size="22"
        class="draggableIcon"
        @click="handleRestore"
        v-if="[ENUM_SIZE.max, ENUM_SIZE.min].includes(defaultPanelSize)"
      >
        <svg-icon icon-class="common-restore"></svg-icon>
        <!-- <icon-vc-restore></icon-vc-restore> -->
      </el-icon>
      <el-icon
        :size="24"
        class="draggableIcon"
        @click="handleMax"
        v-if="![ENUM_SIZE.max].includes(defaultPanelSize) && maximize"
      >
        <svg-icon icon-class="common-max"></svg-icon>
        <!-- <icon-vc-max></icon-vc-max> -->
      </el-icon>
      <el-icon
        :size="20"
        class="draggableIcon"
        v-if="closeable"
        @click="handleClose"
        ><Close
      /></el-icon>
    </div>
    <div class="draggableContent" :style="getContentStyle">
      <div class="leftClass" @mousedown="handleMousedownLeft"></div>
      <div class="slotClass">
        <slot></slot>
      </div>
      <div class="rightClass" @mousedown="handleMousedownRight"></div>
    </div>
    <div class="bottomClass" @mousedown="handleMousedownBottom"></div>
    <div class="bottom-right" @mousedown="handleMousedownBR"></div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref } from 'vue'
import { onBeforeMount } from 'vue'
import { useResizeObserver } from '@vueuse/core'
const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
  initTop: {
    type: [Number, null],
    default: null,
  },
  initBottom: {
    type: [Number, null],
    default: null,
  },
  initLeft: {
    type: [Number, null],
    default: null,
  },
  initRight: {
    type: [Number, null],
    default: null,
  },
  initWidth: {
    type: [Number, null],
    default: null,
  },
  initHeight: {
    type: [Number, String],
    default: null,
  },
  contentHeight: {
    type: [Number, String],
    default: '',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  // 弃用
  minmax: {
    type: Boolean,
    default: false,
  },
  // 是否可以最小化
  minimize: {
    type: Boolean,
    default: true,
  },
  // 是否可以最大化
  maximize: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['close', 'resize'])

const {
  title,
  initTop,
  initBottom,
  initLeft,
  initRight,
  initWidth,
  initHeight,
  contentHeight,
} = toRefs(props)

const ENUM_SIZE = {
  default: 0,
  min: 1,
  max: 2,
}

const initPosition = ref({})

onBeforeMount(() => {
  initPosition.value = { ...props }
  // console.log('initposition===', initPosition)
})

let test = 0
const getStyle = computed(() => {
  const size = defaultPanelSize.value
  if (size === ENUM_SIZE.min) {
    test = 0
    return {
      bottom: '20px',
      left: '20px',
      right: null,
      width: '220px',
      height: 'auto',
    }
  } else if (size === ENUM_SIZE.max) {
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }
  } else {
    const a = {
      top: initTop.value && initTop.value + 'px',
      bottom: initBottom.value && initBottom.value + 'px',
      left: initLeft.value && initLeft.value + 'px',
      right: initRight.value && initRight.value + 'px',
      width: initWidth.value && initWidth.value + 'px',
      height: initHeight.value && initHeight.value + 'px',
    }
    return a
  }
})

const getContentStyle = computed(() => {
  const style = {
    display: defaultPanelSize.value === ENUM_SIZE.min ? 'none' : 'flex',
  }
  if (initHeight.value === 'auto') {
    style['height'] = 'auto'
    // style['height'] = 'calc(100% - 42px)'
    return style
  } else {
    style['height'] = `calc(100% - 42px)`
    return style
  }
})

const draggableRef = ref(null)

const handleMousedownTitle = (e) => {
  let el = draggableRef.value
  let disx = e.pageX - el.offsetLeft
  let disy = e.pageY - el.offsetTop
  document.onmousemove = function (e1) {
    let temp1 = e1.pageX - disx
    let temp2 = e1.pageY - disy
    el.style.left = `${temp1}px`
    if (temp2 >= 0) {
      el.style.top = `${temp2}px`
      if (defaultPanelSize.value === ENUM_SIZE.max) {
        el.style.bottom = `${e.pageY - e1.pageY}px`
        el.style.right = `${e.pageX - e1.pageX}px`
      } else if (defaultPanelSize.value === ENUM_SIZE.min) {
        el.style.bottom = null
      }else{

      }
    }
  }
  document.onmouseup = function () {
    document.onmousemove = null
    document.onmouseup = null
  }
}

const handleMousedownLeft = (e) => {
  let el = draggableRef.value
  let offsetParent = el.parentElement.offsetLeft
  var disx = e.pageX
  var temp = el.offsetWidth
  document.onmousemove = function (e) {
    var left = el.offsetLeft - (disx - e.pageX)
    var num = disx - e.pageX + temp
    el.style.left = `${e.pageX - offsetParent}px`
    el.style.width = `${num}px`
  }
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null
  }
}

const handleMousedownRight = (e) => {
  let el = draggableRef.value
  var disx = e.pageX
  var temp = el.offsetWidth
  document.onmousemove = function (e) {
    var num = e.pageX - disx + temp
    el.style.width = `${num}px`
  }
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null
  }
}

const parentClassName = 'content_custom'
const handleMousedownBottom = (e) => {
  if (isNaN(initHeight.value)) return
  let el = draggableRef.value
  const disy = e.pageY
  var temp = el.offsetHeight
  let x = 0
  document.onmousemove = function (e) {
    const h = e.pageY - disy + temp
    x = e.pageY - disy
    el.style.height = `${h}px`
  }
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null
  }
}

const handleMousedownBR = (e) => {
  const el = draggableRef.value
  const disx = e.pageX
  const disy = e.pageY
  const offsetWidth = el.offsetWidth
  const offsetHeight = el.offsetHeight
  let x = 0
  document.onmousemove = function (e) {
    const w = e.pageX - disx + offsetWidth
    const h = e.pageY - disy + offsetHeight
    x = e.pageY - disy
    el.style.width = `${w}px`
    el.style.height = `${h}px`
  }
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null
  }
}

const handleClose = () => {
  emits('close')
}

const defaultPanelSize = ref(ENUM_SIZE.default)
const handleMin = () => {
  console.log(111)
  defaultPanelSize.value = ENUM_SIZE.min
}

const handleMax = () => {
  defaultPanelSize.value = ENUM_SIZE.max
}

const handleRestore = () => {
  defaultPanelSize.value = ENUM_SIZE.default
}

useResizeObserver(draggableRef, (entries) => {
  const height = entries[0].contentRect.height
  const width = entries[0].contentRect.width
  emits('resize', {
    height,
    width,
  })
})

defineExpose({
  handleMin,
  handleRestore,
})
</script>

<style scoped>
#draggableContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  /* box-shadow: -2px 4px 3px 1px rgb(0 0 0 / 30%); */
  /* box-shadow: 5px 5px 8px 1px rgba(0, 0, 0, 0.3); */
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  z-index: 1299;
  background-color: white;
  border-radius: 5px;

  -webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;
  /* overflow-y: auto; */
}

.draggableTitleClass {
  display: flex;
  align-items: center;
  padding: 10px;
  height: 42px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 700;
  color: #268ae5;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  cursor: move;
  border-bottom: 1px solid #dddddd;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.draggableContent {
  height: auto;
  display: flex;
  width: 100%;
  background-color: white;
  padding: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  /* border: 1px solid #268ae5; */
}

.slotClass {
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  /* overflow-y: auto; */
  /* padding: 5px; */
  /* padding: 4px; */
  background-color: white;
  border-radius: 5px;
}

.draggableClose {
  cursor: pointer;
  font-size: large;
  margin-right: 5px;
}

.draggableClose:hover {
  color: blue;
}

.leftClass {
  border-left: 1px solid rgb(255, 255, 255);
  cursor: w-resize;
}

.rightClass {
  border-right: 1px solid rgb(255, 255, 255);
  cursor: e-resize;
}

.bottomClass {
  border-bottom: 1px solid rgb(255, 255, 255);
  cursor: n-resize;
}

.draggableIcon {
  cursor: pointer;
  color: #268ae5;
  margin-right: 6px;
}

.bottom-right {
  cursor: se-resize;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  position: absolute;
}
</style>
