<template>
    <div ref="parent" class="gamemap"> 
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { GameMap } from "@/assets/scripts/GameMap";
import { ref, onMounted } from 'vue' //想创建游戏对象首先要把canvas引用进来，OnMounted是当组件挂载完之后需要执行哪些操作

export default {
    setup() {
        let parent = ref(null);//vue中调用变量的话定义ref
        let canvas = ref(null);

        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value)//创建Game Map对象
        });

        return {
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
div.gamemap {
    width: 100%;
    height: 100%; /*让画出来的canvas水平和竖直同时居中*/
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
