# 组件传值

## 父传子组件

父子组件传值，最简单的就是通过props传递，话不多说看代码

```html
// App
<template>
  <div id="app">
    <Child1 :title="title1"></Child1>
  </div>
</template>

<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  data(){
    return {
      title1:'我是你爸爸'
    }
  },
  components:{Child1}

}
</script>
// Child1
<template>
    <div>
        <h2>Child2</h2>
        <div>{{title}}</div>
    </div>
</template>
<script>
export default {
    props:['title']
    
}
</script>
```



## 子传父

Vue更推荐单向数据流，所以子组件像修改传递的数据，需要通知父组件来修改，使用$emit触发父元素传递的事件

```html
<template>
  <div id="app">
    <h2>Parent</h2>
    <h3>{{msg}}</h3>
    <Child1 :title="title1" @getmsg="getmsg"></Child1>
  </div>
</template>

<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  data(){
    return {
      msg:'',
      title1:'我是你爸爸'
    }
  },
  methods:{
    getmsg(msg){
      console.log(msg)
      this.msg = msg
    }
  },
  components:{Child1}

}

</script>
<style>

div{
  border:1px red solid;
  padding:20px;
}
</style>
// child1
<template>
    <div>
        <h2>Child2</h2>
        <p>{{title}}</p>
        <button @click="toParent">传递到父元素</button>
    </div>
</template>
<script>
export default {
    props:['title'],
    methods:{
        toParent(){
            this.$emit('getmsg','爸爸,我知道错了')
        }
    }
    
}
</script>
```



## 兄弟组件

兄弟组件不能直接通信，只需要父元素搭个桥即可，大家自己体验即可

## 祖先后代 provide & inject

props一层层传递，爷爷给孙子还好，如果嵌套了五六层还这么写，感觉自己就是一个沙雕，所以这里介绍一个 稍微冷门的API， [provice/inject](https://cn.vuejs.org/v2/api/#provide-inject),类似React中的上下文，专门用来跨层级提供数据

现在很多开源库都使用这个api来做跨层级的数据共享，比如element-ui的[tabs](https://github.com/ElemeFE/element/blob/efcfbdde0f06e3e1816f1a8cd009a4e413e6e290/packages/tabs/src/tabs.vue#L26) 和 [select](https://github.com/ElemeFE/element/blob/f55fbdb051f95d52e92f7a66aee9a58e41025771/packages/select/src/select.vue#L161)



```js
// 组件接收
inject:['classBoxId']

// 组件传值
 provide(){
	 return{
    	 classBoxId:this.class
     }            
 },
       
class:{
    clazzId:''
}

```



```html
<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  provide:{
    woniu:'我是蜗牛'
  },
  components:{Child1}

}

</script>
<style>
// 子孙元素
<template>
    
    <div>
        <h3>Grandson1</h3>
        <p>
            祖先元素提供的数据 : {{woniu}}
        </p>
    </div>
</template>
<script>
export default {
    
    inj ect:['woniu']
}
</script>
```

### provide响应式

```js
<script>
    import Vue from "vue";
    import ChildrenB from "./ChildrenB";
    import ChildrenC from "./ChildrenC";
    import ChildrenD from "./ChildrenD";
    export default {
      components: {
        ChildrenB,
        ChildrenC,
        ChildrenD
      },
      provide() {
        this.theme = Vue.observable({
          color: "blue"
        });
        return {
          theme: this.theme
        };
      },
      methods: {
        changeColor(color) {
          if (color) {
            this.theme.color = color;
          } else {
            this.theme.color = this.theme.color === "blue" ? "red" : "blue";
          }
        }
      }
    };
</script>
```



但是provider和inject不是响应式的，如果子孙元素想通知祖先，就需要hack一下，Vue1中有dispatch和boardcast两个方法，但是vue2中被干掉了，我们自己可以模拟一下

原理就是可以通过this.$parent和this.$children来获取父组件和子组件，我们递归一下就可以了





## $attr listeners跨组件传值 事件

$attrs获取的是父组件中传递的数据，子组件没接收的数据集合

$listeners传递执行函数

```js
// 父组件
<template>
  <div>
    23
    <com :item="item" :index="index" @test="test"></com>
  </div>
</template>

<script>
  import com from './a.vue'; 
  export default{
    data(){
      return {
        item:2222,
        index:2
      }
    },
    components:{
      com
    }
  }
</script>

// 子组件
<template>
     // v-bind="$attrs"是关键
     // $attrs:{item:2222} 
	<div>a <bm v-bind="$attrs" v-on="$listeners"></bm></div>  
</template>

<script>
	import bm from './b.vue'; 
	export default{
		components:{
			bm
		},
		inheritAttrs:false,
		props:{
			index:Number
		},
		
	}
</script>

// 孙子组件

<template>
  <div>
   b
  </div>
</template>

<script>
  
  export default{
    name:'ba',
    inheritAttrs:false,
    created(){
        // $attrs:{item:2222}
        // $listeners: test(){}
       console.log(this.$attrs,this.$listeners)   
    }
  }
</script>
```



## inheritAttrs

中文翻译：继承

如果你**不**希望组件的根元素继承特性，可以在组件的选项中设置` inheritAttrs: false`

#### 默认情况

父组件中传的值，子组件值接收了title,没接收message,message会当做父组件的属性,使用`inheritAttrs: false`避免这种情况。

```js
// 父组件
<template>
  <div class="home">
    <mytest  :title="title" :massgae="massgae"></mytest>  
	// <div massgae="massgae" ></div>
  </div>
</template>

// 子组件
props:{
    title:String
}
```





## dispatch

递归获取$parent即可 比较简单

```html
<button @click="$dispatch('dispatch','哈喽 我是GrandGrandChild1')">dispatch</button>

Vue.prototype.$dispatch=function (eventName, data) {
      let parent = this.$parent
      // 查找父元素
      while (parent ) {
        if (parent) {
          // 父元素用$emit触发
          parent.$emit(eventName,data)
          // 递归查找父元素
          parent = parent.$parent
        }else{
          break

        }
      }
 
    }

Vue.prototype.$dispatch=function (componentName,eventName,data){
  let parent=this.$parent;
  let name=parent.$options.name;
  while(parent && name !== componentName){
    parent=parent.$parent;
    if(parent){
      name=parent.$options.name;
    }
  }
  if(parent){
    parent.$emit(eventName,data);
  }
}
```

注意只向上传递了，并没有影响别的元素

## boardcast

和dispatch类似，递归获取$children 来向所有子元素广播

```html
<button @click="$boardcast('boardcast','我是Child1')">广播子元素</button>
function boardcast(eventName, data){
  this.$children.forEach(child => {
    // 子元素触发$emit
    child.$emit(eventName, data)
    if(child.$children.length){
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data)
    }
  });
}
{
  methods: {

    $boardcast(eventName, data) {
      boardcast.call(this,eventName,data)
    }
  }
}
```

## 全局挂载dispatch和boardcast

想用的时候，需要自己组件内部定理dispatch和boardcast太烦了，我们挂载到Vue的原型链上，岂不是很high,找到main.js

```js
Vue.prototype.$dispatch =  function(eventName, data) {
  let parent = this.$parent
  // 查找父元素
  while (parent ) {
    if (parent) {
      // 父元素用$emit触发
      parent.$emit(eventName,data)
      // 递归查找父元素
      parent = parent.$parent
    }else{
      break
    }
  }
}

Vue.prototype.$boardcast = function(eventName, data){
  boardcast.call(this,eventName,data)
}
function boardcast(eventName, data){
  this.$children.forEach(child => {
    // 子元素触发$emit
    child.$emit(eventName, data)
    if(child.$children.length){
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data)
    }
  });
}
```

这样组件里直接就可以用了 无压力

## Ref使用

获取组件实例

```html
<Grandson2 v-bind="$attrs" v-on="$listeners" ref="grand2"></Grandson2>
mounted() { // 获取组件定义的属性
  console.log(this.$refs.grand2.name);
}
```

## event-bus

如果俩组件没啥关系呢，我们只能使用订阅发布模式来做，并且挂载到Vue.protytype之上，我们来试试，我们称呼这种机制为总线机制，也就是喜闻乐见的 event-bus

```js
class Bus{
  constructor(){
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {}
  }
  $on(name,fn){
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }
  $emit(name,args){
    if(this.callbacks[name]){
      // 存在 遍历所有callback
      this.callbacks[name].forEach(cb=> cb(args))
    }
  }
}

Vue.prototype.$bus = new Bus()
```

使用

```js
// 使用
eventBus(){
    this.$bus.$emit('event-bus','测试eventBus')
}

// 监听
this.$bus.$on("event-bus",msg=>{
    this.msg = '接收event-bus消息:'+ msg
})
```



其实本身Vue就是一个订阅发布的实现，我们偷个懒，把Bus这个类可以删掉，新建一个空的Vue实例就可以啦

```js
Vue.prototype.$bus = new Vue()
```

## vuex

状态管理