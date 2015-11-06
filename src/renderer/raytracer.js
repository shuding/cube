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
        this.time_stamp = 1;
        this.rcount = 0;
        this.scount = 0;
        this.sigma = 16;
        this.cur_stage = 4;
        this.r = 24;
        this.rlimit = [1280, 640, 320, 160, 40];
        this.pattern = new GaussianPattern(this.r, this.sigma);
    }

    /**
     * Add point light source
     * @param {Vector} p Position
     * @param {Color} c Color
     */
    addLight(p, c) {
        this.lights.push({
            p: p,
            c: c
        });
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
            let ret;

            // Reflection
            minP.c = ray.c.mask(minObj.c);
            ret    = this.trace(scene, minP, depth - 1, false).mulBy(0.5);

            // Shadow
            for (let i = 0; i < this.lights.length; ++i) {
                let light = this.lights[i];
                let rayToLight = new Ray(minP.s.clone(), light.p.clone());
                let shadow     = false;
                for (let obj of scene.eachObject()) {
                    if (obj !== minObj) {
                        let test = obj.testInnerRay(rayToLight);
                        if (test != null && test != Cons.FLAG_EDGE) {
                            shadow = true;
                            break;
                        }
                    }
                }
                let cosAngle = 0;
                if (!shadow) {
                    cosAngle = light.p.minus(minP.s).normalize().dot(minP.t.normal());
                    if (cosAngle < 0) {
                        cosAngle = 0;
                    }
                    ret.addBy(minObj.c.mul(cosAngle * cosAngle).mask(light.c).mask(ray.c));
                    //ret = ret.add(minObj.c.mul(pow(cosAngle, 10)));
                }
            }

            return ret;
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

    render() {
        let output = this.output;
        while (true) {
            if (this.rcount >= this.screen_size)
                break;
            let coor = this.rand_coor.getNext();
            let x = coor[0];
            let y = coor[1];
            let ray = this.camera.rayAt(x, y);
            let c = this.trace(scene, ray, Cons.DEEP);
            for (var dx = -this.r + 1; dx < this.r; ++dx)
                for (var dy = -this.r + 1; dy < this.r; ++dy) {
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height)
                        continue;
                    if (this.stage[ny][nx] == 0)
                        continue;
                    if (dx == 0 && dy == 0) {
                        this.output.setPoint(x, y, c);
                        this.stage[ny][nx] = 0;
                        this.time_stamp_arr[ny][nx] = this.time_stamp;
                    } else if (this.time_stamp_arr[ny][nx] < this.time_stamp) {
                        let cn = c.mul(this.pattern.pat[dx][dy]);
                        this.stage[ny][nx] = this.cur_stage;
                        this.time_stamp_arr[ny][nx] = this.time_stamp;
                        this.acc[ny][nx] = this.pattern.pat[dx][dy];
                        this.output.setPoint(nx, ny, cn);
                    } else {
                        let co = this.output.getPoint(nx, ny);
                        let rn = this.pattern.pat[dx][dy];
                        let cn = c.mul(rn);
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
            this.rcount ++;
            this.scount ++;
            if (this.rcount % this.rlimit[this.cur_stage] == 0) {
                output.updateCanvas();
                if (this.scount * this.sigma * this.sigma > this.screen_size && this.cur_stage > 1) {
                    this.scount = 0;
                    this.sigma /= 2;
                    this.r /= 2;
                    this.pattern = new GaussianPattern(this.r, this.sigma);
                    this.cur_stage--;
                }
                break;
            }
        }
    }
}

export default Raytracer;
