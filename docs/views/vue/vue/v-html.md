# v-html

## vue2.0不再支持v-html中使用过滤器了怎么办？

三种方法对v-html中的数据处理

1.methods

```js
<div v-html="msg(content)"></div>

methods:{
    msg(content){
        return content.replace(/、+/g,'');
    }
}
```



2.filters

```js
<div v-html="$options.filters.msg(content)"></div>

filters:{
    msg(content){
        return content.replace(/、+/g,'');
    }
}
```



3.computed

```js
<div v-html="msg3(content)"></div>

computed:{
    msg3(){
        return content=>content.replace(/、+/g,'');
    }
}
```

