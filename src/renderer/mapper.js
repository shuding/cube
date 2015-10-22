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

function drawProjectLine(bresenham, A, B, x, y) {
    bresenham.draw(
        A.projectionLength(x),
        A.projectionLength(y),
        B.projectionLength(x),
        B.projectionLength(y),
        colors.black
    );
}

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

    rotate(x, y, z) {
        this.camera.rotate(x, y, z);
    }

    /**
     * Render particular scene with camera to output
     * @param {Scene} scene
     */
    render(scene) {
        var coorA, coorB, coorC, coorD, coorE, coorF, coorG, coorH;

        let screenPlane = planeFromScreen(this.camera.screen);
        let origin = this.camera.screen[2];
        let x = this.camera.screen[1].minus(this.camera.screen[0]);
        let y = this.camera.screen[0].minus(this.camera.screen[2]);

        let bresenham = new Bresenham(this.output);

        for (let obj of scene.eachObject()) {
            let objProject = obj.projection(screenPlane);
            switch (objProject.constructor.name) {
                case 'Line':
                    coorA = objProject.a.minus(origin);
                    coorB = objProject.b.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    break;
                case 'Face':
                    coorA = objProject.a.minus(origin);
                    coorB = objProject.b.minus(origin);
                    coorC = objProject.c.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    drawProjectLine(bresenham, coorA, coorC, x, y);
                    drawProjectLine(bresenham, coorB, coorC, x, y);
                    break;
                case 'Face4':
                    coorA = objProject.a.minus(origin);
                    coorB = objProject.b.minus(origin);
                    coorC = objProject.c.minus(origin);
                    coorD = objProject.d.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    drawProjectLine(bresenham, coorB, coorC, x, y);
                    drawProjectLine(bresenham, coorC, coorD, x, y);
                    drawProjectLine(bresenham, coorD, coorA, x, y);
                    break;
                case 'Cuboid':
                    coorA = objProject.a.a.minus(origin);
                    coorB = objProject.a.b.minus(origin);
                    coorC = objProject.a.c.minus(origin);
                    coorD = objProject.a.d.minus(origin);
                    coorE = objProject.b.a.minus(origin);
                    coorF = objProject.b.b.minus(origin);
                    coorG = objProject.b.c.minus(origin);
                    coorH = objProject.b.d.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    drawProjectLine(bresenham, coorB, coorC, x, y);
                    drawProjectLine(bresenham, coorC, coorD, x, y);
                    drawProjectLine(bresenham, coorD, coorA, x, y);
                    drawProjectLine(bresenham, coorE, coorF, x, y);
                    drawProjectLine(bresenham, coorF, coorG, x, y);
                    drawProjectLine(bresenham, coorG, coorH, x, y);
                    drawProjectLine(bresenham, coorH, coorE, x, y);
                    drawProjectLine(bresenham, coorE, coorA, x, y);
                    drawProjectLine(bresenham, coorF, coorB, x, y);
                    drawProjectLine(bresenham, coorG, coorC, x, y);
                    drawProjectLine(bresenham, coorH, coorD, x, y);
                    break;
            }
        }
        this.output.updateCanvas();
    }

    clear() {
        this.output.clearCanvas();
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
