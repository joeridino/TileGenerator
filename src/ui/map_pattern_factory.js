(function () {
    'use strict';

    TileGenerator.MapPatternFactory = {};

    TileGenerator.MapPatternFactory.getPatternInstances = function () {
        return [
            new TileGenerator.MapPatternRepeat(),
            new TileGenerator.MapPatternSeamless()
        ];
    };
}());