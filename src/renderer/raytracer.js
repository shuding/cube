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
     * @returns {Color}
     */
    trace(scene, ray) {
        // TODO
        for (let obj of scene.eachObject()) {
            switch (obj.constructor.name) {
                case 'Face':
                    let p = obj.testInnerRay(ray);
                    if (p) {
                        let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
                        return colors.white.mul(cosAngle * cosAngle * cosAngle);
                    }
                    break;
            }
        }
        if (this.plane) {
            let p        = this.plane.testInnerRay(ray);
            let cosAngle = this.light.p.minus(p.s).normalize().dot(p.t.normalize());
            return colors.white.mul(cosAngle * cosAngle * cosAngle);
        }
        return colors.black;
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        for (let pixel of this.camera.eachRay()) {
            this.output.setPoint(pixel.x, pixel.y, this.trace(scene, pixel.ray));
        }
        this.output.updateCanvas();
    }
}

export default Raytracer;
