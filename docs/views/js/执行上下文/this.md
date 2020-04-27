---
date: 2020-04-25
categories: javascript
title: js中的this
---

<u>**你以为 你以为的  就是你以为的**</u>



## 规则

### 小括号直接调用，this指向window

```js
function a(){
    alert(this);  //window
}
a();  
```

自执行函数中的this永远是window



### 函数作为对象的一个方法，对象打点调用，函数的this就是这个对象

```js
function func(){
    alert(this.a);   // 10
}

var obj={
    "a":10,
    "b":20,
    "c":func
}

obj.c();
```



### 函数是事件处理函数，函数的this是这个触发事件的对象

```js
function fun(){
    this.style.color='red';
}

var btn=document.getElementById('btn');
btn.onclick=fun();    //this指向btn
```



### 定时器调用函数，this是window对象

```js
function func(){
    alert(this.a); 
}

var a=888;
setTimeout(func(),1000);
```



### 数组中存放的函数，被数组索引调用，this就是这个数组

```js
function func(){
    alert(this == arr)   // true
}

var arr=[func,'东风'];
arr[0]();
```



```js
// this指向arr，arr.length返回数组的长度 2
function func(a,b,c,d,e,f){
    alert(this.length)  结果为2
}
var length=10;
var arr=[func,'东风'];
arr[0]();
```



### es6箭头函数里的this指的是定义这个函数时外层代码的this



用new运算符调用的函数，this指向的是new出来的对象

```js
function Fun(){
   this.name='l';
   this.age=10;
}

var obj=new Fun().name;   // this => obj
console.log(obj)
```





### call() ,apply()

call和apply都能改变this的指向，只是传参数的方式不一样

```js
call(this,arg1,arg2);

function f1(){console.log(1)}
function f2(){console.log(2)}
f1.call(f2) // =>在Function原型上执行call方法，将this改成f2，执行f1(),结果1
f1.call.call(f2) // =>在Function原型上执行call方法，将this(f1.call)改成f2，执行f2.call(f2),结果2
Function.prototype.call(f1)// =>Function.prototype为空函数，所以返回undefined
fn1.call(null) // =>非严格模式下this指向window
fn1.call(undefined)// =>非严格模式下this指向window

[].slice.call(arguments) // 将类数组转换为真数组

apply(this,[4,2]);
```



求数组当中最大的数

```js
Math.max.apply(null,[1,2,4,22,32]);   // 32
```



## 题目

```js
function fun(m,n,o,p,q,r){
	alert(this.length);   // 结果为4
}
function f(a,b){
	arguments[0](9,10,11,12);
}

f(fun,5,6,7);
```

使用`arguments.callee`调用函数本身

`arguments.length`:实参的个数

`callee.length`:形参的个数

函数由`arguments`调用，所以this指向的是`arguments,arguments.length`指向的是函数实际传参的个数，`arguments.length`的个数为`4`，`fun,5,6,7,`所以弹出`4`



 ```js
var x=15;
var foo={
    x:20,
    bar:function(){
        var x=30;
        return this.x;
    }
}
alert(foo.bar())  
// 20    函数有foo调用,this指向foo，foo中有x：20 所以结果为20

alert((foo.bar)())  
// 20	跟上面一样  只是加了括号

alert((foo.bar=foo.bar)())  
// 15   foo.bar-foo.bar返回true，相当于在window下执行函数  this执行window

alert((foo.bar,foo.bar)())  
// 15   foo.bar-foo.bar返回true，相当于在window下执行函数  this执行window

alert(foo.bar.call(window))  
// 15  this绑定到window上

alert(foo.bar.call(foo))   
// 20  this绑定到foo上
 ```

