---
title: tapable
tags:
 - webpack
categories:
 -  javascript
---

`tapable` 是一个类似于`nodejs` 的`EventEmitter` 的库, 主要是控制钩子函数的发布与订阅,实现了`webpack`的插件机制

## 同步钩子

- ### SyncHook

  ```js
  // 同步的方法
  let {SyncHook} = require('tapable');
  
  // 核心就是发布订阅
  class Lesson {
    constructor(){
      this.hooks = {
        arch: new SyncHook(['name','age']) // 限制绑定函数的参数
      }
    }
    tap(){ // 希望调用这个方法来在钩子上注册事件
      this.hooks.arch.tap('node', function (name) { // 第一个参数是注释作用 没有实际意义
        console.log('node', name);
      });
      this.hooks.arch.tap('react', function (name) {
        console.log('node', name);
      });
    }
    start(){
      this.hooks.arch.call('jw');
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  ```

  ### 手动实现SyncHook

  ```js
  class SyncHook{ // 同步的钩子
    constructor(args) { // args 起一个限制作用
      this.tasks = [];
    }
    tap(name,task){
      this.tasks.push(task);
    }
    call(...args){
      this.tasks.forEach(task=>task(...args));
    }
  }
  let hook = new SyncHook(['name']);
  hook.tap('node',function (name) {
    console.log('node',name);
  }); // tap用来注册事件的 events.on 
  hook.tap('react', function (name) {
    console.log('react', name);
  }); 
  hook.call('jw');
  ```

- ### SyncBailHook

  ```js
  // 同步的方法
  let {SyncBailHook} = require('tapable');
  // Bail保险 熔断型的
  // 核心就是发布订阅
  class Lesson {
    constructor(){
      this.hooks = {
        arch: new SyncBailHook(['name','age']) // 限制绑定函数的参数
      }
    }
    tap(){ // 希望调用这个方法来在钩子上注册事件
      this.hooks.arch.tap('node', function (name) { // 第一个参数是注释作用 没有实际意义
        console.log('node', name);
        return false; // 如果当前函数有返回值则不会继续执行
      });
      this.hooks.arch.tap('react', function (name) {
        console.log('react', name);
      });
    }
    start(){
      this.hooks.arch.call('jw');
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  ```

  ### 手动实现SyncBailHook
  
  ```js
  class SyncBailHook{ // 同步的钩子
    constructor(args) { // args 起一个限制作用
      this.tasks = [];
    }
    tap(name,task){
      this.tasks.push(task);
    }
    call(...args){
      let index = 0; // 取任务队列中的第一个
      let ret;
      do{ // 至少做一次
        ret = this.tasks[index++](...args);
      }while(ret === undefined && index < this.tasks.length)
    }
  }
  let hook = new SyncBailHook(['name']);
  hook.tap('node',function (name) {
    console.log('node',name);
   // return '停一停有事'
  }); // tap用来注册事件的 events.on 
  hook.tap('react', function (name) {
    console.log('react', name);
  }); 
  hook.call('jw');
  ```
  
  


- ### SyncWaterfallHook

  ```js
  // 同步的方法
  let {SyncWaterfallHook} = require('tapable');
  // 瀑布的意思就是上一个监听函数的结果是下一个人的输入
  class Lesson {
    constructor(){
      this.hooks = {
        arch: new SyncWaterfallHook(['name','age']) 
      }
    }
    tap(){ // 希望调用这个方法来在钩子上注册事件
      this.hooks.arch.tap('node', function (name) { 
        console.log('node', name);
        return 'node学的不错'
      });
      this.hooks.arch.tap('react', function (data) {
        console.log('react', data);
        return  'react 更好'
      });
      this.hooks.arch.tap('webpack', function (data) {
        console.log('webpack', data);
      });
    }
    start(){
      this.hooks.arch.call('jw');
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  ```

  ### 手动实现SyncWaterfallHook

  ```js
  class SyncWaterfallHook{ 
    constructor(args) { 
      this.tasks = [];
    }
    tap(name,task){
      this.tasks.push(task);
    }
    call(...args){
      let [first,...others] = this.tasks;
      // first就是第一个任务
      // reduce
      others.reduce((prev,next)=>{
        return next(prev);
      }, first(...args))
    }
  }
  let hook = new SyncWaterfallHook(['name']);
  hook.tap('node',function (name) {
    console.log('node',name);
    return 'node还不错'
  }); 
  hook.tap('react', function (data) {
    console.log('react', data);
    return 'react ok'
  }); 
  hook.tap('webpack', function (data) {
    console.log('webpack', data);
  }); 
  hook.call('jw');
  ```

  

- ### SyncLoopHook

  ```js
  let {SyncLoopHook} = require('tapable');
  // 某个监听事件 如果返回了值 这个方法会再次执行，只有返回undefined这个方法才会停止执行
  class Lesson {
    constructor(){
      this.index = 0;
      this.hooks = {
        arch: new SyncLoopHook(['name','age']) 
      }
    }
    tap(){ 
      this.hooks.arch.tap('node',  (name) => { 
        console.log('node', name);
        return ++this.index == 3?undefined:'再来一次'
      });
      this.hooks.arch.tap('react',  (data) =>{
        console.log('react', data);
      });
      this.hooks.arch.tap('webpack', function (data) {
        console.log('webpack', data);
      });
    }
    start(){
      this.hooks.arch.call('jw');
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  ```

  ### 手动实现SyncLoopHook

  ```js
  class SyncLoopHook{ 
    constructor(args) { 
      this.tasks = [];
    }
    tap(name,task){
      this.tasks.push(task);
    }
    call(...args){
      this.tasks.forEach(task => {
        let ret;
        do{
          ret = task(...args);
        } while (ret !== undefined)
      });
    }
  }
  let total = 0;
  let hook = new SyncLoopHook(['name']);
  hook.tap('node',function (name) {
    console.log('node',name);
    return ++total == 3?undefined :'1'
  }); 
  hook.tap('react', function (name) {
    console.log('react', name);
    
  }); 
  hook.call('jw');
  ```

  

## 异步钩子

- ### AsyncParallelHook

  ```js
  let { AsyncParallelHook } = require('tapable');
  class Lesson {
    constructor() {
      this.hooks = {
        arch: new AsyncParallelHook(['name'])
      }
    }
    tap() {
      this.hooks.arch.tapAsync('react', (name, cb) => {
        setTimeout(() => {
          console.log('react', name);
          cb(); // BailHook
        }, 2000);
      });
      this.hooks.arch.tapAsync('node', (name, cb) => {
        setTimeout(() => {
          console.log('node', name);
          cb();
        }, 2000);
      });
    }
    start() {
      this.hooks.arch.callAsync('jw', function () {
        console.log('end');
      });
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  
  ```

  ### 手写实现AsyncParralleHook

  ```js
  // let {AsyncParralleHook} = require('tapable');
  class AsyncParralleHook {
    constructor() {
      this.tasks = [];
    }
    tapAsync(name, task) {
      this.tasks.push(task);
    }
    callAsync(...args) { // express 中的中间件的原理
      let finalCallback = args.pop();
      let index = 0; // Promise.all方法
      let done = () => { // 提供给用户一个done方法
        index++;
        if (index === this.tasks.length) finalCallback();
      }
      this.tasks.forEach(task => task(...args, done));
    }
  }
  let hook = new AsyncParralleHook(['name']);
  hook.tapAsync('node', function (name, cb) {
    setTimeout(() => {
      console.log('node');
      cb();
    }, 1000);
  });
  hook.tapAsync('react', function (name, cb) {
    setTimeout(() => {
      console.log('react');
      cb();
    }, 1000);
  });
  
  hook.callAsync('jw', function () {
    console.log('all')
  });
  ```

  ```js
  // let {AsyncParralleHook} = require('tapable');
  
  // 绑定事件的三种方式 tap 绑定同步 tapAsync 异步的 tapPromise
  //                  call         callAsync      promise
  class AsyncParralleHook {
      constructor() {
        this.tasks = [];
      }
      tapPromise(name, task) {
        this.tasks.push(task);
      }
      promise(...args) { // express 中的中间件的原理
       let promises = this.tasks.map(task=>task());
       return Promise.all(promises)
      }
    }
    let hook = new AsyncParralleHook(['name']);
    hook.tapPromise('node', function (name) {
      return new Promise((resolve,reject)=>{
        setTimeout(() => {
          console.log('node');
          resolve();
        }, 1000);
      })
    });
    hook.tapPromise('react', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react');
          resolve();
        }, 1000);
      })
    });
    hook.promise('jw').then(function () {
      console.log('all')
    });
  ```

- ### AsyncSeriesHook 异步串行

  ```js
  let { AsyncSeriesHook } = require('tapable');
  // AsyncSeriesHook 串行执行 tapAsync + callAsync
  //                         tapPromise + promise
  class Lesson {
    constructor() {
      this.hooks = {
        arch: new AsyncSeriesHook(['name'])
      }
    }
    tap() {
      this.hooks.arch.tapPromise('react', (name) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('react', name);
            resolve();
          }, 2000);
        })
      });
      this.hooks.arch.tapPromise('node', (name) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('node', name);
            resolve();
          }, 2000);
        })
      });
    }
    start() {
      this.hooks.arch.promise('jw').then(function () {
        console.log('end');
      });
    }
  }
  let l = new Lesson();
  l.tap();
  l.start();
  ```

  ### 手写实现AsyncSerieslHook

  ```js
  class AsyncSerieslHook{
      constructor(){
        this.tasks = [];
      }
      tapAsync(name,task){
        this.tasks.push(task);
      }
      callAsync(...args){ // express 中的中间件的原理
        let finalCallback = args.pop();
        let index = 0;
        let next = ()=>{ // compose
          if (index === this.tasks.length) return finalCallback();
          let task = this.tasks[index++];
          task(...args,next);
        }
        next();
      }
    }
    let hook = new AsyncSerieslHook(['name']);
    hook.tapAsync('node',function (name,cb) {
      setTimeout(() => {
        console.log('node');
        cb('错误');
      }, 1000);
    });
    hook.tapAsync('react', function (name,cb) {
      setTimeout(() => {
        console.log('react');
        cb();
      }, 1000);
    });
    
    hook.callAsync('jw',function () {
      console.log('all')
    });
  ```

  

- ### AsyncSeriesWaterfallHook

```js
let {AsyncSeriesWaterfallHook} = require('tapable');
// AsyncSeriesBailHook
// tapable (compose + promise + asyncCallback)
// webpack
let h = new AsyncSeriesWaterfallHook(['name']);
// tapAsync tapPromise
h.tapAsync('node',function (name,cb) {
  setTimeout(() => {
    console.log('node');
    cb('error','我饿了'); // 第一个是错误信息,第二个是传递的参数
  }, 1000);
});
h.tapAsync('react', function (data, cb) {
  setTimeout(() => {
    console.log('react', data);
    cb();
  },2000);
});

h.callAsync('jw',function () {
  console.log('end');
});
```

### 手写实现AsyncSeriesWaterfallHook

```js
// let {AsyncSerieslHook} = require('tapable');
class AsyncSeriesWaterfallHook{
    constructor(){
      this.tasks = [];
    }
    tapAsync(name,task){
      this.tasks.push(task);
    }
    callAsync(...args){ // express 中的中间件的原理
      let finalCallback = args.pop();
      let index = 0;
      let next = (err,data)=>{ 
        let task = this.tasks[index];
        if(!task){
            return finalCallback();
        }
        if(index === 0){
            task(...args,next);
        }else{
             task(data,next);
        }
        index++;
      }
      next();
    }
  }
  let hook = new AsyncSeriesWaterfallHook(['name']);
  hook.tapAsync('node',function (name,cb) {
    setTimeout(() => {
      console.log('node');
      cb('err','23213');
    }, 1000);
  });
  hook.tapAsync('react', function (name,cb) {
    setTimeout(() => {
      console.log('react');
      cb(null);
    }, 1000);
  });
  
  hook.callAsync('jw',function () {
    console.log('all')
  });
```

