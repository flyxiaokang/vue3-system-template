<template>
  <div id="wh-mapId" ref="refChart">
  </div>
</template>

<script>
  // import echarts from 'echarts'
  window.forceWebGL = true
  // import './index'
  export default {
    data() {
      return {}
    },
    components: {},
    created() {},
    mounted() {
      require('./index')
    },
    methods: {}
  }

</script>

<style scoped>
  #wh-mapId {
    width: 100%;
    height: 100%;
  }

  @import url('./index.css');
</style>
