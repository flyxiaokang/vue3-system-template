var DLTBMvtStyle = function (options) {
    this.styleOptions = options
};
DLTBMvtStyle.prototype.getStyle = function () {
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
        console.log(feature, _this.styleOptions)
        var length = 0;
        var layer = feature.get("layer");
        var dlbm = feature.get("dlbm");
        var geom = feature.getGeometry().getType();

        // fill.setColor("blue");
        // styles[length++] = strokedPolygon;

        // stroke.setColor('red');
        // stroke.setWidth(0.5);
        // styles.length = length;
        // return styles;
        if (layer == "dt_sxdltb") {
            if (dlbm == "0701" || dlbm == "0702") {
                fill.setColor("rgb(240,110,125)");
            } else if (dlbm == "08H1" || dlbm == "08H2" || dlbm == "0809" || dlbm == "0810A") {
                fill.setColor("rgb(255,170,200)");
            } else if (dlbm == "05H1" || dlbm == "0508") {
                fill.setColor("rgb(235,150,160)");
            } else if (dlbm == "0401") {
                fill.setColor("rgb(170,190,30)");
            } else if (dlbm == "0403") {
                fill.setColor("rgb(150,210,50)");
            } else if (dlbm == "0404") {
                fill.setColor("rgb(200,220,100)");
            } else if (dlbm == "0601") {
                fill.setColor("rgb(210,145,135)");
            } else if (dlbm == "1006") {
                fill.setColor("rgb(127,63,0)");
            } else if (dlbm == "1201") {
                fill.setColor("rgb(225,200,225)");
            } else if (dlbm == "1202") {
                fill.setColor("rgb(165,0,0)");
            } else if (dlbm == "0102") {
                fill.setColor("rgb(255,255,0)");
            } else if (dlbm == "0301" || dlbm == "0302" || dlbm == "0305" || dlbm == "0307") {
                fill.setColor("rgb(40,140,0)");
            } else if (dlbm == "0201" || dlbm == "0202" || dlbm == "0203" || dlbm == "0204") {
                fill.setColor("rgb(245,210,40)");
            } else if (dlbm == "1003" || dlbm == "1004") {
                fill.setColor("rgb(170,85,80)");
            } else if (dlbm == "1107" || dlbm == "1107A") {
                fill.setColor("rgb(160,205,240)");
            } else if (dlbm == "1101" || dlbm == "1104") {
                fill.setColor("rgb(150,240,255)");
            } else if (dlbm == "1109") {
                fill.setColor("rgb(230,130,100)");
            } else {
                fill.setColor("#15d649");
            }
            styles[length++] = strokedPolygon;
        } else if (layer === 'xzq') {
            fill.setColor("blue");
            styles[length++] = strokedPolygon;
        }

        fill.setColor("blue");
        styles[length++] = strokedPolygon;

        stroke.setColor('red');
        stroke.setWidth(0.5);
        styles.length = length;
        return styles;
    };
};

export default DLTBMvtStyle;