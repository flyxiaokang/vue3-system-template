<!--
 * @Description: vector layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:03:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-23 10:47:10
-->
<template></template>
<script setup>
import {
  onMounted,
  onUnmounted,
  nextTick,
  inject,
  watch,
  computed,
  toRefs,
  reactive,
  ref,
} from 'vue'
import { useProps, useEmits, useWatch } from '../baseLayer'
import InteractionHandler from '@/VMap/ol/lib/core/plugins/InteractionHandler'
import { uuid } from '@/VMap/public/utils/base/string'

const cesiumHandler = inject('cesiumHandler')

const props = defineProps({
  ...useProps,
  source: {
    type: Object,
    default() {
      return {
        features: [],
      }
    },
  },
  features: {
    type: [Array, Object],
    default() {
      return []
    },
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  geometrys: {
    type: Array,
    default() {
      return []
    },
  },
  style: {
    type: Object,
    default() {
      return {}
    },
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  modifiable: {
    type: Boolean,
    default: false,
  },
  clusterOptions: {
    type: [Object, null],
    default() {
      return null
    },
  },
  geomField: {
    type: String,
    default: 'geometry',
  },
})

const emits = defineEmits([...useEmits, 'select-change', 'modify-end'])

const {
  sourceId,
  features,
  style,
  visible,
  zIndex,
  selectable,
  modifiable,
  clusterOptions,
  geomField,
} = toRefs(props)

onMounted(() => {
  nextTick(() => {
    initLayer()
  })
})

let layerObject = ref(null)
useWatch(toRefs(props), layerObject)

watch(
  features,
  () => {
    initLayer()
  },
  {
    deep: true,
  }
)

watch(selectable, () => {
  handleSelect()
})

watch(modifiable, () => {
  handleModify()
})

const initLayer = async () => {
  if (isValidLayerId()) {
    if (clusterOptions.value) {
    } else {
      layerObject.value = await cesiumHandler.createVectorLayer({
        ...props,
        clear: true,
        id: getLayerId.value,
      })
    }
    // handleSelect()
    // handleModify()
    emits('ready', layerObject.value)
  }
}

const getLayerId = computed(() => {
  return sourceId.value || uuid()
})

const isValidLayerId = () => {
  if (sourceId.value) {
    if (cesiumHandler.getDataSourceById(sourceId.value)) {
      console.warn('重复的图层id')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

let interactionHandler = null
const handleSelect = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(cesiumHandler.map, {
      layers: [cesiumHandler.getDataSourceById(getLayerId.value)],
    })
  }
  interactionHandler.enableSelect(selectable.value, (e) => {
    emits('select-change', e)
  })
}

const handleModify = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(cesiumHandler.map, {
      layers: [cesiumHandler.getDataSourceById(getLayerId.value)],
    })
  }
  interactionHandler.enableModify(modifiable.value, (e) => {
    emits('modify-end', e)
  })
}

onUnmounted(() => {
  if (interactionHandler) {
    interactionHandler.release()
    interactionHandler = null
  }
})
</script>

<script>
export default {
  name:'CesiumVector'
}
</script>
<style lang=""></style>
