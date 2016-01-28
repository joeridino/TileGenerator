(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor4 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor4';
        this._title = 'Neighbor 4';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor4);

    TileGenerator.AlgoNeighbor4.prototype.draw = function (ctx) {
        parent.prototype.draw.call(this, ctx);
    };

    TileGenerator.AlgoNeighbor4.prototype.getRandomNeighborColorIndex = function (options) {
        return parent.getRandomNeighborColorIndex.call(this, options);
    };
}());