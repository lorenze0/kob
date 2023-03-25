export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        //圆的坐标不是整数，因为算在格子里的话是有0.5的量的。
        this.x = c + 0.5;
        this.y = r + 0.5;
    }
}
