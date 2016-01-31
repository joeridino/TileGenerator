(function () {
    'use strict';

    var mainRef = null;

    TileGenerator.Main = function () {
        this._settings = new TileGenerator.Settings();
        this._ui = new TileGenerator.Ui();
        this._algos = null;
    };

    TileGenerator.Main.getRef = function () {
        return mainRef;
    };

    TileGenerator.Main.prototype.onLoad = function () {
        var ctx,
            i;
        this._settings.onLoad();
        this._ui.onLoad();
        this._algos = TileGenerator.AlgoFactory.getAlgoInstances();
        for (i = 0; i < this._algos.length; i += 1) {
            this._ui.addAlgoToDom(this._algos[i]);
            ctx = this._ui.getCtx(this._algos[i]);
            this._algos[i].setup(ctx);
        }
    };

    TileGenerator.Main.prototype.draw = function () {
        var ctx,
            i;
        for (i = 0; i < this._algos.length; i += 1) {
            ctx = this._ui.getCtx(this._algos[i]);
            ctx.clearRect(0, 0, this._settings.getWidth(), this._settings.getHeight());
            this._algos[i].draw(ctx);
        }
    };

    TileGenerator.Main.prototype.getSettings = function () {
        return this._settings;
    };

    window.onload = function () {
        mainRef = new TileGenerator.Main();
        mainRef.onLoad();
        mainRef.draw();
    };
}());