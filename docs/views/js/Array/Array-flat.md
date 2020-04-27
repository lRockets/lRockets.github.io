---
date: 2020-04-25
categories: javascript
title: 数组扁平化
---

# 数组扁平化

## reduce

```js
var arr=[1, [2, 3, [4, 5]]];
function flatten(arr) {  
    return arr.reduce((result, item)=> {
        return result.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}
console.log(flatten(arr))
```

```js
const flatten = (arr, deep = 1) => {
  return arr.reduce((cur, next) => {
    return Array.isArray(next) && deep > 1 ?
      ([...cur, ...flatten(next, deep - 1)]) :
      [...cur, next]
  },[])
}
let  val=flatten([1,2,3,[3,4,5,5,[1,2,[3,4]]]],4);
console.log(val)
```

## toString

```js
function flatten(arr) {
    return arr.toString().split(',').map(function(item) {
        return Number(item);
    })
} 
```

## 递归

```js
function flatten(arr) {
    var res = [];
    arr.map(item => {
        if(Array.isArray(item)) {
            res = res.concat(flatten(item));
        } else {
            res.push(item);
        }
    });
    return res;
}
```

## 扩展符

```js
function flatten(arr) {
    while(arr.some(item=>Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

## flat

```js
var arr=[1, [2, 3, [4, 5]]];
function flatten(arr) {  
    return arr.flat(Infinity)
}
console.log(flatten(arr))
```



## JSON.stringify()

将数组原封不动的转换成字符串`[1, [2, 3, [4, 5]]]` => `"[1,[2,3,[4,5]]]"`

```js
var arr=[1, [2, 3, [4, 5]]];
function flatten(arr) {  
    return JSON.stringify(arr).replace(/(\[|\])/g,'').split(',').map(item=>Number(item));
}
console.log(flatten(arr))
```

