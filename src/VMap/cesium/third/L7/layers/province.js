/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2020-01-30 23:58:56
 * @LastEditTime : 2020-02-03 00:01:07
 */
import BaseLayer from './baseLayer'
import CityLayerGroup from './city';
export default class ProvinceNcovLayer extends BaseLayer {
  addLayerEvent() {
    this.layers[0].on('dblclick', (e) => {
      const {
        adcode,
        cities = []
      } = e.feature.properties;
      console.log(e)

      this.addCityLayer(adcode, cities);
    })

    setTimeout(() => {
      this.addCityLayer('320000', window.defaultProvice.cities);
    }, 0);
  }
  async addCityLayer(adcode, citydata) {

    const cityGeo = await (await fetch(`https://gw.alipayobjects.com/os/antvdemo/assets/json/${adcode}.json`)).json();

    const dataPoint = cityGeo.features.map(fe => {
      return {
        name: fe.properties.name,
        center: fe.properties.centroid || fe.properties.center
      }
    })
    cityGeo.features = cityGeo.features.map(fe => {
      const name = fe.properties.name.replace('市', '');
      const city = citydata.find((c) => {
        if (c.name === '恩施州') c.name = '恩施';
        if (name.match(c.name) !== null || c.name.match(name) !== null) {
          return true;
        }
        return false;
      })
      if (city) {
        fe.properties.confirm = city.confirm;
        fe.properties.suspect = city.suspect;
        fe.properties.heal = city.heal;
        fe.properties.dead = city.dead;
      } else {
        fe.properties.confirm = 0;
        fe.properties.suspect = 0;
        fe.properties.heal = 0;
        fe.properties.dead = 0;
      }
      return fe;
    })
    this.cityLayer = new CityLayerGroup(this.scene, cityGeo, dataPoint);

    this.cityLayer.layers[0].on('undblclick', () => {
      this.cityLayer.destroy();
      this.show();
      setTimeout(() => {
        this.scene.render();
      }, 10)

    })
    this.hide();
    setTimeout(() => {
      this.scene.render();
    }, 10)
  }

}
