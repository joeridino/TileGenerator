(function () {
    'use strict';

    var parent = TileGenerator.AlgoPixellation;

    TileGenerator.AlgoFilePixellation = function (settings) {
        parent.call(this, settings);
        this._id = 'file_pixellation';
        this._title = 'File Pixellation';
        this._description = 'Blocks of pixels are assigned the same color based on the selected image file.';
    };

    TileGenerator.Oop.extend(parent, TileGenerator.AlgoFilePixellation);

    TileGenerator.AlgoFilePixellation.prototype.draw = function (ctx) {
        var imageElement = this._settings.getImageElement();
        if (!imageElement) {
            this._drawMissingImage(ctx);
        } else {
            this._drawImage(ctx);
            this._pixellateImage(ctx);
            this._drawPixels(ctx);
        }
    };

    TileGenerator.AlgoFilePixellation.prototype._drawMissingImage = function (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this._settings.getWidth(), this._settings.getHeight());
        if (!this._drawTextConditional(ctx, 'Need File')) {
            this._drawTextConditional(ctx, 'File');
        }
    };

    TileGenerator.AlgoFilePixellation.prototype._drawImage = function (ctx) {
        var imageElement = this._settings.getImageElement();
        ctx.drawImage(
            imageElement,
            0,
            0,
            imageElement.width,
            imageElement.height,
            0,
            0,
            this._settings.getWidth(),
            this._settings.getHeight()
        );
    };

    TileGenerator.AlgoFilePixellation.prototype._pixellateImage = function (ctx) {
        var blockY,
            blockX,
            color,
            imageData = ctx.getImageData(0, 0, this._settings.getWidth(), this._settings.getHeight()).data,
            positions;
        this._blockWidth = 4;
        this._blockHeight = 4;
        this._numBlocksX = Math.ceil(this._settings.getWidth() / this._blockWidth);
        this._numBlocksY = Math.ceil(this._settings.getHeight() / this._blockHeight);
        for (blockY = 0; blockY < this._numBlocksY; blockY += 1) {
            for (blockX = 0; blockX < this._numBlocksX; blockX += 1) {
                positions = this._getBlockPositions(blockX, blockY);
                color = this._getBlockColor(ctx, imageData, positions);
                this._setBlockPixels(ctx, positions, color);
            }
        }
    };

    TileGenerator.AlgoFilePixellation.prototype._drawTextConditional = function (ctx, text) {
        var height = 16,
            measurement,
            x,
            y;
        ctx.font = 'bold ' + height + 'px serif';
        ctx.textBaseline = 'top';
        measurement = ctx.measureText(text);
        if (measurement.width >= this._settings.getWidth()) {
            return false;
        }
        x = Math.round((this._settings.getWidth() - measurement.width) / 2);
        y = Math.round((this._settings.getHeight() - height) / 2);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);
        return true;
    };

    TileGenerator.AlgoFilePixellation.prototype._getBlockColor = function (ctx, imageData, positions) {
        var a = 0,
            b = 0,
            color,
            g = 0,
            i,
            pixelIndex,
            r = 0;
        for (i = 0; i < positions.length; i += 1) {
            pixelIndex = this._getPixelIndex(ctx, positions[i].x, positions[i].y);
            r += imageData[pixelIndex++];
            g += imageData[pixelIndex++];
            b += imageData[pixelIndex++];
            a += imageData[pixelIndex++];
        }
        color = [
            Math.round(r / positions.length),
            Math.round(g / positions.length),
            Math.round(b / positions.length),
            Math.round(a / positions.length)
        ];
        return color;
    };
}());