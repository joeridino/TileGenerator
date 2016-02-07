(function () {
    'use strict';

    var parent = TileGenerator.MapPattern;

    TileGenerator.MapPatternRepeat = function () {
        var sizeStr;
        parent.call(this);
        this._numXTiles = 3;
        this._numYTiles = 3;
        sizeStr = this._numXTiles + 'x' + this._numYTiles;
        this._title = sizeStr + ' Repeat';
        this._description = 'Tiles are repeated in a ' + sizeStr + ' pattern.';
    };

    TileGenerator.Oop.extend(parent, TileGenerator.MapPatternRepeat);

    TileGenerator.MapPatternRepeat.prototype.draw = function (sourceCanvas, ctx) {
        var tileX,
            tileY,
            x,
            y;
        for (tileY = 0; tileY < this._numYTiles; tileY += 1) {
            for (tileX = 0; tileX < this._numXTiles; tileX += 1) {
                x = tileX * sourceCanvas.width;
                y = tileY * sourceCanvas.height;
                ctx.drawImage(
                    sourceCanvas,
                    x,
                    y,
                    sourceCanvas.width,
                    sourceCanvas.height
                );
            }
        }
    };
}());
