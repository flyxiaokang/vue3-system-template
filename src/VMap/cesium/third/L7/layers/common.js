import {
  LineLayer,
  PolygonLayer,
  PointLayer,
  Control,
  Layers,
  Popup
} from "@antv/l7";
const colors = ['rgb(106,33,29)', 'rgb(144,55,53)', 'rgb(181,78,76)', 'rgb(211,104,101)', 'rgb(227,147,131)', 'rgba(255,255,255,0.8)'].reverse();

import * as L7 from "@antv/l7"

export function addLayerGroup(scene, data, dataPoint) {
  const china = new PolygonLayer({
      autoFit: true
    })
    .source(data)
    .shape("fill")
    .color("confirm", (d) => {
      return d > 1000 ? colors[5] :
        d > 499 ? colors[4] :
        d > 100 ? colors[3] :
        d > 10 ? colors[2] :
        d > 0 ? colors[1] :
        colors[0];
    })
    .style({
      opacity: 1
    });
  var popup = new L7.Popup();
  china.on('mousemove', e => {
    const info = scene.getControlByName('infoControl');
    info.update(e.feature);
    console.log(">>>>>>>>", e)
    //
    // if (e.lngLat) {
    //   //
    //   var lnglat = e.lngLat,
    //     feature = e.feature;
    //   var html = '\n        <p>\u677F\u5757\uFF1A' + feature.properties.name + '</p>\n        <p>\u5E73\u5747\u623F\u4EF7\uFF1A' + feature.properties.confirm + '</p>';
    //   popup.setLnglat([lnglat.lng, lnglat.lat]).setHTML(html).addTo(scene);
    // }
  });
  const chinaline = new LineLayer({})
    .source(data)
    .size(0.5)
    .shape("line")
    .color("#222")
    .style({
      opacity: 1
    });
  const pointLayer = new PointLayer({})
    .source(dataPoint, {
      parser: {
        type: "json",
        coordinates: "center"
      }
    })
    .shape("name", "text")
    .size(12)
    .color("#fff")
    .style({
      stroke: "#ffffff", // 描边颜色
      strokeWidth: 1.0, // 描边宽度
      strokeOpacity: 1.0,
      textAllowOverlap: false
    });

  scene.addLayer(china);
  scene.addLayer(chinaline);
  scene.addLayer(pointLayer);
  return [china, chinaline, pointLayer];
}

export function addLegend() {

  const legend = new Control({
    position: 'bottomright'
  });
  legend.onAdd = function () {
    var el = document.createElement('div');
    el.className = 'infolegend legend';
    var grades = [0, 1, 10, 100, 500, 1000];
    el.innerHTML += '<h4>图例</h4><span>确诊数</span><br>'
    for (var i = 0; i < grades.length; i++) {
      el.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }
    return el;
  };
  return legend;
}

export function addInfoControl() {
  const info = new Control({
    position: 'topright',
    name: 'infoControl',
  });
  info.onAdd = function () {
    this._div = document.createElement('div');
    this.update();
    return this._div;
  };

  info.update = function (feature) {
    if (!feature) {
      return;

    }
    this._div.innerHTML = `<div class=info_control>
           <h4>${feature.properties.name}</h4>
          <p><span>确诊: ${feature.properties.confirm || 0}</span> <span>疑似: ${feature.properties.suspect || 0}</span><p>
          <p><span>治愈: ${feature.properties.heal || 0}</span> <span>死亡: ${feature.properties.dead || 0}</span> </p>
          <p style ='font-size: 8px;'>注：<I> 双击省份下钻到市级地图，双击空白处切换到省级地图</I> </p>
          </div>`;
  };
  return info;

}

export function mapInfoContol() {
  const info = new Control({
    position: 'bottomright',
  });
  info.onAdd = function () {
    const el = document.createElement('div');
    el.innerHTML = `<div class='mapinfo'>
      <span>数据来源：<a  target='_blank' href="https://github.com/wuhan2020/map-viz#%E4%B8%B4%E6%97%B6%E6%8E%A5%E5%8F%A3">wuhan2020</a></span>
      <span>地图可视化库：<a  target='_blank' href="https://github.com/antvis/L7">AntV | L7</a></span>
      <span>源码：<a  target='_blank' href="https://github.com/lzxue/yiqingditu">疫情地图</a></span>
    </div>
    `
    el.innerHTML = `<div class='mapinfo'>
    <span><a  target='_blank' href="#">疫情地图</a></span>
  </div>
  `
    return el;
  };

  return info

}

export function addLayerControl(overlayers) {
  const layerContorl = new Layers({
    position: 'topleft',
    overlayers
  })
  return layerContorl;
}
export function joinData(geo, data) {
  const dataObj = {};
  data.forEach(item => {
    dataObj[item.name] = item;
  });
  geo.features = geo.features.map(item => {
    const name = item.properties.name;
    item.properties = {
      ...item.properties,
      ...dataObj[name]
    }
    return item
  })
  return geo;
}
