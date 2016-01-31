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
