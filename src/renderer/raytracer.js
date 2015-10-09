/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

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
     * @param ray
     * @returns {Color}
     */
    trace(ray) {
        // TODO
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        let genRay = this.camera.eachRay();
        let pixel  = genRay.next();

        while (!pixel.done) {
            this.output.draw(pixel.value.x, pixel.value.y, this.trace(pixel.value.ray));
        }
    }
}

export default Raytracer;
