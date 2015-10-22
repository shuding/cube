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
import Plane, {planeFromScreen} from './object/plane';
import Vector from './object/vector';

import Linescanner from './renderer/linescanner';
import Raytracer from './renderer/raytracer';
import Mapper, {mapperFromSize} from './renderer/mapper';

import Bresenham from './drawer/line';

export default {
<<<<<<< HEAD
    Camera     : Camera,
    Color      : Color,
    colors     : colors,
    Ray        : Ray,
    Scene      : Scene,
    Canvas     : Canvas,
    Interface  : Interface,
    Face       : Face,
    Line       : Line,
    Plane      : Plane,
    Vector     : Vector,
    Linescanner: Linescanner,
    Raytracer  : Raytracer,
    Bresenham  : Bresenham
=======
// classes
    Camera:          Camera,
    Color:           Color,
    Ray:             Ray,
    Scene:           Scene,
    Canvas:          Canvas,
    Interface:       Interface,
    Face:            Face,
    Face4:           Face4,
    Cuboid:          Cuboid,
    Line:            Line,
    Plane:           Plane,
    Vector:          Vector,
    Linescanner:     Linescanner,
    Raytracer:       Raytracer,
    Mapper:          Mapper,
    Bresenham:       Bresenham,
// methods
    mapperFromSize:  mapperFromSize,
    planeFromScreen: planeFromScreen,
// constants
    colors:          colors
>>>>>>> 5970e4c30721dd4f5831a07ee4194295314b390c
};
