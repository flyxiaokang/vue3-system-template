<!--
 * @Description: 通用图表 highcharts
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2025-04-03 11:39:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-03 11:39:45
-->
<template>
  <div :id="target">1212</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue' 
import { Highcharts } from 'highcharts/modules/stock'
import { VUtils } from 'v-openlayers'

const target = ref(VUtils.UUIDGenerator())
const chart = ref(null)
const chartData = ref({
  title: '图表标题',
  xAxis: {
    data: ['1', '2', '3', '4', '5'],
  },
  series: [
    {
      name: '数据名称',
      type: 'bar',
      data: [120, 200, 150, 80, 70],
    },
  ],
})
const chartOptions = ref({
  title: {
    text: chartData.value.title,
  },
  xAxis: {
    data: chartData.value.xAxis.data,
  },
  series: chartData.value.series,
})
const chartInstance = ref(null)
const initChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  chartInstance.value = echarts.init(target.value)
  chartInstance.value.setOption(chartOptions.value)
}
onMounted(() => {
  initChart()
})
watch(
  () => chartData.value,
  (newVal) => {
    chartOptions.value.title.text = newVal.title
    chartOptions.value.xAxis.data = newVal.xAxis.data
    chartOptions.value.series = newVal.series
    initChart()
  },
  { deep: true }
)
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}
const handleClick = () => {
  console.log('图表被点击')
}
const handleDblClick = () => {
  console.log('图表被双击')
}
const handleMouseOver = () => {
  console.log('鼠标悬停在图表上')
}
const handleMouseOut = () => {
  console.log('鼠标离开图表')
}
const handleLegendSelectChanged = (params) => {
  console.log('图例选择变化', params)
}
const handleDataZoom = (params) => {
  console.log('数据缩放', params)
}
const handleChartClick = (params) => {
  console.log('图表点击', params)
}
</script>

<style scoped></style>