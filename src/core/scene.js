/**
 * Created by shuding on 10/9/15.
 * <ds303077135@gmail.com>
 */

class Scene {
    constructor(...objects) {
        this.objects = objects;
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    * eachObject() {
        for (let i = 0; i < this.objects.length; ++i) {
            yield this.objects[i];
        }
    }
}

export default Scene;
