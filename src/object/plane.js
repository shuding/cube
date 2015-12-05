/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';
import Color, {colors} from '../core/color';

class Plane {
    /**
     * The Plane constructor
     * @param {Vector} p Origin point
     * @param {Vector} n The normal vector
     * @param c
     */
    constructor(p, n, c = colors.white) {
        this.p = p;
        this.n = n.normalize();
        this.c = c;
    }

    /**
     * Test if a ray intersect with the plane
     * @param ray
     */
    testInnerRay(ray) {
        let dot = ray.t.dot(this.n);
        if (dot > 0) {
            return null;
        }
        let len = ray.s.minus(this.p).dot(this.n);
        if (len < 0)
            return null;
        let p = ray.s.add(ray.t.mul(-len / dot));
        return new Ray(p, ray.t.add(this.n.mul(-2.0 * dot)));
        //let p = ray.t.mul(this.p.minus(ray.s).dot(this.n) / dot);
        //return new Ray(p.add(ray.s), p.minus(this.n.mul(p.dot(this.n) * 2)));
    }
}

export var planeFromScreen = function (screen) {
    return new Plane(screen[0], screen[1].minus(screen[0]).det(screen[2].minus(screen[0])).normalize());
};
export default Plane;
