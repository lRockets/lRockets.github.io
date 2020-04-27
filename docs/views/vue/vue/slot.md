# slot

#### 子组件

```vue
<template>
  <div>
    <slot />
    <slot name="title" />
    <slot name="item" v-bind="{ value: 'vue' }" />
  </div>
</template>

<script>
export default {
  name: "SlotDemo"
};
</script>

```

#### 父组件

```vue
<SlotDemo>   // 新语法
    <p>default slot</p>
    <template v-slot:title>
        <p>title slot1</p>
        <p>title slot2</p>
    </template>
    <template v-slot:item="props">
    	<p>item slot-scope {{ props }}</p>
    </template>
</SlotDemo>

<SlotDemo>   // 老语法
    <p>default slot</p>
    <p slot="title">title slot1</p>
    <p slot="title">title slot2</p>
    <p slot="item" slot-scope="props">item slot-scope {{ props }}</p>
</SlotDemo>
```

