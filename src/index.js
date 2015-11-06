/**
 * Created by shuding on 10/8/15.
 * <ds303077135@gmail.com>
 */

import 'babel/polyfill';

import Camera from './core/camera';
import Color, {colors} from './core/color';
import Ray from './core/ray';
import Scene from './core/scene';

import Canvas from './interface/canvas';
import Interface from './interface/index';

import Face from './object/face';
import Face4 from './object/face4';
import Cuboid from './object/cuboid';
import Line from './object/line';
import Ball from './object/ball';
import Plane, {planeFromScreen} from './object/plane';
import Vector from './object/vector';

import Linescanner from './renderer/linescanner';
import Raytracer from './renderer/raytracer';
import Mapper, {mapperFromSize} from './renderer/mapper';

import Bresenham from './drawer/line';
import MarkFiller from './drawer/polygon';

import RandomCoor from './utility/pseudoRandom';
import GaussianPattern from './utility/gaussianPattern';

export default {
// classes
    Camera         : Camera,
    Color          : Color,
    Ray            : Ray,
    Scene          : Scene,
    Canvas         : Canvas,
    Interface      : Interface,
    Face           : Face,
    Face4          : Face4,
    Cuboid         : Cuboid,
    Line           : Line,
    Ball           : Ball,
    Plane          : Plane,
    Vector         : Vector,
    Linescanner    : Linescanner,
    Raytracer      : Raytracer,
    Mapper         : Mapper,
    Bresenham      : Bresenham,
    MarkFiller     : MarkFiller,
    RandomCoor     : RandomCoor,
    GaussianPattern: GaussianPattern,
// methods
    mapperFromSize : mapperFromSize,
    planeFromScreen: planeFromScreen,
// constants
    colors         : colors
};
