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

    const angleCrds = (latlng, prevLatlng) => {
        if (!latlng || !prevLatlng) return 0;
        const {lat, lng} = latlng;
        const [lng2, lat2] = prevLatlng;
        const x = Math.cos(lat2) * Math.sin(lat) - Math.sin(lat2) * Math.cos(lat) * Math.cos(lng2 - lng);
        const y = Math.sin(lng2 - lng) * Math.cos(lat);
        const brng = Math.atan2(y, x) * (180 / Math.PI);
        return (brng + 360) % 360 + 90;
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
                this.options.img.rotate += angleCrds(this._latlng, this.options.prevLatlng);
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