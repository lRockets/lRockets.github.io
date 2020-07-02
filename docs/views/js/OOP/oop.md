---
title: js面向对象
date: 2020-04-25
tags:
 - 面向对象
categories:
 -  javascript
---

面向对象特征：继承，封装，多态

继承：子类继承父级的属性和方法

多态:包括重载和重写，js中只有重写，但是却可以模拟重载



## 构造函数

被new字符调用的函数，成为构造函数，new出来的对象成为构造函数的实例

```js
function CreatePerson(name,age){
	this.name=name;
	this.age=age;
	this.run=function(){
		console.log(this.name,this.age)
	}
}
var person=new CreatePerson('张三',18);
var person2=new CreatePerson('王麻子',25);
person.run();
```

```js
function CreatePerson(name,age){
	this.name=name;
	this.age=age;
	this.run=function(){
		console.log(this.name,this.age)
	}
    return 123;  
    return {sex:'男'};  
    // 构造函数中，浏览器会默认把实例返回,如果手动加了return
    	// 返回值类型不会改变数据,
        // 返回引用类型，当前实例会被自己返回的引用类型覆盖
}
var person=new CreatePerson('张三',18); 
console.log(person); 
// 如果return 123,值为{name: "张三", age: 18, run: ƒ}
// 如果 return {sex:'男'}，值为{sex:'男'}
```



1 . 任何对象都拥有`__proto__`(隐式原型) 属性, 一般指向他们的构造函数的原型 (prototype).

```js
var a = new Array ()
// a 是一个数组对象 默认拥有__proto__ 属性
console.log(a.__proto__ === Array.prototype);  // true
白话就是 由谁创建 其__proto__ 就指向谁的 prototype
```

2 . 原型链的顶端是Object.prototype，其 `__proto__`为 null

```js
console.log(Object.prototype.__proto__ === null); // true
// 这是一个特例,为了避免JavaScript死循环.
```

3 . 所有函数都拥有prototype （显式原型）属性

```js
任何函数的 prototype.__proto__ 都指向 Object.prototype 特例见第 2
```

4 . 所有函数都是Function 的 实例

```js
function fn () {
  // some code
}
// fn 是 Function 构造函数创建出来的
// 因此 fn 的 __proto__ 属性指向 Function 的 原型对象
console.log(fn.__proto__ === Function.prototype);  // true
```

类似的 十分容易就能理解

```js
var obj = {}  // 可以看做是 var obj = new Object ()
var arr = []   //  var obj = new Array ()
// 因此他们的构造函数分别是 Object 和 Array
console.log(obj.__proto__ === Object.prototype); // true
console.log(arr.__proto__ === Array.prototype);    // true
```

5 . 更奇葩的来了，Object Function Array 本身也都是一个函数，由于是最常用的，所以JavaScript帮我们实现了

```js
// 当我们通过构造函数的方式来创建一个对象 ，其本质也是new一个普通的函数
// 因此可以得出
console.log(Function.__proto__ === Function.prototype); // true
console.log(Object.__proto__ === Function.prototype );  // true
console.log(Array.__proto__ === Function.prototype);    // true
// 可印证 第4点
```

6 . 原型对象中又拥有constructor属性,该属性指向函数本身,这个好理解

```js
console.log(Function.prototype.constructor === Function); // true
console.log(Object.prototype.constructor === Object);     // true
console.log(Array.prototype.constructor === Array);       // true
```

`特殊：`

```js
typeof Function.prototype // => function
typeof Function.prototype.prototype  // => undefined
Object.constructor == Function  // => true
```





## new()到底做了什么

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象） ；
3. 执行构造函数中的代码（为这个新对象添加属性） ；
4. 返回新对象。



## 原型与原型链

- 
  当我们声明了一个函数(构造函数,类)的时候，天生自带了一个`prototype`的属性。并且这个`prototype`的值也是一个对象类型的。这个对象类型值也有一个天生自带的属性叫`constructor`并且这个属性的值是函数(构造函数，类)本身
-  这个类的实例也会有一个叫做`__proto_`_的天生自带的属性,并且这个属性的值也是一个对象类型的。这个值是这个实例所属类的原型.
- 每一个引用类型都有一个天生自带的属性叫`__proto__`,所以说我们的`prototype`的值也有天生自带一个`__proto__`的属性。并且这个属性的值也是一个对象类型，一直到我们的基类`Object`
- 通过类的原型添加的属性和方法都是公有的，每个实例都会自带
- 一个实例的方法在运行的时候，如果这个方法是自己私有的，那么就直接用，如果不是私有的，那么通过`__proto__`去所属类的原型上去查找，如果还没有就通过原型的`__proto_`_一直查到基类的`Object`.如果还没有报错，如果有就直接用了。我们把这种通过`__proto__`查找的机制叫做原型链.

```js
function Person(name,age,sex){
    this.name=name;
    this.age=age;
    this.sex=sex;
}
var xiaoming=new Person("xiaoming",12,"男")
console.log(Person.prototype === xiaoming.__proto__)  // true
```

`new Person`**也能够执行构造函数，只是没传参**

**构造函数的prototype指向谁，new出来实例的`__proto__`就指向谁，`__proto__`有原型链查找功能**

```js
function Person(name,age,sex){
    this.name=name;
    this.age=age;
    this.sex=sex;
}
Person.prototype=Math;
var xiaoming=new Person("小明",20,"男");
xiaoming.random(); // 0.3456289539654427
```

某一个方法中的this=>看执行的时候，前面是谁，this就是谁

1. 需要先确定this的指向（this是谁）
2. 把this替换成对应的代码
3. 按照原型链查找的机制，一步步查找结果

```js
function Fn(){
    this.x=100;
    this.y=200;
    this.getY=function(){
        console.log(this.y);
    }
}
Fn.prototype={ 
    // prototype写成对象的模式，需要设置constructor，不写会把需要设置constructor改为object
    constructor:Fn, 
    y:300,
    getX:function(){
        console.log(this.x)
    },
    getY:function(){
        console.log(this.y)
    }
}
var f=new Fn;
f.getX();  // =>console.log(f.x)=>寻找私有属性x：100=>值为:100
f.__proto__.getX(); 
// =>console.log(f.__proro__.x)=>console.log(Fn.prototype.x)=>原型上没有 => undefined

Fn.prototype.getX()  // => Fn.prototype.x=>undefined
```



## 内置构造函数

### Object

系统内置一个Object函数，可以直接去new它，返回一个空对象

**`Object的prototype是所有对象的原型链终点`**



```js
var obj=new Object();
console.log(obj)  // {}

obj.a=1;
obj.b=2;
console.log(obj);  // {a: 1, b: 2}
```

**json对象的`__proto__`指向Object的prototype**

```js
var obj={
    "a":1,
    "b":2
}
console.log(obj.__proto__ === Object.prototype)  // true
```



### Function

系统内置一个Function函数，用于构造函数。事实上，所有function字面量，都是它的实例。

`任何函数都是Function的实例，Object也是Function的实例，Function自己也是自己的实例`

`Object`都是`Function`， `new`出来的

#### 函数的三种角色

1. 普通函数
   - 堆栈内存释放
   - 作用域链
2. 类
   - `prototype` 原型
   - `__proto__`原型链
   - 实例
3. 普通对象
   - 和普通的`obj`没啥区别,就是对键值对的增删改查

```js
function Fn(){
	var n=10;
	this.m=100;
}
Fn.prototype.aa=function(){
	console.log('aa');
}
Fn.bb=function(){
	console.log('bb');
}
Fn() // this:window
var f=new Fn(); // this:f
console.log(f.n) // undefined n是变量f，与实例无关
f.m // 100 实例的所有属性
f.aa() // 'aa'
f.bb() // Fn.bb是把Fn当做普通的对象，Fn的实例下面没有bb  f.bb() is not a function
```



```js
Function.__proto__ === Function.prototype  // true
Object.__proto__ === Function.prototype  // true
Object.__proto__ === Function.__proto__  //true
Function.__proto__.__proto__=== Object.prototype  // true
Function.prototype.__proto__ === Object.prototype  // true
```





![logo](../../images/prototype1.png)



```js
function sum(a,b){
    alert(a+b);
}
sum(4,5);  // 9
```

```js
var sum=new Function("a","b","alert(a+b)");
sum(4,5);  // 9
```



### Array

Array是系统内置的数组构造函数，用于构造数组。

`Array是由Function new出来的`



![logo](../../images/prototype.png)



```js
Array.__proto__ == Function.prototype  // true	
Array.__proto__.__proto__ == Object.prototype // true
```



```js
var arr=new Array(5);    // length为5的，5个空值
console.log(arr.length)   
```

##### 小题目

写一个函数，接收两个参数，数字n和字符串str,函数将返回重复n次的str,用一句话来实现

```js
function repeat(n,str){
    return new Array(n+1).join(str);
}
repeat(3,"你好");
```



### RegExp

系统内置的正则构造函数，用于构造正则

`RegExp是由Function new出来的`

```js
RegExp.__proto__ == Function.prototype  // true
```



```js
// var reg=/\d/g;
var reg=new RegExp("\\d","g")
var str="123aaaa3214312";
str.replace(reg,'*');
```



### Number

系统内置的Number构造函数，用于构造数字

`Number是由Function new出来的`

```js
Number.__proto__ == Function.prototype  // true
```

```
var  a=new Number(3);
console.log(a);
```

![logo](../../images/number.png)

**有个坑**

new Number(0),返回的是真，new Number创建数字是个对象，空对象也返回真

```js
if(new Number(0)){
    alert(1);  // 会弹出1
}
```



### String

`String是由Function new出来的`

```js
var str=new String("1");   // String {"1"}
```

String的常用api,都是写在prototype上面的

```js
String.prototype.szmdx=function(){
    return this[0].toUpperCase()+this.slice(0);
}
console.log('addfdf'.szmdx());  // Aaddfdf
```



### Boolean

`Boolean是由Function new出来的`

```js
var str=new Boolean(false);    // Boolean {false}
```



## constructor

`任何一个构造函数的prototype身上都有个constructor属性，指向构造函数`

![logo](../../images/constructor.png)



constructor属性很容易被更改



## instanceof

检测某一个对象是不是某一个构造函数的实例

```js
var obj={};
obj instanceof Object  // true
```



## isPrototypeOf

来判断一个对象是否存在于另一对象的原型链中，此时不使用构造函数作为中介

```js
var a1 = new Array();
console.log(Array.prototype.isPrototypeOf(a1));
// true

console.log(Array.prototype.isPrototypeOf([1,2,3]));
// true
```

## hasOwnProperty

判断对象实例的是否具有某个属性



## propertyIsEnumerable

判断属性是否能够被枚举

```js
Object.prototype.sex='男';
var obj={name:'xx',age:10};
for(var key in obj){ // for in循环默认会把所有私有公有的属性都遍历 name,age,sex
    if(obj.propertyIsEnumerable(key)){
    	console.log(key)  // name,age,sex
    }
}
```

## Object.create

创建一个拥有指定原型和若干属性的对象

```js
function _create(obj){ // object.create原理
    function Fn(){}
    Fn.prototype = obj;
    return new Fn();
}
```



## 继承



### 原型继承

让Student类继承Person类，然后还有些自己的属性

核心：原型链继承并不是把父类的方法和属性克隆一份给另一个类，而是类之间增加了原型链的链接

**把父类的私有公有属性方法，都变成子类的公有属性方法**

![logo](../../images/jc.png)



```js
function Person(){
    
}

Person.prototype.say=function(str){
	alert(str);    
}

function Student(){
    
}
Student.prototype=new Person();  //  Student类的原型绑定到Person类的实例上

Person.prototype.study=function(){
	alert('学习中');    
}

var peo=new Person();

peo.say('hello');

var student=new Student();
student.say('你好');

```



### call继承

```js
var father = function() {
	this.age=52;
	this.say=function(){
		alert('hello i am '+ this.name+ ' and i am '+this.age + 'years old');
	}
}

var child = function() {
	father.call(this);  // 改变this指向，把父类的私有属性方法编程私有的
	this.name = 'bill';
}

```

### 混合继承

call继承+原型继承

```js
function Box(age) {
    this.name = ['Lee', 'Jack', 'Hello']
    this.age = age;
}
Box.prototype.run = function () {
	return this.name + this.age;
};
function Desk(age) {
	Box.call(this, age); //对象冒充
}
Desk.prototype = new Box(); //原型链继承
var desk = new Desk(100);
alert(desk.run());
```



### 冒充对象继承

```js
<script>
    // 冒充对象继承：把父类私有的+公有的克隆一份一模一样的 给子类私有的
    function A() {
        this.x = 100;
    }
    A.prototype.getX = function () {
        console.log(this.x);

    };

    function B(){
        var temp = new A;
        for(var key in temp){
            console.log(key);
            this[key] = temp[key];
        }
        temp = null;
    }
    var n = new B;
    console.log(n.x);
    n.getX();//这回getX这个方法成为了B私有的 不在prototype上
</script>
```



### 寄生组合式继承

<https://www.cnblogs.com/niulina/p/5712263.html>

```js
    function SuperType(name){
        this.name = name;
        this.colors = ["red", "blue", "yellow"];
    }

	function SubType(name){
        SuperType.call(this, name);
         SubType.prototype = Object.create(SuperType.prototype);
         SubType.prototype.constructor = SubType;
    }

    var s1 = new SubType("niulina");
```





## 练习

### 阿里经典面试题

```js
function Foo(){
	getName=function(){
		console.log(1);
	}
	return this;
}
Foo.getName=function(){
	console.log(2);
}
Foo.prototype.getName=function(){
	console.log(3);
}
var getName=function(){
	console.log(4);
}
function getName(){
	console.log(5);
}

Foo.getName();
getName();
Foo().getName();  
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();

// 首先预解析,函数表达式不提升,function getName(){console.log(5);}，函数提升到顶部。
// 执行Fn.getName()函数,Foo.getName=function(){console.log(2);} 得到2
// getName() 走var getName=function(){console.log(4);}函数表达式 得到4
// Foo().getName();  
	// 执行Foo()，函数预解析，getName为全局，将全局替换为function getName(){console.log(1);},执行window.getName() 得到1
// getName(); 执行全局getName() 得到1
// new Foo.getName();
	// 先执行Foo.getName(),然后被new调用，得到2
// new Foo().getName();
	// 先执行new Foo();然后执行getName();执行prototype上的方法，得到3
// new new Foo().getName(); 
	// 执行顺序 new Foo() => new Foo().getName() => new new Foo().getName()
	// 创建实例，执行原型getName()方法得到3
```

 https://www.cnblogs.com/petterguo/p/9152956.html 

```js
 function Fn(){
     var num = 10; //在实例运算的时候，这个里的私有变量跟实例没有关系
     this.x = 100; //window.x = 100 相当于给window添加了x的属性值为100
     this.getX = function (){ //相当于给window添加了一个getX变量，至始一个匿名函数
         return (this.x); //100
     }
 }
var f = new Fn(); //  f = {x:100,getX:function (){console.log(this.x)}}
console.log(f);
console.log(f.hasOwnProperty('X')) // false
console.log(f.num); //undefined
```



