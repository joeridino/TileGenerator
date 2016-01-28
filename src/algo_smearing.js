(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSmearing = function (settings) {
        parent.call(this, settings);
        this._id = 'smearing';
        this._title = 'Smearing';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSmearing);

    TileGenerator.AlgoSmearing.prototype.draw = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            colorContinueCount = 0,
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
                if (colorContinueCount > (5 + Math.random() * 20)) {
                    needColorChange = true;
                }
                position.x = x;
                position.y = y;
                this._drawPixel(ctx, position, colors[colorIndex]);
            }
        }
    };
}());