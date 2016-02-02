(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor8 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor8';
        this._title = 'Neighbor 8';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor8);
}());