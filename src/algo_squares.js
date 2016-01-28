(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSquares = function (settings) {
        parent.call(this, settings);
        this._id = 'squares';
        this._title = 'Random Squares';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSquares);

    TileGenerator.AlgoSquares.prototype.draw = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            height = this._settings.getHeight(),
            i,
            position = {},
            rectWidth,
            rectHeight,
            width = this._settings.getWidth();
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, width, height);
        for (i = 0; i < 100; i += 1) {
            colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
            rectWidth = 4 + Math.floor(Math.random() * 4);
            rectHeight = 4 + Math.floor(Math.random() * 4);
            position.x = Math.floor(Math.random() * width - rectWidth);
            position.y = Math.floor(Math.random() * height - rectHeight);
            this._drawPixel(ctx, position, colors[colorIndex]);
        }
    };
}());