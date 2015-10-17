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
                    if (obj.testInnerRay(ray)) {
                        return colors.white;
                    }
                    break;
            }
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
