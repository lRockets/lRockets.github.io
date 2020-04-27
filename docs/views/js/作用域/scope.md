---
date: 2020-04-25
categories: javascript
title: js作用域 
---

## 预解析

预解析只发生在当前的作用域下，开始只对`window`下进行解析，函数执行的时候，才会对函数进行解析

### js中内存的分类

栈内存：用来提供一个供js代码执行的环境，作用域

堆内存：用来存储引用类型的值，对象存储的是属性名和属性值，函数存储的是代码字符串

### 规则

- 所有的变量与函数，在运行之前，都会提前赋值为`undefined` ，所有的函数在运算前都是整个函数体
- 在全局作用域下的自执行函数不被预解释,预解释只发生在当前作用域
- 无论条件是否成立，都会预解释
- `return`下面的代码仍然会被预解释,但是`return`出来的值即使你是一个函数也不会被预解释
- 遇到重名的只留一个 后面的代码会替换前一个
- 变量和函数重名了留下函数

```js
console.log(a); // f a(){ console.log(10) }
var a=10;
function a(){
	console.log(10);
}
```

```js
console.log(a);  // => undefined
if(true){ // if中定义的变量会变量提升
	var a=10;
}
```

```js
console.log(b); // b is not define 
!function (){
     var b = 0;
 }()
```

```js
 function fn(){
     console.log(num); // undefined
     return function (){
         console.log(num);  // function (){console.log(num);}
     }
     alert();
     var num = 9;
 }
fn();
```



### 执行过程

- 代码预解析
- 逐行执行代码



### 如何区分全局变量和私有变量？

- 在全局作用域下**声明的变量**是全局变量
- 在私有作用域中**用var声明的变量**和**函数的形参**都是私有的变量



## 作用域链

在私有作用域中，我们代码执行的时候遇到了一个变量，首先我们需要确定是否为私有变量，如果是私有的变量，那么和外面的没有任何关系，如果不是私有变量，则往当前作用域的上级作用域查找，如果上级作用域没有则继续查找，一直找到`window`为止。

### 如何查找当前作用域的上级作用域

当前函数在哪个作用域下定义的,那么它的上级作用域就是谁，和函数在哪里执行无关。

```js
var num=12;
function fn(){
	var num=120;
	return function(){
		console.log(num);
	}
}
var f=fn();
f();

~function(){
	var num=1200;
	f();
}();
```



## 内存释放

### 堆内存

**对象**数据类型或者**函数**数据类型在定义的时候首先都会开辟一个堆内存，堆内存有一个引用地址，如果外面有变量等知道了这个地址，我们就说这个内存被占用了，就不能摧毁了

```js
var obj1={name：’张三‘}；
var obj2=obj1;
```

我们如果想让堆内存释放/摧毁，只需要把所有引用它的变量值赋值为null即可，如果当前的堆内存没有任何东西被占用了，name浏览器会在空闲的时候把它删掉

```js
obj=null;
obj2=null;
```



### 栈内存

**全局作用域**：只有当页面关闭的时候，全局作用域才会销毁

**私有作用域**：（函数执行会产生私作用域）

一般情况下，函数执行会形成一个私有作用域，当私有作用域中的代码执行完成后，当前作用域都会主动进行销毁

 当私有作用域的内存被作用域之外的东西占用了,那么当前的这个作用域不能销毁了

a.函数执行返回一个引用数据类型的值，并且在函数的外面被一个其他的东西给接收了（<u>fn函数被var出来的fn赋值了</u>），这种情况下形成的私有作用域不会被销毁

```js
function fn(){
	var num=100;
	return function(){
		num++;
		console.log(num)
	}
}
var f=fn(); // fn执行系形成的这个私有作用域不能被销毁了
```

b.在一个私有作用域中，给DOM元素事件绑定方法，一般情况下我们的私有作用域都不销毁

```js
oDiv=document.getElementById('div1');
_function(){
    ODiv.onclick=function(){
        
    }
}(); 

ODiv.onclick=(function(){
    
})()

// 实现点击按钮数字累加
btn.onclick = (function (){
    var count = 0;
    return function (){
        count++;
        console.log(count);
        btn.innerHTML = count;
    }
})()
```

c.下面的情况属于不立即销毁，`fn`返回的函数没有被其他东西占用，但是还需要执行一次，所以暂时不销毁，函数执行完了之后，浏览器会在空闲的时候把它销毁了

```js
function fn(){
	var num=100;
	rerurn function(){
	
	}
}
fn()();
```



## 练习

```js
function fn(){
	var i=10;
	return function(n){
		console.log(n+(++i));
	}
}
var f=fn(); // 不会被垃圾回收
f(10); // 10+10+1=21
f(20); // 20+11+1=32
fn()(10); // 21
fn()(20); // 31
```

```js
function fn(i){
	return function(n){
		console.log(n+i++);
	}
}
var f=fn(13); // i=13
f(12); // 13+12=25; i=14;
f(14); // 14+14=28; i=15;
fn(15)(12); // 15+12=27;
fn(16)(13); // 16+13=29;
```

```js
var num=20;
var obj={
	num:30,
	fn:(function(num){
		this.num*=3; 
		num+=15; 
		var num=45;
		return function(){
			this.num*=4;
			num+=20;
			console.log(num);
		}
	})(num) // 把全局变量的num传给自执行函数
};
var fn=obj.fn;
fn();
obj.fn();
console.log(window.num,obj.num);
```

执行过程：

- 首先预解析全局的`num`和`obj`

- 执行代码

  ```js
  var num=20;
  var obj={
  	num:30,
  	fn:(function(num){  
          // 2. 这里是自执行函数，this指向的是window，全局的num改为60  20*3=60；
  		this.num*=3; 
          //  3. 将函数内部私有变量改成 20+15=35；
  		num+=15;
           // 1.将全局的num当做私有变量传入,已经有私有变量num，这里不会预解析
          // 4.赋值，内部变量num为45
  		var num=45; 
  		return function(){
  			this.num*=4;  // 6.预解析,第二步把全局的num改成了60，再乘以4，全局num为240
  			num+=20;  // 7. 这里的num为上级的私有变量 num=45+20=65;
  			console.log(num); // 8.打印65
  		}
  	})(num) 
  };
  fn(); // 5.执行函数,函数前没有点，this指向window
  ```

  ```js
  // 调用obj.fn();
  var num=20; // 上一步把全局的num，改成了240
  var obj={
  	num:30,
  	fn:(function(num){
  		this.num*=3; 
  		num+=15; 
  		var num=45; 
  		return function(){ // 1.obj.fn()执行此函数
  			this.num*=4; // 2. this指向obj，this.num=30*4=120; obj.num=120;
  			num+=20; // 3. 向上级作用域找num,上面把num改成了65,65+20=85
  			console.log(num); // 打印85
  		}
  	})(num) // 把全局变量的num传给自执行函数
  };
  ```

  ```js
  console.log(window.num,obj.num); // 全局的num为240，obj.num为120
  ```

  