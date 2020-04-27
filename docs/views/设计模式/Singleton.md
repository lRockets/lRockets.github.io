---
title: 单体模式
date: 2020-04-25
categories:
 -  设计模式
---

## 1.概念介绍
**单体模式(Singleton Pattern)**的思想在于**保证一个特定类仅有一个实例**，即不管使用这个类创建多少个新对象，都会得到**与第一次创建的对象完全相同**。 

它让我们能将代码组织成一个逻辑单元，并可以通过单一变量进行访问。   

单体模式有以下优点：   
* 用来划分命名空间，减少全局变量数量。   
* 使代码组织的更一致，提高代码阅读性和维护性。
* 只能被实例化一次。

但在JavaScript中没有类，只有对象。当我们创建一个新对象，它都是个新的单体，因为JavaScript中永远不会有完全相等的对象，除非它们是同一个对象。   
因此，**我们每次使用对象字面量创建对象的时候，实际上就是在创建一个单例**。   
```js
let a1 = { name : 'leo' };
let a2 = { name : 'leo' };
a1 === a2;  // false
a1 == a2;   // false
```

这里需要注意，单体模式有个条件，是该对象能被实例化，比如下面这样就不是单体模式，因为它不能被实例化：   
```js
let a1 = {
    b1: 1, b2: 2,
    m1: function(){
        return this.b1;
    },
    m2: function(){
        return this.b2;
    }
}
new a1();  // Uncaught TypeError: a1 is not a constructor
```
下面展示一个单体模式的基本结构：   
```js
let Singleton = function (name){
    this.name = name;
    this.obj = null;
}
Singleton.prototype.getName = function(){
    return this.name;
}
function getObj(name){
    return this.obj || (this.obj = new Singleton(name));
}
let g1 = getObj('leo');
let g2 = getObj('pingan');
g1 === g2;    // true
g1 == g2;     // true
g1.getName(); // 'leo'
g2.getName(); // 'leo'
```
从这里可以看出，单体模式只能实例化一次，后面再调用的话，都是使用第一次实例化的结果。   

## 2.应用场景
单例模式只允许实例化一次，能提高对象访问速度并且节约内存，通常被用于下面场景：
* 需要频繁创建再销毁的对象，或频繁使用的对象：如：弹窗，文件；   
* 常用的工具类对象；   
* 常用的资源消耗大的对象；   

## 3.实现弹框案例
这里我们要用单体模式，创建一个弹框，大概需要实现：元素值创建一次，使用的时候直接调用。   
因此我们这么做：   
```js
let create = (() => {
    let div;
    return () => {
        if(!div){
            div = document.createElement('div');
            div.innderHTML = '我是leo创建的弹框';
            div.style.display = 'none';
            div.setAttribute("id", "leo");
            document.body.appendChild(div);
        }
        return div;
    }
})();
// 触发事件
document.getElementById('otherBtn').onclick = () => {
    let first = create();
    first.style.display = 'block';
}
```

## 4.使用new操作符
由于JavaScript中没有类，但JavaScript有`new`语法来用构造函数创建对象，并可以使用这种方法实现单体模式。     
当使用同一个构造函数以`new`操作符创建多个对象，获得的是指向完全相同的对象的新指针。

通常我们使用`new`操作符创建单体模式的三种选择，让构造函数总返回最初的对象：   
* 使用全局对象来存储该实例（不推荐，容易全局污染）。   
* 使用静态属性存储该实例，无法保证该静态属性的私有性。    
```js
function Leo(name){
    if(typeof Leo.obj === 'object'){
        return Leo.obj;
    }
    this.name = name;
    Leo.obj = this;
    return this;
}
let a1 = new Leo('leo');
let a2 = new Leo('pingan');
a1 === a2 ; // true
a1 ==  a2 ; // true
```
唯一的缺点就是`obj`属性是公开的，容易被修改。   

* 使用闭包将该实例包裹，保证实例是私有性并不会被外界修改。  

我们这通过重写上面的方法，加入闭包：    
```js
function Leo(name){
    let obj;
    this.name = name;
    obj = this;       // 1.存储第一次创建的对象
    Leo = function(){ // 2.修改原来的构造函数
        return obj;
    }
}
let a1 = new Leo('leo');
let a2 = new Leo('pingan');
a1 === a2 ; // true
a1 ==  a2 ; // true
```
当我们第一次调用构造函数，像往常一样返回this，而后面再调用的话，都将重写构造函数，并访问私有变量`obj`并返回。   


## 参考资料   
1. 《JavaScript Patterns》