# transition

demo点击显示与消失

```javascript
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>
```



#### transition使用

```javascript
<transition name="fade">
    运动东西(元素，属性、路由....)
</transition>
```

在进入/离开的过渡中，会有 6 个 class 切换。

1. `v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `v-enter-to`: **2.1.8版及以上** 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter` 被移除)，在过渡/动画完成之后移除。
4. `v-leave`: 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`: **2.1.8版及以上** 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave` 被删除)，在过渡/动画完成之后移除。

![Transition Diagram](https://cn.vuejs.org/images/transition.png)

对于这些在过渡中切换的类名来说，如果你使用一个没有名字的 `<transition>`，则 `v-` 是这些类名的默认前缀。如果你使用了 `<transition name="my-transition">`，那么 `v-enter` 会替换为 `my-transition-enter`。

`v-enter-active` 和 `v-leave-active` 可以控制进入/离开过渡的不同的缓和曲线，在下面章节会有个示例说明。

#### transition相关函数

```javascript
<transition name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
>
    <p v-show="show"></p>
</transition>
```



```javascript
methods:{
    beforeEnter(el){
        console.log('动画enter之前');
    },
    enter(el){
        console.log('动画enter进入');
    },
    afterEnter(el){
        console.log('动画进入之后');
        el.style.background="blue";
    },
    beforeLeave(el){
        console.log('动画leave之前');
    },
    leave(el){
        console.log('动画leave');
    },
    afterLeave(el){
        console.log('动画leave之后');
        el.style.background="red";
    }
}
```



#### 四、transition结合animate.css使用。

```javascript
<transition enter-active-class="zoomInLeft" leave-active-class="zoomOutRight">
        <p v-show="show" class="animated"></p>
</transition>
或者
<transition enter-active-class="animated zoomInLeft" leave-active-class="animated zoomOutRight">
        <p v-show="show"></p>
</transition>
```



#### 五、多个元素运动

```javascript
<!-- key一般是循环遍历出来的 -->
<transition-group enter-active-class="zoomInLeft" leave-active-class="zoomOutRight">
      <p v-show="show" :key=""></p>
      <p v-show="show" :key=""></p>
</transition-group>
```

 

