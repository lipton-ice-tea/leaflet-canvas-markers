'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    } else {
        factory(window.L);
    }
}(this, function (L) {
    L.Canvas.include({
        _updateImg(layer) {
            const { img } = layer.options;
            const p = layer._point.round();
            p.x += img.offset.x; p.y += img.offset.y;
            if (img.rotate) {
                this._ctx.save();
                this._ctx.translate(p.x, p.y);
                this._ctx.rotate(img.rotate * Math.PI / 180);
                this._ctx.drawImage(img.el, -img.size[0] / 2, -img.size[1] / 2, img.size[0], img.size[1]);
                this._ctx.restore();
            } else {
                this._ctx.drawImage(img.el, p.x - img.size[0] / 2, p.y - img.size[1] / 2, img.size[0], img.size[1]);
            }
        },
    });

    const angleCrds = (map, prevLatlng, latlng) => {
        if (!latlng || !prevLatlng) return 0;
        const pxStart = map.project(prevLatlng);
        const pxEnd = map.project(latlng);
        return Math.atan2(pxStart.y - pxEnd.y, pxStart.x - pxEnd.x) / Math.PI * 180 - 90;
    };

    const defaultImgOptions = {
        rotate: 0,
        size: [40, 40],
        offset: { x: 0, y: 0 },
    };

    const CanvasMarker = L.CircleMarker.extend({
        _updatePath() {
            if (!this.options.img || !this.options.img.url) return;
            if (!this.options.img.el) {
                this.options.img = {...defaultImgOptions, ...this.options.img};
                this.options.img.rotate += angleCrds(this._map, this.options.prevLatlng, this._latlng);
                const img = document.createElement('img');
                img.src = this.options.img.url;
                this.options.img.el = img;
                img.onload = () => {
                    this.redraw();
                };
                img.onerror = () => {
                    this.options.img = null;
                };
            } else {
                this._renderer._updateImg(this);
            }
        },
    });

    L.canvasMarker = function (...options) {
        return new CanvasMarker(...options);
    };
}));