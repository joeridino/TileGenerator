(function () {
    'use strict';

    TileGenerator.Oop = {};

    TileGenerator.Oop.extend = function (parent, child) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    };
}());