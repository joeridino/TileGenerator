(function () {
    'use strict';

    var parent = TileGenerator.MapPattern;

    TileGenerator.MapPatternSeamless = function () {
        var sizeStr;
        parent.call(this);
        this._numXTiles = 2;
        this._numYTiles = 2;
        sizeStr = this._numXTiles + 'x' + this._numYTiles;
        this._title = sizeStr + ' Seamless';
        this._description = 'Tiles are flipped to create a seamless pattern.';
    };

    TileGenerator.Oop.extend(parent, TileGenerator.MapPatternSeamless);

    TileGenerator.MapPatternSeamless.prototype.draw = function (sourceCanvas, ctx) {
        var scaleX,
            scaleY,
            tileX,
            tileY,
            x,
            y;
        for (tileY = 0; tileY < this._numYTiles; tileY += 1) {
            for (tileX = 0; tileX < this._numXTiles; tileX += 1) {
                scaleX = 1;
                scaleY = 1;
                x = tileX * sourceCanvas.width;
                y = tileY * sourceCanvas.height;
                if (tileX % 2 !== 0) {
                    x = -(x + sourceCanvas.width);
                    scaleX = -1;
                }
                if (tileY % 2 !== 0) {
                    y = -(y + sourceCanvas.height);
                    scaleY = -1;
                }
                ctx.scale(scaleX, scaleY);
                ctx.drawImage(
                    sourceCanvas,
                    x,
                    y,
                    sourceCanvas.width,
                    sourceCanvas.height
                );
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
    };
}());
