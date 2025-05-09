/*
 * @Description: 
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-12-13 17:18:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-04-30 11:33:25
 */

const resolutions = [
  1.4062500000022087, 0.7031249999891485, 0.35156250000645817,
  0.17578124999134512, 0.08789062499567256, 0.04394531250972024,
  0.02197265625486012, 0.01098632812743006, 0.00549316406371503,
  0.002746582031857515, 0.0013732910159287575, 6.866454960804162e-4,
  3.4332275992417075e-4, 1.7166136807812276e-4, 8.583068403906138e-5,
  4.291534201953069e-5, 2.1457682893727956e-5, 1.0728841446863978e-5,
  5.364420723431989e-6, 2.6822103617159945e-6, 1.3411051808579973e-6,
]

export const MAP_CONFIG = {
  prj: 'EPSG:4326',
  defaultView: {
    projection: 'EPSG:4326',
    center: [105.4, 35.2],
    zoom: 4.5,
    minZoom: 4.5,
    // maxZoom: 15,
  },
  defaultBaseLayerId: 'tdt-vec',
  baseLayers: [
    {
      id: 'tdt-vec',
      label: '矢量',
      type: 'tdt',
      children: [
        {
          id: 'tdt_vec',
          label: '天地图地形',
          visible: true,
          type: 'tdt',
          // url: 'http://t{0-7}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
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
        },
        {
          id: 'TDT_IMG_LABEL',
          order: '10',
          visible: true,
          type: 'tdt',
        },
      ],
    },
    // {
    //   id: 'supermap-vec',
    //   label: '矢量',
    //   type: 'supermapwmts',
    //   children: [
    //     {
    //       id: 'supermap',
    //       label: '超图',
    //       visible: true,
    //       type: 'supermapwmts',
    //       url: 'https://10.243.45.80/hebei-map/iserver/services/map-ugcv5-China4326/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=China4326&STYLE=default&FORMAT=image/png&TILEMATRIXSET=Custom_China4326',
    //       origin: [62.88574218750019, 66.75292968750006],
    //       resolutions,
    //       requestParams: {
    //         layer: 'China4326',
    //         tilematrixset: 'Custom_China4326',
    //       },
    //     },
    //     {
    //       id: 'huaiwei-river2',
    //       label: '河流(新)',
    //       type: 'supermapwmts',
    //       visible: true,
    //       origin: [111.98170377278893, 43.43296131468836],
    //       url: 'https://10.243.45.80/hebei-map/iserver/services/map-ugcv5-HeBeiRiverV4/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=HeBeiRiverV4&STYLE=default&FORMAT=image/png&TILEMATRIXSET=Custom_HeBeiRiverV4',
    //       resolutions,
    //       requestParams: {
    //         layer: 'HeBeiRiverV4',
    //         tilematrixset: 'Custom_HeBeiRiverV4',
    //       },
    //     },
    //   ],
    // },
  ],
  businessLayers: [],
  toolbar: [],
}