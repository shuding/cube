/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

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
