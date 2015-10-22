/**
 * Created by shuding on 10/16/15.
 * <ds303077135@gmail.com>
 */

class Cuboid {
    /**
     * Constructor of the Cuboid class
     * @param {Face4} a
     * @param {Face4} b
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    projection() {
        return new Cuboid(
            this.a.projection(...arguments),
            this.b.projection(...arguments)
        );
    }
}

export default Cuboid;
