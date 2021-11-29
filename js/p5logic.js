const virtualmsg = 'this is a virtual function, inherit this class and implement it';
class ModuloShape {
    constructor(x, y, r, n, m, { w = 0.2, bw = 1, dw = 4, c = fg, dc = hi, dp = 0, xs = 4, aw = 170, af = 28, fv = 0.08 } = {}) {
        this.x = x;     // center x coordinate
        this.y = y;     // center y coordinate
        this.r = r;     // radius of shape
        this.n = n;     // number of points
        this.m = m;     // modular arithmetic multiplier
        this.w = w;     // weight of line
        this.bw = bw;   // weight of shape base line
        this.dw = dw;   // scales w for deviant
        this.c = c;     // colour
        this.dc = dc;   // deviant colour
        this.dp = dp;   // deviant probability
        this.aw = aw;   // animation wait time
        this.af = af;   // animation fade out time
        this.fv = fv;   // fade value
        this.xs = xs;   // number of pixels to extend fade out square size
        this.tlx = x - r - xs;      // top left corner's x
        this.tly = y - r - xs;      // top left corner's y
        this.s = r * 2 + xs + xs;   // fade out square side size
        this.pts = null;            // list of points around shape
        this.fi = 1 - fv;           // fade inverse '1 - fv'
        this.fc = color(...bgrgbarr, round(fv * 255)); // fade color
        // constants

        this.tp = 0;    // animation phase variable
        this.t = 0;     // timer variable
        // variables

        this.calculatePoints();
        // initialize pts
    }

    /**
     * returns list of 'n' points distributed around shape
     * must 'n' values to 'this.pts'
     */
    calculatePoints() {
        throw virtualmsg;
    }

    /**
     * draws base shape
     */
    drawBase() {
        throw virtualmsg;
    }

    drawLine(a, b) {
        const isD = random(1) < this.dp;
        strokeWeight(this.w * (isD ? this.dw : 1));
        stroke(isD ? this.dc : this.c);
        line(...this.pts[a % this.n], ...this.pts[b % this.n]);
    }

    anim() {
        switch (this.tp) {
            case 0:
                this.drawLine(this.t, this.t * this.m);
                this.t++;
                if (this.t === this.n) {
                    this.tp = 1;
                    this.t = this.aw;
                }
                return 0;
            case 1:
                if (this.t > 0) {
                    this.t--;
                } else {
                    this.tp = 2;
                    this.t = this.af;
                }
                return 1;
            case 2:
                if (this.t > 0) {
                    this.t--;
                } else {
                    this.tp = 3;
                }
                noStroke();
                fill(this.fc);
                square(this.tlx, this.tly, this.s);
                return 1;
            case 3:
                noStroke();
                fill(bg);
                square(this.tlx, this.tly, this.s);
                this.tp = 4;
                return 2;
            case 4:
                return 2;
        }
    }
}

class ModuloCircle extends ModuloShape {
    constructor(...args) {
        super(...args);
    }

    calculatePoints() {
        this.pts = [...Array(this.n).keys()]
            .map(i => TWO_PI / this.n * i)
            .map(a => [this.x + cos(a) * this.r, this.y + sin(a) * this.r]);
    }

    drawBase() {
        strokeWeight(this.bw);
        stroke(this.c);
        noFill();
        circle(this.x, this.y, this.r * 2);
    }
}

class ModuloSquare extends ModuloShape {
    constructor(...args) {
        super(...args);
    }

    calculatePoints() {
        this.ns = ceil(this.n / 4);
        this.n = this.ns * 4;
        const step = (this.r * 2) / (this.ns + 1);
        const spts = [...Array(this.ns).keys()].map(x => x * step);
        const rs = spts.map(x => [this.x + this.r, this.y - this.r + x]);
        const bs = spts.map(x => [this.x + this.r - x, this.y + this.r]);
        const ls = spts.map(x => [this.x - this.r, this.y + this.r - x]);
        const ts = spts.map(x => [this.x - this.r + x, this.y - this.r]);
        this.pts = [...rs, ...bs, ...ls, ...ts];
    }

    drawBase() {
        strokeWeight(this.bw);
        stroke(this.c);
        noFill();
        square(this.tlx, this.tly, this.r * 2);
    }
}

class ModuloTriangle extends ModuloShape {
    constructor(...args) {
        super(...args);
    }

    calculatePoints() {
        this.ns = ceil(this.n / 3);
        this.n = this.ns * 3;
        const fac = 1; // 2 / (2 * sqrt(3))
        const rfac = this.r * fac;
        const stepfx = (this.r * 2) / (this.ns + 1);
        const stepx = this.r / (this.ns + 1);
        const stepy = (rfac * 2) / (this.ns + 1);
        const spts = [...Array(this.ns).keys()];
        const rs = spts.map(x => [this.x + stepx * x, this.y - rfac + stepy * x]);
        const bs = spts.map(x => [this.x + this.r - stepfx * x, this.y + rfac]);
        const ls = spts.map(x => [this.x - this.r + stepx * x, this.y + rfac - stepy * x]);
        this.pts = [...rs, ...bs, ...ls];
    }

    drawBase() {
        const fac = 1; // 2 / (2 * sqrt(3))
        const rfac = this.r * fac;
        strokeWeight(this.bw);
        stroke(this.c);
        noFill();
        line(this.x, this.y - rfac, this.x + this.r, this.y + rfac);
        line(this.x + this.r, this.y + rfac, this.x - this.r, this.y + rfac);
        line(this.x - this.r, this.y + rfac, this.x, this.y - rfac);
    }
}
// p5js functions

class DynamicGrid {
    constructor(x, y, s, n, p, g, pad = 0.9, pts = 200, dev = 0.1, dp = 0) {
        this.x = x; // top left of grid
        this.y = y; // top left of grid
        this.s = s; // side of one smallest cell
        this.n = n; // number of cells along length
        this.p = p; // number of simultaneous draws
        this.g = g; // probability of cell growing
        this.pad = pad;         // percent of smallest cell as padding
        this.pts = pts;         // number of points for shapes
        this.dev = dev;         // number of points to deviate for shapes
        this.dp = dp;           // shape deviant probability
        this.padw = pad * s;    // pad actual length

        this.shapes = [];
        this.clears = [];
        this.grid = [...Array(n).keys()].map(x => [...Array(n).keys()].map(x => false));
        this.occ = [];
        this.fre = [...Array(n * n).keys()];
        this.tot = n * n;

        this.dead = false;
        this.testvar = 0;
    }

    coordToKey(x, y) {
        return y * this.n + x;
    }

    keyToCoord(k) {
        const y = floor(k / this.n);
        return [k - (y * this.n), y];
    }

    getFreeKey() {
        let k = this.fre[floor(random(0, this.fre.length))];
        return k;
    }

    setCell(x, y) {
        const k = this.coordToKey(x, y);
        this.fre = this.fre.filter(x => x !== k);
        this.occ.push(k);
        this.grid[y][x] = true;
    }

    unsetCell(x, y) {
        const k = this.coordToKey(x, y);
        this.occ = this.occ.filter(x => x != k);
        this.fre.push(k);
        this.grid[y][x] = false;
    }

    getCellsFromRange(tlx, tly, brx, bry) {
        let rs = [];
        for (let i = tlx; i <= brx; i++) {
            for (let j = tly; j <= bry; j++) {
                rs.push([i, j]);
            }
        }
        return rs;
    }

    expand(tlx, tly, brx, bry) {
        let len = brx - tlx + 1;
        let ls = [...Array(len).keys()];
        let tw = !ls.map(w => this.grid?.[tly - 1]?.[tlx + w] ?? true).every(b => !b);
        let lw = !ls.map(w => this.grid?.[tly + w]?.[tlx - 1] ?? true).every(b => !b);
        let rw = !ls.map(w => this.grid?.[tly + w]?.[brx + 1] ?? true).every(b => !b);
        let bw = !ls.map(w => this.grid?.[bry + 1]?.[tlx + w] ?? true).every(b => !b);
        let cs = [
            (this.grid?.[tly - 1]?.[tlx - 1] ?? true) || tw || lw,
            (this.grid?.[tly - 1]?.[brx + 1] ?? true) || tw || rw,
            (this.grid?.[bry + 1]?.[brx + 1] ?? true) || bw || rw,
            (this.grid?.[bry + 1]?.[tlx - 1] ?? true) || bw || lw
        ].map((b, i) => [i, b]).filter(([i, b]) => !b).map(([i, b]) => i);
        // get all valid expand choices

        if (cs.length === 0) return [true, [tlx, tly], [brx, bry]];
        // if no choices, return as is

        let c = cs[floor(random(0, cs.length))];
        // make a choice

        switch (c) {
            case 0: tlx--; tly--; break;
            case 1: tly--; brx++; break;
            case 2: brx++; bry++; break;
            default: tlx--; bry++;
        }
        // expand

        return [false, [tlx, tly], [brx, bry]];
    }

    makeShape() {
        if (this.occ.length >= this.tot) return; // terminate if no empty cells
        let k = this.getFreeKey();
        let tl = this.keyToCoord(k);
        let br = [...tl];
        let brk = true;
        // step1 : find random empty cell

        while (random(1) < this.g) {
            [brk, tl, br] = this.expand(...tl, ...br);
            if (brk) break;
        }
        let cells = this.getCellsFromRange(...tl, ...br);
        cells.forEach(x => this.setCell(...x));
        // step2 : expand cell

        let x = (tl[0] + br[0]) / 2;
        let y = (tl[1] + br[1]) / 2;
        x = this.x + (x + 0.5) * this.s;
        y = this.y + (y + 0.5) * this.s;
        let r = (br[0] - tl[0] + 1 - ((1 - this.pad) * 2)) * this.s;
        // step3 : calculate shape data

        const nn = this.pts * this.dev;
        const N = round(random(this.pts - nn, this.pts + nn));
        const M = round(random(2, N));
        const c = lerpColor(fg, fgb, random(0, 1));
        const rnd = random(1);
        const f = ModuloCircle;//rnd < 0.8 ? ModuloCircle : rnd < 0.95 ? ModuloSquare : ModuloTriangle;
        const shape = new f(x, y, r / 2, N, M, { c: c, dp: this.dp });
        this.shapes.push([shape, () => cells.forEach(x => this.unsetCell(...x))]);
        // step4 : make shape
    }

    print() {
        console.log(this.grid.map(a => a.map(b => b ? '*' : '-').join('')).join('\n'));
    }

    kill() {
        this.dead = true;
    }

    isEmpty() {
        return this.occ.length === 0;
    }

    anim() {
        let [cp, a] = this.shapes.reduce(([cp, a], [s, c]) => {
            let res = s.anim();
            switch (res) {
                case 0: return [cp + 1, [...a, [s, c]]];
                case 1: return [cp, [...a, [s, c]]];
                default: c(); return [cp, a];
            }
        }, [0, []]);
        this.shapes = a;
        if (cp < this.p && !this.dead) this.makeShape();
    }
}

class StaticGrid {
    constructor(n = 3, nm = 5, pad = 0.9, pts = 200, dev = 0.1, dp = 0) {
        this.n = n;
        this.nm = nm;
        this.pad = pad;
        this.pts = pts;
        this.dev = dev;
        this.dp = dp;
        this.shapes = [];
    }

    newGrid(sze = 200) {
        const mulwdt = Math.floor(wdt / sze);
        const mulhgt = Math.floor(hgt / sze);
        return [...Array(mulwdt * mulhgt).keys()]
            .map(i => [i, i % mulwdt * sze + sze * 0.5, Math.floor(i / mulwdt) * sze + sze * 0.5])
            .map(([i, x, y]) => {
                const nn = this.pts * this.dev;
                const N = round(random(this.pts - nn, this.pts + nn));
                const M = round(random(2, N));
                const c = lerpColor(fg, fgb, random(0, 1));
                const r = random(1);
                const f = ModuloCircle;//random([ModuloCircle, ModuloSquare, ModuloTriangle]);
                const circ = new f(x, y, (sze * 0.5) * this.pad, N, M, { c: c, dp: this.dp });
                return circ;
            });
    }

    kill() {
        this.dead = true;
    }

    isEmpty() {
        return this.shapes.length === 0;
    }

    anim() {
        if (this.isEmpty() && !this.dead) {
            this.shapes = this.newGrid(wdt / round(random(this.n, this.nm)));
        } else {
            this.shapes = this.shapes.filter(x => x.anim() < 2);
        }
    }
}

class AlternatingAutomater {
    constructor(f, g) {
        this.f = f;
        this.g = g;

        this.dyn = true;
        this.grid = null;      // automater object
        this.tmr = null;       // timer variable
        this.maxTmr = null;    // max timer value
        this.inTransition = false;
        this.it = 0;
        this.reset();
    }

    reset(isF = true) {
        this.grid = isF ? this.f() : this.g();
        this.it = 0;
        this.tmr = 0;
        this.maxTmr = round(random(1500, 2000));
    }

    transition() {
        this.inTransition = true;
        this.it = 0;
    }

    anim() {
        if (!this.inTransition) {
            this.grid.anim();
            if (this.tmr < this.maxTmr) this.tmr++;
            else if (this.grid.isEmpty()) {
                this.dyn = !this.dyn;
                this.reset(this.dyn);
            } else {
                this.grid.kill();
            }
        } else {
            if (this.it < 25) {
                this.it++;
                background(color(...bgrgbarr, 0.3 * 255));
            } else {
                background(color(...bgrgbarr));
                this.inTransition = false;
                this.dyn = !this.dyn;
                this.reset(this.dyn);
            }
        }
    }
}

// automaters

let canvas;
let runner;

function setup() {
    fg = color(fg2);
    fgb = color(fg1);
    bgb = color(bg);
    hi = fg;
    // setup color constants

    canvas = createCanvas(wdt, hgt);
    document.addEventListener('scroll', repositionCanvas);
    window.onresize = repositionCanvas;
    canvas.addClass("canvas");
    repositionCanvas();
    background(bg);
    // setup dom with canvas

    runner = new AlternatingAutomater(
        () => new StaticGrid(2, 5, 0.97, 400),
        () => new DynamicGrid(0, 0, wdt / 9, 9, 11, 0.7, 0.97, 400));
}

function draw() {
    runner.anim();
}