(function () {
    'use strict';

    TileGenerator.MapPattern = function () {
        this._title = null;
        this._description = null;
        this._numXTiles = 0;
        this._numYTiles = 0;
    };

    TileGenerator.MapPattern.prototype.draw = function (sourceCanvas, ctx) {
        // Virtual function
    };

    TileGenerator.MapPattern.prototype.getTitle = function () {
        return this._title;
    };

    TileGenerator.MapPattern.prototype.getDescription = function () {
        return this._description;
    };

    TileGenerator.MapPattern.prototype.getNumXTiles = function () {
        return this._numXTiles;
    };

    TileGenerator.MapPattern.prototype.getNumYTiles = function () {
        return this._numYTiles;
    };
}());