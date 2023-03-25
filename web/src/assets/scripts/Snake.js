import { LrzGameObject } from "./LrzGameObject"; //蛇需要每一帧都画出来，所以需要继承自LrzGameObject
import { Cell } from "./Cell";

export class Snake extends LrzGameObject{
    constructor(info, gamemap) {
        super();      //引入基类的构造信息

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];  // 存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null;    // 下一步的目标位置

        this.speed = 5;  // 蛇每秒走5个格子
        this.direction = -1;  // -1表示没有指令，0、1、2、3表示上右下左
        this.status = "idle";  // idle表示静止，move表示正在移动，die表示死亡

        this.dr = [-1, 0, 1, 0];  // 4个方向行的偏移量
        this.dc = [0, 1, 0, -1];  // 4个方向列的偏移量

        this.step = 0;  // 表示回合数
        this.eps = 1e-2;  // 允许的误差，即当两个点足够接近的时候我们就认为他们两相撞了

        //设置蛇的方向 
        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;  // 左下角的蛇初始朝上，右上角的蛇朝下

        this.eye_dx = [  // 蛇两个眼睛x方向的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [  // 蛇两个眼睛y方向的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ]
    }

    //
    start() {

    }

    set_direction(d) {
        this.direction = d;
    }

    check_tail_increasing() {  // 检测当前回合，蛇的长度是否增加，以此来判断蛇尾是否要动
        if (this.step <= 10) return true;  //前十回合每回合都变长，
        if (this.step % 3 === 1) return true; //每三步，增长一步
        return false;
    }

    next_step() {  // 将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]); //蛇头的下一步的位置：行数列数分别加上自己对应的偏移量 
        this.eye_direction = d;
        this.direction = -1;  // 清空操作
        this.status = "move";  //状态由静止变成了移动 
        this.step ++ ;  //每次近到下一个回合的时候回合数就要++

        //首先求一下所有小球的数量
        const k = this.cells.length;  //求所有小球的数量
        for (let i = k; i > 0; i -- ) {//每个小球往后移动一位
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1])); //为了避免复引用造成的问题，这里采取了深层复制
        }

        if (!this.gamemap.check_valid(this.next_cell)) {  // 下一步操作相撞了，操作非法，蛇死亡
            this.status = "die";
        }
    }

    //每帧调用一次
    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);  //算出欧几里得距离（斜边等于两直角边的距离的平方的和再开根号）

        if (distance < this.eps) {  // 走到目标点了
            this.cells[0] = this.next_cell;  // 添加一个新的蛇头
            this.next_cell = null;  //将目标点作为真实的头部
            this.status = "idle";  // 走完了，停下来

            if (!this.check_tail_increasing()) {  // 判断蛇不变长的情况
                this.cells.pop();  //往前移动之后把尾巴砍掉
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000;  // 每两帧之间走的距离
            this.cells[0].x += move_distance * dx / distance;  //继续走。
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];  //蛇尾
                const tail_dx = tail_target.x - tail.x;  //需要把蛇尾移到新的地方
                const tail_dy = tail_target.y - tail.y;  //需要把蛇尾移到新的地方
                tail.x += move_distance * tail_dx / distance;  //移动的实现
                tail.y += move_distance * tail_dy / distance;  //移动的实现
            }
        }
    }

    update() {  // 每一帧执行一次
        if (this.status === 'move') {
            this.update_move();
        }

        this.render();
    }

    //画出来
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;  //调用画圆的api
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {  //of遍历的是值，in遍历的是下标
            ctx.beginPath();  //开启路径
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);  //参数为：每一个小圆的终点，每个单元格的距离
            ctx.fill();
        }

        //把蛇的身体填充上颜色
        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
                continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);  //竖直方向，因为蛇缩小之后有百分之十的偏移量，所以等价于-0.4（-0.5+0.1）
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);  //水平方向 因为蛇缩小之后有百分之十的偏移量，所以等价于-0.4（-0.5+0.1）
            }
        }

        //显示出蛇的眼睛
        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++ ) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;  //眼睛的横坐标
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;  //眼睛的纵坐标

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}