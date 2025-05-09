<template>
  <div class="tags" v-if="showTags">
    <div :style="styleObject">
      <el-tag
        v-for="(item, index) in tagsList"
        type="primary"
        :key="index"
        closable
        :effect="isActive(item.fullPath) ? 'dark' : 'plain'"
        @close="closeTags(index)"
        @contextmenu.prevent.native="openMenu(item, $event)"
      >
        <router-link
          :to="item.fullPath"
          :class="!isActive(item.fullPath) ? 'tags-title' : 'tags-title-active'"
          >{{ item.title }}</router-link
        >
      </el-tag>
    </div>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="handleRefresh">刷新</li>
      <li @click="handleClose">关闭</li>
    </ul>

    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="small" type="primary" style="height: 28px">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
  getCurrentInstance,
  reactive,
  onMounted,
  nextTick,
} from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useTagsStore } from '@/store/tags'

import ElementResizeDetectorMaker from 'element-resize-detector'

const route = useRoute()
const router = useRouter()
const isActive = (path) => {
  return path === route.fullPath
}

const styleObject = reactive({
  'box-sizing': 'border-box',
  width: '100%',
  display: 'flex',
  gap: '4px',
  'min-width': document.body.clientWidth - 150 + 'px',
})

const store = useTagsStore()
const tagsList = computed(() => {
  return store.list
})

const showTags = computed(() => tagsList.value.length > 0)

watch(
  tagsList,
  (nv, ov) => {
    let width = 0
    nv.forEach((element) => {
      width += element.title.length * 14 + 50
    })
    styleObject.width = width + 'px'
  },
  {
    deep: true,
  }
)

onMounted(() => {
  ElementResizeDetectorMaker().listenTo(
    document.querySelector('body'),
    (element) => {
      styleObject['min-width'] = element.clientWidth - 150 + 'px'
    }
  )
})

// 关闭单个标签
const closeTags = (index) => {
  if (checkTag()) {
    const delItem = tagsList.value[index]
    store.delTagsItem(index)
    const item = tagsList.value[index]
      ? tagsList.value[index]
      : tagsList.value[index - 1]
    if (item) {
      delItem.fullPath === route.fullPath && router.push(item.fullPath)
    } else {
      router.push('/')
    }

    if (tagsList.value.length === 0) {
      store.setIndexPage(router)
      // store.setTagsItem({
      //     name: 'dashboard',
      //     title: '首页',
      //     path: '/dashboard',
      //     meta: {
      //         keepAlive: true,
      //     },
      // })
      // router.push('/dashboard')
    }
  }
}

// 设置标签
const setTags = (route) => {
  // console.log('setTags', route, tagsList.value)
  let isExist = false
  // tagsList.value.some((item) => {
  //   return (
  //     item.path === route.path &&
  //     (!route.meta.polymorphic || item.fullPath === route.fullPath)
  //   )
  // })

  tagsList.value.forEach((item) => {
    if (
      item.path === route.path &&
      (!route.meta.polymorphic || item.fullPath === route.fullPath)
    ) {
      isExist = true
    }
    if (
      item.path === route.path &&
      item.fullPath.includes('?') &&
      !route.meta.polymorphic
    ) {
      item.fullPath = route.fullPath
    }
  })

  if (!isExist) {
    if (tagsList.value.length >= 8) {
      store.delTagsItem(0)
    }
    store.setTagsItem({
      name: route.name,
      title: route.meta.title,
      meta: route.meta,
      path: route.path,
      fullPath: route.fullPath,
    })
  }
}
setTags(route)
onBeforeRouteUpdate((to) => {
  setTags(to)
})

// 关闭全部标签
const closeAll = () => {
  store.clearTags()
  router.push('/')
}
// 关闭其他标签
const closeOther = () => {
  const curItem = tagsList.value.filter((item) => {
    return item.path === route.fullPath
  })
  store.closeTagsOther(curItem)
}
const handleTags = (command) => {
  command === 'other' ? closeOther() : closeAll()
}

const checkTag = () => {
  if (tagsList.value.length === 1 && tagsList.value[0].name.includes('首页')) {
    return false
  } else {
    return true
  }
}
// 关闭当前页面的标签页
// store.commit("app/closeCurrentTag", {
//     $router: router,
//     $route: route
// });

let curTag = null
let visible = ref(false)
let left = ref(0)
let top = ref(0)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const closeMenu = () => {
  visible.value = false
}

const openMenu = (tag, e) => {
  // console.log(tag, e, e.screenX,e.clientX, e.offsetX, e.offsetY)
  const { offsetX, offsetY, clientX } = e
  left.value = clientX + 5
  top.value = offsetY + 20
  visible.value = true
  curTag = tag
}

const handleClose = () => {
  let route = {
    fullPath: curTag.path,
  }
  store.closeCurrentTag({ route, router })
  visible.value = false
}

const { ctx } = getCurrentInstance()
const handleRefresh = () => {
  visible.value = false
  nextTick(() => {
    router.replace({
      path: `/redirect${curTag.path}`,
    })
  })
}
</script>

<style lang="scss" scoped>
.tags {
  // position: relative;
  height: 32px;
  overflow: auto;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
  border-bottom: 2px solid #dddddd;
  padding-top: 3px;
  padding-left: 3px;
}

.tags ul {
  // width: 100%;
  // height: 100%;
}

.tags-li {
  float: left;
  margin: 2px 5px 2px 3px;
  border-radius: 3px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid hsl(240deg 5.1% 77.68%);
  // background: #fff;
  padding: 1px 5px 1px 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  /* max-width: 80px; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.custom-close-icon {
  margin-top: 5px;
  cursor: pointer;
  font-size: 10px;
}

.custom-close-icon :hover {
  color: #9fdcf6;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  width: 100px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>

<style scoped>
:deep(.el-tag) {
  height: 28px;
  font-size: 14px;
}

.tags-title {
  color: black;
}

.tags-title-active {
  color: white;
}
</style>
