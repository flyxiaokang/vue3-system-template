/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2020-01-30 23:58:56
 * @LastEditTime : 2020-02-04 10:34:23
 */
import {
  addLayerGroup
} from './common'
export default class BaseLayer {
  constructor(scene, data, pointData) {
    this.scene = scene;
    this.data = data;
    this.pointData = pointData;
    this.addLayers();
    this.addLayerEvent();
  }

  hide() {
    this.layers.forEach(element => {
      element.hide();

    });
  }

  show() {
    this.layers.forEach(element => {
      element.show();

    });
    this.layers[0].fitBounds();
  }
  addLayers() {
    this.layers = new addLayerGroup(this.scene, this.data, this.pointData);
  }
  removeLayers() {
    this.layers.forEach(element => {
      this.scene.removeLayer(element);
    });
  }
  addLayerEvent() {

  }
  destroy() {
    this.removeLayers();
    this.scene.render();
    this.layers = [];
    this.data = [];
    this.pointData = [];
  }
}
