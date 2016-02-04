(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoBrick = function (settings) {
        parent.call(this, settings);
        this._id = 'brick';
        this._title = 'Brick';
        this._description = 'Rectangles and lines create bricks.';
    };

    TileGenerator.Oop.extend(parent, TileGenerator.AlgoBrick);

    TileGenerator.AlgoBrick.prototype.draw = function (ctx) {
        var brickHexColors = [],
            brickX,
            brickY,
            brickHeight,
            brickWidth,
            colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            halfBrickWidth,
            i,
            loopBrickWidth,
            loopNumBricksX,
            numBricksX,
            numBricksY,
            outlineHexColor,
            x;
        for (i = 0; i < colors.length; i += 1) {
            if (colorWeights[i] > 0) {
                if (!outlineHexColor) {
                    outlineHexColor = TileGenerator.Dec.decArrayToSimpleHex(colors[i]);
                } else {
                    brickHexColors.push(TileGenerator.Dec.decArrayToSimpleHex(colors[i]));
                }
            }
        }
        if (brickHexColors.length === 0) {
            brickHexColors.push(outlineHexColor);
        }
        brickWidth = Math.floor(this._settings.getWidth() / 4);
        halfBrickWidth = Math.floor(brickWidth / 2);
        brickHeight = Math.floor(this._settings.getHeight() / 8);
        numBricksX = Math.floor(this._settings.getWidth() / brickWidth);
        numBricksY = Math.floor(this._settings.getHeight() / brickHeight);
        ctx.strokeStyle = outlineHexColor;
        for (brickY = 0; brickY < numBricksY; brickY += 1) {
            x = 0;
            ctx.fillStyle = brickHexColors[brickY % brickHexColors.length];
            loopNumBricksX = (brickY % 2 === 0 ? numBricksX : numBricksX + 1);
            for (brickX = 0; brickX < loopNumBricksX; brickX += 1) {
                if (loopNumBricksX !== numBricksX
                        && (brickX === 0 || brickX === loopNumBricksX - 1)) {
                    loopBrickWidth = halfBrickWidth;
                } else {
                    loopBrickWidth = brickWidth;
                }
                ctx.fillRect(x, brickY * brickHeight, loopBrickWidth, brickHeight);
                ctx.strokeRect(x, brickY * brickHeight, loopBrickWidth, brickHeight);
                x += loopBrickWidth;
            }
        }
    };
}());