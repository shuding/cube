/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';

class Face {
    /**
     * Constructor of the Face class
     * @param {Vector} a
     * @param {Vector} b
     * @param {Vector} c
     */
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;

        // Normal vector
        this.n = a.minus(b).det(c.minus(b)).normalize();
    }

    /**
     * Test if a ray intersect with the face
     * @param ray
     */
    testInnerRay(ray) {
        let a = this.a.minus(ray.s);
        let b = this.b.minus(ray.s);
        if (a.det(b).dot(ray.t) > 0) {
            return null;
        }
        let c = this.c.minus(ray.s);
        if (b.det(c).dot(ray.t) > 0) {
            return null;
        }
        if (c.det(a).dot(ray.t) > 0) {
            return null;
        }
        // Intersect point
        let p = ray.t.mul(this.a.minus(ray.s).dot(this.n) / ray.t.dot(this.n)).addBy(ray.s);
        return new Ray(p, p.minusBy(this.n.mul(p.dot(this.n) * 2)));
    }

    projection() {
        return new Face(
            this.a.projection(...arguments),
            this.b.projection(...arguments),
            this.c.projection(...arguments)
        );
    }
}

export default Face;
