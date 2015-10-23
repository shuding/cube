/**
 * Created by ziyang on 15/10/23.
 */

import Canvas from '../interface/canvas';
import Bresenham from './line';

class MarkFiller {
    constructor (canvas) {
        this.cvs = canvas;
        this.w = canvas.width;
        this.h = canvas.height;
        this.mark = new Array(this.h);
        for (var i = 0; i < this.h; ++i)
            this.mark[i] = new Array(this.w + 1);
    }

    setColor(acolor, bcolor) {
        this.acolor = acolor;
        this.bcolor = bcolor;
    }

    line(x0, y0, x1, y1) {
        x0 = ~~x0;
        y0 = ~~y0;
        x1 = ~~x1;
        y1 = ~~y1;

        var dx = x1 - x0;
        var dy = y1 - y0;
        var x  = x0;
        var y  = y0;
        var D;

        if (dx > 0 && dy >= 0) {
            if (dx > dy) {
                D = -dx;
                for (; x < x1; ++x) {
                    D += 2 * dy;
                    if (D >= 0) {
                        this.mark[y][x] ^= 1;
                        y++;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y < y1; ++y) {
                    this.mark[y][x] ^= 1;
                    D += 2 * dx;
                    if (D >= 0) {
                        x++;
                        D -= 2 * dy;
                    }
                }
            }
        } else if (dx <= 0 && dy > 0) {
            dx = -dx;
            if (dx > dy) {
                D = -dx;
                for (; x > x1; --x) {
                    D += 2 * dy;
                    if (D >= 0) {
                        this.mark[y][x - 1] ^= 1;
                        y++;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y < y1; ++y) {
                    D += 2 * dx;
                    if (D >= 0) {
                        x--;
                        D -= 2 * dy;
                    }
                    this.mark[y][x] ^= 1;
                }
            }
        } else if (dx < 0 && dy <= 0) {
            dx = -dx;
            dy = -dy;
            if (dx > dy) {
                D = -dx;
                for (; x > x1; --x) {
                    D += 2 * dy;
                    if (D >= 0) {
                        y--;
                        this.mark[y][x - 1] ^= 1;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y > y1; --y) {
                    D += 2 * dx;
                    if (D >= 0) {
                        x--;
                        D -= 2 * dy;
                    }
                    this.mark[y - 1][x] ^= 1;
                }
            }
        } else {
            dy = -dy;
            if (dx > dy) {
                D = -dx;
                for (; x < x1; ++x) {
                    D += 2 * dy;
                    if (D >= 0) {
                        y--;
                        this.mark[y][x] ^= 1;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y > y1; --y) {
                    this.mark[y - 1][x] ^= 1;
                    D += 2 * dx;
                    if (D >= 0) {
                        x++;
                        D -= 2 * dy;
                    }
                }
            }
        }
    }

    draw(PX, PY) {
        var n = PX.length;
        for (var y = 0; y < this.h; ++y)
            for (var x = 0; x <= this.w; ++x) {
                this.mark[y][x] = 0;
            }
        for (var i = 0; i < n; ++i)
            this.line(PX[i], PY[i], PX[(i + 1) % n], PY[(i + 1) % n]);
        for (var y = 0; y < this.h; ++y) {
            var c = 0;
            for (var x = 0; x < this.w; ++x) {
                c ^= this.mark[y][x];
                if (c == 1) {
                    this.cvs.setPoint(x, y, this.acolor);
                }
            }
        }
    }

    drawBorder(PX, PY) {
        var n = PX.length;
        var line_drawer = new Bresenham(this.cvs);
        for (var i = 0; i < n; ++i) {
            line_drawer.draw(PX[i] - 1, PY[i], PX[(i + 1) % n] - 1, PY[(i + 1) % n], this.bcolor);
        }
    }

    updateCanvas() {
        this.cvs.updateCanvas();
    }
}

export default MarkFiller;