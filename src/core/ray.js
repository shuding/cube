/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import Color, {colors} from './color';

class Ray {
    /**
     * Constructor of the Ray class
     * @param {Vector} s  start point
     * @param {Vector} t the direction vector
     * @param {Color} c color of the ray source
     */
    constructor(s, t, c = colors.white) {
        this.s = s;
        this.t = t;
        this.c = c;
    }

    clone() {
        return new Ray(this.s.clone(), this.t.clone(), this.c.clone());
    }
}

export default Ray;
