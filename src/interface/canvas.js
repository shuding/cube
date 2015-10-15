/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Canvas {

    constructor(canvas) {
        this.cvs     = canvas;
        this.context = canvas.getContext("2d");
        this.width   = canvas.width;
        this.height  = canvas.height;
        this.imgData = this.context.getImageData(0, 0, canvas.width, canvas.height);
    }

    setPoint(x, y, color) {
        let index = (y * this.width + x) * 4;

        this.imgData.data[index]     = color.r;
        this.imgData.data[index + 1] = color.g;
        this.imgData.data[index + 2] = color.b;
        this.imgData.data[index + 3] = ~~(color.a * 255);
    }

    updateCanvas() {
        this.context.putImageData(this.imgData, 0, 0);
    }
}

export default Canvas;
