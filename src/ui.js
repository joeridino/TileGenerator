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
        this._widthElement = null;
        this._heightElement = null;
        this._redrawElement = null;
    };

    TileGenerator.Ui.prototype.onLoad = function () {
        this._settings = TileGenerator.Main.getRef().getSettings();
        this._canvasesElement = document.getElementById('canvases-dynamic');
        this._canvasContainerTplElement = document.getElementById('canvas-container-template');
        this._colorsElement = document.getElementById('colors-dynamic');
        this._newColorElement = document.getElementById('new-color-btn');
        this._newColorElement.addEventListener('click', this._onAddColor.bind(this));
        this._colorContainerTplElement = document.getElementById('color-container-template');
        this._widthElement = document.getElementById('width');
        this._widthElement.value = this._settings.getWidth();
        this._widthElement.addEventListener('input', this._onInputWidth.bind(this));
        this._widthElement.addEventListener('change', this._onChangeWidth.bind(this));
        this._heightElement = document.getElementById('height');
        this._heightElement.value = this._settings.getHeight();
        this._heightElement.addEventListener('input', this._onInputHeight.bind(this));
        this._heightElement.addEventListener('change', this._onChangeHeight.bind(this));
        this._redrawElement = document.getElementById('redraw-btn');
        this._redrawElement.addEventListener('click', this._onRedraw.bind(this));
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
        var color = this._colorContainerTplElement.querySelector('.color').value,
            colorWeight = parseInt(this._colorContainerTplElement.querySelector('.color-weight-range').value, 10);
        this._addColorToDom(color, colorWeight);
        this._settings.addColor(color)
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
        this._settings.updateColor(index, e.target.value);
        colorContainerElement.querySelector('.color-value').value = e.target.value;
        this._redraw();
    };

    TileGenerator.Ui.prototype._onInputColorValue = function (e) {
        var colorContainerElement,
            colorElement,
            eventObj;
        if (this._isValidColor(e.target.value)) {
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
        if (!this._isValidColor(e.target.value)) {
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
            index;
        index = this._getSiblingIndex(colorContainerElement);
        this._settings.updateColorWeight(index, parseInt(e.target.value, 10));
        this._redraw();
    };

    TileGenerator.Ui.prototype._onInputWidth = function (e) {
        var width = this._parseSize(e.target.value);
        if (width) {
            this._settings.setWidth(width);
            this._resizeCanvases();
            this._redraw();
        }
    };

    TileGenerator.Ui.prototype._onChangeWidth = function (e) {
        var width = this._parseSize(e.target.value);
        if (!width) {
            e.target.value = this._settings.getWidth();
        }
    };

    TileGenerator.Ui.prototype._onInputHeight = function (e) {
        var height = this._parseSize(e.target.value);
        if (height) {
            this._settings.setHeight(height);
            this._resizeCanvases();
            this._redraw();
        }
    };

    TileGenerator.Ui.prototype._onChangeHeight = function (e) {
        var height = this._parseSize(e.target.value);
        if (!height) {
            e.target.value = this._settings.getHeight();
        }
    };

    TileGenerator.Ui.prototype._onRedraw = function () {
        this._redraw();
    };

    TileGenerator.Ui.prototype._redraw = function () {
        TileGenerator.Main.getRef().draw();
    };

    TileGenerator.Ui.prototype._addColorToDom = function (color, colorWeight) {
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
        colorElement.value = color;
        colorValueElement.value = color;
        colorWeightElement.value = colorWeight;
        colorWeightValueElement.textContent = colorWeight;
        tpl.querySelector('.remove-color-btn').addEventListener('click', this._onRemoveColor.bind(this));
        colorElement.addEventListener('change', this._onChangeColor.bind(this));
        colorValueElement.addEventListener('input', this._onInputColorValue.bind(this));
        colorValueElement.addEventListener('change', this._onChangeColorValue.bind(this));
        colorWeightElement.addEventListener('input', this._onInputColorWeight.bind(this));
        colorWeightElement.addEventListener('change', this._onChangeColorWeight.bind(this));
        this._colorsElement.appendChild(tpl);
    };

    TileGenerator.Ui.prototype._addColorsFromSettings = function () {
        var colors,
            colorWeights,
            i;
        colors = this._settings.getColors();
        colorWeights = this._settings.getColorWeights();
        for (i = 0; i < colors.length; i += 1) {
            this._addColorToDom(colors[i], colorWeights[i]);
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

    TileGenerator.Ui.prototype._isValidColor = function (value) {
        return /^#([0-9a-f]{2}){3}$/i.test(value);
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
}());