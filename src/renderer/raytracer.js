/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

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
        if (depth <= 0)
            return colors.black;
        // TODO
        let p;
        for (let obj of scene.eachObject()) {
            switch (obj.constructor.name) {
                case 'Face':
                    p = obj.testInnerRay(ray);
                    if (p) {
                        let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                        if (cosAngle < 0) cosAngle = 0;
                        return colors.white.mul(cosAngle * cosAngle);
                    }
                    break;
                case 'Ball':
                    p = obj.testInnerRay(ray);
                    if (p) {
                        let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                        if (cosAngle < 0) cosAngle = 0;
                        let c = this.trace(scene, p, depth - 1);
                        return colors.white.mul(cosAngle * cosAngle).add(c.mul(0.5));
                    }
                    break;
            }
        }

        if (this.plane) {
            p = this.plane.testInnerRay(ray);
            if (p) {
                let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                //if (cosAngle < 0) cosAngle = 0;
                let c = this.trace(scene, p, depth - 1);
                return colors.white.mul(Math.pow(cosAngle, 2)).add(c);
            }
            //return colors.red.mul(cosAngle);
            //return colors.red;
        }

        return colors.black;
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        for (let pixel of this.camera.eachRay()) {
            this.output.setPoint(pixel.x, pixel.y, this.trace(scene, pixel.ray, 2));
        }
        this.output.updateCanvas();
    }
}

export default Raytracer;
