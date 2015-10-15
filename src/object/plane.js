/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

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
}

export var planeFromScreen = function (screen) {
    return new Plane(screen[0], screen[1].minus(screen[0]).det(screen[2].minus(screen[0])).normalize());
};
export default Plane;
