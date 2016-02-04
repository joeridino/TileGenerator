(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor4;

    TileGenerator.AlgoNeighbor8 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor8';
        this._title = 'Neighbor 8';
        this._description = 'Pixel colors are based off 8 neighboring pixels.';
    };

    TileGenerator.Oop.extend(parent, TileGenerator.AlgoNeighbor8);

    TileGenerator.AlgoNeighbor8.prototype._getNeighbors = function (x, y) {
        var neighbors = parent.prototype._getNeighbors.call(this, x, y);
        if (x > 0 && y > 0) {
            neighbors.push({
                x: x - 1,
                y: y - 1
            });
        }
        if ((x < this._settings.getWidth() - 1) && y > 0) {
            neighbors.push({
                x: x + 1,
                y: y - 1
            });
        }
        if (x > 0 && (y < this._settings.getHeight() - 1)) {
            neighbors.push({
                x: x - 1,
                y: y + 1
            });
        }
        if ((x < this._settings.getWidth() - 1) && (y < this._settings.getHeight() - 1)) {
            neighbors.push({
                x: x + 1,
                y: y + 1
            });
        }
        return neighbors;
    };
}());