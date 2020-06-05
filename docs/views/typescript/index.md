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

```js
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

## 结构类型系统

### 接口的兼容性

- 如果传入的变量和声明的类型不匹配，TS就会进行兼容性检查
- 原理是`Duck-Check`,就是说只要目标类型中声明的属性变量在源类型中都存在就是兼容的

```js
interface Animal {
    name: string;
    age: number;
}

interface Person {
    name: string;
    age: number;
    gender: number
}
// 要判断目标类型`Person`是否能够兼容输入的源类型`Animal`
function getName(animal: Animal): string {
    return animal.name;
}

let p = {
    name: 'zhufeng',
    age: 10,
    gender: 0
}

getName(p);
//只有在传参的时候两个变量之间才会进行兼容性的比较，赋值的时候并不会比较,会直接报错
let a: Animal = {
    name: 'zhufeng',
    age: 10,
    gender: 0
}
```

### 基本类型的兼容性

```js
//基本数据类型也有兼容性判断
let num : string|number;
let str:string='zhufeng';
num = str;

//只要有toString()方法就可以赋给字符串变量
let num2 : {
  toString():string
}

let str2:string='jiagou';
num2 = str2;
```

### 类的兼容性

- 在TS中是结构类型系统，只会对比结构而不在意类型

```js
class Animal{
    name:string
}
class Bird extends Animal{
   swing:number
}

let a:Animal;
a = new Bird();

let b:Bird;
//并不是父类兼容子类，子类不兼容父类
b = new Animal();
class Animal{
  name:string
}
//如果父类和子类结构一样，也可以的
class Bird extends Animal{}

let a:Animal;
a = new Bird();

let b:Bird;
b = new Animal();
//甚至没有关系的两个类的实例也是可以的
class Animal{
  name:string
}
class Bird{
  name:string
}
let a:Animal ;
a = new Bird();
let b:Bird;
b = new Animal();
```

### 函数的兼容性

- 比较函数的时候是要先比较函数的参数，再比较函数的返回值

#### 比较参数

```js
type sumFunc = (a:number,b:number)=>number;
let sum:sumFunc;
function f1(a:number,b:number):number{
  return a+b;
}
sum = f1;

//可以省略一个参数
function f2(a:number):number{
   return a;
}
sum = f2;

//可以省略二个参数
function f3():number{
    return 0;
}
sum = f3;

 //多一个参数可不行
function f4(a:number,b:number,c:number){
    return a+b+c;
}
sum = f4;
```

#### 比较返回值

```js
type GetPerson = ()=>{name:string,age:number};
let getPerson:GetPerson;
//返回值一样可以
function g1(){
    return {name:'zhufeng',age:10};
}
getPerson = g1;
//返回值多一个属性也可以
function g2(){
    return {name:'zhufeng',age:10,gender:'male'};
}
getPerson = g2;
//返回值少一个属性可不行
function g3(){
    return {name:'zhufeng'};
}
getPerson = g3;
//因为有可能要调用返回值上的方法
getPerson().age.toFixed();
```

### 函数参数的协变

- 当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功
- `"strictFunctionTypes": false`

```js
let sourceFunc = (args: number | string) => { }
let target1Func = (args: number | string) => { }
let target2Func = (args: number | string | boolean) => { }
sourceFunc = target1Func;
sourceFunc = target2Func;

interface Event {
    timestamp: number;
}

interface MouseEvent extends Event {
    eventX: number;
    eventY: number;
}

interface KeyEvent extends Event {
    keyCode: number;
}

function addEventListener(eventType: EventType, handler: (n: Event) => void) { }

addEventListener(EventType.Mouse, (e: MouseEvent) => console.log(e.eventX + ', ' + e.eventY));
addEventListener(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.eventX + ', ' + e.eventY)));
```

### 泛型的兼容性

- 泛型在判断兼容性的时候会先判断具体的类型,然后再进行兼容性判断

```js
//接口内容为空没用到泛型的时候是可以的
//1.接口内容为空没用到泛型的时候是可以的
interface Empty<T>{}
let x!:Empty<string>;
let y!:Empty<number>;
x = y;

//2.接口内容不为空的时候不可以
interface NotEmpty<T>{
  data:T
}
let x1!:NotEmpty<string>;
let y1!:NotEmpty<number>;
x1 = y1;

//实现原理如下,称判断具体的类型再判断兼容性
interface NotEmptyString{
    data:string
}

interface NotEmptyNumber{
    data:number
}
let xx2!:NotEmptyString;
let yy2!:NotEmptyNumber;
xx2 = yy2;
```

### 枚举的兼容性

- 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容
- 不同枚举类型之间是不兼容的

```js
//数字可以赋给枚举
enum Colors {Red,Yellow}
let c:Colors;
c = Colors.Red;
c = 1;
c = '1';

//枚举值可以赋给数字
let n:number;
n = 1;
n = Colors.Red;
```

## 类

```js
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

```js
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

```js
class Person{
	private name:string;
	constructor(name:string){
		this.name=name;
	}
}
```

### 静态属性

```js
class Person{
	static age:number=20;
}
```

### 抽象类

- 抽象类不能被实例化，只能被继承，可以封装一些公共的方法和属性
- 无法创建抽象类的实例
- 抽象方法不能在抽象类中实现,只能在抽象类的具体子类中实现，而且必须实现

## 函数

```js
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

```js
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

```js
function sum(...parameters: number[]) {
    let args: IArguments = arguments;
    return Array.from(args).reduce((total,cur)=>total+cur);
}
let total=sum(1, 2, 3);
console.log(total)
```

## @ts-ignore

忽略类型检查

```js
function createArray<T>(length:number,value:T):T[]{
    let arr:T[]=[];
    for(let i=0;i<length;i++){
        // @ts-ignore
        arr[i]=3;
    }
    return arr;
}

let arr=createArray<string>(3,'x');
console.log(arr);
```

## 泛型

- 泛型是在定义函数，接口或者类的时候，不预先指定类型，而在使用的时候再指定类型的一种特性
- 泛型`T`作用域只限于函数内部使用

```js
function fn<T>(num: T): Array<T> {
    let arr: Array<T> = [];
    arr.push(num);
    return arr;
}
fn<string>('1')
```

### 泛型类

```js
class MyArray<T>{
    private list:T[]=[];
    add(value:T) {
        this.list.push(value);
    }
    getMax():T {
        let result=this.list[0];
        for (let i=0;i<this.list.length;i++){
            if (this.list[i]>result) {
                result=this.list[i];
            }
        }
        return result;
    }
}
let arr=new MyArray();
arr.add(1); arr.add(2); arr.add(3);
let ret = arr.getMax();
console.log(ret);
```

### 泛型接口

```js
interface Calculate{
  <T>(a:T,b:T):T
}
let add:Calculate = function<T>(a:T,b:T){
  return a;
}
add<number>(1,2);
```

### 多个泛型参数

```js
function swap<A,B>(tuple:[A,B]):[B,A]{
  return [tuple[1],tuple[0]];
}
let swapped = swap<string,number>(['a',1]);
console.log(swapped);
console.log(swapped[0].toFixed(2));
console.log(swapped[1].length);
```

### 默认泛型类型

```js
function createArray3<T=number>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
let result2 = createArray3(3,'x');
console.log(result2);
```

### 泛型约束

在函数中使用泛型的时候，由于预先并不知道泛型的类型，所以不能随意访问相应类型的属性或方法。

```js
function logger<T>(val: T) {
    console.log(val.length); //直接访问会报错
}
//可以让泛型继承一个接口
interface LengthWise {
    length: number
}
//可以让泛型继承一个接口
function logger2<T extends LengthWise>(val: T) {
    console.log(val.length)
}
logger2('zhufeng');
logger2(1);
```

## 类型变换

### 交叉类型

交叉类型（Intersection Types）表示将多个类型合并为一个类型

```js
interface Bird {
    name: string,
    fly(): void
}
interface Person {
    name: string,
    talk(): void
}
type BirdPerson = Bird & Person;
let p: BirdPerson = { name: 'zhufeng', fly() { }, talk() { } };
p.fly;
p.name
p.talk;
```

### typeof

- 可以获取一个变量的类型

```js
//先定义类型，再定义变量
type People = {
    name:string,
    age:number,
    gender:string
}
let p1:People = {
    name:'zhufeng',
    age:10,
    gender:'male'
}
//先定义变量，再定义类型
let p1 = {
    name:'zhufeng',
    age:10,
    gender:'male'
}
type People = typeof p1;
function getName(p:People):string{
    return p.name;
}
getName(p1);
```

### 索引访问操作符

- 可以通过[]获取一个类型的子类型

```js
interface Person{
    name:string;
    age:number;
    job:{
        name:string
    };
    interests:{name:string,level:number}[]
}
let FrontEndJob:Person['job'] = {
    name:'前端工程师'
}
let interestLevel:Person['interests'][0]['level'] = 2;
```

### keyof

- 索引类型查询操作符

```js
interface Person{
  name:string;
  age:number;
  gender:'male'|'female';
}
//type PersonKey = 'name'|'age'|'gender';
type PersonKey = keyof Person;

function getValueByKey(p:Person,key:PersonKey){
  return p[key];
}
let val = getValueByKey({name:'zhufeng',age:10,gender:'male'},'name');
console.log(val);
```

### 映射类型

- 在定义的时候用in操作符去批量定义类型中的属性

```js
interface Person{
  name:string;
  age:number;
  gender:'male'|'female';
}
//批量把一个接口中的属性都变成可选的
type PartPerson = {
  [Key in keyof Person]?:Person[Key]
}

let p1:PartPerson={};
//也可以使用泛型
type Part<T> = {
  [key in keyof T]?:T[key]
}
let p2:Part<Person>={};
```

## 内置工具类型

### Partial

将类型 `T` 的所有属性标记为可选属性

```js
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

```js
// 账号属性
interface AccountInfo {
    name: string 
    email: string 
    age: number 
    vip: 0|1 // 1 是vip ，0 是非vip
}

// 当我们需要渲染一个账号表格时，我们需要定义
const accountList: AccountInfo[] = []

// 但当我们需要查询过滤账号信息，需要通过表单，
// 但明显我们可能并不一定需要用到所有属性进行搜索，此时可以定义
const model: Partial<AccountInfo> = {
  name: '',
  vip: undefind
}
```

### Required

与 `Partial` 相反，`Required` 将类型 T 的所有属性标记为必选属性

```js
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

```js
interface Person{
    name?:string,
    age?:number
}
type Require<T> = { [P in keyof T]-?: T[P] };  // 设置之后属性为必填，不填会报错
let p:Required<Person> = {
    name:'xiaoming',
    age:20
}
```

#### Readonly

`Readonly` 通过为传入的属性每一项都加上 `readonly` 修饰符来实现。

```js
interface Person{
  name:string;
  age:number;
  gender?:'male'|'female';
}
//type Readonly<T> = { readonly [P in keyof T]: T[P] };
let p:Readonly<Person> = {
  name:'111',
  age:10,
  gender:'male'
}
p.age = 11;  //修改报错
```

### Pick

从大类型中截取几个小类型使用

```js
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

```js
interface AccountInfo {
  name: string 
  email: string 
  age: number 
  vip?: 0|1 // 1 是vip ，0 是非vip
}

type CoreInfo = Pick<AccountInfo, 'name' | 'email'>
/* 
{ 
  name: string
  email: stirng
}
*/
```

### Omit

从类型中删除某属性使用

```js
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Omit<Todo, 'description'>;

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false
};


interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Omit<Todo, 'description'|'completed'>;

const todo: TodoPreview = {
    title: 'Clean room'
};
```

###  Exclude

不包括某类型

```js
type E = Exclude<string|number,boolean>;  // 定义一个类型，包括string,number 不包括boolean
let e:E = '10';
```

### Extract

提取某类型

```js
type  E = Extract<string|number,string>;  // 在string和number中 提取string类型
let e:E = '1';
```

### NonNullable

排除`null`和`undefined`

```js
type  E = NonNullable<string|number|null|undefined>;
let e:E = 1;
```

### ReturnType

```js
function getUserInfo() {
    return { name: "xiaoming", age: 10 };
  }
  

// 通过 ReturnType 将 getUserInfo 的返回值类型赋给了 UserInfo
type UserInfo = ReturnType<typeof getUserInfo>;

const userA: UserInfo = {
  name: "xiaoming1",
  age: 10
};
```

### InstanceType

获取构造函数类型的实例类型

```js
class Person{
    name:string;
    age:number;
    constructor(name:string,age:number){
        this.name=name;
        this.age=age;
    }
}
type p=InstanceType<typeof Person>;
let p1:p={name:'wer',age:20}
```

### 更多

<https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypet>

## 类型声明文件



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

## is

判断一个变量属于某个接口|类型

```js
function isNumber(value: any): value is string {
	// 可以进行进一步处理
	return typeof value === "number";
}
console.log(isNumber(20))
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

