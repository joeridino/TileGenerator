(function () {
    'use strict';

    TileGenerator.Algo = function (settings) {
        this._settings = settings;
        this._id = null;
        this._title = null;
        this._imageData = null;
        this._imageDataArray = null;
    };

    TileGenerator.Algo.prototype.setup = function (ctx) {
        this._imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        this._imageDataArray = this._imageData.data;
    };

    TileGenerator.Algo.prototype.draw = function (ctx) {
        this._setPixels(ctx);
        this._drawPixels(ctx);
    };

    TileGenerator.Algo.prototype.getId = function () {
        return this._id;
    };

    TileGenerator.Algo.prototype.getTitle = function () {
        return this._title;
    };

    TileGenerator.Algo.prototype._setPixel = function (ctx, position, color) {
        var index = (position.y * ctx.canvas.width + position.x) * 4;
        this._imageDataArray[index++] = color[0];
        this._imageDataArray[index++] = color[1];
        this._imageDataArray[index++] = color[2];
        this._imageDataArray[index++] = 255;
    };

    TileGenerator.Algo.prototype._drawPixels = function (ctx) {
        ctx.putImageData(this._imageData, 0, 0);
    };
}());