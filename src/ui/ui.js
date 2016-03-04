(function () {
    'use strict';

    TileGenerator.Ui = function () {
        this._settings = null;
        this._canvasList = {};
        this._ctxList = {};
        this._canvasesContainerElement = null;
        this._canvasesElement = null;
        this._canvasContainerTplElement = null;
        this._dimElement = null;
        this._progressElement = null;
        this._lastDropTarget = null;
        this._fileElement = null;
        this._fileRemoveElement = null;
        this._filePreviewElement = null;
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
        this._map = null;
    };

    TileGenerator.Ui.prototype.onLoad = function () {
        this._settings = TileGenerator.Main.getRef().getSettings();
        this._canvasesContainerElement = document.getElementById('tg-canvases');
        this._canvasesElement = document.getElementById('tg-canvases-dynamic');
        this._canvasesContainerElement.addEventListener('drop', this._onDropCanvases.bind(this));
        this._canvasesContainerElement.addEventListener('dragenter', this._onDragEnterCanvases.bind(this));
        this._canvasesContainerElement.addEventListener('dragover', this._onDragOverCanvases.bind(this));
        this._canvasesContainerElement.addEventListener('dragleave', this._onDragLeaveCanvases.bind(this));
        this._canvasContainerTplElement = document.getElementById('tg-canvas-container-template');
        this._dimElement = document.getElementById('tg-dim');
        this._progressElement = document.getElementById('tg-progress');
        this._fileElement = document.getElementById('tg-file');
        this._fileRemoveElement = document.getElementById('tg-file-remove');
        this._filePreviewElement = document.getElementById('tg-file-preview');
        this._fileElement.addEventListener('change', this._onFileChange.bind(this));
        this._fileRemoveElement.addEventListener('click', this._onFileRemove.bind(this));
        this._colorsElement = document.getElementById('tg-colors-dynamic');
        this._newColorElement = document.getElementById('tg-new-color-btn');
        this._newColorElement.addEventListener('click', this._onAddColor.bind(this));
        this._colorContainerTplElement = document.getElementById('tg-color-container-template');
        this._redrawElement = document.getElementById('tg-redraw-btn');
        this._redrawElement.addEventListener('click', this._onRedraw.bind(this));
        this._sizeElement = document.getElementById('tg-size');
        this._populateSizes();
        this._sizeElement.addEventListener('change', this._onChangeSize.bind(this));
        this._sizeElement.addEventListener('keyup', this._onKeySize.bind(this));
        this._addColorsFromSettings();
        this._map = new TileGenerator.Map(this);
        this._map.onLoad();
    };

    TileGenerator.Ui.prototype.onLoadEnd = function () {
        this._redraw();
    };

    TileGenerator.Ui.prototype.addAlgoToDom = function (algo) {
        var canvas,
            ctx,
            deep = true,
            description = algo.getDescription(),
            algoId = algo.getId(),
            title = algo.getTitle(),
            tpl;
        tpl = this._canvasContainerTplElement.cloneNode(deep);
        tpl.removeAttribute('id');
        tpl.setAttribute('class', 'tg-canvas-container');
        tpl.querySelector('.tg-canvas-title').textContent = title;
        tpl.querySelector('.tg-canvas-description').textContent = description;
        canvas = tpl.querySelector('canvas');
        canvas.dataset.algoId = algoId;
        canvas.width = this._settings.getWidth();
        canvas.height = this._settings.getHeight();
        canvas.setAttribute('title', title);
        canvas.addEventListener('click', this._onClickCanvas.bind(this));
        canvas.addEventListener('keyup', this._onKeyCanvas.bind(this));
        ctx = canvas.getContext('2d');
        this._canvasList[algoId] = canvas;
        this._ctxList[algoId] = ctx;
        this._canvasesElement.appendChild(tpl);
        algo.setup(ctx);
    };

    TileGenerator.Ui.prototype.redrawAlgo = function (algoId) {
        this._redrawAlgo(algoId);
    };

    TileGenerator.Ui.prototype._onClickCanvas = function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        this._map.show(e.target);
    };

    TileGenerator.Ui.prototype._onKeyCanvas = function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (e.which === 13) {
            this._map.show(e.target);
        }
    };

    TileGenerator.Ui.prototype._onDragEnterCanvases = function (e) {
        this._lastDropTarget = e.target;
        this._canvasesContainerElement.classList.add('tg-drop-effect');
        e.preventDefault();
    };

    TileGenerator.Ui.prototype._onDragOverCanvases = function (e) {
        e.preventDefault();
    };

    TileGenerator.Ui.prototype._onDragLeaveCanvases = function (e) {
        if (this._lastDropTarget === e.target) {
            this._canvasesContainerElement.classList.remove('tg-drop-effect');
        }
    };

    TileGenerator.Ui.prototype._onDropCanvases = function (e) {
        this._canvasesContainerElement.classList.remove('tg-drop-effect');
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            this._onNewFile(e.dataTransfer.files[0]);
        }
    };

    TileGenerator.Ui.prototype._onFileChange = function (e) {
        var validated = false;
        if (!this._fileElement.value) {
            return;
        }
        validated = this._onNewFile(this._fileElement.files[0]);
        if (!validated) {
            this._fileElement.value = null;
        }
    };

    TileGenerator.Ui.prototype._onNewFile = function (file) {
        var fileReader,
            maxMbs = 1,
            userMbs,
            validateSize = false;
        if (!/^image\//.test(file.type)) {
            alert('Please upload an image file.');
            return false;
        }
        if (validateSize) {
            if (file.size > (1024 * 1024 * maxMbs)) {
                userMbs = Math.round(file.size / (1024 * 1024));
                alert('Image files should be no more than ' + maxMbs + 'MB in size.  Your file is ~' + userMbs + 'MB.');
                return false;
            }
        }
        this._showProgress();
        fileReader = new FileReader();
        fileReader.addEventListener('load', this._onFileLoad.bind(this));
        fileReader.addEventListener('error', this._onFileError.bind(this));
        fileReader.addEventListener('abort', this._onFileError.bind(this));
        fileReader.readAsDataURL(file);
        return true;
    };

    TileGenerator.Ui.prototype._onFileLoad = function (e) {
        this._filePreviewElement.setAttribute('src', e.target.result);
        this._filePreviewElement.style.display = 'block';
        this._fileRemoveElement.style.display = 'block';
        this._settings.setImageElement(this._filePreviewElement);
        setTimeout(function () {
            this._hideProgress();
            this._redraw();
        }.bind(this), 150);
    };

    TileGenerator.Ui.prototype._onFileError = function (e) {
        this._hideProgress();
        alert('There was an error loading your file.  Please try again.');
    };

    TileGenerator.Ui.prototype._onFileRemove = function (e) {
        this._fileElement.value = null;
        this._filePreviewElement.removeAttribute('src');
        this._filePreviewElement.style.display = 'none';
        this._fileRemoveElement.style.display = 'none';
        this._settings.setImageElement(null);
        this._redraw();
    };

    TileGenerator.Ui.prototype._showProgress = function () {
        var progressRect;
        this._dimElement.style.display = 'block';
        this._progressElement.style.display = 'block';
        progressRect = this._progressElement.getBoundingClientRect();
        this._progressElement.style.left = Math.max(Math.floor((window.innerWidth - progressRect.width) / 2), 0) + 'px';
        this._progressElement.style.top = Math.max(Math.floor((window.innerHeight - progressRect.height) / 2), 0) + 'px';
    };

    TileGenerator.Ui.prototype._hideProgress = function () {
        this._dimElement.style.display = 'none';
        this._progressElement.style.display = 'none';
    };

    TileGenerator.Ui.prototype._onAddColor = function (e) {
        this._cloneColor(this._colorContainerTplElement);
    };

    TileGenerator.Ui.prototype._onCloneColor = function (e) {
        var colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container');
        this._cloneColor(colorContainerElement);
    };

    TileGenerator.Ui.prototype._onRemoveColor = function (e) {
        var colorContainerElement,
            index;
        if (this._settings.getNumColors() > 1) {
            colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container');
            index = TileGenerator.Dom.getSiblingIndex(colorContainerElement);
            this._settings.removeColor(index)
                .removeColorWeight(index);
            this._colorsElement.removeChild(colorContainerElement);
            this._redraw();
        } else {
            alert('You must keep at least 1 color.');
        }
    };

    TileGenerator.Ui.prototype._onChangeColor = function (e) {
        var colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container'),
            index;
        index = TileGenerator.Dom.getSiblingIndex(colorContainerElement);
        this._settings.updateColor(index, TileGenerator.Hex.simpleToDecArray(e.target.value));
        colorContainerElement.querySelector('.tg-color-value').value = e.target.value;
        this._redraw();
    };

    TileGenerator.Ui.prototype._onInputColorValue = function (e) {
        var colorContainerElement,
            colorElement,
            eventObj;
        if (TileGenerator.Hex.isSimpleHex(e.target.value)) {
            colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container');
            colorElement = colorContainerElement.querySelector('.tg-color');
            colorElement.value = e.target.value;
            eventObj = new Event('change');
            colorElement.dispatchEvent(eventObj);
        }
    };

    TileGenerator.Ui.prototype._onChangeColorValue = function (e) {
        var colorContainerElement,
            colorElement;
        if (!TileGenerator.Hex.isSimpleHex(e.target.value)) {
            colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container');
            colorElement = colorContainerElement.querySelector('.tg-color');
            e.target.value = colorElement.value;
        }
    };

    TileGenerator.Ui.prototype._onInputColorWeight = function (e) {
        var colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container');
        colorContainerElement.querySelector('.tg-color-weight-value').textContent = e.target.value;
    };

    TileGenerator.Ui.prototype._onChangeColorWeight = function (e) {
        var colorContainerElement = TileGenerator.Dom.getParentNodeByClass(e.target, 'tg-color-container'),
            colorWeight = parseInt(e.target.value, 10),
            index;
        index = TileGenerator.Dom.getSiblingIndex(colorContainerElement);
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
            this._callAlgoResized();
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
        var i;
        for (i in this._ctxList) {
            if (this._ctxList.hasOwnProperty(i)) {
                this._redrawAlgo(i);
            }
        }
    };

    TileGenerator.Ui.prototype._redrawAlgo = function (algoId) {
        var algo = TileGenerator.Main.getRef().getAlgo(algoId);
        this._ctxList[algoId].clearRect(0, 0, this._settings.getWidth(), this._settings.getHeight());
        algo.draw(this._ctxList[algoId]);
    };

    TileGenerator.Ui.prototype._cloneColor = function (colorContainerElement) {
        var colorWeight,
            simpleColor;
        simpleColor = colorContainerElement.querySelector('.tg-color').value;
        colorWeight = parseInt(colorContainerElement.querySelector('.tg-color-weight-range').value, 10);
        this._addColorToDom(simpleColor, colorWeight);
        this._settings.addColor(TileGenerator.Hex.simpleToDecArray(simpleColor))
            .addColorWeight(colorWeight);
        this._redraw();
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
        tpl.setAttribute('class', 'tg-color-container');
        colorElement = tpl.querySelector('.tg-color');
        colorValueElement = tpl.querySelector('.tg-color-value');
        colorWeightElement = tpl.querySelector('.tg-color-weight-range');
        colorWeightValueElement = tpl.querySelector('.tg-color-weight-value');
        colorElement.value = simpleColor;
        colorValueElement.value = simpleColor;
        colorWeightElement.value = colorWeight;
        colorWeightValueElement.textContent = colorWeight;
        tpl.querySelector('.tg-clone-color-btn').addEventListener('click', this._onCloneColor.bind(this));
        tpl.querySelector('.tg-remove-color-btn').addEventListener('click', this._onRemoveColor.bind(this));
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
        this._map.onResize();        
    };

    TileGenerator.Ui.prototype._callAlgoResized = function () {
        var algo,
            i;
        for (i in this._ctxList) {
            if (this._ctxList.hasOwnProperty(i)) {
                algo = TileGenerator.Main.getRef().getAlgo(i);
                algo.resized(this._ctxList[i]);
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