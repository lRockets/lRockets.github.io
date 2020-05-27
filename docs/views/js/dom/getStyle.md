---
title: 获取dom具体样式
date: 2020-04-25
tags:
 - dom
categories:
 -  javascript
---

`style`只能获取写在行内的样式，不写在行内获取不到

## getComputedStyle

使用`window.getComputedStyle`这个方法获取所有经过浏览器计算过的样式，不兼容`IE6 7 8`

```js
let style = window.getComputedStyle(element, [pseudoElt]);
```

- element

   用于获取计算样式的`element`

- `pseudoElt` 可选

  指定一个要匹配的伪元素的字符串。必须对普通元素省略（或`null`）。

```js
window.getComputedStyle(box,null).width;
```



## currentStyle

```js
box.currentStyle.width
```



## 兼容写法

```js
function getCss(ele, attr) {
    if(window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[attr];
    }else {
        if (attr == 'opacity') { // 处理opacity兼容
            var val = ele.currentStyle['filter'];
            var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            return ele.currentStyle[attr];
        }
    }
}
```

