/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

// Cache methods
var sqrt = Math.sqrt;

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    det(v) {
        return this.y * v.z - this.z * v.y - this.x * v.z + this.z * v.x + this.x * v.y - this.y * v.x;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    addBy(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        delete this.len;
    }

    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    minusBy(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        delete this.len;
    }

    mul(r) {
        return new Vector(this.x * r, this.y * r, this.z * r);
    }

    mulBy(r) {
        this.x *= r;
        this.y *= r;
        this.z *= r;
        delete this.len;
    }

    length() {
        if (typeof this.len === 'undefined') {
            this.len = sqrt(this.dot(this));
        }
        return this.len;
    }

    normalize() {
        this.mulBy(1 / this.length());
        this.len = 1;
    }

    clone() {
        return Object.assign({}, this);
    }
}

export default Vector;
