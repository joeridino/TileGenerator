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
