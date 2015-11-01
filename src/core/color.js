/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Color {
    /**
     * Color constructor
     * @param {Number} r Red [0, 1]
     * @param {Number} g Green [0, 1]
     * @param {Number} b Blue [0, 1]
     * @param {Number} a Alpha [0, 1]
     */
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    mul(r) {
        return new Color(this.r * r, this.g * r, this.b * r, this.a);
    }

    add(r) {
        return new Color(this.r + r.r, this.g + r.g, this.b + r.b, this.a + r.a);
    }

    mask(r) {
        return new Color(this.r * r.r, this.g * r.g, this.b * r.b, this.a * r.a);
    }

    brightness() {
        return this.r + this.g + this.b;
    }
}

export var colors = {
    white:  new Color(1, 1, 1, 1),
    black:  new Color(0, 0, 0, 1),
    green:  new Color(0, 1, 0, 1),
    blue:   new Color(0, 0, 1, 1),
    red:    new Color(1, 0, 0, 1),
    yellow: new Color(1, 1, 0, 1),
    cyan:   new Color(0, 1, 1, 1),
    magenta:new Color(1, 0, 1, 1)
};
export default Color;
