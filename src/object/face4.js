/**
 * Created by shuding on 10/16/15.
 * <ds303077135@gmail.com>
 */

class Face4 {
    /**
     * Constructor of the Face4 class
     * @param {Vector} a
     * @param {Vector} b
     * @param {Vector} c
     * @param {Vector} d
     */
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    projection() {
        return new Face4(
            this.a.projection(...arguments),
            this.b.projection(...arguments),
            this.c.projection(...arguments),
            this.d.projection(...arguments)
        );
    }
}

export default Face4;
