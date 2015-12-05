/**
 * Created by ziyang on 15/11/6.
 */

class GaussianPattern {

    constructor(r, sigma) {
        this.r     = ~~r;
        this.sigma = sigma;
        this.pat   = [];
        for (var x = -r + 1; x < r; ++x) {
            this.pat[x] = [];
            for (var y = -r + 1; y < r; ++y) {
                this.pat[x][y] = Math.exp(-0.5 * ((x * x) + (y * y)) / (sigma * sigma));
            }
        }
    }

}

export default GaussianPattern;