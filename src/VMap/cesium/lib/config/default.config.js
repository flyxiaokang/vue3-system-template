/*
 * @Description: 配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-20 15:06:59
 */
import { V_MAP_PROVIDER } from '@/VMap/global'

const mapConfig = {
  prj: 'EPSG:3857',
  // prj: 'EPSG:4326',
  vcConfig: {
    // cesiumPath: '1',
    // accessToken: '2',
    // tdtToken: '718469ef14a862124f30427a38edaec4',
  },
  defaultView: {
    // lon: 115.5,
    // lat: 39.5,
    // height: 100000,
    // heading: 0,
    // pitch: -89.74026687972041,
    // roll: 0,
    camera: {
      lon: 103.84,
      lat: 31.15,
      height: 17850000,
      heading: 0,
      pitch: -89.74026687972041,
      roll: 0,
    },
    zoom: 4,
    minZoom: 0,
    maxZoom: 18,
  },
  defaultBaseLayerId: '1',
  baseLayers: [
    {
      id: '1',
      label: '影像',
      type: V_MAP_PROVIDER.tdt,
      children: [
        {
          id: 'TDT_IMG',
          zIndex: 0,
          visible: true,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '../../../public/static/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
        {
          id: 'TDT_IMG_LABEL',
          zIndex: 1,
          visible: true,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '../../../public/static/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
      ],
    },
    {
      id: '2',
      label: '矢量',
      type: V_MAP_PROVIDER.tdt,
      children: [
        {
          id: 'TDT_VEC',
          zIndex: '1',
          visible: true,
          opacity: 1,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '../../../public/static/image/baseMap/vector.jpg',
            import.meta.url
          ).href,
        },
        {
          id: 'TDT_VEC_LABEL',
          zIndex: '2',
          visible: true,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '../../../public/static/image/baseMap/vector.jpg',
            import.meta.url
          ).href,
        },
      ],
    },
    {
      id: '3',
      label: '地形',
      type: V_MAP_PROVIDER.geoserverwmts,
      children: [
        // {
        //   id: 'geo_wmts',
        //   label: 'wmts',
        //   visible: true,
        //   type: V_MAP_PROVIDER.geoserverwmts,
        //   image: new URL(
        //     '../../../public/static/image/baseMap/terrian.jpg',
        //     import.meta.url
        //   ).href,
        //   url:'http://localhost:8080/geoserver/gwc/service/wmts',
        //   layer:'kjr:countries',
        // },
        // {
        //   id: 'geo_wms',
        //   label: 'wms',
        //   visible: true,
        //   type: V_MAP_PROVIDER.wmsimagetile,
        //   image: new URL(
        //     '../../../public/static/image/baseMap/terrian.jpg',
        //     import.meta.url
        //   ).href,
        //   url:'http://localhost:8080/geoserver/kjr/wms',
        //   layers:'kjr:China',
        // },
        // {
        //   id: 'geo_arcgis',
        //   visible: true,
        //   type: V_MAP_PROVIDER.arcgisimage,
        //   image: new URL(
        //     '../../../public/static/image/baseMap/terrian.jpg',
        //     import.meta.url
        //   ).href,
        //   url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        //   layers: '1,3',
        // },
        // {
        //   id: 'geo_wms',
        //   visible: true,
        //   type: V_MAP_PROVIDER.wmsimagetile,
        //   image: new URL(
        //     '../../../public/static/image/baseMap/terrian.jpg',
        //     import.meta.url
        //   ).href,
        //   url: 'http://localhost:8080/geoserver/jinshui/wms',
        //   layers: 'jinshui:BAS1',
        // },
        {
          id: 'geo_wmts',
          visible: true,
          type: V_MAP_PROVIDER.geoserverwmts,
          image: new URL(
            '../../../public/static/image/baseMap/terrian.jpg',
            import.meta.url
          ).href,
          url: 'http://localhost:8080/geoserver/gwc/service/wmts',
          layer: 'kjr:countries',
          tilematrixset: 'EPSG:4326',
          matrixSetPrefix: 'EPSG:4326:',
        },
      ],
    },
  ],
  businessLayers: [],
  toolbar: [
    {
      label: '定位',
      index: 'location',
      iconClass: 'iconfont icon-location',
    },
    {
      label: '量测',
      index: 'measure',
      iconClass: 'iconfont icon-celiang1',
    },
    {
      label: '查询',
      index: 'search',
      iconClass: 'iconfont icon-i',
    },
    {
      label: '卷帘',
      index: 'rool',
      iconClass: 'iconfont icon-juanlian',
      //img: require('../assets/images/toolbar/卷帘.png')
    },
    {
      label: '分屏',
      index: 'multiple-screen',
      iconClass: 'iconfont icon-ic-normal-fenping',
      //img: require('../assets/images/toolbar/分屏.png')
    },
    // {
    //     label: "鹰眼",
    //     index: 3,
    //     iconClass: "iconfont icon-yingyan",
    //     //img: require('../assets/images/toolbar/鹰眼.png')
    // },
    {
      label: '图例',
      index: 'legend',
      iconClass: 'iconfont icon-tuli',
      //img: require('../assets/images/toolbar/图例.png')
    },
    {
      label: '导出',
      index: 'export',
      iconClass: 'iconfont icon-daochutupian',
      // //img: require('../assets/images/toolbar/导出图片.png')
    },
    {
      label: '底图',
      index: 'basemap',
      iconClass: 'iconfont icon-dituqiehuan',
      // //img: require('../assets/images/toolbar/导出图片.png')
    },
    {
      label: '图层',
      index: 'layers',
      iconClass: 'iconfont icon-tucengguanli',
      // //img: require('../assets/images/toolbar/图层.png')
    },
    {
      label: '工具条',
      index: 'bar',
      iconClass: 'iconfont icon-shubiao',
    },
  ],
  tdt: {
    TDT_IMG_4326: [
      {
        id: 'img_c',
        zIndex: 10,
      },
      {
        id: 'cva_c',
        zIndex: 20,
      },
    ],
    TDT_VEC_4326: [
      {
        id: 'vec_c',
        zIndex: 10,
      },
      {
        id: 'cia_c',
        zIndex: 20,
      },
    ],

    TDT_IMG_3857: [
      {
        id: 'img_w',
        zIndex: 10,
      },
      {
        id: 'cva_w',
        zIndex: 20,
      },
    ],
    TDT_VEC_3857: [
      {
        id: 'vec_w',
        zIndex: 10,
      },
      {
        id: 'cia_w',
        zIndex: 20,
      },
    ],
  },
}

export default mapConfig
