var TileGenerator = {};
(function () {
    'use strict';

    TileGenerator.Util = {};

    TileGenerator.Util.extend = function (parent, child) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    };

    TileGenerator.Util.randomizeArray = function (a) {
        var i,
            len = a.length,
            r,
            tmp;
        for (i = 0; i < a.length; i += 1) {
            r = Math.floor(Math.random() * len);
            tmp = a[r];
            a[r] = a[len - 1];
            a[len - 1] = tmp;
            len -= 1;
        }
    };

    TileGenerator.Util.getRandomWeightedIndex = function (a) {
        var dataArraySum = 0,
            i,
            loopSum = 0,
            rand;
        for (i = 0; i < a.length; i += 1) {
            dataArraySum += a[i];
        }
        rand = Math.floor(Math.random() * dataArraySum);
        for (i = 0; i < a.length; i += 1) {
            loopSum += a[i];
            if (rand < loopSum || i === (a.length - 1)) {
                return i;
            }
        }
        return -1;
    };
}());
(function () {
    'use strict';

    TileGenerator.Settings = function () {
        this._width = 64;
        this._height = 64;
        this._colors = [
            '#ff0000',
            '#00ff00',
            '#0000ff'
        ];
        this._colorWeights = [
            100,
            100,
            100
        ];
    };

    TileGenerator.Settings.prototype.onLoad = function () {
        // TODO: COMPLETE ME
        var colors = window.localStorage.getItem('colors'),
            colorWeights = window.localStorage.getItem('color_weights');
        try {
            if (colors) {
                this._colors = JSON.parse(colors);
            }
            if (colorWeights) {
                this._colorWeights = JSON.parse(colorWeights);
            }
        } catch (e) {

        }
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
}());
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
        var i;
        this._settings.onLoad();
        this._ui.onLoad();
        this._algos = TileGenerator.AlgoFactory.getAlgoInstances();
        for (i = 0; i < this._algos.length; i += 1) {
            this._ui.addAlgoToDom(this._algos[i]);
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
(function () {
    'use strict';

    TileGenerator.Algo = function (settings) {
        this._settings = settings;
        this._id = null;
        this._title = null;
    };

    TileGenerator.Algo.prototype.draw = function (ctx) {
    };

    TileGenerator.Algo.prototype.getId = function () {
        return this._id;
    };

    TileGenerator.Algo.prototype.getTitle = function () {
        return this._title;
    };

    TileGenerator.Algo.prototype._drawPixel = function (ctx, position, color) {
        ctx.fillStyle = color;
        ctx.fillRect(position.x, position.y, 1, 1);
    };
}());
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
(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSmearing = function (settings) {
        parent.call(this, settings);
        this._id = 'smearing';
        this._title = 'Smearing';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSmearing);

    TileGenerator.AlgoSmearing.prototype.draw = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            colorContinueCount = 0,
            needColorChange = true,
            position = {},
            x,
            y;
        for (y = 0; y < this._settings.getHeight(); y += 1) {
            for (x = 0; x < this._settings.getWidth(); x += 1) {
                if (needColorChange) {
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                    colorContinueCount = 0;
                    needColorChange = false;
                }
                colorContinueCount += 1;
                if (colorContinueCount > (5 + Math.random() * 20)) {
                    needColorChange = true;
                }
                position.x = x;
                position.y = y;
                this._drawPixel(ctx, position, colors[colorIndex]);
            }
        }
    };
}());
(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoSquares = function (settings) {
        parent.call(this, settings);
        this._id = 'squares';
        this._title = 'Random Squares';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSquares);

    TileGenerator.AlgoSquares.prototype.draw = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            height = this._settings.getHeight(),
            i,
            position = {},
            rectWidth,
            rectHeight,
            width = this._settings.getWidth();
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, width, height);
        for (i = 0; i < 100; i += 1) {
            colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
            rectWidth = 4 + Math.floor(Math.random() * 4);
            rectHeight = 4 + Math.floor(Math.random() * 4);
            position.x = Math.floor(Math.random() * width - rectWidth);
            position.y = Math.floor(Math.random() * height - rectHeight);
            this._drawPixel(ctx, position, colors[colorIndex]);
        }
    };
}());
(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoNeighbor = function (settings) {
        parent.call(this, settings);
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor);

    TileGenerator.AlgoNeighbor.prototype.draw = function (ctx) {
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
                this._drawPixel(ctx, position, colors[colorIndex]);
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
(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor4 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor4';
        this._title = 'Neighbor 4';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor4);

    TileGenerator.AlgoNeighbor4.prototype.draw = function (ctx) {
        parent.prototype.draw.call(this, ctx);
    };

    TileGenerator.AlgoNeighbor4.prototype.getRandomNeighborColorIndex = function (options) {
        return parent.getRandomNeighborColorIndex.call(this, options);
    };
}());
(function () {
    'use strict';

    var parent = TileGenerator.AlgoNeighbor;

    TileGenerator.AlgoNeighbor8 = function (settings) {
        parent.call(this, settings);
        this._id = 'neighbor8';
        this._title = 'Neighbor 8';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoNeighbor8);

    TileGenerator.AlgoNeighbor8.prototype.draw = function (ctx) {
        parent.prototype.draw.call(this, ctx);
    };

    TileGenerator.AlgoNeighbor8.prototype.getRandomNeighborColorIndex = function (options) {
        return parent.getRandomNeighborColorIndex.call(this, options);
    };
}());
(function () {
    'use strict';

    TileGenerator.AlgoFactory = {};

    TileGenerator.AlgoFactory.getAlgoInstances = function () {
        var settings = TileGenerator.Main.getRef().getSettings();
        return [
            new TileGenerator.AlgoRandom(settings),
            new TileGenerator.AlgoSmearing(settings),
            new TileGenerator.AlgoSquares(settings),
            new TileGenerator.AlgoNeighbor4(settings),
            new TileGenerator.AlgoNeighbor8(settings)
        ];
    };
}());