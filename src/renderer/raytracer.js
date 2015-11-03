/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Cons from '../core/constant';
import Ray from '../core/ray';
import Color, {colors} from '../core/color';

var pow    = Math.pow;
var random = Math.random;

class Raytracer {
    /**
     * Constructor of the Raytracer class
     * @param {Camera} camera Camera class from core/camera
     * @param {Output} output Output class from interface/index
     */
    constructor(camera, output) {
        this.camera = camera;
        this.output = output;

        this.lights = [];
    }

    /**
     * Add point light source
     * @param {Vector} p Position
     * @param {Color} c Color
     */
    addLight(p, c) {
        this.lights.push({
            p: p,
            c: c
        });
    }

    /**
     * Tracy specific ray and returns color
     * @param {Scene} scene
     * @param {Ray} ray
     * @param {Number} depth
     * @param {Boolean} sample
     * @returns {Color}
     */
    trace(scene, ray, depth = 1, sample = true) {
        if (depth <= 0) {
            return colors.black.clone();
        }
        /*
        if (ray.c.brightness() < Cons.MIN_BRIGHTNESS) {
            return colors.black;
        }
        */

        let p      = null;
        let minP   = null;
        let minDis = Infinity;
        let minObj = null;
        for (let obj of scene.eachObject()) {
            p = obj.testInnerRay(ray);
            if (p !== null) {
                if (p == Cons.FLAG_EDGE) {
                    if (sample) {
                        // Samples
                        let c = colors.black.clone();
                        let rayY = ray.clone();
                        // Top-left
                        for (let i = 0; i + 1 < Cons.NUMBER_SAMPLE; ++i) {
                            rayY.t.minusBy(this.camera.widthIncPerSubPixel);
                            rayY.t.minusBy(this.camera.heightIncPerSubPixel);
                        }
                        for (let i = 0; i < Cons.NUMBER_SAMPLE; ++i) {
                            let randRay = rayY.clone();
                            for (let j = 0; j < Cons.NUMBER_SAMPLE; ++j) {
                                c.addBy(this.trace(scene, randRay, depth, false));
                                randRay.t.addBy(this.camera.widthIncPerSubPixel);
                                randRay.t.addBy(this.camera.widthIncPerSubPixel);
                            }
                            rayY.t.addBy(this.camera.heightIncPerSubPixel);
                            rayY.t.addBy(this.camera.heightIncPerSubPixel);
                        }
                        return c.mulBy(1.0 / (Cons.NUMBER_SAMPLE * Cons.NUMBER_SAMPLE)).mask(ray.c);
                    }
                } else {
                    let dis = ray.s.minus(p.s);
                    if (dis.length() < minDis) {
                        minDis = dis.length();
                        minObj = obj;
                        minP   = p;
                    }
                }
            }
        }

        if (minObj) {
            let ret;

            // Reflection
            minP.c = ray.c.mask(minObj.c);
            ret    = this.trace(scene, minP, depth - 1, false).mulBy(0.5);

            // Shadow
            for (let i = 0; i < this.lights.length; ++i) {
                let light = this.lights[i];
                let rayToLight = new Ray(minP.s.clone(), light.p.clone());
                let shadow     = false;
                for (let obj of scene.eachObject()) {
                    if (obj !== minObj) {
                        let test = obj.testInnerRay(rayToLight);
                        if (test != null && test != Cons.FLAG_EDGE) {
                            shadow = true;
                            break;
                        }
                    }
                }
                let cosAngle = 0;
                if (!shadow) {
                    cosAngle = light.p.minus(minP.s).normalize().dot(minP.t.normal());
                    if (cosAngle < 0) {
                        cosAngle = 0;
                    }
                    ret.addBy(minObj.c.mul(cosAngle * cosAngle).mask(light.c).mask(ray.c));
                    //ret = ret.add(minObj.c.mul(pow(cosAngle, 10)));
                }
            }

            return ret;
        }

        return colors.black.clone();
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
        let output = this.output;

        for (let pixel of this.camera.eachRay(x0, y0, stepX, stepY)) {
            let c = this.trace(scene, pixel.ray, Cons.DEEP);
            for (let x = 0; x < stepX - x0; ++x) {
                for (let y = 0; y < stepY - y0; ++y) {
                    output.setPoint(pixel.x + x, pixel.y + y, c);
                }
            }
        }

        output.updateCanvas();
    }
}

export default Raytracer;
