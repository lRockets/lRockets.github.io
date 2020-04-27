# v-model .sync

都是语法糖,下面两段代码结果一样

`v-model="phoneInfo"` => `:phone-info="phoneInfo" @change="val => (phoneInfo = val)"`

`:zip-code.sync="zipCode"`  => `:zip-code="zipCode" @update:zipCode="val => (zipCode = val)"`

```vue
 <PersonalInfo v-model="phoneInfo" :zip-code.sync="zipCode" />

<PersonalInfo
    :phone-info="phoneInfo"
     @change="val => (phoneInfo = val)"
    :zip-code="zipCode"
    @update:zipCode="val => (zipCode = val)"
/>
```



## v-model

双向绑定

**修饰符**

- .lazy：取代 imput 监听 change 事件。
- .number：输入字符串转为数字。
- .trim：输入去掉首尾空格。



```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>vue</title>
</head>
<body>
	<div id="app">
		<input type="text" v-model="inputValue">
		<button @click="handleClick">提交</button>
		<ul>
			<li v-for="(item,index) in list" >{{ index }}-{{ item }}</li>
		</ul>
	</div>
</body>
</html>
<script src="vue.js"></script>
<script>
	var vm=new Vue({
		el:'#app',
		data:{
			inputValue:'',
			list:[]
		},
		created(){
			console.log(1)
		},
		methods:{
			handleClick(){
				this.list.push(this.inputValue);
				this.inputValue='';
			}
		}
	})
</script>
```



## .sync

**必须用在组件上**

sync只是给大家伙提供了一种与父组件沟通的思路而已！所以在后面日子里，你如果只是单纯的在子组件当中修改父组件的某个数据时，建议使用sync，简单，快捷，有档次！真好！



```js
<comp :foo.sync="bar"></comp>
// 相当于
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```



## vue-router

- 实现一个插件
- 监听url
- 路由配置的解析 { ‘/’ :  Home }
- 实现自定义组件  router-link   router-view