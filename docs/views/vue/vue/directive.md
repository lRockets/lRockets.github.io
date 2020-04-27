# vue自定义指令

https://www.jb51.net/article/154111.htm

- `bind`: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
- `inserted`: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
- `update`: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
- `componentUpdated`: 被绑定元素所在模板完成一次更新周期时调用。
- `unbind`: 只调用一次， 指令与元素解绑时调用。

## v-clickOutSide

```js
Vue.directive('clickOutSide':{
    inserted(el,binding){
    	el.__handlerClick__=function(e){
    		if(e.target === el || el.contains(e.target)){
    			return;
    		}
    		binding.value();
    	};
    	document.addEventListener('click',el.__handlerClick__,false);
    },
    unbind(el){
    	document.removeEventListener('click',el.__handlerClick__,false);
    	delete el.__handlerClick__;
    }
})
```

## v-scroll

```js

<template>
	<div class="container">
		<div class="header">这里是头部</div>
		<div class="section" v-scroll="loadingMore">
			<ul>
				<li class="list">4</li>
				<li class="list">5</li>
				<li class="list">6</li>
				<li class="list">7</li>
				<li class="list">8</li>
				<li class="list">9</li>
				<li class="list">10</li>
				<li class="list">11</li>
				<li class="list">12</li>
				<li class="list">13</li>
				<li class="list">14</li>
				<li class="list">15</li>
				<li class="list">16</li>
				<li class="list">17</li>
				<li class="list">18</li>
				<li class="list">19</li>
				<li class="list">20</li>
				<li class="list">21</li>
				<li class="list">22</li>
				<li class="list">23</li>
				<li class="list">24</li>
				<li class="list">25</li>
				<li class="list">26</li>
				<li class="list">27</li>
				<li class="list">28</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
				<li class="list">29</li>
			</ul>
		</div>
		<div class="footer">这里是底部</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				item: '123'
			}
		},
		directives: {
			'scroll': {
				bind: function(el, binding, vnode, oldVnode) {
					let scrollHeight = el.offsetHeight,
						cb_name = binding.expression,
						cb = vnode.context[cb_name];
          console.log(binding);
					el.addEventListener('scroll', async () => {
						console.log(el.firstChild.clientHeight)
						if (el.offsetHeight + el.scrollTop >= el.firstChild.clientHeight) {
              alert(1);
							try {
								cb && await cb();
							} catch (error) {
								console.log(error)
							}
						}
					})
				}
			}
		},
		methods: {
			loadingMore() {
				console.log('到底了');
			}
		},
		mounted() {

		}
	}
</script>
<style>
	.section {
		height: 200px;
		overflow: auto;
	}
</style>

```

## v-to

```js
Vue.directive('to', {
        bind(el, binding, vnode) {
            function clickHandler(e) {
                // 这里判断点击的元素是否是本身，是本身，则返回
                if (!el.contains(e.target)) {
                    return false;
                }
                if (window.$vueEl.$router && (typeof binding.value === 'string' || typeof binding.value === 'object')) {
                    window.$vueEl.$router.push(binding.value);  // this.$router.push
                }
            }
            // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
            el.__vueRouteTo__ = clickHandler;
            document.addEventListener('click', clickHandler);
        },
        update(el, binding, vnode) {
            function clickHandler(e) {
                // 这里判断点击的元素是否是本身，是本身，则返回
                if (!el.contains(e.target)) {
                    return false;
                }
                if (window.$vueEl.$router && (typeof binding.value === 'string' || typeof binding.value === 'object')) {
                    window.$vueEl.$router.push(binding.value);
                }
            }
            document.removeEventListener('click', el.__vueRouteTo__);
            // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
            el.__vueRouteTo__ = clickHandler;
            document.addEventListener('click', clickHandler);
        },
        unbind(el, binding) {
            // 解除事件监听
            document.removeEventListener('click', el.__vueRouteTo__);
            // 删除私有变量
            delete el.__vueRouteTo__;  
        },
    });
```

## v-dialogDrag

```js
// elementUi 弹框组件拖拽
Vue.directive('dialogDrag', {
        bind(el, binding, vnode, oldVnode) {
            const dialogHeaderEl = el.querySelector('.el-dialog__header');
            const dragDom = el.querySelector('.el-dialog');
            //dialogHeaderEl.style.cursor = 'move';
            dialogHeaderEl.style.cssText += ';cursor:move;'
            dragDom.style.cssText += ';top:0px;'
     
            // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
            const sty = (function() {
                if (window.document.currentStyle) {
                    return (dom, attr) => dom.currentStyle[attr];
                } else{
                    return (dom, attr) => getComputedStyle(dom, false)[attr];
                }
            })()       
            
            dialogHeaderEl.onmousedown = (e) => {
                // 鼠标按下，计算当前元素距离可视区的距离
                const disX = e.clientX - dialogHeaderEl.offsetLeft;
                const disY = e.clientY - dialogHeaderEl.offsetTop;
                
                const screenWidth = document.documentElement.clientWidth; // body当前宽度
                const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 

                const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
                const dragDomheight = dragDom.offsetHeight; // 对话框高度
                
                const minDragDomLeft = dragDom.offsetLeft;
                const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
                
                const minDragDomTop = dragDom.offsetTop;
                const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
     
                
                // 获取到的值带px 正则匹配替换
                let styL = sty(dragDom, 'left');
                let styT = sty(dragDom, 'top');
     
                // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
                if(styL.includes('%')) {
                    styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
                    styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
                }else {
                    styL = +styL.replace(/\px/g, '');
                    styT = +styT.replace(/\px/g, '');
                };
                
                document.onmousemove = function (e) {
                    // 通过事件委托，计算移动的距离 
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;
                    
                    // 边界处理
                    if (-(left) > minDragDomLeft) {
                        left = -(minDragDomLeft);
                    } else if (left > maxDragDomLeft) {
                        left = maxDragDomLeft;
                    }
                    
                    if (-(top) > minDragDomTop) {
                        top = -(minDragDomTop);
                    } else if (top > maxDragDomTop-1) {
                        top = maxDragDomTop-1;
                    }
 
                    dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
                };
     
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            }  
        }
```



## 15个vue自定义指令

### V-Hotkey

**仓库地址**: https://github.com/Dafrok/v-hotkey
**Demo**: 戳这里 https://dafrok.github.io/v-hotkey
**安装**: `npm install --save v-hotkey`
这个指令可以给组件绑定一个或多个快捷键。你想要通过按下 Escape 键后隐藏某个组件，按住 Control 和回车键再显示它吗？小菜一碟：

```js
<template>
  <div
    v-show="show"
    v-hotkey="{
      'esc': onClose,
      'ctrl+enter': onShow
    }"
  >
      Press `esc` to close me!
  </div>
</template>

<script>
export default {
    data() {
        return {
            show: true
        }
    },

    methods: {
        onClose() {
            this.show = false
        },

        onShow() {
            this.show = true
        },
    }
}
</script>
```

### V-Click-Outside

**仓库地址**: https://github.com/ndelvalle/v-click-outside
**Demo**: https://codesandbox.io/s/zx7mx8y1ol?module=%2Fsrc%2Fcomponents%2FHelloWorld.vue
**安装**: `npm install --save v-click-outside`

你想要点击外部区域关掉某个组件吗？用这个指令可以轻松实现。这是我每个项目必用的指令之一，尤其在弹框和下拉菜单组件里非常好用。

```js
<template>
  <div
    v-show="show"
    v-click-outside="onClickOutside"
  >
    Hide me when a click outside this element happens
  </div>
</template>
```

HTML

```js
<script>
export default {
  data() {
    return {
      show: true
    };
  },

  methods: {
    onClickOutside() {
      this.show = false;
    }
  }
};
</script>
```

**说明：** 你也可以通过双击外部区域来触发，具体用法请参考文档。

### V-Clipboard

**仓库地址**: https://github.com/euvl/v-clipboard
**安装**: `npm install --save v-clipboard`

这个简单指令的作者是Yev Vlasenko ，可以用在任何静态或动态元素上。当元素被点击时，指令的值会被复制到剪贴板上。用户需要复制代码片段的时候，这个非常有用。

```js
<button v-clipboard="value">
  Copy to clipboard
</button>
```

HTML

### Vue-ScrollTo

**仓库地址**: https://github.com/rigor789/vue-scrollTo
**Demo**: https://vue-scrollto.netlify.com/
**安装**: `npm install --save vue-scrollto`

这个指令监听元素的点击事件，然后滚动到指定位置。我通常用来处理文章目录跳转和导航跳转。

```js
<span v-scroll-to="{
  el: '#element',          // 滚动的目标位置元素
  container: '#container', // 可滚动的容器元素
  duration: 500,           // 滚动动效持续时长（毫秒）
  easing: 'linear'         // 动画曲线
  }"
>
  Scroll to #element by clicking here
</span>
```

**说明：** 也可以通过代码动态设置，具体看文档。

### Vue-Lazyload

**仓库地址**: https://github.com/hilongjw/vue-lazyload
**Demo**: http://hilongjw.github.io/vue-lazyload/
**安装**: `npm install --save vue-lazyload`
图片懒加载，非常方便。

```js
<img v-lazy="https://www.domain.com/image.jpg">
```

### V-Tooltip

**仓库地址**: v-tooltip
**Demo**: available here
**安装**: `npm install --save v-tooltip`
几乎每个项目都会用到 tooltip。这个指令可以给元素添加响应式的tooltip，并可控制显示位置、触发方式和监听事件。

```js
<button v-tooltip="'You have ' + count + ' new messages.'">
```

**说明：** 还有一个比较流行的tooltip插件vue-directive-tooltip.

### V-Scroll-Lock

**仓库地址**: https://github.com/phegman/v-scroll-lock
**Demo**: https://v-scroll-lock.peterhegman.com/
**安装**: `npm install --save v-scroll-lock`

基于 body-scroll-lock 开发，这个指令的作用是在打开模态浮层的时候防止下层的元素滚动。

```js
<template>
  <div class="modal" v-if="opened">
    <button @click="onCloseModal">X</button>
    <div class="modal-content" v-scroll-lock="opened">
      <p>A bunch of scrollable modal content</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      opened: false
    }
  },
  methods: {
    onOpenModal () {
      this.opened = true
    },

    onCloseModal () {
      this.opened = false
    }
  }
}
</script>
```

### V-Money

**仓库地址**: https://github.com/vuejs-tips/v-money
**Demo**: https://vuejs-tips.github.io/v-money/
**安装**: `npm install --save v-money`
如果你需要在输入框里加上货币前缀或后缀、保留小数点位数或者设置小数点符号——不用找了，就是它！一行代码搞定这些需求：

```js
<template>
  <div>
    <input v-model.lazy="price" v-money="money" /> {{price}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      price: 123.45,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '$ ',
        precision: 2,
      }
    }
  }
}
</script>
```

### Vue-Infinite-Scroll

**仓库地址**: https://github.com/ElemeFE/vue-infinite-scroll
**安装**: `npm install --save vue-infinite-scroll`

无限滚动指令，当滚动到页面底部时会触发绑定的方法。

```js
<template>
  <!-- ... -->
  <div
    v-infinite-scroll="onLoadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
  ></div>
<template>
<script>
export default {
  data() {
    return {
      data [],
      busy: false,
      count: 0
    }
  },

  methods: {
    onLoadMore() {
      this.busy = true;

      setTimeout(() => {
        for (var i = 0, j = 10; i < j; i++) {
          this.data.push({ name: this.count++ });
        }
        this.busy = false;
      }, 1000);
    }
  }
}
</script>
```

### Vue-Clampy

**仓库地址**: vue-clampy.
**安装**: `npm install --save @clampy-js/vue-clampy`

这个指令会截断元素里的文本，并在末尾加上省略号。它是用clampy.js实现的。

```js
  <p v-clampy="3">Long text to clamp here</p>
  <!-- displays: Long text to...-->
```

### Vue-InputMask

**仓库地址**: vue-inputmask
**安装**: `npm install --save vue-inputmask`
当你需要在输入框里格式化日期时，这个指令会自动生成格式化文本。基于Inputmask library 开发。

```js
<input type="text" v-mask="'99/99/9999'" />
```

HTML

### Vue-Ripple-Directive

**仓库地址**: vue-ripple-directive
**安装**: `npm install --save vue-ripple-directive`

Aduardo Marcos 写的这个指令可以给点击的元素添加波纹动效。

```js
<div v-ripple class="button is-primary">This is a button</div>
```

### Vue-Focus

**仓库地址**: vue-focus
**安装**: `npm install --save vue-focus`
有时候，用户在界面里操作，需要让某个输入框获得焦点。这个指令就是干这个的。

```js
<template>
  <button @click="focused = true">Focus the input</button>

  <input type="text" v-focus="focused">
</template>
<script>
export default {
  data: function() {
    return {
      focused: false,
    };
  },
};
</script>
```

### V-Blur

**仓库地址**: v-blur
**Demo**: 戳这里
**安装**: `npm install --save v-blur`
假设你的页面在访客没有注册的时候，有些部分需要加上半透明遮罩。用这个指令可以轻松实现，还可以自定义透明度和过渡效果。

```js
<template>
  <button
    @click="blurConfig.isBlurred = !blurConfig.isBlurred"
  >Toggle the content visibility</button>

  <p v-blur="blurConfig">Blurred content</p>
</template>
<script>
  export default {
      data () {
        return
          blurConfig: {
            isBlurred: false,
            opacity: 0.3,
            filter: 'blur(1.2px)',
            transition: 'all .3s linear'
          }
        }
      }
    }
  };
</script>
```

### Vue-Dummy

**仓库地址**: vue-dummy
**Demo**: available here
**安装**: `npm install --save vue-dummy`
开发 app 的时候，偶尔会需要使用假文本数据，或者特定尺寸的占位图片。用这个指令可以轻松实现。

```js
<template>
  <!-- the content inside will have 150 words -->
  <p v-dummy="150"></p>

  <!-- Display a placeholder image of 400x300-->
  <img v-dummy="'400x300'" />
</template>
```

