/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

class Line {
    /**
     * Constructor of the Line class
     * @param {Vector} a
     * @param {Vector} b
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    projection() {
        return new Line(
            this.a.projection(...arguments),
            this.b.projection(...arguments)
        );
    }
}

export default Line;
