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

    /**
     * Dot: |a||b|cos
     * @param v
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Det: (signed)|a||b|sin
     * @param v
     */
    det(v) {
        return new Vector(this.y * v.z - this.z * v.y, -this.x * v.z + this.z * v.x, this.x * v.y - this.y * v.x);
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    addBy(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        delete this.len;
        return this;
    }

    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    minusBy(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        delete this.len;
        return this;
    }

    mul(r) {
        return new Vector(this.x * r, this.y * r, this.z * r);
    }

    mulBy(r) {
        this.x *= r;
        this.y *= r;
        this.z *= r;
        delete this.len;
        return this;
    }

    rotateBy(x, y, z) {
        if (x !== 0) {
            this.rotateByX(x);
        }
        if (y !== 0) {
            this.rotateByY(y);
        }
        if (z !== 0) {
            this.rotateByZ(z);
        }
        return this;
    }

    rotateByX(angle) {
        let y   = this.y;
        let z   = this.z;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this.y  = y * cos - z * sin;
        this.z  = y * sin + z * cos;
        return this;
    }

    rotateByY(angle) {
        let x   = this.x;
        let z   = this.z;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this.x  = x * cos + z * sin;
        this.z  = -x * sin + z * cos;
        return this;
    }

    rotateByZ(angle) {
        let x   = this.x;
        let y   = this.y;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this.x  = x * cos - y * sin;
        this.y  = x * sin + y * cos;
        return this;
    }

    length() {
        if (typeof this.len === 'undefined') {
            this.len = sqrt(this.dot(this));
        }
        return this.len;
    }

    normal() {
        return this.clone().normalize();
    }

    normalize() {
        if (this.len !== 1) {
            this.mulBy(1 / this.length());
            this.len = 1;
        }
        return this;
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    /**
     * Get projection
     * @param {Plane} p
     */
    projection(p) {
        let v      = this.minus(p.p);
        let len    = v.dot(p.n);
        let vDelta = p.n.mul(len);
        let ret = this.minus(vDelta);
        ret.z = len; // projection distance
        return ret;
    }

    projectionLength(v) {
        let len = this.dot(v);
        return len / v.length();
    }
}

export default Vector;
