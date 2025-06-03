<!--
 * @Description: popup
 * @Author: kangjinrui
 * @Date: 2025-05-11 14:57:32
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-19 09:17:46
 * @FilePath: \dywebd:\kjr\git\vue3-system-manager\src\VMap\components-v3\Popup\Popup.vue
-->
<template>
  <div class="title" :style="getStyle">
    {{ title }} <span @click="handleClose">✕</span>
  </div>
  <div class="content">
    <div class="content-item">
      <div v-for="(item, index) in left" :key="index" class="content-item2">
        <span>{{ item.label }}</span
        >：<span>{{ item.value || "" }}</span>
      </div>
    </div>
    <div class="content-item">
      <div v-for="(item, index) in right" :key="index" class="content-item2">
        <span>{{ item.label }}</span
        >：<span>{{ item.value || "" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="VueCard">
import { computed, toRefs, watch ,ref} from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  properties: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emits = defineEmits(["close"]);

const getStyle = ref({
  background: `url("${
    new URL("../assets/images/Rectangle.png", import.meta.url).href
  }") no-repeat`,
});

// console.log('=================',getStyle.value)

const { properties } = toRefs(props);
const left = ref([]);
const right = ref([]);

watch(properties, (nv) => {
  const l = nv.length;
  if (l > 0) {
    const index = l % 2 === 0 ? l / 2 : Math.floor(l / 2) + 1;
    left.value = nv.slice(0, index);
    right.value = nv.slice(index);
  } else {
    left.value = [];
    right.value = [];
  }
});

const handleClose = () => {
  emits("close");
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  // background: url("../../assets/image/widgets/Rectangle.png") no-repeat;
  background-size: cover;
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 32px;
  padding: 0 5px;
  justify-content: space-between;

  span {
    cursor: pointer;
  }
  span:hover {
    color: #a0c8ff;
  }
}

.content {
  width: 100%;
  min-height: 50px;
  max-height: 200px;
  background: #0c53ff70;
  border: 1px solid #a0c8ff;
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px;

  .content-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 500;
    font-size: 14px;
    color: white;
    line-height: 21px;
    text-align: center;
    font-style: normal;

    .content-item2 {
      display: flex;
      flex-direction: row;

      span {
        display: inline-block; /* 或者使用 inline，但需要额外的宽度设置 */
        max-width: 180px; /* 设置最大宽度 */
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
      }
    }
  }
}
</style>
