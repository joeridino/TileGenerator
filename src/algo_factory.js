(function () {
    'use strict';

    TileGenerator.AlgoFactory = {};

    TileGenerator.AlgoFactory.getAlgoInstances = function () {
        var settings = TileGenerator.Main.getRef().getSettings();
        return [
            new TileGenerator.AlgoRandom(settings),
            new TileGenerator.AlgoSmearing(settings),
            new TileGenerator.AlgoNeighbor4(settings),
            new TileGenerator.AlgoNeighbor8(settings)
        ];
    };
}());