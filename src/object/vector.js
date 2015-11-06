/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

// http://media.tojicode.com/sfjs-vectors/#1

// Cache methods
var sqrt = Math.sqrt;

//var sin = Math.sin;
//var cos = Math.cos;
// fast cos
var cos = function (x) {
    var x2 = x * x;
    var x4 = x2 * x2;
    var x6 = x4 * x2;
    var x8 = x6 * x2;
    var x10 = x8 * x2;
    return 1.0 - (1814400.0 * x2 - 151200.0 * x4 + 5040.0 * x6 - 90.0 * x8 + x10) / 3628800.0;
};

// fast sin
var sin = function(inValue) {
    // See  for graph and equations
    // https://www.desmos.com/calculator/8nkxlrmp7a
    // logic explained here : http://devmaster.net/posts/9648/fast-and-accurate-sine-cosine
    var B = 1.2732395; // 4/pi
    var C = -0.40528473; // -4 / (pi²)

    if (inValue > 0) {
        return B*inValue - C * inValue*inValue;
    }
    return B*inValue + C * inValue*inValue;
};

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
        return this;
    }

    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    minusBy(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    mul(r) {
        return new Vector(this.x * r, this.y * r, this.z * r);
    }

    mulBy(r) {
        this.x *= r;
        this.y *= r;
        this.z *= r;
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
        var y   = this.y;
        var z   = this.z;
        var _cos = Math.cos(angle);
        var _sin = Math.sin(angle);
        this.y  = y * _cos - z * _sin;
        this.z  = y * _sin + z * _cos;
        return this;
    }

    rotateByY(angle) {
        var x   = this.x;
        var z   = this.z;
        var _cos = Math.cos(angle);
        var _sin = Math.sin(angle);
        this.x  = x * _cos + z * _sin;
        this.z  = -x * _sin + z * _cos;
        return this;
    }

    rotateByZ(angle) {
        var x   = this.x;
        var y   = this.y;
        var _cos = Math.cos(angle);
        var _sin = Math.sin(angle);
        this.x  = x * _cos - y * _sin;
        this.y  = x * _sin + y * _cos;
        return this;
    }

    length() {
        // Inline code
        var x = this.x, y = this.y, z = this.z;
        return sqrt(x * x + y * y + z * z);
    }

    normal() {
        return this.clone().normalize();
    }

    normalize() {
        var x = this.x, y = this.y, z = this.z;
        var len = 1 / sqrt(x * x + y * y + z * z);
        this.x *= len;
        this.y *= len;
        this.z *= len;
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
