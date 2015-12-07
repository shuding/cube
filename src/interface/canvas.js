/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

import Color from '../core/color';

class Canvas {
    constructor(canvas) {
        this.cvs     = canvas;
        this.context = canvas.getContext("2d");
        this.width   = canvas.width;
        this.height  = canvas.height;
        this.imgData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        // http://www.onaluf.org/en/entry/13
        this._imgData_ = this.imgData.data;

        // State flags
        this.mouseDown      = false;
        this.dragData       = {};
        this._lastDragData_ = {};

        // Binding functions
        this.mouseDownFn = [];
        this.mouseUpFn   = [];
        this.mouseMoveFn = [];
        this.dragFn      = [];
    }

    fillBlack() {
        for (var i = 0; i < this.imgData.data.length; i += 4) {
            this._imgData_[i] = 0;
            this._imgData_[i + 1] = 0;
            this._imgData_[i + 2] = 0;
            this._imgData_[i + 3] = 255;
        }
    }

    setPoint(x, y, color) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return;
        }

        let index = ((this.height - y - 1) * this.width + x) * 4;

        this._imgData_[index]     = ~~(color.r * 255);
        this._imgData_[index + 1] = ~~(color.g * 255);
        this._imgData_[index + 2] = ~~(color.b * 255);
        this._imgData_[index + 3] = ~~(color.a * 255);
    }

    getPoint(x, y) {
        let index = ((this.height - y - 1) * this.width + x) * 4;
        return new Color(this._imgData_[index] / 255.0, this._imgData_[index + 1] / 255.0, this._imgData_[index + 2] / 255.0, this._imgData_[index + 3] / 255.0);
    }

// Interactions binding fn
    bindMouseDown(fn) {
        if (!this.mouseDownFn.length) {
            // If not initialized, then init the event listener
            this.cvs.addEventListener('mousedown', (event) => {
                let self = this;
                this.mouseDownFn.forEach(function (fn) {
                    self._mouseDownData_ = {
                        x: event.offsetX,
                        y: event.offsetY
                    };
                    fn.call(self, event, self._mouseDownData_);
                });
            });
        }
        // Push into function list
        this.mouseDownFn.push(fn);
    }

    bindMouseUp(fn) {
        if (!this.mouseUpFn.length) {
            // If not initialized, then init the event listener
            this.cvs.addEventListener('mouseup', (event) => {
                let self = this;
                this.mouseUpFn.forEach(function (fn) {
                    fn.call(self, event);
                });
            });
        }
        // Push into function list
        this.mouseUpFn.push(fn);
    }

    bindMouseMove(fn) {
        if (!this.mouseMoveFn.length) {
            // If not initialized, then init the event listener
            this.cvs.addEventListener('mousemove', (event) => {
                let self = this;
                this.mouseMoveFn.forEach(function (fn) {
                    fn.call(self, event);
                });
            });
        }
        // Push into function list
        this.mouseMoveFn.push(fn);
    }

    bindDrag(fn) {
        if (!this.dragFn.length) {
            this.bindMouseDown((event) => {
                this.mouseDown      = true;
                this._lastDragData_ = {
                    x: event.x,
                    y: event.y
                };
            });
            this.bindMouseUp(() => {
                this.mouseDown = false;
            });
            this.bindMouseMove((event) => {
                if (this.mouseDown) {
                    let self            = this;
                    this.dragFn.forEach(function (fn) {
                        fn.apply(self, [event, self._lastDragData_]);
                    });
                    self.dragData       = {
                        x: event.x,
                        y: event.y
                    };
                    self._lastDragData_ = self.dragData;
                }
            });
        }
        this.dragFn.push(fn);
    }

    updateCanvas() {
        this.context.putImageData(this.imgData, 0, 0);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imgData   = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this._imgData_ = this.imgData.data;
    }
}

export default Canvas;
