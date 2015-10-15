/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import Ray from './ray';

class Camera {
    /**
     * Constructor of Camera class
     * @param {Vector} eye The eye position of camera
     * @param {Object} screen [tl, tr, bl, br], the viewport
     * @param {Number} width Pixel width
     * @param {Number} height Pixel height
     */
    constructor(eye, screen, width = 800, height = 600) {
        this.eye      = eye;
        this.screen   = screen;
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
    }

    /**
     * Generator for each pixel's coordinate and the vector pointed to this pixel
     */
    * eachPixel() {
        let posY = this.screen.tl.clone();
        for (let y = 0; y < this.pxHeight; ++y) {
            let posX = posY.clone();
            for (let x = 0; x < this.pxWidth; ++x) {
                yield {
                    x: x,
                    y: y,
                    v: posX
                };
                posX.addBy(this.widthInc);
            }
            posY.addBy(this.heightInc);
        }
    }

    /**
     * Generator for each pixel's coordinate and the ray from camera to this pixel
     */
    * eachRay() {
        for (let pixel of this.eachPixel()) {
            yield {
                x:   pixel.x,
                y:   pixel.y,
                ray: new Ray(this.eye, pixel.v.clone().minusBy(this.eye))
            };
        }
    }
}

export default Camera;
