(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoPixellation = function (settings) {
        parent.call(this, settings);
        this._id = 'pixellation';
        this._title = 'Pixellation';
        this._description = 'Blocks of pixels are assigned the same color based on random color values.';
        this._blockWidth = 0;
        this._blockHeight = 0;
        this._numBlocksX = 0;
        this._numBlocksY = 0;
    };

    TileGenerator.Oop.extend(parent, TileGenerator.AlgoPixellation);

    TileGenerator.AlgoPixellation.prototype._setPixels = function (ctx) {
        var blockColors,
            blockY,
            blockX,
            colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            positions,
            x,
            y;
        this._blockWidth = Math.floor(this._settings.getWidth() / 8);
        this._blockHeight = Math.floor(this._settings.getHeight() / 8);
        this._numBlocksX = Math.ceil(this._settings.getWidth() / this._blockWidth);
        this._numBlocksY = Math.ceil(this._settings.getHeight() / this._blockHeight);
        for (blockY = 0; blockY < this._numBlocksY; blockY += 1) {
            for (blockX = 0; blockX < this._numBlocksX; blockX += 1) {
                positions = this._getBlockPositions(blockX, blockY);
                colorIndex = TileGenerator.Array.getRandomWeightedIndex(colorWeights);
                this._setBlockPixels(ctx, positions, colors[colorIndex]);
            }
        }
    };

    TileGenerator.AlgoPixellation.prototype._getBlockPositions = function (blockX, blockY) {
        var positions = [],
            x,
            xEnd,
            xStart,
            y,
            yEnd,
            yStart;
        xStart = blockX * this._blockWidth;
        xEnd = Math.min(xStart + this._blockWidth, this._settings.getWidth());
        yStart = blockY * this._blockHeight;
        yEnd = Math.min(yStart + this._blockHeight, this._settings.getHeight());
        for (y = yStart; y < yEnd; y += 1) {
            for (x = xStart; x < xEnd; x += 1) {
                positions.push({
                    x: x,
                    y: y
                });
            }
        }
        return positions;
    };
}());