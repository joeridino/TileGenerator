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

    TileGenerator.Hex = {};

    TileGenerator.Hex.Map = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'a': 10,
        'A': 10,
        'b': 11,
        'B': 11,
        'c': 12,
        'C': 12,
        'd': 13,
        'D': 13,
        'e': 14,
        'E': 14,
        'f': 15,
        'F': 15
    };

    TileGenerator.Hex.simpleToDecArray = function (h) {
        // Convert "#ff00ff" or "#FF00FF" to an array with 3 array elements:
        // r: [0] = 255
        // g: [1] = 0
        // b: [2] = 255
        var a = [];
        a[0] = TileGenerator.Hex.hexComponentToDec(h.slice(1, 3));
        a[1] = TileGenerator.Hex.hexComponentToDec(h.slice(3, 5));
        a[2] = TileGenerator.Hex.hexComponentToDec(h.slice(5));
        return a;
    };

    TileGenerator.Hex.hexComponentToDec = function (component) {
        var i,
            p = 0,
            value = 0;
        for (i = component.length - 1; i >= 0; i -= 1) {
            value += TileGenerator.Hex.Map[component[i]] * Math.pow(16, p);
            p += 1;
        }
        return value;
    };

    TileGenerator.Hex.isSimpleHex = function (h) {
        return /^#([0-9a-f]{2}){3}$/i.test(h);
    };
}());

(function () {
    'use strict';

    TileGenerator.Dec = {};

    TileGenerator.Dec.HexValues = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
    ];

    TileGenerator.Dec.decArrayToSimpleHex = function (decArray) {
        // Convert an array of 3 decimal values (each value is from 0-255) to a
        // simple hex string (e.g. "#0000ff").
        var h = '#',
            i;
        for (i = 0; i < decArray.length; i += 1) {
            h += TileGenerator.Dec.decComponentToHex(decArray[i]);
        }
        return h;
    };

    TileGenerator.Dec.decComponentToHex = function (d) {
        var h = '';
        while (d !== 0) {
            h = TileGenerator.Dec.HexValues[d % 16] + h;
            d = Math.floor(d / 16);
        }
        switch (h.length) {
        case 0:
            h = TileGenerator.Dec.HexValues[0] + TileGenerator.Dec.HexValues[0];
            break;

        case 1:
            h = TileGenerator.Dec.HexValues[0] + h;
            break;
        }
        return h;
    };
}());

(function () {
    'use strict';

    TileGenerator.Settings = function () {
        this._width = 96;
        this._height = 96;
        this._colors = [
            [255, 0, 0],
            [0, 255, 0],
            [0, 0, 255]
        ];
        this._colorWeights = [
            100,
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

    TileGenerator.Main.prototype.resized = function () {
        var ctx,
            i;
        for (i = 0; i < this._algos.length; i += 1) {
            ctx = this._ui.getCtx(this._algos[i]);
            this._algos[i].resized(ctx);
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
        this._imageData = null;
        this._imageDataArray = null;
        this._imageDataModified = false;
    };

    TileGenerator.Algo.prototype.setup = function (ctx) {
        this._createImageData(ctx);
    };

    TileGenerator.Algo.prototype.resized = function (ctx) {
        this._createImageData(ctx);
    };

    TileGenerator.Algo.prototype.draw = function (ctx) {
        this._setPixels(ctx);
        this._drawPixels(ctx);
    };

    TileGenerator.Algo.prototype.getId = function () {
        return this._id;
    };

    TileGenerator.Algo.prototype.getTitle = function () {
        return this._title;
    };

    TileGenerator.Algo.prototype._setPixel = function (ctx, position, color) {
        var index = this._getPixelIndex(ctx, position.x, position.y);
        this._imageDataArray[index++] = color[0];
        this._imageDataArray[index++] = color[1];
        this._imageDataArray[index++] = color[2];
        this._imageDataArray[index++] = 255;
        this._imageDataModified = true;
    };

    TileGenerator.Algo.prototype._getPixelIndex = function (ctx, x, y) {
        return (y * ctx.canvas.width + x) * 4;
    };

    TileGenerator.Algo.prototype._drawPixels = function (ctx) {
        ctx.putImageData(this._imageData, 0, 0);
    };

    TileGenerator.Algo.prototype._createImageData = function (ctx) {
        this._imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        this._imageDataArray = this._imageData.data;
        this._imageDataModified = false;
    };
}());
(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoRandom = function (settings) {
        parent.call(this, settings);
        this._id = 'random';
        this._title = 'Random';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoRandom);

    TileGenerator.AlgoRandom.prototype._setPixels = function (ctx) {
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
                this._setPixel(ctx, position, colors[colorIndex]);
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

    TileGenerator.AlgoSmearing.prototype._setPixels = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            colorContinueBaseAmount = 5,
            colorContinueCount = 0,
            colorContinueRandAmount = 20,
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
                if (colorContinueCount > (colorContinueBaseAmount + Math.random() * colorContinueRandAmount)) {
                    needColorChange = true;
                }
                position.x = x;
                position.y = y;
                this._setPixel(ctx, position, colors[colorIndex]);
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
        this._title = 'Squares';
    };

    TileGenerator.Util.extend(parent, TileGenerator.AlgoSquares);

    TileGenerator.AlgoSquares.prototype.draw = function (ctx) {
        this._drawPixels(ctx);
    };

    TileGenerator.AlgoSquares.prototype._drawPixels = function (ctx) {
        var colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            hexColors = [],
            height = this._settings.getHeight(),
            i,
            numRects,
            position = {},
            rectMinHeight,
            rectMinWidth,
            rectRandHeight,
            rectRandWidth,
            rectWidth,
            rectHeight,
            width = this._settings.getWidth();
        for (i = 0; i < colors.length; i += 1) {
            hexColors.push(TileGenerator.Dec.decArrayToSimpleHex(colors[i]));
        }
        numRects = width * height;
        rectRandWidth = Math.floor(width / 100);
        rectRandHeight = Math.floor(height / 100);
        rectMinWidth = Math.floor(width / 10);
        rectMinHeight = Math.floor(height / 10);
        ctx.fillStyle = hexColors[0];
        ctx.fillRect(0, 0, width, height);
        for (i = 0; i < numRects; i += 1) {
            colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
            rectWidth = rectMinWidth + Math.floor(Math.random() * rectRandWidth);
            rectHeight = rectMinHeight + Math.floor(Math.random() * rectRandHeight);
            position.x = Math.floor(Math.random() * width);
            position.y = Math.floor(Math.random() * height);
            if (position.x + rectWidth >= width) {
                position.x = width - rectWidth;
            }
            if (position.y + rectHeight >= height) {
                position.y = height - rectHeight;
            }
            ctx.fillStyle = hexColors[colorIndex];
            ctx.fillRect(position.x, position.y, rectWidth, rectHeight);
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

    TileGenerator.AlgoNeighbor.prototype._setPixels = function (ctx) {
        var color,
            colorIndex,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            lastColor,
            maxSameColorCount,
            position = {},
            rows = [],
            sameColorCount = 0,
            x,
            y;
        for (y = 0; y < this._settings.getHeight(); y += 1) {
            rows.push(y);
        }
        maxSameColorCount = Math.floor(this._settings.getWidth() / 10);
        TileGenerator.Util.randomizeArray(rows);
        if (this._imageDataModified) {
            this._createImageData(ctx);
        }
        for (y = 0; y < rows.length; y += 1) {
            for (x = 0; x < this._settings.getWidth(); x += 1) {
                color = this._getRandomNeighborColor(ctx, x, y);
                if (color === null) {
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                    color = colors[colorIndex];
                }
                if (this._colorMatch(color, lastColor)) {
                    ++sameColorCount;
                }
                if (sameColorCount > maxSameColorCount) {
                    sameColorCount = 0;
                    colorIndex = TileGenerator.Util.getRandomWeightedIndex(colorWeights);
                    color = colors[colorIndex];
                }
                lastColor = color;
                position.x = x;
                position.y = y;
                this._setPixel(ctx, position, color);
            }
        }
    };

    TileGenerator.AlgoNeighbor.prototype._getRandomNeighborColor = function (ctx, x, y) {
        var i,
            neighbors = [],
            pixelIndex;
        if (y > 0) {
            neighbors.push({
                x: x,
                y: y - 1
            });
        }
        if (y < this._settings.getHeight() - 1) {
            neighbors.push({
                x: x,
                y: y + 1
            });
        }
        if (x > 0) {
            neighbors.push({
                x: x - 1,
                y: y
            });
        }
        if (x < this._settings.getWidth() - 1) {
            neighbors.push({
                x: x + 1,
                y: y
            });
        }
        if (neighbors.length === 0) {
            return null;
        }
        TileGenerator.Util.randomizeArray(neighbors);
        for (i = 0; i < neighbors.length; i += 1) {
            pixelIndex = this._getPixelIndex(ctx, neighbors[i].x, neighbors[i].y);
            if (this._imageDataArray[pixelIndex + 3] !== 0) {
                return [
                    this._imageDataArray[pixelIndex++],
                    this._imageDataArray[pixelIndex++],
                    this._imageDataArray[pixelIndex++]
                ];
            }
        }
        return null;
    };

    TileGenerator.AlgoNeighbor.prototype._colorMatch = function (color1, color2) {
        if (color1
                && color2
                && color1[0] === color2[0]
                && color1[1] === color2[1]
                && color1[2] === color2[2]) {
            return true;
        }
        return false;
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