---
title: js手写reduce
date: 2020-04-25
tags:
 - 手写系列
categories:
 -  javascript

---

```javascript
let arr = [{ price: 10, count: 5 }, { price: 10, count: 5 }, { price: 10, count: 5 }];

  Array.prototype.reduce = function (fn, defaultPre) {
    let oldArr = JSON.parse(JSON.stringify(arr));
    let pre = null;
    if (defaultPre != null && defaultPre != undefined) {
      pre = defaultPre;
    } else {
      pre = arr.shift();
    }
    arr.forEach((item, index) => {
      pre = fn(pre, item, index, oldArr);
    });
    return pre;
  }
  let total = arr.reduce((pre, current, index, arr) => {
    return pre + current.price * current.count;
  }, 0)
  console.log(total);
```





