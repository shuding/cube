/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import Ray from './ray';
import Cons from '../core/constant';
import Vector from '../object/vector';

class Camera {
    /**
     * Constructor of Camera class
     * @param {Vector} eye The eye position of camera
     * @param {Object} screen [tl, tr, bl, br], the viewport
     * @param {Number} width Pixel width
     * @param {Number} height Pixel height
     */
    constructor(eye, screen, width = 400, height = 300) {
        this.eye      = eye;
        this._screen_ = screen;
        this.pxWidth  = width;
        this.pxHeight = height;

        let r2l = screen[1].minus(screen[0]);
        let b2t = screen[2].minus(screen[0]);

        this.width  = r2l.length();
        this.height = b2t.length();

        this.widthPerPx  = this.width / this.pxWidth;
        this.heightPerPx = this.height / this.pxHeight;

        this.widthInc  = r2l.mulBy(this.widthPerPx / this.width);
        this.heightInc = b2t.mulBy(this.heightPerPx / this.height);

        this.widthIncPerSubPixel = this.widthInc.mul(1.0 / Cons.NUMBER_SAMPLE);
        this.heightIncPerSubPixel = this.heightInc.mul(1.0 / Cons.NUMBER_SAMPLE);
    }

    get screen() {
        return this._screen_;
    }

    set screen(screen) {
        this._screen_ = screen;
        let r2l       = screen[1].minus(screen[0]);
        let b2t       = screen[2].minus(screen[0]);

        this.width  = r2l.length();
        this.height = b2t.length();

        this.widthPerPx  = this.width / this.pxWidth;
        this.heightPerPx = this.height / this.pxHeight;

        this.widthInc  = r2l.mulBy(this.widthPerPx / this.width);
        this.heightInc = b2t.mulBy(this.heightPerPx / this.height);
    }

    rotate(x, y, z) {
        this.eye.rotateBy(x, y, z);
        this._screen_.forEach(function (p) {
            p.rotateBy(x, y, z);
        });
        let r2l       = this._screen_[1].minus(this._screen_[0]);
        let b2t       = this._screen_[2].minus(this._screen_[0]);

        this.width  = r2l.length();
        this.height = b2t.length();

        this.widthPerPx  = this.width / this.pxWidth;
        this.heightPerPx = this.height / this.pxHeight;

        this.widthInc  = r2l.mulBy(this.widthPerPx / this.width);
        this.heightInc = b2t.mulBy(this.heightPerPx / this.height);
    }

    /**
     * Generator for each pixel's coordinate and the vector pointed to this pixel
     */
    * eachPixel(x0, y0, stepX, stepY) {
        let widthInc = this.widthInc.mul(stepX);
        let heightInc = this.heightInc.mul(stepY);
        let widthOffset = this.widthInc.mul(x0);
        let heightOffset = this.heightInc.mul(y0);

        let posY = this._screen_[0].add(heightOffset);

        for (let y = y0; y < this.pxHeight; y += stepY) {
            let posX = posY.add(widthOffset);
            for (let x = x0; x < this.pxWidth; x += stepX) {
                yield {
                    x: x,
                    y: y,
                    v: posX
                };
                posX.addBy(widthInc);
            }
            posY.addBy(heightInc);
        }
    }

    /**
     * Generator for each pixel's coordinate and the ray from camera to this pixel
     */
    * eachRay(x0, y0, stepX, stepY) {
        for (let pixel of this.eachPixel(x0, y0, stepX, stepY)) {
            yield {
                x  : pixel.x,
                y  : pixel.y,
                ray: new Ray(this.eye, pixel.v.minus(this.eye))
            };
        }
    }

    rayAt(x, y) {
        let v = this.widthInc.mul(x).add(this.heightInc.mul(y)).add(this._screen_[0]);
        return new Ray(this.eye, v.minus(this.eye));
    }
}

export default Camera;
