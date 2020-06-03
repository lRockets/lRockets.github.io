---
title: typescript
tags:
 - typescript
categories:
 -  javascript
---



## typescript优势

- 编写代码错误提示
- 编辑器语法提示
- 类型声明可以直观看到代码潜在的语义，可读性更好

## 环境搭建

```bash
npm install typescript ts-node -g
```

## 基本类型

### string

```js
let a:string='abc';
```

### number

```js
let a:number=1;
```

### boolean

```js
let a:boolean=true;
```

### Array

```js
var c:Array<number>=[1,2,3,4];  // c数组里面的每个值都是数字
var d:number[]=[1,2,3,4]; // d数组里面的每个值都是数字
```

### Tuple

元组，跟数组差不多，里面的内容可以为多个类型，编译出来的也是数组，元素的个数是固定的，位置不能颠倒

```js
let my_tuple:[string,number]=['r',199];  // 第一个值得类型为字符串，第二个为数字
```

### any

任意值

```js
let a:any;
a=10;
a='10';
a=[1,2,3];
```

### enum 

枚举类型

```js
enum Flag {success=1,error=2};
let s:Flag=Flag.success;
console.log(s)
```

### null和undefined

空或未定义

### never

其他类型，包括null和undefined

### void

没有return值的时候使用,方法没有返回任何类型

```js
function add():void{
    console.log(1)
}
```



## 接口

程序的接口是必须传入某值，其他的不管

`函数调用必须要有firstName  lastName`

```js
interface Fullname{
    firstName:string;
    lastName:string;
}
function printName(name:Fullname){
    console.log(name.firstName+'--'+name.lastName)
}

var obj={
    age:20,
    firstName:'张',
    lastName:'三'
}
printName(obj);  // 这样调用还可以传入其他值
printName({     // 这样调用会报错 不能传入其他值
    age:20,
    firstName:'张',
    lastName:'三'
});
```

### 可选属性

```tsx
interface Point{
	x?:number
}
```

### 只读属性

```tsx
interface Point{
	readonly x:number;
	readonly y:number;
}


let a:number[]=[1,2,3];
let ro:ReadonlyArray<number>=a;
```

### 可索引接口

```js
interface StringArray{
    [index:number]:string
}

let arr:StringArray=['1','2','ass'];
console.log(arr)
```

### 混合类型

```js
function getCounter():Counter{
    let counter=(function(star:number){

    }) as Counter
    counter.interval=123;
    counter.reset=function(){
        console.log(counter);
    }
    return counter
}

let c=getCounter();
c(10);
c.reset();
```

### 接口继承

```tsx
interface Shape {
    color: string;
}
// interface Square extends Shape, PenStroke 可以继承多个
interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```



## 类

```tsx
class Person{
    name:string;
    constructor(name:string){
        this.name=name;
    }
    run():string{
        return `${this.name}在运动`
    }
}


class Web extends Person{   // extends继承
    constructor(name:string){
        super(name); // 初始化父类的构造函数
    }
}

var w=new Web("李四");
console.log(w.run())
```

### 修饰符

`public`：公有,默认值

`private`:私有属性，外部获取不到

```tsx
class Person{
	private name:string;
	constructor(name:string){
		this.name=name;
	}
}

let person=new Person('name');
console.log(person.name)  // name属性外部访问报错
```

`protected`:保护类型 在类里面和子类可以访问  外部不能访问

```tsx
class Person{
	private name:string;
	constructor(name:string){
		this.name=name;
	}
}
```



## as

```tsx
// 断言 as 分别判断不同类型的不同处理方式
function sum(input:string | number) :number {
   const str = input as String;
   if(str.length){
     return str.length
   }else{
      const number = input as Number;
      return number.toString().length
   }
} 
=>
function sum(input:string | number) :number {
   if((<string>input).length){
     return (<string>input).length
   }else{
      return input.toString().length
   }
} 
```

