/**
 * Created by shuding on 10/15/15.
 * <ds303077135@gmail.com>
 */

import Camera from '../core/camera';

import {planeFromScreen} from '../object/plane';
import Line from '../object/line';
import Vector from '../object/vector';

import Bresenham from '../drawer/line';
import MarkFiller from '../drawer/polygon';

import {colors} from '../core/color';

function drawProjectLine(bresenham, A, B, x, y) {
    bresenham.draw(A.projectionLength(x), A.projectionLength(y), B.projectionLength(x), B.projectionLength(y), colors.black);
}

function drawProjectFace(markfiller, coors, x, y) {
    let X = [], Y = [];
    coors.forEach(coor => {
        X.push(coor.projectionLength(x));
        Y.push(coor.projectionLength(y));
    });
    markfiller.draw(X, Y);
    markfiller.drawBorder(X, Y);
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
        let origin      = this.camera.screen[2];
        let x           = this.camera.screen[1].minus(this.camera.screen[0]);
        let y           = this.camera.screen[0].minus(this.camera.screen[2]);
        let z           = this.camera.screen[2].add(x.mul(.5)).addBy(y.mul(.5)).minusBy(this.camera.eye);

        let bresenham  = new Bresenham(this.output);
        let markfiller = new MarkFiller(this.output);
        markfiller.setColor(colors.yellow, colors.black);

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
                    drawProjectFace(markfiller, [coorA, coorB, coorC, coorD], x, y);
                    break;
                case 'Cuboid':
                    coorA     = objProject.a.a.minus(origin);
                    coorB     = objProject.a.b.minus(origin);
                    coorC     = objProject.a.c.minus(origin);
                    coorD     = objProject.a.d.minus(origin);
                    coorE     = objProject.b.a.minus(origin);
                    coorF     = objProject.b.b.minus(origin);
                    coorG     = objProject.b.c.minus(origin);
                    coorH     = objProject.b.d.minus(origin);

                    // Sort by z-index
                    let faces = [
                        [coorA, coorB, coorC, coorD],
                        [coorE, coorF, coorG, coorH],
                        [coorA, coorB, coorF, coorE],
                        [coorB, coorC, coorG, coorF],
                        [coorC, coorD, coorH, coorG],
                        [coorD, coorA, coorE, coorH]
                    ];
                    faces = faces.map(face => {
                        face.zIndex = Math.max(
                            face[0].projectionLength(z),
                            face[1].projectionLength(z),
                            face[2].projectionLength(z),
                            face[3].projectionLength(z)
                        );
                        return face;
                    });
                    faces.sort((a, b) => {
                        return -a.zIndex + b.zIndex;
                    });

                    drawProjectFace(markfiller, faces[0], x, y);
                    drawProjectFace(markfiller, faces[1], x, y);
                    drawProjectFace(markfiller, faces[2], x, y);
                    drawProjectFace(markfiller, faces[3], x, y);
                    drawProjectFace(markfiller, faces[4], x, y);
                    drawProjectFace(markfiller, faces[5], x, y);
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
    let camera = new Camera(new Vector(0, 0, 0), [new Vector(0, height, 0), new Vector(width, height, 0), new Vector(0, -height, 0), new Vector(width, -height, 0)]);
    return new Mapper(camera, output);
};

export default Mapper;
