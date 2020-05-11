---
title: js动画
date: 2020-04-25
tags:
 - 动画
categories:
 -  javascript

---

```js
//=>UTILS操作CSS工具库
	let utils = (function () {
	    //=>获取样式
	    let getCss = (ele, attr) => {
	        let val = null,
	            reg = /^-?\d+(\.\d+)?(px|rem|em)?$/;
	        if ('getComputedStyle' in window) {
	            val = window.getComputedStyle(ele)[attr];
	            if (reg.test(val)) {
	                val = parseFloat(val);
	            }
	        }
	        return val;
	    };
	
	    //=>设置样式
	    let setCss = (ele, attr, value) => {
	        if (!isNaN(value)) {
	            if (!/^(opacity|zIndex)$/.test(attr)) {
	                value += 'px';
	            }
	        }
	        ele['style'][attr] = value;
	    };
	
	    //=>批量设置样式
	    let setGroupCss = (ele, options) => {
	        for (let attr in options) {
	            if (options.hasOwnProperty(attr)) {
	                setCss(ele, attr, options[attr]);
	            }
	        }
	    };
	
	    //=>合并为一个
	    let css = (...arg) => {
	        let len = arg.length,
	            fn = getCss;
	        if (len >= 3) {
	            fn = setCss;
	        }
	        if (len === 2 && typeof arg[1] === 'object') {
	            fn = setGroupCss;
	        }
	        return fn(...arg);
	    };
	
	    //=>EACH：遍历对象、数组、类数组
	    let each = (obj, callback) => {
	        if ('length' in obj) {
	            for (let i = 0; i < obj.length; i++) {
	                let item = obj[i],
	                    res = callback && callback.call(item, i, item);
	                if (res === false) {
	                    break;
	                }
	            }
	            return;
	        }
	        for (let attr in obj) {
	            if (obj.hasOwnProperty(attr)) {
	                let item = obj[attr],
	                    res = callback && callback.call(item, attr, item);
	                if (res === false) {
	                    break;
	                }
	            }
	        }
	    };
	
	    return {css, each}
	})();
	
	//=>ANIMATE动画库
	~function () {
	    //=>匀速运动公式
	    let effect = {
	        Linear: (t, b, c, d) => t / d * c + b
	    };
	
	    //=>开始运动
	    window.animate = function animate(ele, target, duration = 1000, callback) {
	        //=>参数处理(传递三个值,第三个值是函数,其实本身想要代表的意思：第三个是回调函数，总时间是默认值即可)
	        if (typeof duration === 'function') {
	            callback = duration;
	            duration = 1000;
	        }
	
	        //=>准备数据
	        let time = 0,
	            begin = {},
	            change = {};
	        utils.each(target, (key, value) => {
	            begin[key] = utils.css(ele, key);
	            change[key] = value - begin[key];
	        });
	
	        //=>设置新动画之前清除原有正在运行的动画
	        clearInterval(ele.animateTimer);
	        ele.animateTimer = setInterval(() => {
	            time += 17;
	            //->动画结束
	            if (time >= duration) {
	                clearInterval(ele.animateTimer);
	                utils.css(ele, target);
	                callback && callback.call(ele);
	                return;
	            }
	            //->获取每个方向的当前位置，并且给元素设置
	            utils.each(target, (key, value) => {
	                let cur = effect.Linear(time, begin[key], change[key], duration);
	                utils.css(ele, key, cur);
	            });
	        }, 17);
	    };
	}();
```



```js
<!DOCTYPE html>
<html lang="zh">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title></title>
		<style>
			#box {
				background: red;
				width: 100px;
				height: 100px;
				
			}
		</style>
	</head>
	<body>
		<div id="box"></div>
	</body>
</html>
<script>
	var oDiv1 = document.getElementById('box');
	oDiv1.onclick = function() {
		move(this, {
			width: 500
		},800,'backBoth',function(){
			move(this,{
				width:100
			},400)
		});
	}

	function move(obj, json, duration, fx, callback) {
		clearInterval(obj.iTimer);
		
		var d = duration || 1000;
		
		var j = {};
		
		for (var attr in json) {
			j[attr] = {};
			if (attr == 'opacity') {
				j[attr].b = Math.round(css(obj, attr) * 100);
			} else {
				j[attr].b = parseInt(css(obj, attr));
			}
			j[attr].c = json[attr] - j[attr].b;
		}
		console.log(j)
		
		var fx = fx || 'linear';
		
		var t1 = new Date().getTime();
		
		obj.iTimer = setInterval(function() {
			
			var t = new Date().getTime() - t1;
			
			if (t >= d) {
				t = d;
			}
			
			for (var attr in json) {
				var v = Tween[fx](t, j[attr].b, j[attr].c, d);
			
				if (attr == 'opacity') {
					obj.style[attr] = v / 100;
					obj.style.filter = "alpha(opacity="+v+")";
				} else {
					obj.style[attr] = v + 'px';
				}
			}
			
			if (t == d) {
				clearInterval(obj.iTimer);
				callback && callback.call(obj);
			}
			
		}, 16);
		
	}
	
	function css(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	}
	
	/*
	* t : time 已过时间
	* b : begin 起始值
	* c : count 总的运动值
	* d : duration 持续时间
	* */
	
	//Tween.linear();
	
	var Tween = {
		linear: function (t, b, c, d){  //匀速
			return c*t/d + b;
		},
		easeIn: function(t, b, c, d){  //加速曲线
			return c*(t/=d)*t + b;
		},
		easeOut: function(t, b, c, d){  //减速曲线
			return -c *(t/=d)*(t-2) + b;
		},
		easeBoth: function(t, b, c, d){  //加速减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInStrong: function(t, b, c, d){  //加加速曲线
			return c*(t/=d)*t*t*t + b;
		},
		easeOutStrong: function(t, b, c, d){  //减减速曲线
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t*t*t + b;
			}
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
			if (t === 0) { 
				return b; 
			}
			if ( (t /= d) == 1 ) {
				return b+c; 
			}
			if (!p) {
				p=d*0.3; 
			}
			if (!a || a < Math.abs(c)) {
				a = c; 
				var s = p/4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
			if (t === 0) {
				return b;
			}
			if ( (t /= d) == 1 ) {
				return b+c;
			}
			if (!p) {
				p=d*0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},    
		elasticBoth: function(t, b, c, d, a, p){
			if (t === 0) {
				return b;
			}
			if ( (t /= d/2) == 2 ) {
				return b+c;
			}
			if (!p) {
				p = d*(0.3*1.5);
			}
			if ( !a || a < Math.abs(c) ) {
				a = c; 
				var s = p/4;
			}
			else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			if (t < 1) {
				return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
						Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			}
			return a*Math.pow(2,-10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
		},
		backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
			if (typeof s == 'undefined') {
			   s = 1.70158;
			}
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}, 
		backBoth: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158; 
			}
			if ((t /= d/2 ) < 1) {
				return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			}
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
			return c - Tween['bounceOut'](d-t, 0, c, d) + b;
		},       
		bounceOut: function(t, b, c, d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
			}
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		},      
		bounceBoth: function(t, b, c, d){
			if (t < d/2) {
				return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
		}
	}
</script>

```

