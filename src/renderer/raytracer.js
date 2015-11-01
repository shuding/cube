/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Cons from '../core/constant';
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
        for (let obj of scene.eachObject()) {
            switch (obj.constructor.name) {
                case 'Face':
                    p = obj.testInnerRay(ray);
                    if (p) {
                        let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                        if (cosAngle < 0) cosAngle = 0;
                        return ray.c.mul(cosAngle);
                    }
                    break;
                case 'Ball':
                    p = obj.testInnerRay(ray);
                    /* anti-aliasing
                    if (p == Cons.FLAG_EDGE) {
                        return colors.red//ray.c.mul(Cons.RATE_EDGE);
                    }*/
                    if (p) {
                        let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                        if (cosAngle < 0) cosAngle = 0;
                        // Reflection
                        p.c = ray.c.mask(obj.c).mul(0.5);
                        return ray.c.mask(obj.c).mul(cosAngle * cosAngle).add(this.trace(scene, p, depth - 1));
                    }
                    break;
            }
        }

        if (this.plane) {
            p = this.plane.testInnerRay(ray);
            if (p) {
                let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                if (cosAngle < 0) cosAngle = 0;
                p.c = ray.c.mul(0.5);
                return ray.c.mul(Math.pow(cosAngle, 3)).add(this.trace(scene, p, depth - 1));
            }
        }

        return colors.black;
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        this.output.fillBlack();
        for (let pixel of this.camera.eachRay()) {
            this.output.setPoint(pixel.x, pixel.y, this.trace(scene, pixel.ray, 3));
        }
        this.output.updateCanvas();
    }
}

export default Raytracer;
