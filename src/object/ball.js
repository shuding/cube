/**
 * Created by shuding on 10/29/15.
 * <ds303077135@gmail.com>
 */

import Cons from '../core/constant';
import Ray from '../core/ray';
import Color, {colors} from '../core/color';

// Cache

var sqrt = Math.sqrt;

class Ball {
    /**
     * Constructor of the Ball class
     * @param {Vector} o the origin point
     * @param {Number} r the radius
     * @param {Color} c
     * @param {Number} ref Reflection
     * @param {Number} dif Diffuse
     */
    constructor(o, r, c = colors.white, ref = 0.5, dif = 0.2) {
        this.o          = o;
        this.r          = r;
        this.c          = c;
        this.reflection = ref;
        this.diffuse    = dif;
    }

    testInnerRay(ray) {
        let os   = this.o.minus(ray.s);
        let osn  = os.normal();
        let rayT = ray.t.normal();
        let sin  = osn.det(rayT).length();

        let dis = sin * os.length();
        if (dis > this.r) {
            if (dis < this.r + Cons.DELTA_EDGE) {
                return Cons.FLAG_EDGE;
            }
            return null;
        }

        // ray.t is already normalized here!
        let oscos = os.dot(rayT);

        if (oscos < 0) {
            return null;
        }

        let delta = sqrt(this.r * this.r - dis * dis);
        let x     = rayT.mul(oscos - delta);
        let p     = ray.s.add(x);
        let r     = os.minus(x).normalize();
        let d     = x.add(r.mulBy(-2 * x.dot(r)));

        return new Ray(p, d);
    }
}

export default Ball;
