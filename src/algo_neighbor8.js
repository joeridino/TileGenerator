(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor8 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor8';
        this._title = 'Neighbor 8';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor8);

    TileGenerator.AlgoNeighbor8.prototype.draw = function (ctx) {
        parent.prototype.draw.call(this, ctx);
    };

    TileGenerator.AlgoNeighbor8.prototype.getRandomNeighborColorIndex = function (options) {
        return parent.getRandomNeighborColorIndex.call(this, options);
    };
}());