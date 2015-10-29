/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Color {
    /**
     * Color constructor
     * @param {Number} r Red [0, 255]
     * @param {Number} g Green [0, 255]
     * @param {Number} b Blue [0, 255]
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
}

export var colors = {
    white:  new Color(255, 255, 255, 1),
    black:  new Color(0, 0, 0, 1),
    green:  new Color(0, 255, 0, 1),
    blue:   new Color(0, 0, 255, 1),
    red:    new Color(255, 0, 0, 1),
    yellow: new Color(255, 255, 0, 1),
    cyan:   new Color(0, 255, 255, 1)
};
export default Color;
