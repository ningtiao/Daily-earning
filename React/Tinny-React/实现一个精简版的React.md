#### React 设计原理及源码实现

### 1、JSX 到底是什么

使用 React 就一定会写 JSX，JSX 到底是什么呢？它是一种 JavaScript 语法的扩展，React 使用它来描述用户界面长成什么样子。虽然它看起来非常像 HTML，但它确实是 JavaScript 。在 React 代码执行之前，Babel 会对将 JSX 编译为 React API.

```react
<div className="container">
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```

```react
React.createElement(
  "div",
  {
    className: "container"
  },
  React.createElement("h3", null, "Hello React"),
  React.createElement("p", null, "React is great")
);
```

从两种语法对比来看，JSX 语法的出现是为了让 React 开发人员编写用户界面代码更加轻松。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec280bb236f5419692ed3cdb72d089f9~tplv-k3u1fbpfcp-watermark.image)

[Babel REPL](https://babeljs.io/repl)

### 2. 什么是 Virtual DOM

在现代的 web 应用程序当中，使用 Javascript 操作 DOM 对象是非常频繁的动作，但是这个东西是非常消耗性的，因为使用 Javascript 操作 Dom 对象要远比 Javascript 的操作，其他对象要慢得多，页面中频繁操作 DOM 造成页面卡顿，应用的流畅性，降低带来了非常不好的用户体验，在没有 VitrualDOM 之前呢，大多数 Javascript 框架，对于 DOM 更新远远超过其必须要进行更新，从而使得这种缓慢的操作变得更加的糟糕，举个例子，假设有个数组数组中有十项内容，通过这个十项内容生成了十个 li，当数组中某一项内容发生变化时，大多数框架会根据这个数组重新构建整个列表，这比必要的工作多出了十倍，本来使用 javascript 操作对象就比较慢，再加上这种低效率的更新，使得页面出现卡顿，为了解决这个问题，React 普及了一种叫 VirtualDOM 的东西，VirtualDOM 的出现就是为了提高 Javascript 操作 DOM 对象

在 React 中，每个 DOM 对象都有一个对应的 Virtual DOM 对象，它是 DOM 对象的 JavaScript 对象表现形式，其实就是使用 JavaScript 对象来描述 DOM 对象信息，比如 DOM 对象的类型是什么，它身上有哪些属性，它拥有哪些子元素。

可以把 Virtual DOM 对象理解为 DOM 对象的副本，但是它不能直接显示在屏幕上。

```html
<div className="container">
  <h3>Hello React</h3>
  <p>React is great</p>
</div>
```

```js
{
  type: "div",
  props: { className: "container" },
  children: [
    {
      type: "h3",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "Hello React"
          }
        }
      ]
    },
    {
      type: "p",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "React is great"
          }
        }
      ]
    }
  ]
}
```

### 3. Virtual DOM 如何提升效率

精准找出发生变化的 DOM 对象，只更新发生变化的部分。

在 React 第一次创建 DOM 对象后，会为每个 DOM 对象创建其对应的 Virtual DOM 对象，在 DOM 对象发生更新之前，React 会先更新所有的 Virtual DOM 对象，然后 React 会将更新后的 Virtual DOM 和 更新前的 Virtual DOM 进行比较，从而找出发生变化的部分，React 会将发生变化的部分更新到真实的 DOM 对象中，React 仅更新必要更新的部分。

Virtual DOM 对象的更新和比较仅发生在内存中，不会在视图中渲染任何内容，所以这一部分的性能损耗成本是微不足道的。

<img src="./images/1.png" style="margin: 20px 0;width: 80%"/>

```react
<div id="container">
	<p>Hello React</p>
</div>
```

```react
<div id="container">
	<p>Hello Angular</p>
</div>
```

```react
const before = {
  type: "div",
  props: { id: "container" },
  children: [
    {
      type: "p",
      props: null,
      children: [
        { type: "text", props: { textContent: "Hello React" } }
      ]
    }
  ]
}
```

```react
const after = {
  type: "div",
  props: { id: "container" },
  children: [
    {
      type: "p",
      props: null,
      children: [
        { type: "text", props: { textContent: "Hello Angular" } }
      ]
    }
  ]
}
```

### 4、创建 VirtualDOM 对象 一

ok，说了这么多，终于要开始讲如何实现了～

首先，将需要实现精简版的 React 命名为 TinyReact, Babel 在转换之前是将 JSX 转化成 React.createElement,我们只需告诉 Babel 在转换之前，在 babel 添加注释

```js
/** @jsx TinyReact.createElement **/
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53ab3bc559af4567816ba90fee8e7dd7~tplv-k3u1fbpfcp-watermark.image)

添加 babel 配置文件 .babelrc, 通过配置 将 React.createElement 转换成 TinyReact.createElement,这样代码就可以执行了

```js
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        "pragma": "TinyReact.createElement"
      }
    ]
  ]
}
```

分析如何实现 createElement 方法

createElement 根据传递的参数返回一个 VirtualDOM 对象，对象当中要有 type 属性，表示节点的类型，props 属性表示节点的内容，children 属性表示子节点

```js
{
  type: "div",
  props: null,
  children: [{type: "text", props: {textContent: "Hello"}}]
}
```

```js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
function createElement(type, props, ...children) {
  return {
    type,
    props,
    children,
  };
}
```

在 TinReact 中创建一个 createElemet.js 文件

```js
// createElemet.js
export default function createElement(type, props, ...children) {
  return {
    type,
    props,
    children,
  };
}
```

接下来在 index.js 中通过 import 导入 createElement

```js
// index.js
import createElement from "./createElement";
export default {
  createElement,
};
```

### 在根目录的 src/index.js 中添加 DOM 节点

```js
import TinyReact from "./TinyReact";
const virtuaDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
);

console.log(virtualDOM);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83def4ed5d564905a858d1c197266c79~tplv-k3u1fbpfcp-watermark.image)

可以看到 一个基本的 createElement 就实现了，首先在 src/index.js 中有一段 JSX 代码，引入 TinyReact 对象，在当前 JSX 中每个节点都会转换成 TinyReact.createElement 方法，在调用 createElement 方法时返回了一个 virtualDOM 对象
