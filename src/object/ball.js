/**
 * Created by shuding on 10/29/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';

// Cache

var sqrt = Math.sqrt;

class Ball {
    /**
     * Constructor of the Ball class
     * @param {Vector} o the origin point
     * @param {Number} r the radius
     */
    constructor(o, r) {
        this.o = o;
        this.r = r;
    }

    testInnerRay (ray) {
        let os = this.o.minus(ray.s);
        let osn = os.normal();
        let sin = osn.det(ray.t.normalize()).length();

        let dis = sin * os.length();
        if (dis > this.r)
            return null;

        // ray.t is already normalized here!
        let oscos = os.dot(ray.t);
        let delta = sqrt(this.r * this.r - dis * dis);
        let x = ray.t.mul(oscos - delta);
        let p = ray.s.add(x);
        let r = os.minus(x).normalize();
        let d = x.add(r.mulBy(-2 * x.dot(r)));

        return new Ray(p, d);
    }
}

export default Ball;
