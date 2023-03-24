const Lrz_GAME_OBJECTS = [];



/*逻辑 :requestAnimationFrame表示在下一帧执行step函数,进入step函数，然后遍历所有对象，若没执行过step，就执行step,否则就执行update函数*/
export class LrzGameObject {
    constructor() {
        Lrz_GAME_OBJECTS.push(this);//先创建的先push，后执行的会把前执行的覆盖掉
        this.timedelta = 0;
        this.has_called_start = false; //记录有没有执行过的变量
    }

    start() {     // 只执行一次
    }

    update() {     // 每一帧执行一次，除了第一帧之外

    }

    on_destroy() {     // 删除之前执行

    }

    destroy() {
        this.on_destroy(); //再删除的时候调用就行了

        for (let i in Lrz_GAME_OBJECTS) {
            const obj = Lrz_GAME_OBJECTS[i];
            if (obj === this) {
                Lrz_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp;  // 上一次执行的时刻

const step = timestamp => {
    for (let obj of Lrz_GAME_OBJECTS) { //用of表示遍历的是值，如果用of的话表示遍历的是下标
        if (!obj.has_called_start) {   //如果没执行过start
            obj.has_called_start = true;
            obj.start();
        } else {                       //执行过的话进行更新
            obj.timedelta = timestamp - last_timestamp; //更新之前要赋一下timedelta值
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step)
}

requestAnimationFrame(step)
