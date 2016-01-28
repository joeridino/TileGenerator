(function () {
    'use strict';

    TileGenerator.Algo = function (settings) {
        this._settings = settings;
        this._id = null;
        this._title = null;
    };

    TileGenerator.Algo.prototype.draw = function (ctx) {
    };

    TileGenerator.Algo.prototype.getId = function () {
        return this._id;
    };

    TileGenerator.Algo.prototype.getTitle = function () {
        return this._title;
    };

    TileGenerator.Algo.prototype._drawPixel = function (ctx, position, color) {
        ctx.fillStyle = color;
        ctx.fillRect(position.x, position.y, 1, 1);
    };
}());