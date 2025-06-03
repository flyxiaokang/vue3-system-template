/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-12-28 16:38:39
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-12-28 16:38:41
 *
 */

/**
 * 获取wms name
 * @param {*} url
 * @param {*} location
 * @returns
 */
export function getNameByWMS(url, location = false) {
  let name = ''
  const _this = this
  $.ajax({
    url: url + '?SERVICE=WMS&REQUEST=GetCapabilities', // 'http://localhost:8080/geoserver/kjr/wms?REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index]
        // console.log($(element).find('Name').text())
        var Names = $(element).find('Name').eq(0)
        for (let index = 0; index < Names.length; index++) {
          const element3 = Names[index]
          name = element3.innerHTML
          console.log(element3.innerHTML, name)
        }

        if (location) {
          var BoundingBoxs = $(element).find('BoundingBox')
          for (let index = 0; index < BoundingBoxs.length; index++) {
            const element2 = BoundingBoxs[index]
            // console.log(element2.getAttribute('CRS'))
            var crs =
              element2.getAttribute('SRS') || element2.getAttribute('CRS')
            if (crs === 'EPSG:3857') {
              var extent = {
                spatialReference: {
                  wkid: 3857,
                },
                xmax: element2.getAttribute('maxx'),
                xmin: element2.getAttribute('minx'),
                ymax: element2.getAttribute('maxy'),
                ymin: element2.getAttribute('miny'),
              }
              _this.flyToByExtent(extent)
              console.log('???????', extent)
              break
            } else if (crs === 'EPSG:4490') {
              var extent = {
                spatialReference: {
                  wkid: 4490,
                },
                xmax: element2.getAttribute('maxx'),
                xmin: element2.getAttribute('minx'),
                ymax: element2.getAttribute('maxy'),
                ymin: element2.getAttribute('miny'),
              }
              _this.flyToByExtent(extent)
              console.log('???????', extent)
              break
            } else if (crs === 'EPSG:4326' || crs === 'CRS:84') {
              var extent = {
                spatialReference: {
                  wkid: 4326,
                },
                xmax: element2.getAttribute('maxx'),
                xmin: element2.getAttribute('minx'),
                ymax: element2.getAttribute('maxy'),
                ymin: element2.getAttribute('miny'),
              }
              _this.flyToByExtent(extent)
              break
            }
          }
        }
      }
    },
    error: function () {
      name = 'dltb'
    },
  })
  return name
}

/**
 * 获取wmts name
 * @param {*} url
 * @param {*} location
 * @returns
 */

export function getNameByWMTS(url, location = false) {
  const layerInfo = {}
  const _this = this
  let name = ''
  $.ajax({
    url: url + '?SERVICE=WMTS&REQUEST=GetCapabilities', // 'http://localhost:8080/geoserver/kjr/wms?REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      // console.log(res)
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index]
        // console.log($(element).find('Name').text())
        // var Names = $(element.childNodes).find('ows:Identifier')
        // let aaa = $(element).find('ows:Identifier')
        // let aaaq = $(element).find('ows:Title')
        // var Names = $(element).find('ows:Identifier').eq(0)

        for (var i = 0; i < element.children.length; i++) {
          const a = element.children[i]
          if (a.nodeName === 'ows:Identifier') {
            name = a.innerHTML
          }
          if (a.nodeName === 'style') {
            console.log(a)
          }
          if (location && a.nodeName === 'ows:WGS84BoundingBox') {
            let lower = []
            let upper = []
            for (let index = 0; index < a.children.length; index++) {
              const element2 = a.children[index]
              if (element2.nodeName === 'ows:LowerCorner') {
                lower = element2.innerHTML.split(' ')
              }
              if (element2.nodeName === 'ows:UpperCorner') {
                upper = element2.innerHTML.split(' ')
              }
            }
            var extent = {
              spatialReference: {
                wkid: 4326,
              },
              xmax: upper[0],
              xmin: lower[0],
              ymax: upper[1],
              ymin: lower[1],
            }
            _this.flyToByExtent(extent)
          }
        }
      }
    },
    error: function () {
      name = 'dltb'
    },
  })

  return name
}

export function getNameByWFS(url, location = false) {
  const _this = this
  let name = ''
  $.ajax({
    url: url + '?REQUEST=GetCapabilities', // 'http://localhost:8080/geoserver/kjr/wms?REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      // console.log(res)
      const x2jsObj = new x2js()
      const obj = x2jsObj.dom2js(res)
      console.log(obj)
      const feature = obj.WFS_Capabilities.FeatureTypeList.FeatureType
      name = feature.Name

      if (location) {
        const lower = feature.WGS84BoundingBox.LowerCorner.toString().split(' ')
        const upper = feature.WGS84BoundingBox.UpperCorner.toString().split(' ')
        var extent = {
          spatialReference: {
            wkid: 4326,
          },
          xmax: upper[0],
          xmin: lower[0],
          ymax: upper[1],
          ymin: lower[1],
        }
        _this.flyToByExtent(extent)
      }
    },
    error: function () {
      name = 'dltb'
    },
  })

  return name
}


function getSpatialDataByCode(code) {
  getBoundsByRegionCode({
    xzqdm: code,
    ifGetChildren: false,
  }).then((res) => {
    if (res.data.success) {
      var jsonObj = JSON.parse(res.data.body.data)
      if (jsonObj.features != undefined && jsonObj.features.length > 0) {
        var feature = jsonObj.features[0]
        var curRing = []
        var geo = feature.geometry
        if (geo.type == 'Polygon') {
          curRing.push(geo.coordinates[0])
        } else {
          geo.coordinates.forEach((element) => {
            element.forEach((element2) => {
              curRing.push(element2)
            })
          })
        }
        // getEnvelop(curRing[0])
        this.flyToByExtent(getEnvelop(curRing[0]))
      } else {
        Message({
          type: 'info',
          message: '行政区范围获取失败',
        })
      }
    } else {
      Message({
        type: 'info',
        message: '行政区范围获取失败',
      })
    }
  })
}