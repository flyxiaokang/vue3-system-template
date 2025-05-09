/*
 * @Description: 复制工具
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-01-16 10:16:04
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-07 16:52:56
 */

import { ElMessage } from "element-plus";

export function copy(str) {
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(str).then(() => {
			ElMessage.success("已成功复制到粘贴板");
		});
	} else {
		// // 创建text area
		const textArea = document.createElement("textarea");
		textArea.value = str;
		// 使text area不在viewport，同时设置不可见
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise((resolve, reject) => {
			// 执行复制命令并移除文本框
			document.execCommand("copy") ? resolve() : reject(new Error("出错了"));
			textArea.remove();
		}).then(
			() => {
				ElMessage.success("已成功复制到粘贴板");
			},
			() => {}
		);
	}
}

export function parseString(str) {
	let snsArr = str.split(/[(\r\n)\r\n]+/);
	snsArr.forEach((item, index) => {
		if (!item) {
			snsArr.splice(index, 1); //删除空项
		}
	});
	return snsArr;
	// let total = snsArr.length;
	// let stcdsStr = snsArr.join(",");
	// const params = {
	// 	allPoint: true,
	// 	stcdsStr,
	// };
}

// function pasteHandler(event) {
// 	let text = (event.clipboardData || window.clipboardData).getData("text");
// 	// 获取解析 粘贴的文本
// 	setTimeout(() => {
// 		if (text) {
// 			this.handleBatchImport(text);
// 		}
// 	}, 200);
// }

function parseData(text) {
	let snsArr = text.split(/[(\r\n)\r\n]+/);
	snsArr.forEach((item, index) => {
		if (!item) {
			snsArr.splice(index, 1); //删除空项
		}
	});
	return snsArr;
}

export function addPasteEvent({ vue, RegEx = /,|，|\s|\t+/ }, callback) {
	vue.$nextTick((e) => {
		document.addEventListener("paste", (event) => {
			let text = (event.clipboardData || window.clipboardData).getData("text");
			// 获取解析 粘贴的文本
			setTimeout(() => {
				if (text) {
					const c = [];
					parseData(text).forEach((element) => {
						// let a = element.split(RegEx); //.map(Number);
						let a = element.split(RegEx).map((e) => {
							if (!isNaN(e)) {
								return Number(e);
							} else {
								return e;
							}
						});
						c.push(a);
					});
					// console.log("c....", c);
					callback(c);
				}
			}, 200);
		});
	});
}

export function removePasteEvent(callback) {
	document.removeEventListener("paste", () => {});
}

