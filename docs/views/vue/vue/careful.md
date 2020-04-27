# 组件使用中的细节点

**模板引用，浏览器显示出问题**

`问题`

```vue
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>vue</title>
</head>
<body>
	<div id="app">
		<table>
			<tbody>
				<Item></Item>
			</tbody>
		</table>
	</div>
    // 结果  <div id="app"><tr><td>34324324</td></tr><table><tbody></tbody></table></div>
</body>
</html>
<script src="vue.js"></script>
<script>
	var Item={
		template:'<tr><td>34324324</td></tr>'
	}

	var vm=new Vue({
		el:"#app",
		components:{
			Item:Item
		}
	})
</script>
```

`解决办法:改成<tr is="Item"></tr>，把组件引用方式改成is形式`

```vue
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>vue</title>
</head>
<body>
	<div id="app">
		<table>
			<tbody>
				<tr is="Item"></tr>   // 解决方法
			</tbody>
		</table>
	</div>
</body>
</html>
<script src="vue.js"></script>
<script>
	var Item={
		template:'<tr><td>34324324</td></tr>'
	}

	var vm=new Vue({
		el:"#app",
		components:{
			Item:Item
		}
	})
</script>
```



**在子组件中,定义data必须是一个函数,返回一个对象**

```vue
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>vue</title>
</head>
<body>
	<div id="app">
		<Item></Item>
	</div>
</body>
</html>
<script src="vue.js"></script>
<script>
    // Item中data是一个函数，返回一个对象
	var Item={
		data(){
			return{
				content:'this is content'
			}
		},
		template:'<tr><td>{{content}}</td></tr>'
	}

	var vm=new Vue({
		el:"#app",
		components:{
			Item:Item
		}
	})
</script>
```



