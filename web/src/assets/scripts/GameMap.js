import { LrzGameObject } from "./LrzGameObject"; //js中当import的是export的话import需要括号，若是export default的话就不用括号，每个文件只能export default一个文件，类似于java里面每个文件只能有一个default

import { Wall } from "./Wall";

export class GameMap extends LrzGameObject {
    constructor(ctx, parent) {  //传一个画布和画布的父元素，用来动态构造画布元素的长宽
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;

        //行数和列数13 * 13 的
        this.rows = 13;
        this.cols = 13;
        
        this.inner_walls_count = 20;//存储内部障碍物的数量
        this.walls = []; //开个数组用来存储所有的墙
    }

    //flood fill算法来判断当前是否连通
    check_connectivity(g, sx, sy, tx, ty) { //传参：地图，起点终点的横纵坐标
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];  //定义一下上下左右四个方向的偏移量
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;
    }

    create_walls() {
        const g = [];            //开一个布尔数组判断这里有没有墙
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }

        // 给四周加上墙
        for (let r = 0; r < this.rows; r ++ ) {      //左右
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c ++ ) {     //上下
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物，因为是对称的，只要   
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 5000; j ++ ) {              //随机一个位置，为了防止重复所以采取了5000，这里有11*11=121个空位，所以随机121次以上总会有结果的
                let r = parseInt(Math.random() * this.rows);//parseInt是为了把单位之间的距离取成整像素，避免墙之间产生缝隙
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) continue;         //判断一下是否有障碍物
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)//防止左下角和右上角的起始位置被墙覆盖。
                    continue;

                g[r][c] = g[c][r] = true;
                break;
            }
        }

        //判断两个蛇之间是否连通。类似于迷宫问题，采用Flood Fill算法去搜一下是否联通的。
        const copy_g = JSON.parse(JSON.stringify(g)); //传状态的时候，防止对状态产生影响所以要先复制一下copy_g
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))//传入起点和终点的坐标
            return false;

        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    //只执行一次
    start() {
        for (let i = 0; i < 1000; i ++ ) 
            if (this.create_walls())
                break;
    }

    
    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));//用求div长宽的API，求出最小值。然后canvas的宽度就可以求了
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    //每一帧执行一次
    update() {
        this.update_size();
        this.render();
    }

    //渲染，即把当前的地图画出来，采用现成的API
    render() {
        const color_even = "#AAD751", color_odd = "#A2D149"; //根据奇数格子还是偶数格子。even表示偶数的颜色，采用qq截图的方式获得当前的颜色
        for (let r = 0; r < this.rows; r ++ ) {              //枚举每个格子
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {                      //判断行加列是奇数还是偶数 
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}
