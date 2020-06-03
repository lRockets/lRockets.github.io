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



### util.js

```js
var utils = (function () {
    var flag = "getComputedStyle" in window;

    //->listToArray:把类数组集合转换为数组
    function listToArray(likeAry) {
        if (flag) {
            return Array.prototype.slice.call(likeAry, 0);
        }
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
        return ary;
    }

    //->formatJSON:把JSON格式字符串转换为JSON格式对象
    function formatJSON(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    //->offset:获取页面中任意元素距离BODY的偏移
    function offset(curEle) {
        var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
        while (par) {
            if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                disLeft += par.clientLeft;
                disTop += par.clientTop;
            }
            disLeft += par.offsetLeft;
            disTop += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: disLeft, top: disTop};
    }

    //->win:操作浏览器的盒子模型信息
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    //->children:获取所有的元素子节点
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
            }
            nodeList = null;
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }


    //->prev:获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点,判断是否为元素节点,不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止,如果没有哥哥元素节点,返回null即可
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //->next:获取下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    //->prevAll:获取所有的哥哥元素节点
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    //->nextAll:获取所有的弟弟元素节点
    function nextAll(curEle) {
        var ary = [];
        var nex = this.next(curEle);
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }

    //->sibling:获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    //->siblings:获取所有的兄弟元素节点
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    //->index:获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //->firstChild:获取第一个元素子节点
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[0] : null;
    }

    //->lastChild:获取最后一个元素子节点
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //->prepend:向指定容器的开头追加元素
    //->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有,就放在末尾即可
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    //->insertBefore:把新元素(newEle)追加到指定元素(oldEle)的前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
    //->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在,也就是当前元素已经是最后一个了,我们把新的元素放在最末尾即可
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }


    //->hasClass:验证当前元素中是否包含className这个样式类名
    function hasClass(curEle, className) {
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!this.hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }

    //->removeClass:给元素移除样式类名
    function removeClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (this.hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //->IE6~8
        var ary = [], strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var isOk = true;
            for (var k = 0; k < strClassAry.length; k++) {
                var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }

    //->getCss:获取元素的样式值
    function getCss(attr) {
        var val = null, reg = null;
        if (flag) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr === "opacity") {
                val = this.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
    function setCss(attr, value) {
        if (attr === "float") {
            this["style"]["cssFloat"] = value;
            this["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            this["style"]["opacity"] = value;
            this["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        this["style"][attr] = value;
    }

    //->setGroupCss:给当前元素批量的设置样式属性值
    function setGroupCss(options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]);
            }
        }
    }

    //->css:此方法实现了获取、单独设置、批量设置元素的样式值
    function css(curEle) {
        var argTwo = arguments[1], ary = Array.prototype.slice.call(arguments, 1);
        if (typeof argTwo === "string") {
            if (typeof arguments[2] === "undefined") {
                return getCss.apply(curEle, ary);
            }
            setCss.apply(curEle, ary);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            setGroupCss.apply(curEle, ary);
        }
    }

    //->把外界需要使用的方法暴露给utils
    return {
        win: win,
        offset: offset,
        listToArray: listToArray,
        formatJSON: formatJSON,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        css: css
    }
})();
```

