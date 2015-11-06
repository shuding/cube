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
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    mul(r) {
        return new Color(this.r * r, this.g * r, this.b * r, this.a);
    }

    mulBy(r) {
        this.r *= r;
        this.g *= r;
        this.b *= r;
        return this;
    }

    add(r) {
        return new Color(this.r + r.r, this.g + r.g, this.b + r.b, this.a);
    }

    addBy(r) {
        this.r += r.r;
        this.g += r.g;
        this.b += r.b;
        return this;
    }

    mask(r) {
        return new Color(this.r * r.r, this.g * r.g, this.b * r.b, this.a);
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    brightness() {
        return this.r + this.g + this.b;
    }

    toMax() {
        var m = this.r > this.g ? this.r : this.g;
        m = this.b > m ? this.b : m;
        if (m > 0) m = 1 / m;
        this.r *= m;
        this.g *= m;
        this.b *= m;
        return this;
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
