(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSmearing = function (settings) {
        parent.call(this, settings);
        this._id = 'smearing';
        this._title = 'Smearing';
        this._description = 'Pixels are assigned a continuous set of colors in random amounts.';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSmearing);

    TileGenerator.AlgoSmearing.prototype._setPixels = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            colorContinueBaseAmount = 5,
            colorContinueCount = 0,
            colorContinueRandAmount = 20,
            needColorChange = true,
            position = {},
            x,
            y;
        for (y = 0; y < this._settings.getHeight(); y += 1) {
            for (x = 0; x < this._settings.getWidth(); x += 1) {
                if (needColorChange) {
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                    colorContinueCount = 0;
                    needColorChange = false;
                }
                colorContinueCount += 1;
                if (colorContinueCount > (colorContinueBaseAmount + Math.random() * colorContinueRandAmount)) {
                    needColorChange = true;
                }
                position.x = x;
                position.y = y;
                this._setPixel(ctx, position, colors[colorIndex]);
            }
        }
    };
}());