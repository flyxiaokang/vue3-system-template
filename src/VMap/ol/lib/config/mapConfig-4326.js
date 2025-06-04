/*
 * @Description: ol-map-config
 * @Version: 1.0
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-05-21 09:24:20
 */
import { V_MAP_PROVIDER } from '@/VMap/global'

const mapConfig = {
  prj: 'EPSG:4326',
  defaultView: {
    center: [104.53125000000001, 36.70263671875],
    zoom: 4,
    minZoom: 0,
    maxZoom: 20,
  },
  defaultBaseLayerId: 'tdt-vec',
  baseLayers: [
    {
      id: 'tdt-vec',
      label: '矢量',
      children: [
        {
          id: 'TDT_VEC',
          label: '天地图矢量',
          visible: true,
          opacity:1,
          type: 'tdt',
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/vector.jpg',
            import.meta.url
          ).href,
          // url: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
        },
      ],
    },
    {
      id: 'tdt-img',
      label: '影像',
      type: 'tdt',
      children: [
        {
          id: 'TDT_IMG',
          order: '10',
          visible: true,
          type: 'tdt',
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
        {
          id: 'TDT_IMG_LABEL',
          order: '10',
          visible: true,
          type: 'tdt',
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
      ],
    },
  ],
  businessLayers: [
  ],
  // toolbar: [
  //   {
  //     label: '地图选择',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/arrow.png',
  //       import.meta.url
  //     ).href,
  //     key: 'pointer',
  //     visible: true,
  //   },
  //   {
  //     label: '放大',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/zoomout.png',
  //       import.meta.url
  //     ).href,
  //     key: 'zoomIn',
  //     visible: true,
  //   },
  //   {
  //     label: '缩小',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/zoomin.png',
  //       import.meta.url
  //     ).href,
  //     key: 'zoomOut',
  //     visible: true,
  //   },
  //   {
  //     label: '全图',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/home.png',
  //       import.meta.url
  //     ).href,
  //     key: 'fullExtent',
  //     visible: true,
  //   },
  //   {
  //     label: '行政区划',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/localed.png',
  //       import.meta.url
  //     ).href,
  //     key: 'xzq',
  //     visible: false,
  //   },
  //   {
  //     label: '图层',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/layerC.png',
  //       import.meta.url
  //     ).href,
  //     key: 'layer',
  //     visible: true,
  //   },
  //   {
  //     label: '搜索',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/search123.png',
  //       import.meta.url
  //     ).href,
  //     key: 'search',
  //     hasChild: true,
  //     visible: false,
  //   },
  //   {
  //     label: '测距',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/distance-new.png',
  //       import.meta.url
  //     ).href,
  //     key: 'LineString',
  //     visible: true,
  //   },
  //   {
  //     label: '测面',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/area-new.png',
  //       import.meta.url
  //     ).href,
  //     key: 'Polygon',
  //     visible: true,
  //   },
  //   {
  //     label: '清除',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/clear.png',
  //       import.meta.url
  //     ).href,
  //     key: 'clear',
  //     visible: true,
  //   },
  //   {
  //     label: '绘制',
  //     image: new URL(
  //       '@/VMap/ol/v3/assets/image/toolbar/draw.png',
  //       import.meta.url
  //     ).href,
  //     key: 'draw',
  //     visible: true,
  //   },
  // ],
}

export default mapConfig
