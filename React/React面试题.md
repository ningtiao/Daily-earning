### 1、什么时候使用状态管理器

摘抄阮老师的

**从项目的整体看**

1.用户的使用方式复杂 2.不同身份的用户有不同的使用方式（比如普通用户和管理员） 3.多个用户之间可以协作 4.与服务器大量交互，或者使用了 WebSocket
5.View 要从多个来源获取数据

**从组件角度看**

1.某个组件的状态，需要共享 2.某个状态需要在任何地方都可以拿到 3.一个组件需要改变全局状态 4.一个组件需要改变另一个组件的状态

### 2、render 函数中 return 如果没有使用()会有什么问题？

我们在使用 JSX 语法书写 react 代码时，babel 会将 JSX 语法编译成 js，同时会在每行自动添加分号（；），如果 return 后换行了，那么就会变成 return； 一般情况下会报错：

Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.
上面这段英文翻译成中文：

渲染没有返回任何内容。这通常意味着缺少 return 语句。或者，为了不渲染，返回 null。
为了代码可读性我们一般会在 return 后面添加括号这样代码可以折行书写，否则就在 return 后面紧跟着语句，这样也是可以的。

举两个正确的书写例子：

```js
const Nav = () => {
  return (
    <nav className="c_navbar">
      { some jsx magic here }
    </nav>
  )
}

const Nav = () => {
 return <nav className="c_navbar">
    { some jsx magic here }
  </nav>
}
```

错误的写法：

```js
const Nav = () => {
  return
    <nav className="c_navbar">
      { some jsx magic here }
    </nav>
}
```

### 3、componentWillUpdate 可以直接修改 state 的值吗

react 组件在每次需要重新渲染时候都会调用 componentWillUpdate(),

例如，我们调用 this.setState()时候

在这个函数中我们之所以不调用 this.setState()是因为该方法会触发另一个 componentWillUpdate(),如果我们 componentWillUpdate()中触发状态更改,我们将以无限循环结束.

### 4、说说你对 React 的渲染原理的理解

React 整个渲染机制就是 React 会调用 React.render()构建一颗 DOM 树
当 state 或 props 改变时,render()会被再次调用构建出另外一颗树,利用 Diff 算法与之前的树进行对比,找到需要更新的地方进行更新并渲染到页面上,实现按需更新减少对真实 DOM 的操作,实现性能优化
个人理解这个问题重点在 React.render() 和 Diff 算法上

```js
感觉可以从以下几个方面回答：
1、元素渲染、更新（这块可以从JSX解析，diff算法来谈）；
2、生命周期
3、props、state更新
```

### 5、什么渲染劫持

首先，什么是渲染劫持：渲染劫持的概念是控制组件从另一个组件输出的能力，当然这个概念一般和 react 中的高阶组件（HOC）放在一起解释比较有明了。

高阶组件可以在 render 函数中做非常多的操作，从而控制原组件的渲染输出，只要改变了原组件的渲染，我们都将它称之为一种渲染劫持。

实际上，在高阶组件中，组合渲染和条件渲染都是渲染劫持的一种，通过反向继承，不仅可以实现以上两点，还可以增强由原组件 render 函数产生的 React 元素。

实际的操作中 通过 操作 state、props 都可以实现渲染劫持

### 6、 在 React 怎么使用 Context

```js
// context : Context提供了一种方式，能够让数据在组件树中传递，而不必一级一级手动传递。

API : createContext(defaultValue?)。

// 使用方法：
// 首先要引入createContext
import React, { Component, createContext } from 'react';

/// 然后创建一个Context
const BatteryContext = createContext();
// 然后用BatteryContext.Provider包裹组件并且传递属性值。

<BatteryContext.Provider value={60}>

<Middle />　　//子组件
</BatteryContext.Provider>
```

### 7、React 怎样引入 svg 的文件？

```js
import React from "react";
import logo from "./logo.png"; // Tell Webpack this JS file uses this image

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />;
}
export default Header;
```

### React 中在哪捕获错误?

https://zh-hans.reactjs.org/docs/error-boundaries.html

在 react 15 极其以前的版本中,组件内的 UI 异常将中断组件内部状态，导致下一次渲染时触发隐藏异常。React 并未提供友好的异常捕获和处理方式，一旦发生异常，应用将不能很好的运行。而 React 16 版本有所改进。

组件内异常，也就是异常边界组件能够捕获的异常，主要包括：

1、渲染过程中异常；
2、生命周期方法中的异常；
3、子组件树中各组件的 constructor 构造函数中异常。
当然异常边界也有一些无法捕获的异常，主要是异步及服务端触发异常：

1、事件处理器中的异常；
2、异步任务异常，如 setTiemout，ajax 请求异常等；
3、服务端渲染异常；
4、异常边界组件自身内的异常；
