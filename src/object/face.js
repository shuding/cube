/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';
import Color, {colors} from '../core/color';

class Face {
    /**
     * Constructor of the Face class
     * @param {Vector} a
     * @param {Vector} b
     * @param {Vector} c
     * @param {Color} co
     */
    constructor(a, b, c, co = colors.white) {
        this._a = a;
        this._b = b;
        this._c = c;

        this.c = co;

        // Normal vector
        this.n = b.minus(a).det(c.minus(a)).normalize();
    }

    /**
     * Test if a ray intersect with the face
     * @param ray
     */

    testInnerRay(ray) {
        let dot = ray.t.dot(this.n);
        if (dot > 0) {
            return null;
        }
        let len = ray.s.minus(this._a).dot(this.n);
        if (len < 0)
            return null;
        let p = ray.s.add(ray.t.mul(-len / dot));
        if (this._b.minus(this._a).det(p.minus(this._a)).dot(this.n) < 0)
            return null;
        if (this._c.minus(this._b).det(p.minus(this._b)).dot(this.n) < 0)
            return null;
        if (this._a.minus(this._c).det(p.minus(this._c)).dot(this.n) < 0)
            return null;
        return new Ray(p, ray.t.add(this.n.mul(-2.0 * dot)));
        /*let p = ray.t.mul(this._a.minus(ray.s).dot(this.n) / dot);

        var u = this._b.minus(this._a);
        var v = this._c.minus(this._a);
        var w = p.minus(this._a);

        var uv = u.dot(v);
        var uu = u.dot(u);
        var vv = v.dot(v);
        var wu = w.dot(u);
        var wv = w.dot(v);

        if (wv * (uv - uu) + wu * (uv - vv) < (uv * uv - uu * vv)) {
            return new Ray(p.add(ray.s), p.minus(this.n.mul(p.dot(this.n) * 2)));
        }
        */
        //return null;

        /*
        let a = this._a.minus(ray.s);
        let b = this._b.minus(ray.s);
        if (a.det(b).dot(ray.t) > 0) {
            return null;
        }
        let c = this._c.minus(ray.s);
        if (b.det(c).dot(ray.t) > 0) {
            return null;
        }
        if (c.det(a).dot(ray.t) > 0) {
            return null;
        }
        // Intersect point
        let p = ray.t.mul(this._a.minus(ray.s).dot(this.n) / ray.t.dot(this.n)).addBy(ray.s);
        return new Ray(p, p.minusBy(this.n.mul(p.dot(this.n) * 2)));
        */
    }

    projection() {
        return new Face(
            this._a.projection(...arguments),
            this._b.projection(...arguments),
            this._c.projection(...arguments)
        );
    }
}

export default Face;
