<template>
	<div style="width: 360px; margin: 20px auto">
		<el-upload
			ref="upload"
			drag
			:action="allurl"
			:accept="accept"
			:auto-upload="false"
			multiple
			:on-change="changeFileList"
			:on-success="uploadSuccess"
			:on-error="upError">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">
				将文件拖到此处
				<em>点击添加</em>
			</div>
		</el-upload>
	</div>
</template>
<script setup >
import { ElMessage } from 'element-plus';
import { nextTick, ref, useTemplateRef } from 'vue';

const { url, accept } = defineProps({
	url: {
		type: String,
		default: '',
	},
	accept: {
		type: String,
		default: '',
	},
});
const emit=defineEmits(["uploadOver"])
const length = ref(0);
const sum = ref(0);
const allurl = ref('');
const upload = useTemplateRef('upload');
const init = () => {
	upload.value.clearFiles();
	length.value = 0;
	sum.value = 0;
	allurl.value = '';
};
const submitUpload = (id) => {
	allurl.value = url + id;
	if (length.value) {
		nextTick(() => {
			upload.value.submit();
		});
		return false;
	} else {
		return true;
	}
};
const upError = (err, file, fileList) => {
	ElMessage.error('上传出错，请修改文件！');
	emit("uploadOver")
	init()
};
// 全部上传成功，向上触发结束
const uploadSuccess = (response, file, fileList) => {
	sum.value = sum.value+ 1;
	if (sum.value ==length.value) {
		emit("uploadOver")
		init();
	}
};
// 及时更新列表长度
const changeFileList = (file, fileList) => {
	length.value= fileList.length;
};


defineExpose({
    submitUpload,
    init,
})
</script>
