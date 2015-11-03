/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Cons from '../core/constant';
import Ray from '../core/ray';
import Color, {colors} from '../core/color';

class Raytracer {
    /**
     * Constructor of the Raytracer class
     * @param {Camera} camera Camera class from core/camera
     * @param {Output} output Output class from interface/index
     */
    constructor(camera, output) {
        this.camera = camera;
        this.output = output;
    }

    /**
     * Add point light source
     * @param {Vector} p Position
     * @param {Color} c Color
     */
    addLight(p, c) {
        this.light = {
            p: p,
            c: c
        };
    }

    addPlane(p) {
        this.plane = p;
    }

    /**
     * Tracy specific ray and returns color
     * @param {Scene} scene
     * @param {ray} ray
     * @param depth
     * @returns {Color}
     */
    trace(scene, ray, depth = 1) {
        if (depth <= 0) {
            return colors.black;
        }
        if (ray.c.brightness() < Cons.MIN_BRIGHTNESS) {
            return colors.black;
        }

        // TODO
        let p;
        let minP;
        let minDis = Infinity;
        let minObj = null;
        for (let obj of scene.eachObject()) {
            switch (obj.constructor.name) {
                case 'Ball':
                    p = obj.testInnerRay(ray);
                    /* anti-aliasing
                     if (p == Cons.FLAG_EDGE) {
                     return colors.red//ray.c.mul(Cons.RATE_EDGE);
                     }*/
                    if (p) {
                        let dis = ray.s.minus(p.s);
                        if (dis.length() < minDis) {
                            minDis = dis.length();
                            minObj = obj;
                            minP   = p;
                        }
                    }
                    break;
            }
        }

        if (minObj) {
            // Shadow
            let rayToLight = new Ray(minP.s, this.light.p.clone());
            let shadow     = false;
            for (let obj of scene.eachObject()) {
                if (obj != minObj && obj.testInnerRay(rayToLight)) {
                    shadow = true;
                    break;
                }
            }

            let cosAngle = 0;
            if (!shadow) {
                cosAngle = this.light.p.minus(minP.s).normal().dot(minP.t.normalize());
            }
            if (cosAngle < 0) {
                cosAngle = 0;
            }
            // Reflection
            minP.c = ray.c.mask(minObj.c).mul(0.5);
            return ray.c.mask(minObj.c).mul(cosAngle * cosAngle).add(this.trace(scene, minP, depth - 1));
        }

        if (this.plane) {
            p = this.plane.testInnerRay(ray);
            if (p) {
                // Shadow
                let rayToLight = new Ray(p.s, this.light.p.clone());
                let shadow     = false;
                for (let obj of scene.eachObject()) {
                    if (obj.testInnerRay(rayToLight)) {
                        shadow = true;
                        break;
                    }
                }

                let cosAngle = 0;
                if (!shadow) {
                    cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                }
                if (cosAngle < 0) {
                    cosAngle = 0;
                }
                p.c = ray.c.mul(0.5);
                return ray.c.mul(Math.pow(cosAngle, 3)).add(this.trace(scene, p, depth - 1));
            }
        }

        return colors.black;
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     * @param x0
     * @param y0
     * @param stepX
     * @param stepY
     */
    render(scene, x0 = 0, y0 = 0, stepX = 1, stepY = 1) {
        for (let pixel of this.camera.eachRay(x0, y0, stepX, stepY)) {
            let c = this.trace(scene, pixel.ray, 3);
            for (let x = 0; x < stepX - x0; ++x) {
                for (let y = 0; y < stepY - y0; ++y) {
                    this.output.setPoint(pixel.x + x, pixel.y + y, c);
                }
            }
        }
        this.output.updateCanvas();
    }
}

export default Raytracer;
