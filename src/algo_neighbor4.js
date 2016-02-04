(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor4 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor4';
        this._title = 'Neighbor 4';
        this._description = 'Pixel colors are based off 4 neighboring pixels (north, south, east, and west).';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor4);

    TileGenerator.AlgoNeighbor4.prototype._getNeighbors = function (x, y) {
        var neighbors = [];
        if (y > 0) {
            neighbors.push({
                x: x,
                y: y - 1
            });
        }
        if (y < this._settings.getHeight() - 1) {
            neighbors.push({
                x: x,
                y: y + 1
            });
        }
        if (x > 0) {
            neighbors.push({
                x: x - 1,
                y: y
            });
        }
        if (x < this._settings.getWidth() - 1) {
            neighbors.push({
                x: x + 1,
                y: y
            });
        }
        return neighbors;
    };
}());