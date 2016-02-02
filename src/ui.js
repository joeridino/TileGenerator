(function () {
    'use strict';

    TileGenerator.Ui = function () {
        this._settings = null;
        this._canvasList = {};
        this._ctxList = {};
        this._canvasesElement = null;
        this._canvasContainerTplElement = null;
        this._colorsElement = null;
        this._newColorElement = null;
        this._colorContainerTplElement = null;
        this._redrawElement = null;
        this._sizeElement = null;
        this._sizes = [
            [32, 32],
            [64, 64],
            [96, 96],
            [128, 128],
            [160, 160],
            [192, 192]
        ];
    };

    TileGenerator.Ui.prototype.onLoad = function () {
        this._settings = TileGenerator.Main.getRef().getSettings();
        this._canvasesElement = document.getElementById('canvases-dynamic');
        this._canvasContainerTplElement = document.getElementById('canvas-container-template');
        this._colorsElement = document.getElementById('colors-dynamic');
        this._newColorElement = document.getElementById('new-color-btn');
        this._newColorElement.addEventListener('click', this._onAddColor.bind(this));
        this._colorContainerTplElement = document.getElementById('color-container-template');
        this._redrawElement = document.getElementById('redraw-btn');
        this._redrawElement.addEventListener('click', this._onRedraw.bind(this));
        this._sizeElement = document.getElementById('size');
        this._populateSizes();
        this._sizeElement.addEventListener('change', this._onChangeSize.bind(this));
        this._sizeElement.addEventListener('keyup', this._onKeySize.bind(this));
        this._addColorsFromSettings();
    };

    TileGenerator.Ui.prototype.addAlgoToDom = function (algo) {
        var canvas,
            ctx,
            deep = true,
            algoId = algo.getId(),
            title = algo.getTitle(),
            tpl;
        tpl = this._canvasContainerTplElement.cloneNode(deep);
        tpl.removeAttribute('id');
        tpl.setAttribute('class', 'canvas-container');
        tpl.querySelector('.title').textContent = title;
        canvas = tpl.querySelector('canvas');
        canvas.width = this._settings.getWidth();
        canvas.height = this._settings.getHeight();
        canvas.setAttribute('title', title);
        ctx = canvas.getContext('2d');
        this._canvasList[algoId] = canvas;
        this._ctxList[algoId] = ctx;
        this._canvasesElement.appendChild(tpl);
    };

    TileGenerator.Ui.prototype.getCanvas = function (algo) {
        return this._canvasList[algo.getId()];
    };

    TileGenerator.Ui.prototype.getCtx = function (algo) {
        return this._ctxList[algo.getId()];
    };

    TileGenerator.Ui.prototype._onAddColor = function (e) {
        var simpleColor = this._colorContainerTplElement.querySelector('.color').value,
            colorWeight = parseInt(this._colorContainerTplElement.querySelector('.color-weight-range').value, 10);
        this._addColorToDom(simpleColor, colorWeight);
        this._settings.addColor(TileGenerator.Hex.simpleToDecArray(simpleColor))
            .addColorWeight(colorWeight);
        this._redraw();
    };

    TileGenerator.Ui.prototype._onRemoveColor = function (e) {
        var colorContainerElement,
            index;
        if (this._settings.getNumColors() > 1) {
            colorContainerElement = this._getParentNodeByClass(e.target, 'color-container');
            index = this._getSiblingIndex(colorContainerElement);
            this._settings.removeColor(index)
                .removeColorWeight(index);
            this._colorsElement.removeChild(colorContainerElement);
            this._redraw();
        } else {
            alert('You must keep at least 1 color.');
        }
    };

    TileGenerator.Ui.prototype._onChangeColor = function (e) {
        var colorContainerElement = this._getParentNodeByClass(e.target, 'color-container'),
            index;
        index = this._getSiblingIndex(colorContainerElement);
        this._settings.updateColor(index, TileGenerator.Hex.simpleToDecArray(e.target.value));
        colorContainerElement.querySelector('.color-value').value = e.target.value;
        this._redraw();
    };

    TileGenerator.Ui.prototype._onInputColorValue = function (e) {
        var colorContainerElement,
            colorElement,
            eventObj;
        if (TileGenerator.Hex.isSimpleHex(e.target.value)) {
            colorContainerElement = this._getParentNodeByClass(e.target, 'color-container');
            colorElement = colorContainerElement.querySelector('.color');
            colorElement.value = e.target.value;
            eventObj = new Event('change');
            colorElement.dispatchEvent(eventObj);
        }
    };

    TileGenerator.Ui.prototype._onChangeColorValue = function (e) {
        var colorContainerElement,
            colorElement;
        if (!TileGenerator.Hex.isSimpleHex(e.target.value)) {
            colorContainerElement = this._getParentNodeByClass(e.target, 'color-container');
            colorElement = colorContainerElement.querySelector('.color');
            e.target.value = colorElement.value;
        }
    };

    TileGenerator.Ui.prototype._onInputColorWeight = function (e) {
        var colorContainerElement = this._getParentNodeByClass(e.target, 'color-container');
        colorContainerElement.querySelector('.color-weight-value').textContent = e.target.value;
    };

    TileGenerator.Ui.prototype._onChangeColorWeight = function (e) {
        var colorContainerElement = this._getParentNodeByClass(e.target, 'color-container'),
            colorWeight = parseInt(e.target.value, 10),
            index;
        index = this._getSiblingIndex(colorContainerElement);
        if (this._settings.getColorWeight(index) !== colorWeight) {
            this._settings.updateColorWeight(index, colorWeight);
            this._redraw();
        }
    };

    TileGenerator.Ui.prototype._onKeyColorWeight = function (e) {
        this._onChangeColorWeight(e);
    };

    TileGenerator.Ui.prototype._onMouseColorWeight = function (e) {
        this._onChangeColorWeight(e);
    };

    TileGenerator.Ui.prototype._onChangeSize = function (e) {
        var size,
            sizeIndex = parseInt(e.target.value, 10);
        size = this._sizes[sizeIndex];
        if (this._settings.getWidth() !== size[0]
                && this._settings.getHeight() !== size[1]) {
            this._settings.setWidth(size[0])
                .setHeight(size[1]);
            this._resizeCanvases();
            TileGenerator.Main.getRef().resized();
            this._redraw();
        }
    };

    TileGenerator.Ui.prototype._onKeySize = function (e) {
        this._onChangeSize(e);
    };

    TileGenerator.Ui.prototype._onRedraw = function () {
        this._redraw();
    };

    TileGenerator.Ui.prototype._redraw = function () {
        TileGenerator.Main.getRef().draw();
    };

    TileGenerator.Ui.prototype._addColorToDom = function (simpleColor, colorWeight) {
        var colorElement,
            colorValueElement,
            colorWeightElement,
            colorWeightValueElement,
            deep = true,
            tpl;
        tpl = this._colorContainerTplElement.cloneNode(deep);
        tpl.removeAttribute('id');
        tpl.setAttribute('class', 'color-container');
        colorElement = tpl.querySelector('.color');
        colorValueElement = tpl.querySelector('.color-value');
        colorWeightElement = tpl.querySelector('.color-weight-range');
        colorWeightValueElement = tpl.querySelector('.color-weight-value');
        colorElement.value = simpleColor;
        colorValueElement.value = simpleColor;
        colorWeightElement.value = colorWeight;
        colorWeightValueElement.textContent = colorWeight;
        tpl.querySelector('.remove-color-btn').addEventListener('click', this._onRemoveColor.bind(this));
        colorElement.addEventListener('change', this._onChangeColor.bind(this));
        colorValueElement.addEventListener('input', this._onInputColorValue.bind(this));
        colorValueElement.addEventListener('change', this._onChangeColorValue.bind(this));
        colorWeightElement.addEventListener('input', this._onInputColorWeight.bind(this));
        colorWeightElement.addEventListener('keyup', this._onKeyColorWeight.bind(this));
        colorWeightElement.addEventListener('mouseup', this._onMouseColorWeight.bind(this));
        this._colorsElement.appendChild(tpl);
    };

    TileGenerator.Ui.prototype._addColorsFromSettings = function () {
        var colors,
            colorWeights,
            i;
        colors = this._settings.getColors();
        colorWeights = this._settings.getColorWeights();
        for (i = 0; i < colors.length; i += 1) {
            this._addColorToDom(TileGenerator.Dec.decArrayToSimpleHex(colors[i]), colorWeights[i]);
        }
    };

    TileGenerator.Ui.prototype._getParentNodeByClass = function (element, className) {
        while ((element = element.parentNode) !== null) {
            if (element.classList.contains(className)) {
                return element;
            }
        }
        return null;
    };

    TileGenerator.Ui.prototype._getSiblingIndex = function (element) {
        var index = 0;
        while ((element = element.previousSibling) !== null) {
            index += 1;
        }
        return index;
    };

    TileGenerator.Ui.prototype._parseSize = function (value) {
        if (/^[1-9][0-9]*$/.test(value)) {
            return parseInt(value, 10);
        } else {
            return null;
        }
    };

    TileGenerator.Ui.prototype._resizeCanvases = function () {
        var i;
        for (i in this._canvasList) {
            if (this._canvasList.hasOwnProperty(i)) {
                this._canvasList[i].width = this._settings.getWidth();
                this._canvasList[i].height = this._settings.getHeight();
            }
        }
    };

    TileGenerator.Ui.prototype._populateSizes = function () {
        var i,
            matchedOption,
            option,
            settingsHeight = this._settings.getHeight(),
            settingsWidth = this._settings.getWidth();
        for (i = 0; i < this._sizes.length; i += 1) {
            option = document.createElement('option');
            option.setAttribute('value', i);
            option.textContent = this._sizes[i][0] + 'x' + this._sizes[i][1];
            this._sizeElement.appendChild(option);
            if ((i === 0) || (this._sizes[i][0] == settingsWidth && this._sizes[i][1] == settingsHeight)) {
                matchedOption = option;
            }
        }
        matchedOption.setAttribute('selected', '');
    };
}());