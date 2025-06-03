/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-09 10:20:30
 */
import { V_MAP_PROVIDER } from '@/VMap/global'

const mapConfig = {
  //1 内置3857
  baseMapId: 'TDT_VEC_3857',
  extent: {
    xmax: 15313621.169072356,
    xmin: 7457117.6538108885,
    ymax: 8372107.100905355,
    ymin: 603659.0422283877,
  },
  //2
  //     baseMapId: "TDT_VEC_4326",
  //     extent: {
  //         xmax: 153.89978320478554,
  //         xmin: 53.20209047786816,
  //         ymax: 69.00469964930613,
  //         ymin: 2.721562762799934,
  //     },

  //3 自定义
  // wkid: 3857,
  // url: "https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer",
  // serverType: "arcgisimagetile",
  // extent: {
  //     xmax: 15313621.169072356,
  //     xmin: 7457117.6538108885,
  //     ymax: 8372107.100905355,
  //     ymin: 603659.0422283877,
  // },

  // 底图
  defaultBaseLayerId: '',
  baseLayers: [
    {
      id: '2',
      label: '矢量',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_vec',
          label: '天地图矢量',
          children: [
            {
              id: 'tdt_vec_c',
              visible: true,
              type: 'tdt',
              image: new URL(
                '../../v3/assets/image/baseMap/vector.jpg',
                import.meta.url
              ).href,
              url: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
            },
            {
              id: 'tdt_vec_c_label',
              visible: true,
              type: 'tdt',
              url: 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      label: '影像',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_img',
          label: '天地图影像',
          visible: false,
          type: 'tdt',
          image: new URL(
            '../../v3/assets/image/baseMap/image.jpg',
            import.meta.url
          ).href,
          url: 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
        },
      ],
    },
    {
      id: '4',
      label: '地形',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_ter',
          label: '天地图地形',
          visible: false,
          type: 'tdt',
          image: new URL(
            '../../v3/assets/image/baseMap/terrian.jpg',
            import.meta.url
          ).href,
          url: 'http://t{0-7}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
        },
      ],
    },
    {
      id: '1',
      label: '一张图',
      type: 'layerGroup',
      children: [
        {
          id: 'onemap',
          label: '一张图',
          type: 'layerGroup',
          children: [
            {
              id: 'onemap1',
              label: '矢量图',
              type: V_MAP_PROVIDER.wmts,
              // image: 'http://10.1.102.189:8000/dyweb/static/img/vector.cd6f3524.jpg',
              image: new URL(
                '../../v3/assets/image/baseMap/onemap.png',
                import.meta.url
              ).href,
              visible: false,
              layer: 'dem30m',
              matrixSet: 'Custom_dem30m',
              format: 'image/png',
              style: 'default',
              url: 'http://10.1.3.199:8090/iserver/services/dem30m/wmts100',
            },
            {
              id: 'onemap2',
              label: '河流',
              type: V_MAP_PROVIDER.wmts,
              //   image:
              //     'http://10.1.102.189:8000/dyweb/static/img/vector.cd6f3524.jpg',
              image: new URL(
                '../../v3/assets/image/baseMap/onemap.png',
                import.meta.url
              ).href,
              visible: false,
              layer: 'onemap_v',
              matrixSet: 'Custom_onemap_v',
              format: 'image/png',
              style: 'default',
              url: 'http://10.1.3.199:8090/iserver/services/onemap_v/wmts100',
            },
          ],
        },
      ],
    },
    // {
    //     id: '5',
    //     label: '一张图2',
    //     type: 'layerGroup',
    //     children: [{
    //         id: 'onemap_',
    //         label: '一张图',
    //         type: 'layerGroup',
    //         children: [{
    //             id: 'onemap_1',
    //             label: '矢量图',
    //             type: V_MAP_PROVIDER.supermap,
    //             visible: false,
    //             image: 'http://10.1.102.189:8000/dyweb/static/img/vector.cd6f3524.jpg',
    //             url: 'http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m'
    //         }, {
    //             id: 'onemap_2',
    //             label: '河流',
    //             type: V_MAP_PROVIDER.supermap,
    //             visible: false,
    //             url: 'http://10.1.3.199:8090/iserver/services/onemap_v/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=onemap_v&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_onemap_v'
    //         }]
    //     }]
    // }
  ],
  businessLayers: [
    {
      label: 'wms',
      children: [
        {
          label: 'test',
          children: [
            {
              id: 'layerId_wms_tile3',
              label: 'wms tile',
              visible: false,
              type: 'wms',
              url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
            },
          ],
        },
        {
          id: 'layerId_wms_tile',
          label: 'wms tile',
          visible: false,
          type: 'wms',
          url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
        },
        {
          id: 'layerId_wms_tile2',
          label: 'wms img',
          visible: false,
          type: 'wmsimage',
          url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
        },
      ],
    },
    {
      label: 'wmts',
      children: [
        {
          id: 'layerId_wmts',
          label: 'wmts1',
          visible: false,
          type: 'geoserverwmts',
          url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&matrixSet=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        },
      ],
    },
  ],

  toolbar: [
    {
      label: '地图选择',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/arrow.png',
        import.meta.url
      ).href,
      key: 'pointer',
      visible: true,
    },
    {
      label: '放大',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/zoomout.png',
        import.meta.url
      ).href,
      key: 'zoomIn',
      visible: true,
    },
    {
      label: '缩小',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/zoomin.png',
        import.meta.url
      ).href,
      key: 'zoomOut',
      visible: true,
    },
    {
      label: '全图',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/home.png',
        import.meta.url
      ).href,
      key: 'fullExtent',
      visible: true,
    },
    {
      label: '行政区划',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/localed.png',
        import.meta.url
      ).href,
      key: 'xzq',
      visible: true,
    },
    {
      label: '图层',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/layerC.png',
        import.meta.url
      ).href,
      key: 'layer',
      visible: true,
    },
    {
      label: '搜索',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/search123.png',
        import.meta.url
      ).href,
      key: 'search',
      hasChild: true,
      visible: true,
    },
    {
      label: '清除',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/clear.png',
        import.meta.url
      ).href,
      key: 'clear',
      visible: true,
    },
    {
      label: '测距',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/distance-new.png',
        import.meta.url
      ).href,
      key: 'LineString',
      visible: true,
    },
    {
      label: '测面',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/area-new.png',
        import.meta.url
      ).href,
      key: 'Polygon',
      visible: true,
    },
    {
      label: '绘制',
      image: new URL(
        '../../modules-v2/assets/image/toolbar/draw.png',
        import.meta.url
      ).href,
      key: 'draw',
      visible: true,
    },
  ],
}

export default mapConfig
