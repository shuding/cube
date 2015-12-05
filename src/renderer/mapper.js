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

        let screenPlane = planeFromScreen(this.camera._screen_);
        let origin      = this.camera._screen_[2];
        let x           = this.camera._screen_[1].minus(this.camera._screen_[0]);
        let y           = this.camera._screen_[0].minus(this.camera._screen_[2]);
        let z           = this.camera._screen_[2].add(x.mul(.5)).addBy(y.mul(.5)).minusBy(this.camera.eye);

        let bresenham  = new Bresenham(this.output);
        let markfiller = new MarkFiller(this.output);
        markfiller.setColor(colors.yellow, colors.black);

        for (let obj of scene.eachObject()) {
            let objProject = obj;//obj.projection(screenPlane);
            switch (objProject.constructor.name) {
                case 'Line':
                    coorA = objProject.a.minus(origin);
                    coorB = objProject.b.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    break;
                case 'Face':
                    coorA = objProject._a.minus(origin);
                    coorB = objProject._b.minus(origin);
                    coorC = objProject._c.minus(origin);
                    drawProjectLine(bresenham, coorA, coorB, x, y);
                    drawProjectLine(bresenham, coorA, coorC, x, y);
                    drawProjectLine(bresenham, coorB, coorC, x, y);
                    break;
                case 'Face4':
                    coorA = objProject._a.minus(origin);
                    coorB = objProject._b.minus(origin);
                    coorC = objProject._c.minus(origin);
                    coorD = objProject._d.minus(origin);
                    drawProjectFace(markfiller, [coorA, coorB, coorC, coorD], x, y);
                    break;
                case 'Cuboid':
                    coorA     = objProject.a._a.minus(origin);
                    coorB     = objProject.a._b.minus(origin);
                    coorC     = objProject.a._c.minus(origin);
                    coorD     = objProject.a._d.minus(origin);
                    coorE     = objProject.b._a.minus(origin);
                    coorF     = objProject.b._b.minus(origin);
                    coorG     = objProject.b._c.minus(origin);
                    coorH     = objProject.b._d.minus(origin);

                    // Sort by z-index
                    let faces = [
                        [coorA, coorB, coorC, coorD],
                        [coorE, coorF, coorG, coorH],
                        [coorA, coorB, coorF, coorE],
                        [coorB, coorC, coorG, coorF],
                        [coorC, coorD, coorH, coorG],
                        [coorD, coorA, coorE, coorH]
                    ];

                    faces[0].color = colors.red;
                    faces[1].color = colors.cyan;
                    faces[2].color = colors.blue;
                    faces[3].color = colors.green;
                    faces[4].color = colors.yellow;
                    faces[5].color = colors.magenta;

                    faces = faces.map(face => {
                        face.zIndex = Math.min(
                            face[0].projectionLength(z),
                            face[1].projectionLength(z),
                            face[2].projectionLength(z),
                            face[3].projectionLength(z)
                        );
                        return face;
                    });
                    faces = faces.sort((a, b) => {
                        return b.zIndex - a.zIndex;
                    });

                    for (var i = 0; i < 6; ++i) {
                        markfiller.setColor(faces[i].color, colors.black);
                        drawProjectFace(markfiller, faces[i], x, y);
                    }
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
