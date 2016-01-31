(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoNeighbor = function (settings) {
        parent.call(this, settings);
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor);

    TileGenerator.AlgoNeighbor.prototype._setPixels = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            indexOptions,
            lastColorIndex,
            pixelColorIndices = [],
            position = {},
            rows = [],
            sameColorCount = 0,
            x,
            y;
        for (y = 0; y < this._settings.getHeight(); y += 1) {
            rows.push(y);
            pixelColorIndices[y] = [];
        }
        TileGenerator.Util.randomizeArray(rows);
        indexOptions = {
            pixelColorIndices: pixelColorIndices,
            x: 0,
            y: 0,
            numNeighbors: 4
        };
        for (y = 0; y < rows.length; y += 1) {
            for (x = 0; x < this._settings.getWidth(); x += 1) {
                indexOptions.x = x;
                indexOptions.y = y;
                colorIndex = this._getRandomNeighborColorIndex(indexOptions);
                if (colorIndex === null) {
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                }
                if (lastColorIndex === colorIndex) {
                    ++sameColorCount;
                }
                if (sameColorCount > 10) {
                    sameColorCount = 0;
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                }
                lastColorIndex = colorIndex;
                pixelColorIndices[y][x] = colorIndex;
                position.x = x;
                position.y = y;
                this._setPixel(ctx, position, colors[colorIndex]);
            }
        }
    };

    TileGenerator.AlgoNeighbor.prototype._getRandomNeighborColorIndex = function (options) {
        var i,
            neighbors = [],
            y,
            x;
        if (options.y > 0) {
            neighbors.push({
                x: options.x,
                y: options.y - 1
            });
        }
        if (options.y < this._settings.getHeight() - 1) {
            neighbors.push({
                x: options.x,
                y: options.y + 1
            });
        }
        if (options.x > 0) {
            neighbors.push({
                x: options.x - 1,
                y: options.y
            });
        }
        if (options.x < this._settings.getWidth() - 1) {
            neighbors.push({
                x: options.x + 1,
                y: options.y
            });
        }
        if (neighbors.length === 0) {
            return null;
        }
        TileGenerator.Util.randomizeArray(neighbors);
        for (i = 0; i < neighbors.length; i += 1) {
            y = neighbors[i].y;
            x = neighbors[i].x;
            if (options.pixelColorIndices[y][x] !== undefined) {
                return options.pixelColorIndices[y][x];
            }
        }
        return null;
    };
}());