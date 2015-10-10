/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Color {
    constructor (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export var colors = {
    white : new Color(255, 255, 255, 255),
    black : new Color(0, 0, 0, 255)
};
export default Color;
