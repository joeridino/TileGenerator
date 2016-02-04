(function () {
    'use strict';

    TileGenerator.Algo = function (settings) {
        this._settings = settings;
        this._id = null;
        this._title = null;
        this._description = null;
        this._imageData = null;
        this._imageDataArray = null;
        this._imageDataModified = false;
    };

    TileGenerator.Algo.prototype.setup = function (ctx) {
        this._createImageData(ctx);
    };

    TileGenerator.Algo.prototype.resized = function (ctx) {
        this._createImageData(ctx);
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

    TileGenerator.Algo.prototype.getDescription = function () {
        return this._description;
    };

    TileGenerator.Algo.prototype._setPixel = function (ctx, position, color) {
        var index = this._getPixelIndex(ctx, position.x, position.y);
        this._imageDataArray[index++] = color[0];
        this._imageDataArray[index++] = color[1];
        this._imageDataArray[index++] = color[2];
        this._imageDataArray[index++] = 255;
        this._imageDataModified = true;
    };

    TileGenerator.Algo.prototype._getPixelIndex = function (ctx, x, y) {
        return (y * ctx.canvas.width + x) * 4;
    };

    TileGenerator.Algo.prototype._drawPixels = function (ctx) {
        ctx.putImageData(this._imageData, 0, 0);
    };

    TileGenerator.Algo.prototype._createImageData = function (ctx) {
        this._imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        this._imageDataArray = this._imageData.data;
        this._imageDataModified = false;
    };
}());