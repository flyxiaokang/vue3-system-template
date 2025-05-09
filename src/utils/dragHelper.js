import { deepClone } from "./deepClone";

let dragging = false;
/**
 * 拖动绘制
 * @param {Object} param 
 * @param {number} param.minTickInterval x轴间隔
 * @param {Highcharts.Chart} param.chart chart实例
 * @param {*} param.startTime 左边界
 * @param {*} param.endTime 右边界
 * @param {Function} param.callback 回调函数第一个参数为更新后的数据
 * @param {string} param.lineColor 虚线颜色
 */
export const drawHandler = ({ minTickInterval, chart, startTime, endTime, callback = () => { }, lineColor = "red" }) => {
    let isStart = false;
    let curData;
    let series = null;
    let trackData = [];
    return function (e) {
        const allSeriesData = this.series.userOptions.data;
        const newPoint = e.newPoint;
        curData = e;
        let key = e.newPointId;
        const originPoint = e.origin.points[key];
        let offsetX = newPoint.x - originPoint.x;
        let dis = offsetX / minTickInterval;
        dis=Math.floor(dis)
        newPoint.x=dis*minTickInterval+ originPoint.x
        if (!isStart) {
            let hoverEnable = chart?.options?.plotOptions?.series?.states?.hover?.enabled ?? true;
            let tooltipEnabled = chart?.options?.tooltip?.enabled ?? true;
            let xCrosshairEnable = chart?.options?.xAxis?.crosshair || false;
            let yCrosshairEnable = chart?.options?.yAxis?.crosshair || false;
            chart.update({
                tooltip: {
                    enabled: false
                },
                xAxis: {
                    crosshair: false
                },
                yAxis: {
                    crosshair: false
                },
                plotOptions: {
                    series: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            }, false);
            isStart = true;
            dragging = true;

            series = null;
            trackData = [
                {
                    x: originPoint.x,
                    y: originPoint.y,
                    marker: {
                        enabled: true,
                        fillColor: lineColor,
                        symbol: "circle"
                    }
                },
            ];
            const mouseupHandler = () => {
                chart.update({
                    tooltip: {
                        enabled: tooltipEnabled
                    },
                    xAxis: {
                        crosshair: xCrosshairEnable
                    },
                    yAxis: {
                        crosshair: yCrosshairEnable
                    },
                    plotOptions: {
                        series: {
                            states: {
                                hover: {
                                    enabled: hoverEnable
                                }
                            }
                        }
                    }
                }, false);
                isStart = false;
                dragging = false;
                const newPoint = curData.newPoint;
                const originPoint = e.origin.points[key];
                const min = Math.min(newPoint.x, originPoint.x);
                const max = Math.max(newPoint.x, originPoint.x);
                const newPointData = trackData.filter((item) => item.x >= min && item.x <= max);
                newPointData.sort((a, b) => a.x - b.x);
                const len = newPointData.length;
                //插值补充没有记录到的点
                for (let i = 0; i < len - 1; i++) {
                    const point = newPointData[i];
                    const nextPoint = newPointData[i + 1];
                    if (nextPoint.x == point.x + minTickInterval) {
                        continue;
                    } else {
                        const lackCount = (nextPoint.x - point.x) / minTickInterval - 1;
                        let b = (point.y * nextPoint.x - nextPoint.y * point.x) / (nextPoint.x - point.x);
                        let a = (point.y - b) / point.x;
                        let lackPoint = point.x + minTickInterval;
                        for (let j = 0; j < lackCount; j++) {
                            newPointData.push({
                                x: lackPoint,
                                y: a * lackPoint + b,
                            });
                            lackPoint += minTickInterval;
                        }
                    }
                }
                newPointData.sort((a, b) => a.x - b.x);
                trackData = newPointData;
                let firstIndex;
                let lastIndex;
                let seriesData = this.series.data.map((item, index) => {
                    if (firstIndex == void (0)) {
                        firstIndex = index;
                    }
                    lastIndex = index;
                    return [item.x, item.y];
                });

                //拖动点回到原点
                seriesData[this.index][0] = originPoint.x;
                seriesData[this.index][1] = originPoint.y;

                const allSeriesData = this.series.userOptions.data;
                seriesData = [...allSeriesData.slice(0, firstIndex), ...seriesData, ...allSeriesData.slice(lastIndex + 1)].filter(item => item);

                const map = new Map();
                newPointData.forEach((point) => {
                    map.set(point.x, point.y);
                });
                let isFind = false;
                for (let i = 0; i < seriesData.length; i++) {
                    const point = seriesData[i];
                    if (!point) continue;
                    if (map.has(point[0])) {
                        isFind = true;
                        point[1] = map.get(point[0]);
                        map.delete(point[0]);
                    } else if (isFind) {
                        isFind = false;
                        break;
                    }
                }
                // map.forEach((value, key) => {
                //     seriesData.push([key, value]);
                // });
                // seriesData.sort((a, b) => a[0] - b[0]);

                callback({
                    data: deepClone(seriesData),
                    seriesName: this.series.name
                });
                this.series.update(
                    {
                        data: seriesData,
                    },
                    false
                );
                if (series) {
                    series.remove();
                }
                series = null;
                trackData = [];
                window.removeEventListener("mouseup", mouseupHandler);
            };
            window.addEventListener("mouseup", mouseupHandler);
        }
        let point = trackData.find((item) => item.x === newPoint.x);
        if (point) {
            point.y = newPoint.y;
        } else {
            trackData.push({
                x: newPoint.x,
                y: newPoint.y,
            });
        }
        let min = Math.min(newPoint.x, originPoint.x);
        let max = Math.max(newPoint.x, originPoint.x);
        let et = endTime ?? max;
        let st = startTime ?? min;

        if (max > et || max < st) {
            max = et;
        }
        if (min < st || min > et) {
            min = st;
        }
        const newPointData = trackData.filter((item) => item.x >= min && item.x <= max);
        newPointData.sort((a, b) => a.x - b.x);
        const keys = Object.keys(this.series.data);
        let firstIndex = keys[0];
        let lastIndex = keys.at(-1);
        let l = this.index;
        let r = this.index;
        if (newPointData.length > 0) {
            l = binarySearch(allSeriesData, newPointData[0].x);
            r = binarySearch(allSeriesData, newPointData.at(-1).x);
        }

        const showPoint = [...allSeriesData.slice(firstIndex, l), ...newPointData, ...allSeriesData.slice(r + 1, lastIndex + 1)];
        if (series) {
            // if (!cbId) {
            //     //60毫秒渲染一次
            //     let delay = 16;
            //     switch (true) {
            //         case showPoint.length > 15000: {
            //             delay = 128;
            //             break;
            //         }
            //         case showPoint.length > 10000: {
            //             delay = 64;
            //             break;
            //         }
            //         case showPoint.length > 5000: {
            //             delay = 32;
            //             break;
            //         }
            //         default: delay = 16;
            //     }
            //     cbId = setTimeout(() => {
            //         series && series.update({
            //             data: showPoint,
            //         });
            //         clearTimeout(cbId);
            //         cbId = null;
            //     }, delay);
            // }
            series.update({
                data: showPoint,
            });

        } else {
            series = chart.addSeries({
                data: showPoint,
                type: "line",
                marker: {
                    enable: false
                },
                label: {
                    enabled: false,
                },
                enableMouseTracking: false,
                animation: false,
                showInLegend: false,
                dashStyle: "Dash",
                turboThreshold: 9999999,
                color: lineColor,
                yAxis: this.series.userOptions.yAxis,
                xAxis: this.series.userOptions.xAxis,
                states: {
                    hover: {
                        enabled: true
                    }
                }

            });
        }
        trackData = newPointData;

    };
};



/**
 * 橡皮筋拖动 - y轴拖动
 * @param {Object} param 左边界
 * @param {number} param.startTime 左边界
 * @param {number} param.endTime 右边界
 * @param {Function} param.callback 回调函数第一个参数为更新后的数据
 * @param {number} param.K 弹性系数
 * @returns 
 */
export const dargHandler = ({ startTime, endTime, callback = () => { },K= 1 } = {}) => {
    let isStart = false;
    let lastPoint = null;
    return function (e) {
        const newPoint = e.newPoint;
        let key = e.newPointId;
        const originPoint = e.origin.points[key];
        const allSeriesData = this.series.userOptions.data;
        let minIndex = null;
        let maxIndex = null;
        if (startTime) {
            minIndex = binarySearch(allSeriesData, startTime);
        }
        if (endTime) {
            maxIndex = binarySearch(allSeriesData, endTime);
        }
        if ((minIndex && this.index <= minIndex) || (maxIndex && this.index >= maxIndex)) {
            newPoint.y = originPoint.y;
            return;
        }
        if (!isStart) {
            lastPoint = originPoint;
            isStart = true;
            dragging = true;
            const mouseupHandler = () => {
                isStart = false;
                dragging = false;
                lastPoint = null;
                //更新源数据
                let firstIndex;
                let lastIndex;
                let seriesData = this.series.data.map((item, index) => {
                    if (firstIndex == void (0)) {
                        firstIndex = index;
                    }
                    lastIndex = index;
                    return [item.x, item.y];
                });
                const allSeriesData = this.series.userOptions.data;
                seriesData = [...allSeriesData.slice(0, firstIndex), ...seriesData, ...allSeriesData.slice(lastIndex + 1)].filter(item => item);
                callback({
                    data: seriesData,
                    seriesName: this.series.name
                });
                this.series.update(
                    {
                        data: seriesData,
                    }
                );
                window.removeEventListener("mouseup", mouseupHandler);
            };
            window.addEventListener("mouseup", mouseupHandler);
        }
        const offsetY = newPoint.y - lastPoint.y;
        const keys = Object.keys(this.series.data);
        let firstIndex = keys[0];
        let lastIndex = keys.at(-1);
        let minI = minIndex ?? firstIndex;
        let maxI = maxIndex ?? lastIndex;
        if (firstIndex < minI || firstIndex > maxI) {
            firstIndex = minI;
        }
        if (lastIndex > maxI || lastIndex < minI) {
            lastIndex = maxI;
        }

        let left = this.series.data[firstIndex];
        let right = this.series.data[lastIndex];
        let point = this.series.data[this.index];
        let beforePoint = this.series.data[this.index - 1];
        let nextPoint = this.series.data[this.index + 1];
        /**
         * 单调类型1.单调递增 2.单调递减
         */
        let mType = 1;
        /**
         * 1上升，2下降
         */
        let dragType = offsetY >= 0 ? 1 : 2;
        //左边界
        if (beforePoint) {
            for (let i = this.index; i > firstIndex; i--) {
                const curPoint = this.series.data[i];
                if (!curPoint) continue;
                //寻找第一个比源点大或者小的点
                if ((dragType == 1 && curPoint.y > point.y) || (dragType == 2 && curPoint.y < point.y)) {
                    const tempNextPointJ = this.series.data[i + 1];
                    if (tempNextPointJ) {
                        mType = tempNextPointJ.y < curPoint.y ? 2 : 1;
                    }
                    for (let j = i; j > firstIndex; j--) {
                        const curPointJ = this.series.data[j];
                        const tempBeforePointJ = this.series.data[j - 1];
                        if (!curPointJ || !tempBeforePointJ) continue;
                        //寻找第一个非单调的点
                        if ((mType == 1 && tempBeforePointJ.y > curPointJ.y) || (mType == 2 && tempBeforePointJ.y < curPointJ.y)) {
                            left = curPointJ;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        //右边界
        if (nextPoint) {
            for (let i = this.index; i < lastIndex - 1; i++) {
                const curPoint = this.series.data[i];
                if (!curPoint) continue;
                //寻找第一个比源点大或者小的点
                if ((dragType == 1 && curPoint.y > point.y) || (dragType == 2 && curPoint.y < point.y)) {
                    const tempBeforePoint = this.series.data[i - 1];
                    if (tempBeforePoint) {
                        mType = tempBeforePoint.y > curPoint.y ? 2 : 1;
                    }
                    for (let j = i; j < lastIndex - 1; j++) {
                        const curPointJ = this.series.data[j];
                        const tempNextPointJ = this.series.data[j + 1];
                        if (!curPointJ || !tempNextPointJ) continue;
                        //寻找第一个非单调的点
                        if ((mType == 1 && tempNextPointJ.y < curPointJ.y) || (mType == 2 && tempNextPointJ.y > curPointJ.y)) {
                            right = curPointJ;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (!left) {
            left = this.series.data[firstIndex];
        }
        if (!right) {
            left = this.series.data[lastIndex];
        }
        const lDistance = this.index - left.index;
        const lK = lDistance && lDistance !== 0 ? 1 / lDistance : 1;
        const rDistance = right.index - this.index;
        const rK = rDistance && rDistance !== 0 ? 1 / rDistance : 1;
        let leftIndex = left.index - this.series.points[0].index;
        for (let i = 0; i < lDistance; i++) {
            let changePoint = this.series.points[leftIndex++];
            if (changePoint) {
                changePoint.y = changePoint.y + (lK * i) **K* offsetY;
            }
        }
        let rightIndex = right.index - this.series.points[0].index;
        for (let i = 0; i < rDistance; i++) {
            let changePoint = this.series.points[rightIndex--];
            if (changePoint) {
                changePoint.y = changePoint.y + (rK * i) **K* offsetY;
            }
        }
        lastPoint = newPoint;
    };
};


/**
 * 橡皮筋拖动 - 任意方向拖动
 * @param {Object} param 左边界
 * @param {number} param.startTime 左边界
 * @param {number} param.endTime 右边界
 * @param {Function} param.callback 回调函数第一个参数为更新后的数据
 * @param {number} param.K 弹性系数
 * @returns 
 */
export const dargAnyHandler = ({ minTickInterval, startTime, endTime, callback = () => { }, K = 1 } = {}) => {
    let isStart = false;
    let lastPoint = null;
    let beforeData = [];
    let lastIndex = 0;
    return function (e) {
        const newPoint = e.newPoint;
        
        let key = e.newPointId;
        const originPoint = e.origin.points[key];
        let minIndex = null;
        let maxIndex = null;
        if (startTime) {
            minIndex = binarySearch(this.series.userOptions.data, startTime);
        }
        if (endTime) {
            maxIndex = binarySearch(this.series.userOptions.data, endTime);
        }
        if ((minIndex && this.index < minIndex) || (maxIndex && this.index > maxIndex)) {
            newPoint.y = originPoint.y;
            newPoint.x = originPoint.x;
            return;
        }
        if (!isStart) {
            beforeData = this.series.userOptions.data.map(item => {
                return Array.isArray(item) ? [item[0], item[1]] : [item.x, item.y];
            });
            lastPoint = originPoint;
            isStart = true;
            dragging = true;
            lastIndex = this.index;
            const mouseupHandler = () => {
                isStart = false;
                dragging = false;
                lastPoint = null;
                lastIndex = 0;
                //更新源数据
                callback({
                    data: deepClone(beforeData),
                    seriesName: this.series.name
                });
                this.series?.update({
                    data: deepClone(beforeData),
                });
                beforeData=[]
                window.removeEventListener("mouseup", mouseupHandler);
            };
            window.addEventListener("mouseup", mouseupHandler);
        }
        let allSeriesData = beforeData;
        const keys = Object.keys(this.series.data);
        let firstIndex = Number(keys[0]);
        let endIndex = Number(keys.at(-1));
        let minI = minIndex ?? firstIndex;
        let maxI = maxIndex ?? endIndex;
        if (firstIndex < minI || firstIndex > maxI) {
            firstIndex = minI;
        }
        if (endIndex > maxI || endIndex < minI) {
            endIndex = maxI;
        }
        //=========================x轴计算====================================//
        let offsetX = newPoint.x - lastPoint.x;
        let dis = offsetX / minTickInterval;
        //处理拖动工具异常情况
        dis=Math.floor(dis)
        newPoint.x=dis*minTickInterval+ lastPoint.x
        if (lastIndex + dis < firstIndex) {
            dis = lastIndex - firstIndex;
        }
        if( lastIndex+dis > endIndex){
            dis = endIndex - lastIndex;
        }
        const leftPoints = allSeriesData.slice(firstIndex, lastIndex + 1);
        let lLen = leftPoints.length;
        if (lLen == 1 ) {
            leftPoints.unshift([leftPoints[0][0]-minTickInterval,leftPoints[0][1]]);
            lLen++;
        }
        const rightPoint = allSeriesData.slice(lastIndex, endIndex + 1);
        let rLen = rightPoint.length;
        if (rLen == 1) {
            rightPoint.push([rightPoint[0][0]+minTickInterval,rightPoint[0][1]]);
            rLen++
        }
        if (dis !== 0 &&rLen>0 &&lLen>0) {
            const lSliceCnt = lLen + dis - 1;
            const rSliceCnt = rLen - dis - 1;
            const getNewY = (sliceCount, points) => {
                const arr = [];
                const len = points.length;
                for (let i = 0; i < len - 1; i++) {
                    const point = points[i];
                    const nextPoint = points[i + 1];
                    let b = (point[1] * nextPoint[0] - nextPoint[1] * point[0]) / (nextPoint[0] - point[0]);
                    let a = (point[1] - b) / point[0];
                    for (let k = 0; k < sliceCount; k++) {
                        arr.push(a * (((nextPoint[0] - point[0]) / sliceCount) * k + point[0]) + b);
                    }
                    if (i == len - 2) {
                        arr.push(nextPoint[1]);
                    }
                }
                return arr;
            };
            const lNewY = getNewY(lSliceCnt, leftPoints).filter((_,index)=>index%(lLen - 1)==0);
            const rNewY = getNewY(rSliceCnt, rightPoint).filter((_,index)=>index%(rLen - 1)==0);
            for (let i = firstIndex; i < lastIndex + dis; i++) {
                allSeriesData[i][1] = lNewY[i - firstIndex];
            }
            for (let i = lastIndex + dis ; i < endIndex; i++) {
                allSeriesData[i][1] = rNewY[i - lastIndex - dis];
            }
            lastIndex += dis;
        }
        //=========================x轴计算====================================//
        for (let item of this.series.points) {
            item.x = allSeriesData[item.index][0];
            item.y = allSeriesData[item.index][1];
        }
        //=========================y轴计算====================================//
        const offsetY = newPoint.y - lastPoint.y;
        let left = this.series.data[firstIndex];
        let right = this.series.data[endIndex];
        let point = this.series.data[lastIndex];
        let beforePoint = this.series.data[lastIndex - 1];
        let nextPoint = this.series.data[lastIndex + 1];
        /**
         * 单调类型1.单调递增 2.单调递减
         */
        let mType = 1;
        /**
         * 1上升，2下降
         */
        let dragType = offsetY >= 0 ? 1 : 2;
        //左边界
        if (beforePoint) {
            for (let i = lastIndex; i >= firstIndex; i--) {
                const curPoint = this.series.data[i];
                if (!curPoint) continue;
                //寻找第一个比源点大或者小的点
                if ((dragType == 1 && curPoint.y > point.y) || (dragType == 2 && curPoint.y < point.y)) {
                    const tempNextPointJ = this.series.data[i + 1];
                    if (tempNextPointJ) {
                        mType = tempNextPointJ.y < curPoint.y ? 2 : 1;
                    }
                    for (let j = i; j >= firstIndex; j--) {
                        const curPointJ = this.series.data[j];
                        const tempBeforePointJ = this.series.data[j - 1];
                        if (!curPointJ || !tempBeforePointJ) continue;
                        //寻找第一个非单调的点
                        if ((mType == 1 && tempBeforePointJ.y > curPointJ.y) || (mType == 2 && tempBeforePointJ.y < curPointJ.y)) {
                            left = curPointJ;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        //右边界
        if (nextPoint) {
            for (let i = lastIndex; i < endIndex - 1; i++) {
                const curPoint = this.series.data[i];
                if (!curPoint) continue;
                //寻找第一个比源点大或者小的点
                if ((dragType == 1 && curPoint.y > point.y) || (dragType == 2 && curPoint.y < point.y)) {
                    const tempBeforePoint = this.series.data[i - 1];
                    if (tempBeforePoint) {
                        mType = tempBeforePoint.y > curPoint.y ? 2 : 1;
                    }
                    for (let j = i; j < endIndex - 1; j++) {
                        const curPointJ = this.series.data[j];
                        const tempNextPointJ = this.series.data[j + 1];
                        if (!curPointJ || !tempNextPointJ) continue;
                        //寻找第一个非单调的点
                        if ((mType == 1 && tempNextPointJ.y < curPointJ.y) || (mType == 2 && tempNextPointJ.y > curPointJ.y)) {
                            right = curPointJ;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (!left) {
            left = this.series.data[firstIndex];
        }
        if (!right) {
            left = this.series.data[endIndex];
        }
        const lDistance = lastIndex - left.index;
        const lK = lDistance && lDistance !== 0 ? 1 / lDistance : 1;
        const rDistance = right.index - lastIndex;

        const rK = rDistance && rDistance !== 0 ? 1 / rDistance : 1;
        let leftIndex = left.index;
        allSeriesData[lastIndex][1] = newPoint.y;
        for (let i = 0; i < lDistance; i++) {
            let changePoint = allSeriesData[leftIndex++];
            if (changePoint) {
                changePoint[1] = changePoint[1] + (lK * i) ** K * offsetY;
            }
        }
        let rightIndex = right.index;
        for (let i = 0; i < rDistance; i++) {
            let changePoint = allSeriesData[rightIndex--];
            if (changePoint) {
                changePoint[1] = changePoint[1] + (rK * i) ** K * offsetY;
            }
        }
        //=========================y轴计算====================================//
        lastPoint = {
            ...newPoint,
        };
        newPoint.x = allSeriesData[this.index][0];
        newPoint.y = allSeriesData[this.index][1];
        beforeData = allSeriesData;
        for (let item of this.series.points) {
            item.x = allSeriesData[item.index][0];
            item.y = allSeriesData[item.index][1];
        }
    };
};


/**
 * y轴单点拖动
 * @param {Object} param 
 * @param {number} [param.startTime] 左边界
 * @param {number} [param.endTime] 右边界
 * @param {Function} [param.callback] 回调函数第一个参数为更新后的数据
 * @returns 
 */
export const dargY = ({ startTime, endTime, callback = () => { } } = {}) => {
    let isStart = false;
    return function (e) {
        const newPoint = e.newPoint;
        let key = e.newPointId;
        const originPoint = e.origin.points[key];
        const allSeriesData = this.series.userOptions.data;
        let minIndex = null;
        let maxIndex = null;
        if (startTime) {
            minIndex = binarySearch(allSeriesData, startTime);
        }
        if (endTime) {
            maxIndex = binarySearch(allSeriesData, endTime);
        }
        if ((minIndex && this.index < minIndex) || (maxIndex && this.index > maxIndex)) {
            newPoint.y = originPoint.y;
            return;
        }
        if (!isStart) {
            isStart = true;
            dragging = true;
            const mouseupHandler = () => {
                isStart = false;
                dragging = false;
                const allSeriesData = this.series.userOptions.data.map(item=>{
                    return Array.isArray(item)?[item[0],item[1]]:[item['x'],item['y']]
                });
                // allSeriesData[this.index][1]=newPoint.y
                callback({
                    data: deepClone(allSeriesData),
                    seriesName: this.series.name
                });
                // this.series.update(
                //     {
                //         data: allSeriesData,
                //     }
                // );
                window.removeEventListener("mouseup", mouseupHandler);
            };
            window.addEventListener("mouseup", mouseupHandler);
        }
     
    };
};

/**
 * 
 * @param {[]} arr 
 * @param {number} target 
 * @param {*} key 
 * @returns 
 */
const binarySearch = (arr, target, key = 0) => {
    let l = 0;
    let r = arr.length - 1;
    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        if (Array.isArray(arr[mid])) {
            key = 0;
        } else {
            key = "x";
        }
        if (arr[mid][key] === target) {
            return mid;
        } else if (arr[mid][key] > target) {
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }
    return l;
};

/**
 * 拖动事件辅助类
 */
export default class DragHelper {
    /**
     * @param {Object} params
     * @param {Highcharts.Chart} params.chart chart实例
     * @param {Highcharts.Series[]} params.seriesList  需要绑定事件的series
     * @param {number} params.startTime 起始时间
     * @param {Function} params.callback 回调函数
     */
    constructor({ chart, seriesList, startTime, callback = () => { } }) {
        this.chart = chart;
        this.seriesList = seriesList;
        this.signList = [];
        this.startTime = startTime;
        this.callback = callback;
        this.bindDragEvent();
        this.bindDragHelper();
    }
    /**
     * 绑定拖动方式切换事件
     */
    bindDragEvent() {
        const eventSign = new AbortController();
        this.signList.push(eventSign);
        let isDown = false;
        const isMac = /macintosh|mac os x/i.test(navigator.userAgent.toLowerCase());
        let dragKey="Control"
        let dragYKey="y"
        if (isMac) {
            dragKey="Meta"
        }
        const drawUpHandler = (e) => {
            if (e.key === dragKey && isDown === true) {
                isDown = false;
                if (!dragging) {
                    this.bindDragHelper();
                }
                window.removeEventListener("keyup", drawUpHandler);
            }
        };
        const dragYUpHandler=(e)=>{
            if(e.key === dragYKey && isDown === true){
                isDown = false;
                if (!dragging) {
                    this.bindDragHelper();
                }
                window.removeEventListener("keyup", dragYUpHandler);
            }
        }

        window.addEventListener(
            "keydown",
            (e) => {
                if (dragging) return;
                if (e.key === dragKey && isDown === false) {
                    isDown = true;
                    this.bindDrawHelper();
                    window.addEventListener("keyup", drawUpHandler);
                }else if(e.key === dragYKey && isDown === false){
                    isDown = true;
                    this.bindDragSingleYHelper()
                    window.addEventListener("keyup", dragYUpHandler);
                }
            },
            {
                signal: eventSign.signal,
            }
        );
    }
    /**绑定拖动绘制事件
     * @param {Object} params
     * @param {number} params.startTime 开始时间
     * @param {number} params.dragMinY 最小y值
     * @param {Function} params.callback 回调函数
     */
    bindDrawHelper({ startTime = this.startTime, dragMinY = 0, callback = this.callback } = {}) {
        this.seriesList.forEach(series => {
            if (series.data.length < 2) return;
            const minTickInterval = series.points[1].x - series.points[0].x;
            const dragMaxX = series.points.at(-1).x;
            const dragMinX = series.points[0].x;
            series.update({
                animation: false,
                point: {
                    events: {
                        drag: drawHandler({
                            minTickInterval,
                            chart: this.chart,
                            startTime,
                            lineColor: "#05863b",
                            callback,
                        }),
                    },
                },
                dragDrop: {
                    draggableY: true,
                    draggableX: true,
                    dragPrecisionX: minTickInterval,
                    dragMaxX,
                    dragMinX,
                    dragMinY,
                    liveRedraw: false,
                },
            }, false);
        });
        this.chart.redraw(false);
    }
    /**绑定橡皮筋拖动事件-任意方向
     * @param {Object} params
     * @param {number} params.startTime 开始时间
     * @param {number} params.dragMinY 最小y值
     * @param {Function} params.callback 回调函数 
     */
    bindDragHelper({ startTime = this.startTime, dragMinY = 0, callback = this.callback } = {}) {
        this.seriesList.forEach(series => {
            if (series.data.length < 2) return;
            const minTickInterval = series.points[1].x - series.points[0].x;
            const dragMaxX = series.points.at(-1).x;
            const dragMinX = series.points[0].x;
            series.update({
                animation: false,
                point: {
                    events: {
                        drag: dargAnyHandler({
                            startTime,
                            callback,
                            minTickInterval
                        }),
                    },
                },
                dragDrop: {
                    draggableY: true,
                    draggableX: true,
                    dragPrecisionX: minTickInterval,
                    dragMaxX,
                    dragMinX,
                    dragMinY,
                    liveRedraw: true,
                },
            }, false);
        });
        this.chart.redraw(false);
    }
    /**绑定橡皮筋拖动事件-Y轴拖动
     * @param {Object} params
     * @param {number} params.startTime 开始时间
     * @param {number} params.dragMinY 最小y值
     * @param {Function} params.callback 回调函数 
     */
    bindDragYHelper({ startTime = this.startTime, dragMinY = 0, callback = this.callback } = {}) {
        this.seriesList.forEach(series => {
            if (series.data.length < 2) return;
            const minTickInterval = series.points[1].x - series.points[0].x;
            const dragMaxX = series.points.at(-1).x;
            const dragMinX = series.points[0].x;
            series.update({
                animation: false,
                point: {
                    events: {
                        drag: dargHandler({
                            startTime,
                            callback,
                        }),
                    },
                },
                dragDrop: {
                    draggableY: true,
                    draggableX: false,
                    dragPrecisionX: minTickInterval,
                    dragMaxX,
                    dragMinX,
                    dragMinY,
                    liveRedraw: true,
                },
            }, false);
        });
        this.chart.redraw(false);
    }
    /**
     * 绑定y轴单点拖动
     * @param {Object} params
     * @param {number} params.startTime 开始时间
     * @param {Function} params.callback 回调函数 
     */
    bindDragSingleYHelper({ startTime = this.startTime, dragMinY = 0, callback = this.callback } = {}){
        this.seriesList.forEach(series => {
            if (series.data.length ==0) return;
            const dragMaxX = series.points.at(-1).x;
            const dragMinX = series.points[0].x;
            series.update({
                animation: false,
                point: {
                    events: {
                        drag: dargY({
                            startTime,
                            callback,
                        }),
                    },
                },
                dragDrop: {
                    draggableY: true,
                    draggableX: false,
                    dragMaxX,
                    dragMinX,
                    dragMinY,
                    liveRedraw: true,
                },
            }, false);
        });
        this.chart.redraw(false);
    }
    /**
     * 清除事件监听器
     */
    clear() {
        this.chart = null;
        this.seriesList = [];
        this.signList.forEach(item => {
            item.abort();
        });
        this.signList = [];
    }
}