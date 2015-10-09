/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Color {
    constructor (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

export var white = new Color(255, 255, 255);
export var black = new Color(0, 0, 0);
export default Color;
