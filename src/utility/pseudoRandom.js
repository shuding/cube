/**
 * Created by ziyang on 15/11/6.
 */

class RandomCoor {
    constructor (w, h) {
        this.w = w
        this.h = h;
        this.s = w * h
        this.n = 0;
        this.coor = new Array();
        for (var y = 0; y < h; ++y)
            for (var x = 0; x < w; ++x)
                this.coor[this.n++] = [x, y];
        this.n = 0;
    }

    getNext() {
        this.n--;
        if (this.n < 0)
            this.n = this.h * this.w - 1;
        let id = ~~(Math.random() * this.n);
        let t = this.coor[this.n];
        this.coor[this.n] = this.coor[id];
        this.coor[id] = t;
        return this.coor[this.n];
    }
}

export default RandomCoor;