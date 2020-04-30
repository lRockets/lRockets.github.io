---
title: js手写call
date: 2020-04-30
tags:
 - 手写系列
categories:
 -  javascript
---

```js
Function.prototype.myCall = function(context, ...args) {
    // 判断是否是undefined和null
    if (typeof context === undefined || context === null) {
    	context = window
    }
    let fnSymbol = Symbol()
    context[fnSymbol] = this
    let fn = context[fnSymbol] (...args)
    delete context[fnSymbol] 
    return fn
}
```

