/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';

class Plane {
    /**
     * The Plane constructor
     * @param {Vector} p Origin point
     * @param {Vector} n The normal vector
     */
    constructor(p, n) {
        this.p = p;
        this.n = n;
    }

    /**
     * Test if a ray intersect with the plane
     * @param ray
     */
    testInnerRay(ray) {
        let p = ray.t.mul(this.p.minus(ray.s).dot(this.n) / ray.t.dot(this.n)).addBy(ray.s);
        return new Ray(p, p.minusBy(this.n.mul(p.dot(this.n) * 2)));
    }
}

export var planeFromScreen = function (screen) {
    return new Plane(screen[0], screen[1].minus(screen[0]).det(screen[2].minus(screen[0])).normalize());
};
export default Plane;
