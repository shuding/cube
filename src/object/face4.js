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
    constructor(a, b, c, d, co = colors.white) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.n = b.minus(a).det(d.minus(a)).normalize();
        this.co = co;
    }

    projection() {
        return new Face4(
            this.a.projection(...arguments),
            this.b.projection(...arguments),
            this.c.projection(...arguments),
            this.d.projection(...arguments),
            this.co
        );
    }

    testInnerRay(ray) {
        let dot = ray.t.dot(this.n);
        if (dot > 0) {
            return null;
        }
        let len = ray.s.minus(this.a).dot(this.n);
        if (len < 0)
            return null;
        let p = ray.s.add(ray.t.mul(-len / dot));
        if (this.b.minus(this.a).det(p.minus(this.a)).dot(this.n) < 0)
            return null;
        if (this.c.minus(this.b).det(p.minus(this.b)).dot(this.n) < 0)
            return null;
        if (this.d.minus(this.c).det(p.minus(this.c)).dot(this.n) < 0)
            return null;
        if (this.a.minus(this.d).det(p.minus(this.d)).dot(this.n) < 0)
            return null;
        return new Ray(p, ray.t.add(this.n.mul(-2.0 * dot)));
    }
}

export default Face4;
