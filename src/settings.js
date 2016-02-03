(function () {
    'use strict';

    TileGenerator.Settings = function () {
        this._width = 128;
        this._height = 128;
        this._colors = [
            [255, 0, 0],
            [0, 255, 0]
        ];
        this._colorWeights = [
            100,
            100
        ];
    };

    TileGenerator.Settings.VERSION = '1.1';

    TileGenerator.Settings.prototype.onLoad = function () {
        var settings;
        try {
            settings = window.localStorage.getItem('settings');
            if (settings) {
                settings = JSON.parse(settings);
                this._width = settings.width;
                this._height = settings.height;
                if (!settings.version) {
                    // Old settings that didn't have a version number stored
                    // the colors as #ff00ff instead of [255, 0, 255].
                    // We convert those old color hex values to dec arrays here.
                    this._colors = this._convertHexColors(settings.colors);
                } else {
                    this._colors = settings.colors;
                }
                this._colorWeights = settings.colorWeights;
            }
        } catch (e) {
        }
        window.addEventListener('beforeunload', this._saveSettings.bind(this));
    };

    TileGenerator.Settings.prototype.getWidth = function () {
        return this._width;
    };

    TileGenerator.Settings.prototype.setWidth = function (width) {
        this._width = width;
        return this;
    };

    TileGenerator.Settings.prototype.getHeight = function () {
        return this._height;
    };

    TileGenerator.Settings.prototype.setHeight = function (height) {
        this._height = height;
        return this;
    };

    TileGenerator.Settings.prototype.getColor = function (index) {
        return this._colors[index];
    };

    TileGenerator.Settings.prototype.getColors = function () {
        return this._colors;
    };

    TileGenerator.Settings.prototype.getNumColors = function () {
        return this._colors.length;
    };

    TileGenerator.Settings.prototype.addColor = function (color) {
        this._colors.push(color);
        return this;
    };

    TileGenerator.Settings.prototype.updateColor = function (index, color) {
        this._colors[index] = color;
        return this;
    };

    TileGenerator.Settings.prototype.removeColor = function (index) {
        this._colors.splice(index, 1);
        return this;
    };

    TileGenerator.Settings.prototype.getColorWeight = function (index) {
        return this._colorWeights[index];
    };

    TileGenerator.Settings.prototype.getColorWeights = function () {
        return this._colorWeights;
    };

    TileGenerator.Settings.prototype.getNumColorWeights = function () {
        return this._colorWeights.length;
    };

    TileGenerator.Settings.prototype.addColorWeight = function (colorWeight) {
        this._colorWeights.push(colorWeight);
        return this;
    };

    TileGenerator.Settings.prototype.updateColorWeight = function (index, colorWeight) {
        this._colorWeights[index] = colorWeight;
        return this;
    };

    TileGenerator.Settings.prototype.removeColorWeight = function (index) {
        this._colorWeights.splice(index, 1);
        return this;
    }

    TileGenerator.Settings.prototype._saveSettings = function () {
        var settings;
        try {
            var settings = JSON.stringify({
                version: TileGenerator.Settings.VERSION,
                width: this._width,
                height: this._height,
                colors: this._colors,
                colorWeights: this._colorWeights
            });
            window.localStorage.setItem('settings', settings);
        } catch (e) {
        }
    };

    TileGenerator.Settings.prototype._convertHexColors = function (hexColors) {
        var colors = [],
            i;
        for (i = 0; i < hexColors.length; i += 1) {
            colors.push(TileGenerator.Hex.simpleToDecArray(hexColors[i]));
        }
        return colors;
    };
}());