(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSquares = function (settings) {
        parent.call(this, settings);
        this._id = 'squares';
        this._title = 'Squares';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSquares);

    TileGenerator.AlgoSquares.prototype.draw = function (ctx) {
        this._drawPixels(ctx);
    };

    TileGenerator.AlgoSquares.prototype._drawPixels = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            hexColors = [],
            height = this._settings.getHeight(),
            i,
            numRects,
            position = {},
            rectMinHeight,
            rectMinWidth,
            rectRandHeight,
            rectRandWidth,
            rectWidth,
            rectHeight,
            width = this._settings.getWidth();
        for (i = 0; i < colors.length; i += 1) {
            hexColors.push(TileGenerator.Dec.decArrayToSimpleHex(colors[i]));
        }
        numRects = width * height;
        rectRandWidth = Math.floor(width / 100);
        rectRandHeight = Math.floor(height / 100);
        rectMinWidth = Math.floor(width / 10);
        rectMinHeight = Math.floor(height / 10);
        ctx.fillStyle = hexColors[0];
        ctx.fillRect(0, 0, width, height);
        for (i = 0; i < numRects; i += 1) {
            colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
            rectWidth = rectMinWidth + Math.floor(Math.random() * rectRandWidth);
            rectHeight = rectMinHeight + Math.floor(Math.random() * rectRandHeight);
            position.x = Math.floor(Math.random() * width);
            position.y = Math.floor(Math.random() * height);
            if (position.x + rectWidth >= width) {
                position.x = width - rectWidth;
            }
            if (position.y + rectHeight >= height) {
                position.y = height - rectHeight;
            }
            ctx.fillStyle = hexColors[colorIndex];
            ctx.fillRect(position.x, position.y, rectWidth, rectHeight);
        }
    };
}());