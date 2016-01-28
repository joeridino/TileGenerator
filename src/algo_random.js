(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoRandom = function (settings) {
        parent.call(this, settings);
        this._id = 'random';
        this._title = 'Random Pixels';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoRandom);

    TileGenerator.AlgoRandom.prototype.draw = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            position = {},
            x,
            y;
        for (y = 0; y < this._settings.getHeight(); y += 1) {
            for (x = 0; x < this._settings.getWidth(); x += 1) {
                position.x = x;
                position.y = y;
                colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                this._drawPixel(ctx, position, colors[colorIndex]);
            }
        }
    };
}());