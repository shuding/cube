/**
 * Created by shuding on 10/16/15.
 * <ds303077135@gmail.com>
 */

import Ray from '../core/ray';
import Color, {colors} from '../core/color';

class Face4 {
    /**
     * Constructor of the Face4 class
     * @param {Vector} a
     * @param {Vector} b
     * @param {Vector} c
     * @param {Vector} d
     */
    constructor(a, b, c, d, co = colors.white, refl = 0.5, diff= 0.2) {
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
        this.n = b.minus(a).det(d.minus(a)).normalize();
        this.c = co;
        this.reflection = refl;
        this.diffuse = diff;
    }

    projection() {
        return new Face4(
            this._a.projection(...arguments),
            this._b.projection(...arguments),
            this._c.projection(...arguments),
            this._d.projection(...arguments),
            this.c
        );
    }

    testInnerRay(ray) {
        let dot = ray.t.dot(this.n);
        if (dot >= 0) {
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
        if (this._d.minus(this._c).det(p.minus(this._c)).dot(this.n) < 0)
            return null;
        if (this._a.minus(this._d).det(p.minus(this._d)).dot(this.n) < 0)
            return null;
        return new Ray(p, ray.t.add(this.n.mul(-2.0 * dot)));
    }
}

export default Face4;
