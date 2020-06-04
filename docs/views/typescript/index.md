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

`private`:私有属性，只能自己访问，子类和其他都不能访问

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

### 静态属性

```tsx
class Person{
	static age:number=20;
}
```

### 抽象类

- 抽象类不能被实例化，只能被继承，可以封装一些公共的方法和属性
- 无法创建抽象类的实例
- 抽象方法不能在抽象类中实现,只能在抽象类的具体子类中实现，而且必须实现

## 函数

```tsx
interface GetFunc{
    (x:string,y:string):string
}

let func:GetFunc=(x:string,y:string)=>{
    return x+y;
}

console.log(func('2','1'))
```

### 重载

- 重写是指子类重写继承自父类中的方法
- 重载是指为同一个函数提供多个类型定义

```tsx
function double(val:number):number
function double(val:string):string
function double(val:any):any{
  if(typeof val == 'number'){
    return val *2;
  }
  return val + val;
}

let r = double(1);
console.log(r);
```

### arguments

```tsx
function sum(...parameters: number[]) {
    let args: IArguments = arguments;
    return Array.from(args).reduce((total,cur)=>total+cur);
}
let total=sum(1, 2, 3);
console.log(total)

```

## tsconfig.json

```tsx

"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
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

