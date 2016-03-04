(function () {
    'use strict';

    TileGenerator.AlgoFactory = {};

    TileGenerator.AlgoFactory.getAlgoInstances = function () {
        var settings = TileGenerator.Main.getRef().getSettings();
        return [
            new TileGenerator.AlgoBrick(settings),
            new TileGenerator.AlgoNeighbor4(settings),
            new TileGenerator.AlgoNeighbor8(settings),
            new TileGenerator.AlgoPixellation(settings),
            new TileGenerator.AlgoFilePixellation(settings)
        ];
    };
}());