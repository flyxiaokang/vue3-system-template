/*
 * @Description: 下载
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-11-20 14:07:34
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-08 11:29:56
 */
import defaultSettings from '@/setting'

export function downloadStatic(fileName, aliasName = "数据模板") {
	// 创建一个隐藏的<a>标签
	const link = document.createElement("a");
	link.style.display = "none";
	document.body.appendChild(link);
	// 设置文件的 URL 和名称
	const format = fileName.split(".")[1];
	link.setAttribute("download", `${aliasName}.${format}`);
	var { origin } = window.location;
	const url = `${origin}/${
		defaultSettings.baseUrl
	}/static/template/${fileName}?t=${Date.now()}`;
	console.log("url===", url);
	link.setAttribute("href", url);
	// 模拟点击链接进行下载
	link.click();
	// 移除创建的<a>标签
	document.body.removeChild(link);
}

export function downloadText(content, filename) {
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(content)
	);
	element.setAttribute("download", filename);
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

export function downloadBlob(buff) {
	let url = window.URL.createObjectURL(
		new Blob([buff], { type: "arraybuffer" })
	);
	const link = document.createElement("a");
	link.style.display = "none";
	link.href = url;
	link.setAttribute("download", "out.zip");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
