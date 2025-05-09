<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-04-11 14:16:50
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-12 13:47:41
-->

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { h, nextTick, onMounted, render } from 'vue'
const route = useRoute()
const router = useRouter()

const { params, query } = route
const { path } = params

console.log(path, params)
router.replace({ path: '/' + path, query })

// onMounted(() => {
//     nextTick((e) => {
//         const a = h()
//         render(a)
//     })
// })
</script>
