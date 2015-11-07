/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Cons from '../core/constant';
import Ray from '../core/ray';
import Color, {colors} from '../core/color';
import RandomCoor from '../utility/pseudoRandom';
import GaussianPattern from '../utility/gaussianPattern';

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
        this.width = camera.width;
        this.height = camera.height;
        this.screen_size = this.width * this.height;
        this.rand_coor = new RandomCoor(camera.width, camera.height);
        this.time_stamp_arr = new Array();
        this.stage = new Array();
        this.acc = new Array();
        for (var y = 0; y < this.height; ++y) {
            this.time_stamp_arr[y] = new Array();
            this.stage[y] = new Array();
            this.acc[y] = new Array();
            for (var x = 0; x < this.width; ++x) {
                this.time_stamp_arr[y][x] = 0;
                this.stage[y][x] = 4;
                this.acc[y][x] = 0;
            }
        }
        this.rlimit = [4800, 2400, 320, 80];
        this.slimit = [2, 2, 1, 4];
        this.sigmas = [1, 1, 4, 8];
        this.rs = [1, 1, 4, 8];
        this.time_stamp = 1;
        this.rcount = 0;
        this.scount = 0;
        this.sigma = 20;
        this.cur_stage = 1;
        this.r = 24;
        this.pattern = new GaussianPattern(this.r, this.sigma);
    }

    /**
     * Add point light source
     * @param {Ball} b
     */
    addLight(b) {
        this.lights.push(b);
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
            let ret = colors.black.clone();

            // Reflection
            minP.c = ray.c.mask(minObj.c);
            /*
            for (let i = 0; i < Cons.NUMBER_MONTE_CARLO; ++i) {
                let randRay = minP.clone();
                randRay.t.rotateBy(random() * 0.1, random() * 0.1, random() * 0.1);
                ret.addBy(this.trace(scene, randRay, depth - 1, false));
            }
            ret.mulBy(0.25 / Cons.NUMBER_MONTE_CARLO);
            */
            ret.addBy(this.trace(scene, minP, depth - 1, true).mulBy(0.5));

            // Shadow
            for (let i = 0; i < this.lights.length; ++i) {
                let light = this.lights[i];
                let rayToLight = new Ray(minP.s.clone(), light.o.clone());
                let shadow     = false;
                let edge       = false;
                for (let obj of scene.eachObject()) {
                    if (obj !== minObj) {
                        let test = obj.testInnerRay(rayToLight);
                        if (test != null && test != Cons.FLAG_EDGE) {
                            shadow = true;
                            break;
                        } else if (test == Cons.FLAG_EDGE) {
                            edge = true;
                        }
                    }
                }
                let cosAngle = 0;
                if (!shadow) {
                    cosAngle = light.o.minus(minP.s).normalize().dot(minP.t.normal());
                    if (cosAngle < 0) {
                        cosAngle = 0;
                    }
                    ret.addBy(minObj.c.mul(cosAngle * cosAngle).mask(light.c).mask(ray.c));
                    //ret = ret.add(minObj.c.mul(pow(cosAngle, 10)));
                }
                if (edge) {
                    /*
                    if (sample) {
                        // Samples
                        let c = colors.black.clone();
                        let rayY = minP.clone();
                        // Top-left
                        for (let j = 0; j + 1 < Cons.NUMBER_SAMPLE; ++j) {
                            rayY.t.minusBy(this.camera.widthIncPerSubPixel);
                            rayY.t.minusBy(this.camera.heightIncPerSubPixel);
                        }
                        for (let j = 0; j < Cons.NUMBER_SAMPLE; ++j) {
                            let randRay = rayY.clone();
                            for (let k = 0; k < Cons.NUMBER_SAMPLE; ++k) {
                                c.addBy(this.trace(scene, randRay, depth - 1, false));
                                randRay.t.addBy(this.camera.widthIncPerSubPixel);
                                randRay.t.addBy(this.camera.widthIncPerSubPixel);
                            }
                            rayY.t.addBy(this.camera.heightIncPerSubPixel);
                            rayY.t.addBy(this.camera.heightIncPerSubPixel);
                        }
                        c.mulBy(1.0 / (Cons.NUMBER_SAMPLE * Cons.NUMBER_SAMPLE)).mask(ray.c);
                        ret.addBy(c);
                    }*/
                }
            }

            return ret;
        } else {
            for (let i = 0; i < this.lights.length; ++i) {
                let light = this.lights[i];
                p = light.testInnerRay(ray);
                if (p !== null && p !== Cons.FLAG_EDGE) {
                    return colors.green;
                    //return light.c.mask(ray.c).toMax();
                }
            }
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
    /*render(scene, x0 = 0, y0 = 0, stepX = 1, stepY = 1) {
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
    }*/

    sceneChange() {
        this.time_stamp ++;
        this.sigma = this.sigmas[3];
        this.r = this.rs[3];
        this.cur_stage = 3;
        this.scount = 0;
        this.pattern = new GaussianPattern(this.r, this.sigma);
        for (var y = 0; y < this.height; ++y)
            for (var x = 0; x < this.width; ++x) {
                let c = this.output.getPoint(x, y);
                c.mulBy(0.95);
                this.acc[y][x] = 0.95;
                this.output.setPoint(x, y, c);
            }
        this.output.updateCanvas();
    }

    render() {
        let output = this.output;
        while (true) {
            let coor = this.rand_coor.getNext();
            let x = coor[0];
            let y = coor[1];
            let ray = this.camera.rayAt(x, y);
            let c = this.trace(scene, ray, Cons.DEEP);
            if (this.cur_stage == 1) {
                this.output.setPoint(x, y, c);
            } else {
                for (var dx = -this.r + 1; dx < this.r; ++dx)
                    for (var dy = -this.r + 1; dy < this.r; ++dy) {
                        let nx = x + dx;
                        let ny = y + dy;
                        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height)
                            continue;
                        if (dx == 0 && dy == 0) {
                            this.output.setPoint(x, y, c);
                            this.stage[ny][nx] = 0;
                            this.time_stamp_arr[ny][nx] = this.time_stamp;
                        } else {
                            if (this.time_stamp_arr[ny][nx] < this.time_stamp) {
                                this.stage[ny][nx] = this.cur_stage;
                                this.time_stamp_arr[ny][nx] = this.time_stamp;
                                this.acc[ny][nx] *= 0.8;
                            }
                            if (this.stage[ny][nx] == 0)
                                continue;
                            let co = this.output.getPoint(nx, ny);
                            let rn = this.pattern.pat[dx][dy];
                            let cn = c.mul(rn);
                            rn = Math.pow(rn, 5);
                            while (this.stage[ny][nx] > this.cur_stage) {
                                this.stage[ny][nx] --;
                            }
                            this.acc[ny][nx] += rn;
                            rn /= this.acc[ny][nx];
                            cn.mulBy(rn);
                            co.mulBy(1.0 - rn);
                            cn.addBy(co);
                            this.output.setPoint(nx, ny, cn);
                        }
                    }
            }
            this.rcount ++;
            this.scount ++;
            if (this.rcount % this.rlimit[this.cur_stage] == 0) {
                output.updateCanvas();
                if (this.scount * this.sigma * this.sigma > this.slimit[this.cur_stage] * this.screen_size && this.cur_stage > 1) {
                    this.scount = 0;
                    this.cur_stage--;
                    this.sigma = this.sigmas[this.cur_stage];
                    this.r = this.rs[this.cur_stage];
                    this.pattern = new GaussianPattern(this.r, this.sigma);
                }
                break;
            }
        }
    }
}

export default Raytracer;
