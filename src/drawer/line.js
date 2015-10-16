/**
 * Created by ziyang on 15/10/10.
 * <carbon941030@gmai.com>
 */

import Canvas from '../interface/canvas';

class Bresenham {
    constructor(canvas) {
        this.cvs = canvas;
    }

    draw(x0, y0, x1, y1, color) {
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
                for (; x <= x1; ++x) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dy;
                    if (D >= 0) {
                        y++;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y <= y1; ++y) {
                    this.cvs.setPoint(x, y, color);
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
                for (; x >= x1; --x) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dy;
                    if (D >= 0) {
                        y++;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y <= y1; ++y) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dx;
                    if (D >= 0) {
                        x--;
                        D -= 2 * dy;
                    }
                }
            }
        } else if (dx < 0 && dy <= 0) {
            dx = -dx;
            dy = -dy;
            if (dx > dy) {
                D = -dx;
                for (; x >= x1; --x) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dy;
                    if (D >= 0) {
                        y--;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y >= y1; --y) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dx;
                    if (D >= 0) {
                        x--;
                        D -= 2 * dy;
                    }
                }
            }
        } else {
            dy = -dy;
            if (dx > dy) {
                D = -dx;
                for (; x <= x1; ++x) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dy;
                    if (D >= 0) {
                        y--;
                        D -= 2 * dx;
                    }
                }
            } else {
                D = -dy;
                for (; y >= y1; --y) {
                    this.cvs.setPoint(x, y, color);
                    D += 2 * dx;
                    if (D >= 0) {
                        x++;
                        D -= 2 * dy;
                    }
                }
            }
        }
    }

    updateCanvas() {
        this.cvs.updateCanvas();
    }
}

export default Bresenham;
