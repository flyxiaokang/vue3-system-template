// import ol from './ol.js';
import {
    getToken
} from '@/utils/auth'

var MvtImageryProvider = function (options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
    this._maximumLevel = Cesium.defaultValue(options.maximumLevel, Infinity);

    this._tilingScheme = Cesium.defined(options.tilingScheme) ?
        options.tilingScheme :
        new Cesium.WebMercatorTilingScheme({
            ellipsoid: options.ellipsoid,
        });
    this._rectangle = Cesium.defaultValue(
        options.rectangle,
        this._tilingScheme.rectangle
    );
    this._rectangle = Cesium.Rectangle.intersection(
        this._rectangle,
        this._tilingScheme.rectangle
    );
    this._tileWidth = Cesium.defaultValue(options.tileWidth, 512);
    this._tileHeight = Cesium.defaultValue(options.tileHeight, 512);
    this._readyPromise = Cesium.when.resolve(true);

    // if (!window.ol) {
    //     throw new DeveloperError('请引入Openlayers类库！');
    // }
    this._ol = ol;
    this._mvtParser = new this._ol.format.MVT();

    this._styleClass = options.style;
    this._key = Cesium.defaultValue(options.key, "");
    this._url = Cesium.defaultValue(
        options.url,
        "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}"
    );

    var sw = this._tilingScheme._rectangleSouthwestInMeters;
    var ne = this._tilingScheme._rectangleNortheastInMeters;
    var mapExtent = [sw.x, sw.y, ne.x, ne.y];
    this._resolutions = ol.tilegrid.resolutionsFromExtent(
        mapExtent,
        22,
        this._tileWidth
    );

    this._pixelRatio = 1; //1;
    this._transform = [0.125, 0, 0, 0.125, 0, 0];
    this._replays = ["Default", "Image", "Polygon", "LineString", "Text"];

    this._tileQueue = new Cesium.TileReplacementQueue();
    this._cacheSize = 1000;
};

Object.defineProperties(MvtImageryProvider.prototype, {
    proxy: {
        get: function () {
            return undefined;
        },
    },

    tileWidth: {
        get: function () {
            return this._tileWidth;
        },
    },

    tileHeight: {
        get: function () {
            return this._tileHeight;
        },
    },
    maximumLevel: {
        get: function () {
            return this._maximumLevel;
        }
    },

    minimumLevel: {
        get: function () {
            return this._minimumLevel;
        }
    },

    rectangle: {
        get: function () {
            return this._rectangle;
        }
    },

    tilingScheme: {
        get: function () {
            return this._tilingScheme;
        },
    },

    // rectangle: {
    //     get: function() {
    //         return this._tilingScheme.rectangle;
    //     },
    // },

    tileDiscardPolicy: {
        get: function () {
            return undefined;
        },
    },

    errorEvent: {
        get: function () {
            return this._errorEvent;
        },
    },

    ready: {
        get: function () {
            return true;
        },
    },

    readyPromise: {
        get: function () {
            return this._readyPromise;
        },
    },

    credit: {
        get: function () {
            return undefined;
        },
    },

    hasAlphaChannel: {
        get: function () {
            return true;
        },
    },
});

MvtImageryProvider.prototype.getTileCredits = function (x, y, level) {
    return undefined;
};

MvtImageryProvider.prototype.pickFeatures = function (
    x,
    y,
    level,
    longitude,
    latitude
) {
    return undefined;
};

MvtImageryProvider.prototype.requestImage = function (x, y, level, request) {
    var cacheTile = findTileInQueue(x, y, level, this._tileQueue);
    if (cacheTile != undefined) {
        return cacheTile;
    } else {
        var that = this;
        var url = this._url;
        url = url
            .replace("{x}", x)
            .replace("{y}", y)
            .replace("{z}", level)
            .replace("{k}", this._key);

        // var resource = Cesium.Resource.createIfNeeded(url);
        var resource = new Cesium.Resource({
            url: url,
            headers: {
                'Authorization': getToken()
            },
            queryParameters: {
                'isShare': true
            }
        });
        return resource
            .fetchArrayBuffer()
            .then(function (arrayBuffer) {
                var canvas = document.createElement("canvas");
                canvas.width = that._tileWidth;
                canvas.height = that._tileHeight;
                var vectorContext = canvas.getContext("2d");

                var features = that._mvtParser.readFeatures(arrayBuffer);

                var styleFun = that._styleClass.getStyle();

                var extent = [0, 0, 4096, 4096];
                var _replayGroup = new ol.render.canvas.ReplayGroup(
                    0,
                    extent,
                    8,
                    true,
                    100
                );

                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var styles = styleFun(features[i], that._resolutions[level]);
                    for (var j = 0; j < styles.length; j++) {
                        ol.renderer.vector.renderFeature_(
                            _replayGroup,
                            feature,
                            styles[j],
                            16
                        );
                    }
                }
                _replayGroup.finish();

                _replayGroup.replay(
                    vectorContext,
                    that._pixelRatio,
                    that._transform,
                    0, {},
                    that._replays,
                    true
                );
                if (that._tileQueue.count > that._cacheSize) {
                    trimTiles(that._tileQueue, that._cacheSize / 2);
                }

                canvas.xMvt = x;
                canvas.yMvt = y;
                canvas.zMvt = level;
                that._tileQueue.markTileRendered(canvas);

                _replayGroup = null;

                return canvas;
            })
            .otherwise(function (error) {
                return undefined;
            });
    }
};

function findTileInQueue(x, y, level, tileQueue) {
    var item = tileQueue.head;
    while (
        item != undefined &&
        !(item.xMvt == x && item.yMvt == y && item.zMvt == level)
    ) {
        item = item.replacementNext;
    }
    return item;
}

function removeQueue(tileReplacementQueue, item) {
    var previous = item.replacementPrevious;
    var next = item.replacementNext;

    if (item === tileReplacementQueue._lastBeforeStartOfFrame) {
        tileReplacementQueue._lastBeforeStartOfFrame = next;
    }

    if (item === tileReplacementQueue.head) {
        tileReplacementQueue.head = next;
    } else {
        previous.replacementNext = next;
    }

    if (item === tileReplacementQueue.tail) {
        tileReplacementQueue.tail = previous;
    } else {
        next.replacementPrevious = previous;
    }

    item.replacementPrevious = undefined;
    item.replacementNext = undefined;

    --tileReplacementQueue.count;
}

function trimTiles(tileQueue, maximumTiles) {
    var tileToTrim = tileQueue.tail;
    while (tileQueue.count > maximumTiles && Cesium.defined(tileToTrim)) {
        var previous = tileToTrim.replacementPrevious;

        removeQueue(tileQueue, tileToTrim);
        tileToTrim = previous;
    }
}

export default MvtImageryProvider;