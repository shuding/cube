/**
 * Created by shuding on 10/15/15.
 * <ds303077135@gmail.com>
 */

import Camera from '../core/camera';

import {planeFromScreen} from '../object/plane';
import Line from '../object/line';
import Vector from '../object/vector';

import Bresenham from '../drawer/line';

import {colors} from '../core/color';

/**
 * Mapper is a renderer which has no eye origin position, or says
 * it has a infinite perspective.
 */
class Mapper {
    /**
     * Constructor of the Mapper class
     * @param {Camera} camera Camera class from core/camera
     * @param {Output} output Output class from interface/index
     */
    constructor(camera, output) {
        this.camera = camera;
        this.output = output;
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        var screenPlane = planeFromScreen(this.camera.screen);
        for (let obj of scene.eachObject()) {
            let objProject = obj.projection(screenPlane);
            switch (objProject.constructor.name) {
                case 'Line':
                    let bresenham = new Bresenham(this.output);
                    bresenham.draw(objProject.a.x, objProject.a.y, objProject.b.x, objProject.b.y, colors.black);
                    break;
            }
        }
        this.output.updateCanvas();
    }
}

export var mapperFromSize = function (width, height, output) {
    let camera = new Camera(
        new Vector(0, 0, 0),
        [
            new Vector(0, height, 0),
            new Vector(width, height, 0),
            new Vector(0, -height, 0),
            new Vector(width, -height, 0)
        ]
    );
    return new Mapper(camera, output);
};

export default Mapper;
