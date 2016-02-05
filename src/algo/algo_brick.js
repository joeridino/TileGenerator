(function () {
    'use strict';

    var parent = TileGenerator.Algo;

    TileGenerator.AlgoBrick = function (settings) {
        parent.call(this, settings);
        this._id = 'brick';
        this._title = 'Brick';
        this._description = 'Rows of bricks.';
        this._brickHexColors = null;
        this._outlineHexColor = null;
        this._brickWidth = 0;
        this._brickHeight = 0;
        this._halfBrickWidth = 0;
        this._numBricksX = 0;
        this._numBricksY = 0;
    };

    TileGenerator.Oop.extend(parent, TileGenerator.AlgoBrick);

    TileGenerator.AlgoBrick.prototype.draw = function (ctx) {
        this._defineVariables(ctx);
        this._drawBricks(ctx);
    };

    TileGenerator.AlgoBrick.prototype._defineVariables = function (ctx) {
        var colors = this._settings.getColors(),
            colorWeights = this._settings.getColorWeights(),
            i;
        this._brickHexColors = [];
        this._outlineHexColor = null;
        for (i = 0; i < colors.length; i += 1) {
            if (colorWeights[i] > 0) {
                if (!this._outlineHexColor) {
                    this._outlineHexColor = TileGenerator.Dec.decArrayToSimpleHex(colors[i]);
                } else {
                    this._brickHexColors.push(TileGenerator.Dec.decArrayToSimpleHex(colors[i]));
                }
            }
        }
        if (this._brickHexColors.length === 0) {
            this._brickHexColors.push(this._outlineHexColor);
        }
        this._brickWidth = Math.floor(this._settings.getWidth() / 4);
        this._halfBrickWidth = Math.floor(this._brickWidth / 2);
        this._brickHeight = Math.floor(this._settings.getHeight() / 8);
        this._numBricksX = Math.floor(this._settings.getWidth() / this._brickWidth);
        this._numBricksY = Math.floor(this._settings.getHeight() / this._brickHeight);
    };

    TileGenerator.AlgoBrick.prototype._drawBricks = function (ctx) {
        var brickX,
            brickY,
            loopBrickWidth,
            loopNumBricksX,
            x = 0,
            y = 0;
        for (brickY = 0; brickY < this._numBricksY; brickY += 1) {
            x = 0;
            ctx.fillStyle = this._brickHexColors[brickY % this._brickHexColors.length];
            loopNumBricksX = (brickY % 2 === 0 ? this._numBricksX : this._numBricksX + 1);
            for (brickX = 0; brickX < loopNumBricksX; brickX += 1) {
                if (loopNumBricksX !== this._numBricksX
                        && (brickX === 0 || brickX === loopNumBricksX - 1)) {
                    loopBrickWidth = this._halfBrickWidth;
                } else {
                    loopBrickWidth = this._brickWidth;
                }
                ctx.strokeStyle = this._outlineHexColor;
                ctx.fillRect(x, y, loopBrickWidth, this._brickHeight);
                ctx.strokeRect(x + 0.5, y + 0.5, loopBrickWidth - ctx.lineWidth, this._brickHeight - ctx.lineWidth);
                if (loopBrickWidth === this._halfBrickWidth) {
                    if (brickX === 0) {
                        this._unlineHalfBrick(ctx, x, y + ctx.lineWidth);
                    } else {
                        this._unlineHalfBrick(ctx, x + loopBrickWidth - ctx.lineWidth, y + ctx.lineWidth);
                    }
                }
                x += loopBrickWidth;
            }
            y += this._brickHeight;
        }
    };

    TileGenerator.AlgoBrick.prototype._unlineHalfBrick = function (ctx, x, y) {
        x += 0.5;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this._brickHeight - (ctx.lineWidth * 2));
        ctx.stroke();
    };
}());