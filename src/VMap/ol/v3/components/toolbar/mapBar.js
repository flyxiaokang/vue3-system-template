/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:52:25
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-26 11:37:21
 */

export const toolbar = [
  {
    label: "选择",
    image: new URL("../../assets/image/toolbar/arrow.png", import.meta.url)
      .href,
    key: "pointer",
    icon: "pointer",
  },
  {
    label: "放大",
    image: new URL("../../assets/image/toolbar/zoomout.png", import.meta.url)
      .href,
    key: "zoomIn",
    icon: "zoomout",
  },
  {
    label: "缩小",
    image: new URL("../../assets/image/toolbar/zoomin.png", import.meta.url)
      .href,
    key: "zoomOut",
    icon: "zoomin",
  },
  {
    label: "全图",
    image: new URL("../../assets/image/toolbar/home.png", import.meta.url).href,
    key: "fullExtent",
    icon: "fullmap",
  },
  // {
  //     label: "行政区划",
  //     image: new URL(
  //         "../../assets/image/toolbar/localed.png",
  //         import.meta.url
  //     ).href,
  //     key: "xzq",
  // },
  {
    label: "图层",
    image: new URL("../../assets/image/toolbar/layerC.png", import.meta.url)
      .href,
    key: "layer",
    icon: "layers",
  },
  // {
  //     label: "搜索",
  //     image: new URL(
  //         "../../assets/image/toolbar/search123.png",
  //         import.meta.url
  //     ).href,
  //     key: "search",
  //     hasChild: true,
  // },

  {
    label: "测距",
    image: new URL(
      "../../assets/image/toolbar/distance-new.png",
      import.meta.url
    ).href,
    key: "LineString",
    icon: "measureline",
  },
  {
    label: "测面",
    image: new URL("../../assets/image/toolbar/area-new.png", import.meta.url)
      .href,
    key: "Polygon",
    icon: "measurearea",
  },
  {
    label: "清除",
    image: new URL("../../assets/image/toolbar/clear.png", import.meta.url)
      .href,
    key: "clear",
    icon: "clear",
  },
];
