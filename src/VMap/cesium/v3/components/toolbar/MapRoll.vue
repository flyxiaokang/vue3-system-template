<!--
 * @Description: 卷帘
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-01-15 15:08:01
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-01 10:36:00
-->
<template>
  <div class="vmap-roll-contanier" ref="mapContanierRef">
    <transition v-if="!isInit" name="el-fade-in-linear">
      <Draggable
        title="卷帘设置"
        initWidth="460"
        initHeight="180"
        initTop="100"
        @closeDraggable="closeModal"
      >
        <div style="width: 100%; height: 100%; padding: 0 5px">
          <el-row>
            <el-col :span="10">
              <label for="">选择图层：</label>
              <el-select
                v-model="leftLayer"
                filterable
                placeholder="请选择"
                style="margin-top: 10px"
              >
                <el-option
                  v-for="item in layerList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col style="text-align: center; margin-top: 30px" :span="4">
              <label for="">对比</label>
            </el-col>
            <el-col :span="10">
              <label for="">选择对比图层：</label>
              <el-select
                v-model="rightLayer"
                filterable
                placeholder="请选择"
                style="margin-top: 10px"
              >
                <el-option
                  v-for="item in layerList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div class="view-btn">
            <el-button @click="handleOk" type="primary">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </div>
      </Draggable>
    </transition>
    <div v-show="isInit" class="vmap-roll-mapview">
      <div class="roll-handle-contanier" @mousedown="handleMousedown">
        <div class="roll-handle-btn">
          <el-icon><MoreFilled /></el-icon>
        </div>
      </div>
      <CesiumMap
        ref="mapLeftRef"
        class="vmap-roll-map-left"
        :use-plugin="false"
        @ready="handleReadyLeft"
      ></CesiumMap>
      <CesiumMap
        ref="mapRightRef"
        class="vmap-roll-map-right"
        :use-plugin="false"
        @ready="handleReadyRight"
      ></CesiumMap>
    </div>
    <el-icon v-show="isInit" class="close-btn" @click="closeModal"
      ><Close
    /></el-icon>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Draggable from '@/VMap/components/Draggable/index.vue'
import CesiumMap from '@/VMap/cesium/v3/CesiumMap.vue'
import { V_MAP_PROVIDER } from '@/VMap/global'

const mapContanierRef = ref()
const mapLeftRef = ref()
const mapRightRef = ref()

const props = defineProps({
  layerList: {
    type: Array,
    default() {
      return [
        {
          id: 'TDT_IMG',
          label: '影像',
          order: '20',
          visible: true,
          type: V_MAP_PROVIDER.tdt,
        },
        {
          id: 'TDT_VEC',
          label: '矢量',
          order: '20',
          visible: true,
          type: V_MAP_PROVIDER.tdt,
        },
        {
          id: 'geo_wmts',
          label:'切片',
          visible: true,
          type: V_MAP_PROVIDER.geoserverwmts,
          url: 'http://localhost:8080/geoserver/gwc/service/wmts',
          layer: 'kjr:countries',
          tilematrixset: 'EPSG:3857',
          matrixSetPrefix: 'EPSG:3857:',
        },
      ]
    },
  },
})

const emits = defineEmits('close')

const isInit = ref(false)
const leftLayer = ref('')
const rightLayer = ref('')

const contanierClassName = 'vmap-roll-contanier'
let winWidth = 0
let winHeight = 0
const bindRollBtnEvent = () => {
  document.getElementsByClassName('vmap-roll-map-left')[0].style.width = '100%'
  document.getElementsByClassName('vmap-roll-map-right')[0].style.width = '100%'
  let left = document.getElementsByClassName('vmap-roll-contanier')[0]
    .offsetWidth
  document.getElementsByClassName(
    'vmap-roll-map-right'
  )[0].style.clip = `rect(0px,${winWidth}px,${winHeight}px,${left / 2}px)`
}

const offset = (curEle) => {
  let par = curEle.offsetParent,
    //获取当前元素的父参照物（不一定是父元素）
    l = curEle.offsetLeft,
    //获取当前元素相对父元素左偏离
    t = curEle.offsetTop
  //获取当前元素相对父元素上偏移
  while (par && par.tagName !== 'BODY') {
    //判断是否已经到了最外一层 并且判断父参照物存不存在
    if (!/MSIE 8\.0/.test(navigator.userAgent)) {
      //利用正则表达式判断
      l += par.clientLeft
      t += par.clientTop
    }
    l += par.offsetLeft
    //获得元素距离父元素左偏移多少
    t += par.offsetTop
    //获得元素距离父元素上偏移多少
    par = par.offsetParent
  }
  return {
    top: t,
    left: l,
  }
}

let isMove = false
const handleMousedown = () => {
  isMove = true
  const a = offset(document.getElementsByClassName('vmap-roll-contanier')[0])
  document.onmousemove = function (e) {
    // console.log(e, a, $(contanierClassName).offset())
    var left = e.pageX - a.left
    if (isMove && left >= 0) {
      var obj = document.getElementsByClassName('roll-handle-contanier')[0]
      var obj2 = document.getElementsByClassName('vmap-roll-map-right')[0]
      obj.style.left = `${left}px`
      obj2.style.clip = `rect(0px,${winWidth}px,${winHeight}px,${left}px)`
    }
  }
  document.onmouseup = function () {
    isMove = false
    document.onmousemove = document.onmouseup = null
  }
}

let eventHandleMove = null
let eventHandleMove2 = null
let eventHandleWheel = null
let eventHandleWheel2 = null
const bindCesiumMapEvent = (viewer, viewer2) => {
  function getViewPoint(viewer) {
    return {
      position: viewer.camera.position.clone(),
      orientation: {
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
    }
  }

  eventHandleMove = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  eventHandleMove.setInputAction((event) => {
    const viewPoint = getViewPoint(viewer)
    viewer2.camera.setView({
      destination: viewPoint.position,
      orientation: viewPoint.orientation,
    })
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  eventHandleMove2 = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas)
  eventHandleMove2.setInputAction((event) => {
    const viewPoint = getViewPoint(viewer2)
    viewer.camera.setView({
      destination: viewPoint.position,
      orientation: viewPoint.orientation,
    })
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  eventHandleWheel = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  eventHandleWheel.setInputAction((event) => {
    const viewPoint = getViewPoint(viewer)
    viewer2.camera.setView({
      destination: viewPoint.position,
      orientation: viewPoint.orientation,
    })
  }, Cesium.ScreenSpaceEventType.WHEEL)

  eventHandleWheel2 = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas)
  eventHandleWheel2.setInputAction((event) => {
    const viewPoint = getViewPoint(viewer2)
    viewer.camera.setView({
      destination: viewPoint.position,
      orientation: viewPoint.orientation,
    })
  }, Cesium.ScreenSpaceEventType.WHEEL)
}

let cesiumLeftIns = null
let cesiumRightIns = null
let isMapReady = false

const handleReadyLeft = (e) => {
  cesiumLeftIns = e
  initEvent()
  // e.loadBaseLayer([
  //   {
  //     id: 'TDT_IMG',
  //     order: '10',
  //     visible: true,
  //     type: V_MAP_PROVIDER.tdt,
  //   },
  //   {
  //     id: 'TDT_IMG_LABEL',
  //     order: '10',
  //     visible: true,
  //     type: V_MAP_PROVIDER.tdt,
  //   },
  // ])
}

const handleReadyRight = (e) => {
  cesiumRightIns = e
  initEvent()
  // e.loadBaseLayer([
  //   {
  //     id: 'TDT_VEC',
  //     order: '10',
  //     visible: true,
  //     opacity: 1,
  //     type: V_MAP_PROVIDER.tdt,
  //   },
  //   {
  //     id: 'TDT_VEC_LABEL',
  //     order: '10',
  //     visible: true,
  //     type: V_MAP_PROVIDER.tdt,
  //   },
  // ])
}

const initEvent = () => {
  if (cesiumLeftIns && cesiumRightIns && !isMapReady) {
    isMapReady = true
    bindCesiumMapEvent(cesiumLeftIns.viewer, cesiumRightIns.viewer)
  }
}

const initLayer = () => {
  const leftL = props.layerList.filter((e) => e.id === leftLayer.value)
  const rightL = props.layerList.filter((e) => e.id === rightLayer.value)
  if (leftL.length > 0) {
    cesiumLeftIns.addLayerByType(leftL[0])
  }
  if (rightL.length > 0) {
    cesiumRightIns.addLayerByType(rightL[0])
  }
}

const handleOk = () => {
  isInit.value = true
  winWidth = document.getElementsByClassName(contanierClassName)[0].clientWidth
  winHeight =
    document.getElementsByClassName(contanierClassName)[0].clientHeight
  bindRollBtnEvent()
  console.log(leftLayer, rightLayer)

  setTimeout(() => {
    initLayer()
  }, 200)
}

const handleCancel = () => {
  emits('close')
}

const closeModal = () => {
  emits('close')
}
</script>

<script>
export default {
  name: 'CesiumRoller',
}
</script>

<style lang="scss" scoped>
.vmap-roll-contanier {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;

  .vmap-roll-mapview {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .roll-handle-contanier {
    position: absolute;
    width: 3px;
    height: 100%;
    top: 0px;
    left: 50%;
    border-radius: 2px;
    z-index: 199;
    cursor: move;
  }

  .roll-handle-btn {
    // position: absolute;
    // top: 50%;
    // width: 18px;
    // height: 50px;
    // border-radius: 15px;
    // margin-left: -9px;
    // background-color: #49b0f2;
    // cursor: move;

    position: absolute;
    top: 50%;
    width: 28px;
    height: 28px;
    border-radius: 15px;
    margin-left: -15px;
    background-color: #0e7bb6;
    color: white;
    cursor: move;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .roll-handle-contanier:hover {
    cursor: Move;
  }

  .view-btn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 9999;
    font-size: 30px;
    color: white;
    cursor: pointer;
  }

  .close-btn:hover {
    color: aqua;
  }

  .vmap-roll-map {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .vmap-roll-map-left {
    position: absolute !important;
    width: 0%;
    height: 100%;
  }

  .vmap-roll-map-right {
    position: absolute !important;
    width: 0%;
    height: 100%;
  }
}
</style>
