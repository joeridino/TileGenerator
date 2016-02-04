(function () {
    'use strict';

    TileGenerator.Dom = {};

    TileGenerator.Dom.getParentNodeByClass = function (element, className) {
        while ((element = element.parentNode) !== null) {
            if (element.classList && element.classList.contains(className)) {
                return element;
            }
        }
        return null;
    };

    TileGenerator.Dom.getSiblingIndex = function (element) {
        var index = 0;
        while ((element = element.previousSibling) !== null) {
            index += 1;
        }
        return index;
    };
}());