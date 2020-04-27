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



## 根据年份获取生肖

```js
function getAnimal(year) {
    var animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    var i = (year - 4) % 12;
    return animals[i];
}
```

