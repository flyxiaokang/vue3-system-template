/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2021-06-16 18:47:07
 * @LastEditors: kangjinrui
 * @LastEditTime: 2021-09-01 15:16:00
 */
var CustomMvtStyle = function (options) {
    this.styleOptions = options.layerStyle
    console.log('styleOptions', this.styleOptions)

    this.fillColor = ''
    this.fillColorOpacity = 1
    this.strokeColor = ''

    this.isSimple = true
    this.renderArray = []
    this.fieldName = ''

    this.styleType = {
        case: 'case',
        match: 'match'
    }

    this.curStyleType = ''

    this.styleOptions.forEach(element => {
        let type = element.type
        if (type === 'fill') {
            let paint = element.paint
            if (paint['fill-color'] instanceof Array) {
                this.isSimple = false
                this.renderArray = paint['fill-color']
                if (this.renderArray[0] == 'case') {
                    this.fieldName = this.renderArray[1][1][1]
                } else {
                    this.fieldName = this.renderArray[1][1]
                }
                this.curStyleType = this.renderArray[0]

                // this.fillColor = this.fillColor
                // this.fillColorOpacity = this.fillColorOpacity
                // this.strokeColor = this.strokeColor
            } else {
                this.isSimple = true
                this.fillColor = paint['fill-color'] || this.fillColor
                this.fillColorOpacity = paint['fill-opacity'] || this.fillColorOpacity
                this.strokeColor = paint['fill-outline-color'] || this.strokeColor
            }
        } else if (type === 'line') {

        } else if (type === 'symbol') {

        }
    });
    // console.log(this.styleOptions, this.fillColor)
};
CustomMvtStyle.prototype.getStyle = function () {
    let _this = this
    var fill = new ol.style.Fill({
        color: "",
    });
    var stroke = new ol.style.Stroke({
        color: "",
        width: 1,
    });
    var polygon = new ol.style.Style({
        fill: fill,
    });
    var strokedPolygon = new ol.style.Style({
        fill: fill,
        stroke: stroke,
    });
    var line = new ol.style.Style({
        stroke: stroke,
    });
    var text = new ol.style.Style({
        text: new ol.style.Text({
            text: "",
            fill: fill,
            stroke: stroke,
        }),
    });
    var iconCache = {};

    function getIcon(iconName) {
        var icon = iconCache[iconName];
        if (!icon) {
            icon = new ol.style.Style({
                image: new ol.style.Icon({
                    src: "https://cdn.rawgit.com/mapbox/maki/master/icons/" +
                        iconName +
                        "-15.svg",
                    imgSize: [15, 15],
                }),
            });
            iconCache[iconName] = icon;
        }
        return icon;
    }
    var styles = [];

    return function (feature, resolution) {
        // console.log(feature, _this.fillColor.colorRgbArray(true))
        // let color = _this.fillColor.colorRgbArray(true)
        // color.push(_this.fillColorOpacity)
        // fill.setColor(color);

        if (!_this.isSimple) {
            var layer = feature.get("layer");
            var fieldValue = feature.get(_this.fieldName);

            for (let index = 0; index < _this.renderArray.length; index++) {
                const element = _this.renderArray[index];
                if (index === 0)
                    continue

                if (index === 1 && _this.curStyleType === _this.styleType.match)
                    continue
                if (_this.curStyleType === _this.styleType.case) {
                    if (fieldValue == element[2]) {
                        fill.setColor(_this.renderArray[index + 1]);
                        break
                    }
                    if (index == _this.renderArray.length - 1) {
                        fill.setColor(element);
                        break
                    }
                } else if (_this.curStyleType === _this.styleType.match) {
                    if (element instanceof Array) {
                        let flag = false
                        for (let index2 = 0; index2 < element.length; index2++) {
                            const element2 = element[index2];
                            if (fieldValue == element2) {
                                flag = true
                                fill.setColor(_this.renderArray[index + 1]);
                                break
                            }
                        }
                        if (flag)
                            break
                    } else {
                        if (fieldValue == element) {
                            fill.setColor(_this.renderArray[index + 1]);
                            break
                        }
                    }
                    if (index == _this.renderArray.length - 1) {
                        fill.setColor(element);
                        break
                    }
                }
            }
            // fill.setColor('blue');
            stroke.setColor('#1833a000');
            stroke.setWidth(0);
            styles = [strokedPolygon]
        } else {
            let color = _this.fillColor.colorRgbArray(true)
            color.push(_this.fillColorOpacity)
            fill.setColor(color);

            stroke.setColor(_this.strokeColor);
            stroke.setWidth(0);
            styles = [strokedPolygon]
        }
        return styles;
    };
};

export default CustomMvtStyle;