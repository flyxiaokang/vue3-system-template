<!--
 * @Description: 上传文件pln
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-19 13:53:46
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-08 13:59:54
-->
<template>
  <div class="upload-pln">
    <el-upload
      ref="uploadRef"
      multiple
      :action="url"
      :file-list="fileList"
      :accept="accept"
      :headers="uploadHeaders"
      with-credentials
      :on-success="handleSuccess"
      :auto-upload="false"
      :on-change="handleChange"
    >
      <template #trigger>
        <el-button type="primary" @click="handleSelect">选取文件</el-button>
      </template>
      <el-button
        style="margin-left: 10px"
        class="ml-3"
        type="success"
        @click="submitUpload"
      >
        上传
      </el-button>

      <!-- <DownloadWidget ></DownloadWidget> -->
      <br />
      <div
        slot="tip"
        class="el-upload__tip"
        style="font-size: 16px; margin: 20px 0"
      >
        <p>可批量导入中国洪水预报系统导出的预报方案（.pln格式文件）</p>
        <p style="color: red">
          <el-icon class="el-icon-warning-outline"></el-icon
          >严禁传输国家秘密、工作秘密
        </p>
      </div>
    </el-upload>
    <div class="message-list">
      <label
        for=""
        v-for="(item, index) in messageList"
        style="text-align: left; color: #13ce66"
        ><i class="el-icon-info"></i> {{ item }}</label
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getToken } from '@/utils/auth'
import { uploadPlnApi } from '@/api/scheme'
import { downloadStatic } from '@/utils/download'
import { ElMessage } from 'element-plus'

const props = defineProps({
  schemeId: {
    type: String,
    default: '',
  },
  accept: {
    type: String,
    default: '.pln',
  },
  url: {
    type: String,
    default: '',
  },
  uploadHeaders: {
    type: Object,
    default() {
      return {
        'X-Token': getToken(),
        Authorization: getToken(),
      }
    },
  },
})

const loading = ref(false)
const fileList = ref([])
const messageList = ref([])
const uploadRef = ref(null)

function handleSelect() {
  uploadRef.value.clearFiles()
}
function submitUpload() {
  console.log('fileList===', fileList.value)
  debugger
  if (fileList.value.length === 0) {
    ElMessage.info('请先选取文件')
    return
  }
  loading.value = true
  let formData = new FormData()
  for (var i = 0; i < fileList.value.length; i++) {
    formData.append('file', fileList.value[i].raw)
  }
  uploadPlnApi(props.schemeId, formData).then((res) => {
    loading.value = false
    if (res.code === 200) {
      ElMessage.success('操作成功')
      const { msg } = res.data
      messageList.value = messageList.value.concat(msg)
    }
  })
}

function handleDownload() {
  downloadStatic('平山-大水.pln')
}

function handleSuccess(response) {
  if (response.code === 200) {
    const { msg } = response.data
    messageList.value = messageList.value.concat(msg)
  }
}

const handleChange = (file, files) => {
  fileList.value = files
  console.log('fileList===', fileList.value)
}
</script>

<style scoped>
.upload-pln {
  display: flex;
  justify-content: center;
  min-height: 200px;
  align-items: center;
}

.message-list {
  display: flex;
  flex-direction: column;
  max-height: 446px;
  margin-left: 50px;
  overflow-y: auto;
}

:deep(.el-upload-list) {
  max-height: 400px;
  overflow-y: auto;
}
</style>
