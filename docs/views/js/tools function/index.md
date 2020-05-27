---
title: 实用代码
date: 2020-04-25
tags:
 - 实用代码
categories:
 -  javascript
---

## reduce

### 数字累加

```js
var arr=[1,2,3,4,5];
arr.reduce((total,cur)=>total+cur);
```

### 求最大数

```js
console.log([1, 2, 3, 4, 5, 6].reduce((a, v) => {
    return Math.max(a, v)
}, []));
```

### 组合数据

```js
var arr = [[1, 10, 100], [2, 20, 200]];
let ob=arr.reduce((acc, val) => {
    return (val.forEach((v, i) => acc[i].push(v)), acc)
},[[],[],[]]);
console.log(ob)  // [ [ 1, 2 ], [ 10, 20 ], [ 100, 200 ] ]
```

```js
const xProd = (a, b) => {
    return a.reduce((acc, x) => {
        return acc.concat(b.map(y => [x, y]))
    }, [])
};
let val=xProd([1,2], [3,4]);  // [ [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ] ]
```

### 扁平化数组

```js
var arr=[1,2,[3,[4,5]]];
function flatten(arr){
	return arr.reduce((total,cur)=>{
        return total.concat(Array.isArray(cur) ? flatten(cur) : cur);
    },[]);
}
flatten(arr);
```

## 数组分割
```js
var arr=[1,2,3,4,5];
function splitArr(arr,num){
	var resultArr=[];
	for(var i=0;i<arr.length;i+=num){
		resultArr.push(arr.slice(i,i+num));
	}
	return resultArr;
}
splitArr(arr,3); // [[1,2,3],[4,5]]
```

## 根据年份获取生肖

```js
function getAnimal(year) {
    var animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    var i = (year - 4) % 12;
    return animals[i];
}
```

## js求素数
```js
const isPrime = num => {
    let bount = Math.floor(Math.sqrt(num));
    for (let i = 2; i <= bount; i++) {
        if (num % i === 0) {
            return false
        }
    }
    return num >= 2
}
```

## 判断对象是否相等

```js
export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export const looseEqual = function(a, b) {
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
};

export const arrayEquals = function(arrayA, arrayB) {
  arrayA = arrayA || [];
  arrayB = arrayB || [];

  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    if (!looseEqual(arrayA[i], arrayB[i])) {
      return false;
    }
  }

  return true;
};

export const isEqual = function(value1, value2) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return arrayEquals(value1, value2);
  }
  return looseEqual(value1, value2);
};
```

## dom函数封装

### 类数组转数组

```js
function listToArray(likeArray) {
    var ary = [];
    try {
        ary = Array.prototype.slice.call(likeArray, 0);
    } catch (e) {
        for (var i = 0; i < likeArray.length; i++) {
            ary[ary.length] = likeArray[i];
        }
    }
    return ary;
}
```

### toJson

```js
function (str) {
	return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
}
```

### offset

```js
function (curEle) {
    var p = curEle.offsetParent, t = curEle.offsetTop, l = curEle.offsetLeft;
    while (p) {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            t += p.clientTop;
            l += p.clientLeft;
        }
        t += p.offsetTop;
        l += p.offsetLeft;
        p = p.offsetParent;
    }
    return {top: t, left: l};
}
```

### hasClass

```js
function hasClass(curEle, cName) {
 	var reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
 	return reg.test(curEle.className);
 }
```

### addClass

```js
addClass: function addClass(curEle, cName) {
    if (!this.hasClass(curEle, cName)) {
    	curEle.className += " " + cName;
    }
}
```

### removeClass

```js
function removeClass(curEle, cName) {
    if (this.hasClass(curEle, cName)) {
        var reg = new RegExp("(?:^| +)" + cName + "( +|$)", "g");
        curEle.className = curEle.className.replace(reg, " ");
    }
}
```

### prev

```js
function prev(curEle) {
    if ("previousElementSibling" in curEle) {
    	return curEle.previousElementSibling;
    }
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
    	pre = pre.previousSibling;
    }
    return pre;
}
```

### prevAll

```js
function prevAll(curEle) {
    var ary = [];
    var pre = this.prev(curEle);
    while (pre) {
        ary.unshift(pre);
        pre = this.prev(pre);
    }
    return ary;
}
```

### next

```
function next(curEle) {
    if ("nextElementSibling" in curEle) {
    	return curEle.nextElementSibling;
    }
    var nex = curEle.nextSibling;
    while (nex && nex.nodeType !== 1) {
    	nex = nex.nextSibling;
    }
    return nex;
}
```

### nextAll

```js
function nextAll(curEle) {
    var ary = [];
    var nex = this.next(curEle);
    while (nex) {
        ary.push(nex);
        nex = this.next(nex);
    }
    return ary;
}
```

### sibling

```js
function sibling(curEle) {
    var pre = this.prev(curEle), nex = this.next(curEle);
    var ary = [];
    pre ? ary.push(pre) : null;
    nex ? ary.push(nex) : null;
    return ary;
};
```

### siblings

```js
function siblings(curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle));
}
```

### children

```js
function children(curEle, tag) {
    var nodeList = curEle.childNodes, ary = [];
    for (var i = 0; i < nodeList.length; i++) {
        var cur = nodeList[i];
        if (cur.nodeType === 1) {
            if (typeof tag !== "undefined") {
                var reg = new RegExp("^" + tag + "$", "i")
                reg.test(cur.tagName) ? ary[ary.length] = cur : null;
                continue
            }
            ary[ary.length] = cur;
        }
    }
    return ary
};
```

### getElementsByClass

```js
function getElementsByClass(strClass, context) {
    context = context || document;
    if ("getElementsByClassName" in document) {
        return this.listToArray(context.getElementsByClassName(strClass))
    }
    var tagList = context.getElementsByTagName("*"), ary = [];
    strClass = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
    for (var i = 0; i < tagList.length; i++) {
        var curTag = tagList[i], curTagClass = curTag.className;
        var flag = true;
        for (var k = 0; k < strClass.length; k++) {
            var reg = new RegExp("(?:^| +)" + strClass[k] + "(?: +|$)");
            if (!reg.test(curTagClass)) {
                flag = false;
                break;
            }
        }
        flag ? ary[ary.length] = curTag : null;
    }
    return ary;
};
```

### getCss

```js
function getCss(curEle, attr) {
    var val = reg = null;
    if ("getComputedStyle"in window) {
        val = window.getComputedStyle(curEle, null)[attr];
    } else {
        if (attr === "opacity") {
            val = curEle.currentStyle["filter"]
            reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            val = curEle.currentStyle[attr];
        }
    }
    reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
    return reg.test(val) ? parseFloat(val) : val;
}
```

### setCss

```js
 function setCss(curEle, attr, value) {
    //->JS设置浮动属性的兼容处理
    if (attr === "float") {
        curEle["style"]["cssFloat"] = value;
        curEle["style"]["styleFloat"] = value;
        return;
    }

    //->JS设置透明度属性的兼容处理
    if (attr === "opacity") {
        value > 1 ? value = 1 : null;
        value < 0 ? value = 0 : null;

        curEle["style"]["opacity"] = value;
        curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
        return;
    }

    //->传递进来的属性名符合正则,那么我们需要根据情况选择是否加单位
    var reg = /^(width|height|(padding|margin(Top|Left|Right|Bottom))|top|left|right|bottom)$/;
    if (reg.test(attr)) {
        //如果传递进来的是一个单独的数字,我们给其加单位,传递进来的不是一个数,传递的是啥,我就设置为啥
        reg = /^-?\d+(\.\d+)?$/;
        if (reg.test(value)) {
            curEle["style"][attr] = value + "px";
            return;
        }
    }
    curEle["style"][attr] = value;
}
```

### setGroupCss

```js
function setGroupCss(curEle, options) {
    //->首先检测传递进来的options是否是一个纯粹的对象,不是的话,就没有必要在往下执行对应的操作了
    if (Object.prototype.toString.call(options) !== "[object Object]") {
        return;
    }

    //->如果是的话,我们遍历每一项,在分别的调用setCss设置即可
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            this.setCss(curEle, key, options[key]);
        }
    }
};
```



