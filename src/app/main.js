(function () {
    'use strict';

    var mainRef = null;

    TileGenerator.Main = function () {
        this._settings = new TileGenerator.Settings();
        this._ui = new TileGenerator.Ui();
        this._algos = {};
    };

    TileGenerator.Main.getRef = function () {
        return mainRef;
    };

    TileGenerator.Main.prototype.onLoad = function () {
        var algos,
            i;
        this._settings.onLoad();
        this._ui.onLoad();
        algos = TileGenerator.AlgoFactory.getAlgoInstances();
        for (i = 0; i < algos.length; i += 1) {
            this._ui.addAlgoToDom(algos[i]);
            this._algos[algos[i].getId()] = algos[i];
        }
        this._ui.onLoadEnd();
    };

    TileGenerator.Main.prototype.getAlgo = function (algoId) {
        return this._algos[algoId];
    };

    TileGenerator.Main.prototype.getSettings = function () {
        return this._settings;
    };

    window.onload = function () {
        mainRef = new TileGenerator.Main();
        mainRef.onLoad();
    };
}());