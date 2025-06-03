<template>
  <el-upload
    ref="refUploadFile"
    :drag="drag"
    action=""
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleFileChange"
    :before-upload="handleBeforeUpload"
    :multiple="true"
    :accept="accept"
  >
    <el-icon v-if="drag" class="el-icon--upload"><upload-filled /></el-icon>
    <div v-if="drag" class="el-upload__text">拖拽文件到这里</div>
    <slot>
      <el-button v-if="!drag" type="primary" size="mini"> 上传 </el-button>
    </slot>
  </el-upload>
</template>

<script setup name="VueUpload">
import { ref, reactive, watch, toRefs } from 'vue'
import WKT2WKID from './js/wkid'
import { open } from 'shapefile'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'

import { UploadFilled } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  accept: {
    type: String,
    default: '.shp,.prj,.json,.txt',
  },
  onSuccess: {
    type: Function,
  },
  onError: {
    type: Function,
  },
  drag: {
    type: Boolean,
    default: false,
  },
})

const { accept, drag } = toRefs(props)

// Refs and reactive state
const refUploadFile = ref(null)
const shpFeatures = ref([])
const shpWkid = ref('')
const excelData = reactive({
  header: [],
  results: [],
})
const modelBuffer = ref(false)
const file = ref(null)
const extension = ref('')
const prj = ref('')
const loading = ref(false)

// Methods
const handleBeforeUpload = (file) => {
  handleZip(file)
}

const handleFileChange = (files, fileList) => {
  refUploadFile.value.clearFiles()
  modelBuffer.value = false
  file.value = fileList[0]

  const name = file.value.name
  const ext = name.split('.').pop()
  extension.value = ext

  if (ext === 'xlsx') {
    handleExcel(files)
    return
  }

  if (ext === 'zip') {
    handleZip(files)
    return
  }

  if (!['shp', 'prj', 'json', 'txt', 'geojson'].includes(ext)) {
    emitMessage('info', '请选择shp文件或者导出的json文件')
    return
  }

  if (['json', 'geojson'].includes(ext)) {
    const reader = new FileReader()
    reader.readAsText(file.value.raw)
    reader.onload = () => {
      const jsonObj = JSON.parse(reader.result)
      handleGeojson(jsonObj)
    }
  } else if (ext === 'txt') {
    handleTxt(file.value)
  } else if (ext === 'prj') {
    const reader = new FileReader()
    reader.readAsText(file.value.raw)
    reader.onload = () => {
      const w = reader.result.trim()
      shpWkid.value = getWkid(w)
      if (!shpWkid.value) {
        handleError({
          wkid: shpWkid.value,
          wkt: w,
          message: '无法识别坐标系',
        })
      }
    }
  } else if (ext === 'shp') {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file.value.raw)
    reader.onload = () => {
      getShp(reader.result, (features) => {
        shpFeatures.value = features
        setTimeout(() => {
          handleShp()
        }, 200)
      })
    }
  }
}

const handleTxt = (file) => {
  const reader = new FileReader()
  reader.readAsText(file.raw)
  reader.onload = () => {
    handleSuccess({
      success: true,
      type: 'wkt',
      wkt: reader.result,
    })
  }
}

const handleZip = (file) => {
  const zip = new JSZip()
  zip.loadAsync(file.raw).then((res) => {
    const keys = Object.keys(zip.files)
    keys.forEach((key) => {
      if (!key.includes('MACOS')) {
        if (key.includes('.shp')) {
          zip
            .file(key)
            .async('arraybuffer')
            .then((res) => {
              getShp(res, (features) => {
                shpFeatures.value = features
                setTimeout(() => {
                  handleShp()
                }, 200)
              })
            })
        }
        if (key.includes('.prj')) {
          zip
            .file(key)
            .async('string')
            .then((text) => {
              shpWkid.value = getWkid(text)
              prj.value = text
            })
        }
      }
    })
  })
}

const handleShp = () => {
  if (shpWkid.value && shpFeatures.value.length > 0) {
    const geojson = {
      type: 'FeatureCollection',
      features: shpFeatures.value,
    }
    handleSuccess({
      success: true,
      type: 'geojson',
      wkid: shpWkid.value,
      geojson,
    })
  } else {
    handleError({
      success: false,
      type: 'geojson',
      wkid: shpWkid.value,
      prj: prj.value,
    })
  }

  shpFeatures.value = []
  shpWkid.value = ''
}

const handleGeojson = (geojson) => {
  if (geojson.type === 'FeatureCollection') {
    handleSuccess({
      success: true,
      type: 'geojson',
      geojson,
    })
  } else {
    handleError({
      success: false,
      type: 'geojson',
      wkid: shpWkid.value,
      prj: prj.value,
    })
  }
}

const handleExcel = (e) => {
  const { raw } = e
  if (!raw) return
  upload(raw)
}

const handleSuccess = (data) => {
  if (typeof props.onSuccess === 'function') {
    props.onSuccess(data)
  }
}

const handleError = (data) => {
  if (typeof props.onError === 'function') {
    props.onError(data)
  }
}

const getWkid = (str) => {
  let wkid = ''
  const w = str.trim()
  if (w.includes('China Geodetic Coordinate System 2000')) {
    wkid = 4490
  } else if (w.includes('WGS_1984')) {
    wkid = 4326
  } else {
    WKT2WKID.forEach((element) => {
      if (element.wkt === w) {
        wkid = element.wkid
      }
    })
  }
  return wkid
}

const getShp = (arraybuffer, callback) => {
  const features = []
  open(arraybuffer)
    .then((source) =>
      source.read().then(function log(result) {
        if (result.done) {
          callback(features)
          return
        }
        features.push(result.value)
        return source.read().then(log)
      })
    )
    .catch((error) => {
      console.error(error)
    })
}

const upload = (rawFile) => {
  readerData(rawFile)
}

const readerData = (rawFile) => {
  loading.value = true
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet)
      generateData({ header, results })
      loading.value = false
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

const getHeaderRow = (sheet) => {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  const R = range.s.r
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    let hdr = `UNKNOWN ${C}`
    if (cell && cell.t) {
      hdr = XLSX.utils.format_cell(cell)
    }
    headers.push(hdr)
  }
  return headers
}

const generateData = ({ header, results }) => {
  excelData.header = header
  excelData.results = results
  handleSuccess({ type: extension.value, data: excelData })
}
</script>

<style scoped>
.el-upload--text {
  width: auto;
  height: auto;
}
</style>
