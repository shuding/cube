/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import "babel/polyfill";

import Camera from './core/camera';
import Color, {colors} from './core/color';
import Ray from './core/ray';
import Scene from './core/scene';

import Canvas from './interface/canvas';
import Interface from './interface/index';

import Face from './object/face';
import Line from './object/line';
import Plane from './object/plane';
import Vector from './object/vector';

import Linescanner from './renderer/linescanner';
import Raytracer from './renderer/raytracer';
import Bresenham from './drawer/line';

export default {
    Camera: Camera,
    Color: Color,
    colors: colors,
    Ray: Ray,
    Scene: Scene,
    Canvas: Canvas,
    Interface: Interface,
    Face: Face,
    Line: Line,
    Plane: Plane,
    Vector: Vector,
    Linescanner: Linescanner,
    Raytracer: Raytracer,
    Bresenham: Bresenham
};
