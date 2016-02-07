(function () {
    'use strict';

    TileGenerator.Map = function (ui) {
        this._ui = ui;
        this._settings = null;
        this._dimElement = null;
        this._mapElement = null;
        this._mapCanvas = null;
        this._mapCtx = null;
        this._sourceCanvas = null;
        this._pattern = null;
        this._patterns = null;
        this._previousElement = null;
        this._nextElement = null;
        this._closeElement = null;
        this._redrawElement = null;
        this._patternsElement = null;
        this._closeHandler = this._onClickDim.bind(this);
        this._keyHandler = this._onKeyDocument.bind(this);
        this._previousHandler = this._onClickPrevious.bind(this);
        this._nextHandler = this._onClickNext.bind(this);
        this._redrawHandler = this._onClickRedraw.bind(this);
        this._patternHandler = this._onClickPattern.bind(this);
    };

    TileGenerator.Map.prototype.onLoad = function () {
        this._settings = TileGenerator.Main.getRef().getSettings();
        this._dimElement = document.getElementById('tg-dim');
        this._mapElement = document.getElementById('tg-map');
        this._previousElement = this._mapElement.querySelector('.tg-map-link-previous');
        this._nextElement = this._mapElement.querySelector('.tg-map-link-next');
        this._closeElement = this._mapElement.querySelector('.tg-map-link-close');
        this._redrawElement = this._mapElement.querySelector('.tg-map-link-redraw');
        this._patternsElement = this._mapElement.querySelector('.tg-map-patterns');
        this._patterns = TileGenerator.MapPatternFactory.getPatternInstances();
        this._pattern = this._patterns[0];
        this._createCanvas();
        this._resize();
        this._rearrangeDom();
        this._populateDomPatterns();
    };

    TileGenerator.Map.prototype.onResize = function () {
        this._resize();
    };

    TileGenerator.Map.prototype.show = function (canvas) {
        this._sourceCanvas = canvas;
        this._dimElement.style.display = 'block';
        this._mapElement.style.display = 'block';
        this._populate();
        this._draw();
        this._position();
        this._nextElement.focus();
        document.addEventListener('keyup', this._keyHandler);
        this._dimElement.addEventListener('click', this._closeHandler);
        this._previousElement.addEventListener('click', this._previousHandler);
        this._nextElement.addEventListener('click', this._nextHandler);
        this._closeElement.addEventListener('click', this._closeHandler);
        this._redrawElement.addEventListener('click', this._redrawHandler);
        this._addPatternListeners();
    };

    TileGenerator.Map.prototype._hide = function () {
        var dimElement = document.getElementById('tg-dim');
        dimElement.style.display = 'none';
        this._mapElement.style.display = 'none';
        document.removeEventListener('keyup', this._keyHandler);
        this._dimElement.removeEventListener('click', this._closeHandler);
        this._previousElement.removeEventListener('click', this._previousHandler);
        this._nextElement.removeEventListener('click', this._nextHandler);
        this._closeElement.removeEventListener('click', this._closeHandler);
        this._redrawElement.removeEventListener('click', this._redrawHandler);
        this._removePatternListeners();
    };

    TileGenerator.Map.prototype._populate = function () {
        var canvasContainerElement = TileGenerator.Dom.getParentNodeByClass(this._sourceCanvas, 'tg-canvas-container');
        this._mapElement.querySelector('.tg-map-title').textContent = canvasContainerElement.querySelector('.tg-canvas-title').textContent;
        this._mapElement.querySelector('.tg-map-description').textContent = canvasContainerElement.querySelector('.tg-canvas-description').textContent;
    };

    TileGenerator.Map.prototype._draw = function () {
        this._pattern.draw(this._sourceCanvas, this._mapCtx);
    };

    TileGenerator.Map.prototype._position = function () {
        var mapRect = this._mapElement.getBoundingClientRect();
        this._mapElement.style.left = Math.max(Math.floor((window.innerWidth - mapRect.width) / 2) + window.pageXOffset, 0) + 'px';
        this._mapElement.style.top = Math.max(Math.floor((window.innerHeight - mapRect.height) / 2) + window.pageYOffset, 0) + 'px';
    };

    TileGenerator.Map.prototype._onKeyDocument = function (e) {
        switch (e.which) {
        case 27:
            this._hide();
            break;

        case 37:
            this._previous();
            break;

        case 39:
            this._next();
            break;
        }
    };

    TileGenerator.Map.prototype._onClickDim = function (e) {
        this._hide();
        e.preventDefault();
    };

    TileGenerator.Map.prototype._onClickPrevious = function (e) {
        this._previous();
        e.preventDefault();
    };

    TileGenerator.Map.prototype._onClickNext = function (e) {
        this._next();
        e.preventDefault();
    };

    TileGenerator.Map.prototype._onClickRedraw = function (e) {
        this._ui.redrawAlgo(this._sourceCanvas.dataset.algoId);
        this._draw();
        e.preventDefault();
    };

    TileGenerator.Map.prototype._onClickPattern = function (e) {
        var index;
        if (e.target.classList.contains('tg-map-pattern-active')) {
            return;
        }
        this._patternsElement.querySelector('.tg-map-pattern-active').classList.remove('tg-map-pattern-active');
        index = TileGenerator.Dom.getSiblingIndex(e.target);
        e.target.classList.add('tg-map-pattern-active');
        this._pattern = this._patterns[index];
        this._resize();
        this._draw();
        this._position();
    };

    TileGenerator.Map.prototype._changeCanvas = function (canvas) {
        this._sourceCanvas = canvas;
        this._populate();
        this._draw();
    };

    TileGenerator.Map.prototype._previous = function () {
        var canvasesParent,
            prevContainer,
            sourceContainer = TileGenerator.Dom.getParentNodeByClass(this._sourceCanvas, 'tg-canvas-container');
        prevContainer = sourceContainer.previousSibling;
        if (!prevContainer) {
            canvasesParent = TileGenerator.Dom.getParentNodeByClass(sourceContainer, 'tg-canvases-dynamic');
            prevContainer = canvasesParent.lastChild;
        }
        this._changeCanvas(prevContainer.querySelector('canvas'));
    };

    TileGenerator.Map.prototype._next = function () {
        var canvasesParent,
            nextContainer,
            sourceContainer = TileGenerator.Dom.getParentNodeByClass(this._sourceCanvas, 'tg-canvas-container');
        nextContainer = sourceContainer.nextSibling;
        if (!nextContainer) {
            canvasesParent = TileGenerator.Dom.getParentNodeByClass(sourceContainer, 'tg-canvases-dynamic');
            nextContainer = canvasesParent.firstChild;
        }
        this._changeCanvas(nextContainer.querySelector('canvas'));
    };

    TileGenerator.Map.prototype._createCanvas = function () {
        this._mapCanvas = document.getElementById('tg-map-canvas');
        this._mapCtx = this._mapCanvas.getContext('2d');
    };

    TileGenerator.Map.prototype._resize = function () {
        this._mapCanvas.width = this._settings.getWidth() * this._pattern.getNumXTiles();
        this._mapCanvas.height = this._settings.getHeight() * this._pattern.getNumYTiles();
    }

    TileGenerator.Map.prototype._rearrangeDom = function () {
        if (this._mapElement.parentNode === document.body) {
            return;
        }
        this._mapElement.parentNode.removeChild(this._mapElement);
        this._dimElement.parentNode.removeChild(this._dimElement);
        document.body.appendChild(this._mapElement);
        document.body.appendChild(this._dimElement);
    };

    TileGenerator.Map.prototype._populateDomPatterns = function () {
        var i,
            li,
            ul = this._patternsElement.querySelector('ul');
        for (i = 0; i < this._patterns.length; i += 1) {
            li = document.createElement('li');
            if (i === 0) {
                li.classList.add('tg-map-pattern-active');
            }
            li.setAttribute('tabindex', '0');
            li.setAttribute('title', this._patterns[i].getDescription());
            li.textContent = this._patterns[i].getTitle();
            ul.appendChild(li);
        }
    };

    TileGenerator.Map.prototype._addPatternListeners = function () {
        var i,
            lis = this._patternsElement.querySelectorAll('li');
        for (i = 0; i < lis.length; i += 1) {
            lis[i].addEventListener('click', this._patternHandler);
        }
    };

    TileGenerator.Map.prototype._removePatternListeners = function () {
        var i,
            lis = this._patternsElement.querySelectorAll('li');
        for (i = 0; i < lis.length; i += 1) {
            lis[i].removeEventListener('click', this._patternHandler);
        }
    };
}());